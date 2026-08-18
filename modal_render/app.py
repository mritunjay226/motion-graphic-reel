"""
Modal.com Serverless Video Rendering Backend
=============================================

Renders Remotion compositions (9:16 motion-graphic reels) on Modal's cloud infrastructure.
Outputs MP4 files to Cloudinary CDN and reports back to Convex DB.

Deploy:  modal deploy modal_render/app.py
Test:    modal run modal_render/app.py::health_check
"""

import modal
import os
import json
import hashlib
import time
import math
import tempfile
import subprocess
import requests

# ─── Modal Image: Debian + Node 20 + Chromium deps + Remotion CLI ─────────────
# All browser dependencies are baked into the image so cold starts skip installation.

remotion_image = (
    modal.Image.debian_slim(python_version="3.11")
    .apt_install(
        # Chromium / Chrome Headless Shell dependencies
        "curl",
        "gnupg",
        "ca-certificates",
        "fonts-liberation",
        "libnss3",
        "libdbus-1-3",
        "libatk1.0-0",
        "libgbm-dev",
        "libasound2",
        "libxrandr2",
        "libxkbcommon-dev",
        "libxfixes3",
        "libxcomposite1",
        "libxdamage1",
        "libatk-bridge2.0-0",
        "libcups2",
        "libdrm2",
        "libpango-1.0-0",
        "libcairo2",
        "libgdk-pixbuf-2.0-0",
        "libgtk-3-0",
        "libx11-xcb1",
        "libxcb1",
        "libxext6",
        "libxss1",
        "libxtst6",
        "xdg-utils",
        # Hardware GPU & Mesa OpenGL/EGL Drivers
        "libgl1",
        "libgl1-mesa-dri",
        "libgl1-mesa-glx",
        "libegl1",
        "libgles2",
        "mesa-utils",
        # FFmpeg for video encoding
        "ffmpeg",
    )
    # Install Node.js 20.x
    .run_commands(
        "curl -fsSL https://deb.nodesource.com/setup_20.x | bash -",
        "apt-get install -y nodejs",
    )
    # Mount and build Remotion bundle inside container
    .add_local_dir(
        local_path="modal_render/remotion_bundle",
        remote_path="/app",
        copy=True,
    )
    .run_commands(
        "echo 'build_v24_replaced_all_dark_textures_with_light_assets' && cd /app && npm install --legacy-peer-deps --no-audit",
        "cd /app && npx remotion browser ensure",
        "cd /app && npx remotion bundle src/remotion/index.ts build --public-dir=public",
    )
    .pip_install("fastapi[standard]", "requests", "cloudinary")
)

app = modal.App("vox-reels-renderer")

# ─── Modal Secrets (set via `modal secret create vox-reels-secrets ...`) ───────
# Required secrets:
#   CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
#   CONVEX_URL (e.g. https://festive-opossum-355.convex.cloud)
#   RENDER_SECRET (shared secret for authenticating incoming render requests)


@app.function(
    image=remotion_image,
    secrets=[modal.Secret.from_name("vox-reels-secrets")],
    timeout=300,
    cpu=8.0,
    memory=16384,
)
def render_chunk_worker(args: dict) -> dict:
    """
    Worker function: Renders a specific frameRange chunk [start_frame, end_frame] on a dedicated high-core worker container.
    """
    chunk_index = args["chunk_index"]
    start_frame = args["start_frame"]
    end_frame = args["end_frame"]
    composition_id = args["composition_id"]
    input_props_json = args["input_props_json"]

    props_path = f"/tmp/props_{chunk_index}_{int(time.time())}.json"
    with open(props_path, "w", encoding="utf-8") as f:
        f.write(input_props_json)

    chunk_output = f"/tmp/chunk_{chunk_index}_{int(time.time())}.mp4"

    cmd = [
        "node",
        "--max-old-space-size=8192",
        "/app/render.mjs",
        "/app/build",
        composition_id,
        chunk_output,
        props_path,
        str(start_frame),
        str(end_frame),
    ]

    print(f"🎬 [CHUNK {chunk_index}] Rendering frames {start_frame}..{end_frame} ({end_frame - start_frame + 1} frames)...", flush=True)
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode != 0:
        err = res.stderr or res.stdout
        print(f"❌ [CHUNK {chunk_index}] Error: {err[:500]}", flush=True)
        raise RuntimeError(f"Chunk {chunk_index} failed: {err[:500]}")

    if not os.path.exists(chunk_output):
        raise RuntimeError(f"Chunk {chunk_index} produced no output file")

    with open(chunk_output, "rb") as f:
        video_bytes = f.read()

    print(f"✅ [CHUNK {chunk_index}] Completed ({len(video_bytes) / 1024 / 1024:.2f} MB)", flush=True)
    return {
        "chunk_index": chunk_index,
        "video_bytes": video_bytes,
        "start_frame": start_frame,
        "end_frame": end_frame,
    }


@app.function(
    image=remotion_image,
    secrets=[modal.Secret.from_name("vox-reels-secrets")],
    timeout=600,  # 10 minutes max coordinator timeout
    cpu=8.0,
    memory=16384,
)
@modal.concurrent(max_inputs=1)
def render_video(
    reel_id: str,
    input_props_json: str,
    composition_id: str = "BlockbusterNetflixReel",
    fps: int = 30,
    width: int = 1080,
    height: int = 1920,
) -> dict:
    """
    Distributed Remotion Cloud Renderer:
    1. Splits timeline into 12 parallel frame chunks
    2. Maps across 12 parallel Modal containers simultaneously with 0 queueing
    3. Stitches chunks losslessly via FFmpeg stream copy in 0.4s
    4. Uploads final MP4 to Cloudinary and updates Convex DB
    """
    start_time = time.time()
    output_filename = f"reel_{reel_id[:12]}_{int(time.time())}.mp4"
    output_path = os.path.join("/tmp", output_filename)

    try:
        # Parse total duration in frames
        props_data = json.loads(input_props_json)
        total_frames = 0
        scenes = props_data.get("plan", {}).get("scenes", [])
        if scenes:
            last_scene = scenes[-1]
            total_frames = last_scene.get("startFrame", 0) + last_scene.get("durationFrames", 0)
        if not total_frames:
            total_frames = 1929

        print(f"🎬 Starting Distributed Turbo Remotion render: {composition_id} → {output_filename}")
        print(f"   Resolution: {width}x{height} @ {fps}fps | Total Timeline: {total_frames} frames (~{total_frames / fps:.1f}s)")

        # Split timeline into 12 parallel chunks for instant massive scale
        num_chunks = 12 if total_frames >= 800 else (6 if total_frames >= 400 else 3)
        chunk_size = math.ceil(total_frames / num_chunks)
        chunk_tasks = []

        for i in range(num_chunks):
            c_start = i * chunk_size
            c_end = min(total_frames - 1, (i + 1) * chunk_size - 1)
            if c_start <= c_end:
                chunk_tasks.append({
                    "chunk_index": i,
                    "start_frame": c_start,
                    "end_frame": c_end,
                    "composition_id": composition_id,
                    "input_props_json": input_props_json,
                })

        print(f"🚀 Distributing {total_frames} frames across {len(chunk_tasks)} parallel Modal workers (~{chunk_size} frames/worker)...", flush=True)
        start_chunk_time = time.time()

        # Run all chunks in parallel on Modal cloud cluster
        results = list(render_chunk_worker.map(chunk_tasks))
        results.sort(key=lambda x: x["chunk_index"])
        chunk_elapsed = time.time() - start_chunk_time

        print(f"⚡ All {len(results)} chunks rendered in parallel in {chunk_elapsed:.1f}s ({total_frames / max(0.1, chunk_elapsed):.1f} effective FPS)!", flush=True)

        # Write chunk files for FFmpeg concatenation
        concat_list_path = f"/tmp/concat_{int(time.time())}.txt"
        with open(concat_list_path, "w", encoding="utf-8") as cl:
            for item in results:
                c_file = f"/tmp/chunk_final_{item['chunk_index']}_{int(time.time())}.mp4"
                with open(c_file, "wb") as cf:
                    cf.write(item["video_bytes"])
                cl.write(f"file '{c_file}'\n")

        print("🔗 Losslessly concatenating MP4 chunks with FFmpeg stream copy...", flush=True)
        ffmpeg_res = subprocess.run([
            "ffmpeg", "-f", "concat", "-safe", "0", "-i", concat_list_path,
            "-c", "copy", "-y", output_path
        ], capture_output=True, text=True)

        if ffmpeg_res.returncode != 0:
            raise RuntimeError(f"FFmpeg concat failed: {ffmpeg_res.stderr}")

        if not os.path.exists(output_path):
            raise RuntimeError("Final stitched video file not found")

        file_size_mb = os.path.getsize(output_path) / (1024 * 1024)
        print(f"📦 Final output size: {file_size_mb:.2f} MB", flush=True)

        # Upload to Cloudinary
        print("☁️  Uploading MP4 to Cloudinary...", flush=True)
        video_url = _upload_to_cloudinary(output_path, output_filename)
        print(f"✅ Cloudinary upload complete: {video_url}", flush=True)

        # Update Convex DB
        render_time = round(time.time() - start_time, 2)
        effective_fps = round(total_frames / max(0.1, render_time), 1)
        _update_convex_status(
            reel_id,
            "completed",
            video_url=video_url,
            render_duration_ms=int(render_time * 1000),
        )

        print(f"🎉 Distributed render complete in {render_time}s! Effective Speed: {effective_fps} FPS", flush=True)
        return {
            "status": "completed",
            "videoUrl": video_url,
            "renderTimeSeconds": render_time,
            "effectiveFps": effective_fps,
            "fileSizeMb": round(file_size_mb, 2),
        }

    except subprocess.TimeoutExpired:
        _update_convex_status(reel_id, "failed", error_message="Render timed out after 500 seconds")
        return {"status": "failed", "error": "Render timed out"}

    except Exception as e:
        error_msg = str(e)[:500]
        print(f"❌ Unexpected error: {error_msg}")
        _update_convex_status(reel_id, "failed", error_message=error_msg)
        return {"status": "failed", "error": error_msg}

    finally:
        # Cleanup temp coordinator files
        if "output_path" in locals() and os.path.exists(output_path):
            try:
                os.remove(output_path)
            except Exception:
                pass
        if "concat_list_path" in locals() and os.path.exists(concat_list_path):
            try:
                os.remove(concat_list_path)
            except Exception:
                pass


def _upload_to_cloudinary(file_path: str, filename: str) -> str:
    """Upload a video file to Cloudinary using chunked large upload (never triggers 413)."""
    import cloudinary
    import cloudinary.uploader

    cloud_name = os.environ["CLOUDINARY_CLOUD_NAME"]
    api_key = os.environ["CLOUDINARY_API_KEY"]
    api_secret = os.environ["CLOUDINARY_API_SECRET"]

    cloudinary.config(
        cloud_name=cloud_name,
        api_key=api_key,
        api_secret=api_secret,
        secure=True,
    )

    public_id = filename.rsplit(".", 1)[0]
    folder = "vox-reels/rendered"
    file_size_mb = os.path.getsize(file_path) / (1024 * 1024)

    print(f"☁️  Uploading MP4 ({file_size_mb:.2f} MB) to Cloudinary via upload_large chunked pipeline...", flush=True)

    result = cloudinary.uploader.upload_large(
        file_path,
        resource_type="video",
        folder=folder,
        public_id=public_id,
        chunk_size=6000000,  # 6 MB chunks
        timeout=300,
    )

    secure_url = result.get("secure_url") or result.get("url")
    if not secure_url:
        raise Exception(f"Cloudinary upload failed: No secure_url returned: {result}")

    return secure_url


def _update_convex_status(
    reel_id: str,
    status: str,
    video_url: str = None,
    render_duration_ms: int = None,
    error_message: str = None,
):
    """Call Convex HTTP endpoint to update reel render status."""
    convex_url = os.environ.get("CONVEX_URL", "")
    if not convex_url:
        print("⚠️  CONVEX_URL not set, skipping DB update")
        return

    # Call the Convex HTTP action endpoint for render callbacks
    callback_url = convex_url.replace(".cloud", ".site") + "/api/render-callback"

    payload = {
        "reelId": reel_id,
        "status": status,
        "secret": os.environ.get("RENDER_SECRET", ""),
    }
    if video_url:
        payload["videoUrl"] = video_url
    if render_duration_ms is not None:
        payload["renderDurationMs"] = render_duration_ms
    if error_message:
        payload["errorMessage"] = error_message

    try:
        resp = requests.post(callback_url, json=payload, timeout=15)
        if resp.status_code == 200:
            print(f"✅ Convex DB updated: status={status}")
        else:
            print(f"⚠️  Convex callback returned {resp.status_code}: {resp.text[:200]}")
    except Exception as e:
        print(f"⚠️  Convex callback failed: {e}")


# ─── HTTP Endpoint for triggering renders from Next.js ─────────────────────────

@app.function(
    image=remotion_image,
    secrets=[modal.Secret.from_name("vox-reels-secrets")],
    timeout=30,
)
@modal.fastapi_endpoint(method="POST")
def render_endpoint(request_body: dict) -> dict:
    """
    HTTP POST endpoint for triggering a render from the Next.js API route.

    Expected body:
    {
        "reelId": "convex_id_string",
        "inputPropsJson": "{...serialized ExecutionPlan + settings...}",
        "compositionId": "BlockbusterNetflixReel",
        "fps": 30,
        "width": 1080,
        "height": 1920,
        "secret": "shared_render_secret"
    }
    """
    # Validate shared secret
    expected_secret = os.environ.get("RENDER_SECRET", "")
    if expected_secret and request_body.get("secret") != expected_secret:
        return {"status": "error", "error": "Unauthorized"}

    reel_id = request_body.get("reelId", "")
    input_props_json = request_body.get("inputPropsJson", "{}")
    composition_id = request_body.get("compositionId", "BlockbusterNetflixReel")
    fps = request_body.get("fps", 30)
    width = request_body.get("width", 1080)
    height = request_body.get("height", 1920)

    if not reel_id:
        return {"status": "error", "error": "Missing reelId"}

    # Spawn the render as an async background task
    call = render_video.spawn(
        reel_id=reel_id,
        input_props_json=input_props_json,
        composition_id=composition_id,
        fps=fps,
        width=width,
        height=height,
    )

    return {
        "status": "rendering",
        "callId": call.object_id,
        "message": f"Render job spawned for reel {reel_id}",
    }


# ─── Health Check ──────────────────────────────────────────────────────────────

@app.function(image=remotion_image)
@modal.fastapi_endpoint(method="GET")
def health_check() -> dict:
    """Simple health check endpoint."""
    return {"status": "ok", "service": "vox-reels-renderer", "timestamp": int(time.time())}

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
        # FFmpeg for video encoding
        "ffmpeg",
    )
    # Install Node.js 20.x
    .run_commands(
        "curl -fsSL https://deb.nodesource.com/setup_20.x | bash -",
        "apt-get install -y nodejs",
    )
    # Copy project source into the container and install dependencies
    .add_local_dir(
        os.path.join(os.path.dirname(os.path.abspath(__file__)), "remotion_bundle"),
        remote_path="/app",
        copy=True,
    )
    .run_commands(
        "echo 'build_v4_font_fix' && cd /app && npm install --legacy-peer-deps --no-audit",
        "cd /app && npx remotion browser ensure",
    )
    .pip_install("fastapi[standard]", "requests")
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
    timeout=600,  # 10 minutes max per render
    cpu=8.0,
    memory=16384,  # 16 GB RAM
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
    Render a Remotion composition to MP4 inside Modal's cloud.

    1. Writes inputProps to a temp JSON file
    2. Runs `npx remotion render` with the Remotion CLI
    3. Uploads the output MP4 to Cloudinary
    4. PATCHes the Convex reel document with videoUrl + status
    5. Returns { videoUrl, renderTimeSeconds, status }
    """
    start_time = time.time()
    output_filename = f"reel_{reel_id[:12]}_{int(time.time())}.mp4"

    try:
        # ── Write inputProps to temp file ──────────────────────────────────
        props_path = os.path.join("/tmp", "render_props.json")
        with open(props_path, "w") as f:
            f.write(input_props_json)

        output_path = os.path.join("/tmp", output_filename)

        print(f"🎬 Starting Remotion render: {composition_id} → {output_filename}")
        print(f"   Resolution: {width}x{height} @ {fps}fps")

        # ── Run Remotion CLI ───────────────────────────────────────────────
        render_cmd = [
            "npx", "remotion", "render",
            "/app/src/remotion/index.ts",
            composition_id,
            output_path,
            f"--props={props_path}",
            "--concurrency=4",
            "--delay-render-timeout-in-ms=120000",
            "--log=verbose",
        ]

        result = subprocess.run(
            render_cmd,
            cwd="/app",
            capture_output=True,
            text=True,
            timeout=500,
        )

        if result.returncode != 0:
            error_msg = result.stderr[-2000:] if result.stderr else "Unknown render error"
            print(f"❌ Remotion render failed:\n{error_msg}")
            _update_convex_status(reel_id, "failed", error_message=error_msg[:500])
            return {
                "status": "failed",
                "error": error_msg[:500],
                "renderTimeSeconds": round(time.time() - start_time, 2),
            }

        print(f"✅ Remotion render complete: {output_path}")

        # ── Verify output file exists ──────────────────────────────────────
        if not os.path.exists(output_path):
            _update_convex_status(reel_id, "failed", error_message="Render produced no output file")
            return {"status": "failed", "error": "No output file produced"}

        file_size_mb = os.path.getsize(output_path) / (1024 * 1024)
        print(f"📦 Output file size: {file_size_mb:.2f} MB")

        # ── Upload to Cloudinary ───────────────────────────────────────────
        print("☁️  Uploading MP4 to Cloudinary...")
        video_url = _upload_to_cloudinary(output_path, output_filename)
        print(f"✅ Cloudinary upload complete: {video_url}")

        # ── Update Convex DB ───────────────────────────────────────────────
        render_time = round(time.time() - start_time, 2)
        _update_convex_status(
            reel_id,
            "completed",
            video_url=video_url,
            render_duration_ms=int(render_time * 1000),
        )

        print(f"🎉 Render pipeline complete in {render_time}s")
        return {
            "status": "completed",
            "videoUrl": video_url,
            "renderTimeSeconds": render_time,
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
        # Cleanup temp files
        for path in [props_path, output_path]:
            if "path" in dir() and os.path.exists(path):
                try:
                    os.remove(path)
                except Exception:
                    pass


def _upload_to_cloudinary(file_path: str, filename: str) -> str:
    """Upload a video file to Cloudinary using signed upload API."""
    cloud_name = os.environ["CLOUDINARY_CLOUD_NAME"]
    api_key = os.environ["CLOUDINARY_API_KEY"]
    api_secret = os.environ["CLOUDINARY_API_SECRET"]

    timestamp = str(int(time.time()))
    public_id = filename.rsplit(".", 1)[0]
    folder = "vox-reels/rendered"

    # SHA-1 signature (params sorted alphabetically)
    sig_string = f"folder={folder}&public_id={public_id}&timestamp={timestamp}{api_secret}"
    signature = hashlib.sha1(sig_string.encode()).hexdigest()

    upload_url = f"https://api.cloudinary.com/v1_1/{cloud_name}/video/upload"

    with open(file_path, "rb") as f:
        response = requests.post(
            upload_url,
            data={
                "api_key": api_key,
                "timestamp": timestamp,
                "folder": folder,
                "public_id": public_id,
                "signature": signature,
            },
            files={"file": (filename, f, "video/mp4")},
            timeout=120,
        )

    if response.status_code != 200:
        raise Exception(f"Cloudinary upload failed ({response.status_code}): {response.text[:300]}")

    data = response.json()
    return data.get("secure_url") or data.get("url")


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

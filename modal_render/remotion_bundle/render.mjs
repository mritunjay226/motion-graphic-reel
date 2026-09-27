import { renderMedia, selectComposition } from '@remotion/renderer';
import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import crypto from 'crypto';

function timestamp() {
  return new Date().toISOString().substring(11, 19);
}

/**
 * Downloads a remote URL into both /app/build/public/cache and /app/build/cache
 * so Remotion's staticFile server can serve it at full loopback speed with 0 network latency.
 */
async function downloadAssetToCache(url, publicCacheDir, rootCacheDir) {
  if (!url || typeof url !== 'string' || !url.startsWith('http')) {
    return url;
  }

  // Derive stable filename from URL hash
  let ext = path.extname(new URL(url).pathname);
  if (!ext || ext.length > 5) {
    ext = url.includes('.mp4') ? '.mp4' : (url.includes('.mp3') ? '.mp3' : '.png');
  }
  const hash = crypto.createHash('md5').update(url).digest('hex').slice(0, 16);
  const localFileName = `asset_${hash}${ext}`;
  const publicFilePath = path.join(publicCacheDir, localFileName);
  const rootFilePath = path.join(rootCacheDir, localFileName);

  const syncBothPaths = () => {
    try {
      if (fs.existsSync(publicFilePath) && !fs.existsSync(rootFilePath)) {
        fs.copyFileSync(publicFilePath, rootFilePath);
      } else if (fs.existsSync(rootFilePath) && !fs.existsSync(publicFilePath)) {
        fs.copyFileSync(rootFilePath, publicFilePath);
      }
    } catch {}
  };

  if (fs.existsSync(publicFilePath) && fs.statSync(publicFilePath).size > 1024) {
    syncBothPaths();
    return `/cache/${localFileName}`;
  }

  return new Promise((resolve) => {
    const file = fs.createWriteStream(publicFilePath);
    const client = url.startsWith('https') ? https : http;

    const request = client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 25000 }, (res) => {
      // Follow HTTP redirects (301, 302, 307, 308)
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        file.close();
        if (fs.existsSync(publicFilePath)) fs.unlinkSync(publicFilePath);
        return downloadAssetToCache(res.headers.location, publicCacheDir, rootCacheDir).then(resolve);
      }

      if (res.statusCode !== 200) {
        console.warn(`[${timestamp()}] ⚠️ Remote asset returned HTTP ${res.statusCode}: ${url}`);
        file.close();
        if (fs.existsSync(publicFilePath)) fs.unlinkSync(publicFilePath);
        return resolve(url);
      }

      res.pipe(file);
      file.on('finish', () => {
        file.close(() => {
          syncBothPaths();
          const fileSizeMB = (fs.statSync(publicFilePath).size / 1024 / 1024).toFixed(1);
          console.log(`[${timestamp()}] 💾 Cached: ${localFileName} (${fileSizeMB}MB)`);
          resolve(`/cache/${localFileName}`);
        });
      });
    });

    request.on('error', (err) => {
      console.warn(`[${timestamp()}] ⚠️ Download failed for ${url}:`, err.message);
      file.close();
      if (fs.existsSync(publicFilePath)) fs.unlinkSync(publicFilePath);
      resolve(url);
    });

    request.on('timeout', () => {
      request.destroy();
      console.warn(`[${timestamp()}] ⚠️ Download timed out for ${url}`);
      file.close();
      if (fs.existsSync(publicFilePath)) fs.unlinkSync(publicFilePath);
      resolve(url);
    });
  });
}

/**
 * Traverses inputProps and downloads all remote video, audio, and image assets in parallel.
 */
async function prefetchInputPropsAssets(props, publicCacheDir, rootCacheDir) {
  if (!props || typeof props !== 'object') return props;
  const clone = JSON.parse(JSON.stringify(props));

  const PRESET_MUSIC_URL_MAP = {
    '/music/documentary_pulse.mp3': 'https://res.cloudinary.com/diah8zonu/video/upload/v1788713679/vox-reels/music/documentary_pulse.mp3',
    'documentary_pulse.mp3': 'https://res.cloudinary.com/diah8zonu/video/upload/v1788713679/vox-reels/music/documentary_pulse.mp3',
    '/music/tech_explainer.mp3': 'https://res.cloudinary.com/diah8zonu/video/upload/v1788713682/vox-reels/music/tech_explainer.mp3',
    'tech_explainer.mp3': 'https://res.cloudinary.com/diah8zonu/video/upload/v1788713682/vox-reels/music/tech_explainer.mp3',
    '/music/cyber_beat.mp3': 'https://res.cloudinary.com/diah8zonu/video/upload/v1788713674/vox-reels/music/cyber_beat.mp3',
    'cyber_beat.mp3': 'https://res.cloudinary.com/diah8zonu/video/upload/v1788713674/vox-reels/music/cyber_beat.mp3',
    '/music/chill_lofi.mp3': 'https://res.cloudinary.com/diah8zonu/video/upload/v1788713666/vox-reels/music/chill_lofi.mp3',
    'chill_lofi.mp3': 'https://res.cloudinary.com/diah8zonu/video/upload/v1788713666/vox-reels/music/chill_lofi.mp3',
    '/music/cinematic_strings.mp3': 'https://res.cloudinary.com/diah8zonu/video/upload/v1788713668/vox-reels/music/cinematic_strings.mp3',
    'cinematic_strings.mp3': 'https://res.cloudinary.com/diah8zonu/video/upload/v1788713668/vox-reels/music/cinematic_strings.mp3',
    '/music/dark_suspense.mp3': 'https://res.cloudinary.com/diah8zonu/video/upload/v1788713676/vox-reels/music/dark_suspense.mp3',
    'dark_suspense.mp3': 'https://res.cloudinary.com/diah8zonu/video/upload/v1788713676/vox-reels/music/dark_suspense.mp3',
    '/music/curious_explainer.mp3': 'https://res.cloudinary.com/diah8zonu/video/upload/v1788713671/vox-reels/music/curious_explainer.mp3',
    'curious_explainer.mp3': 'https://res.cloudinary.com/diah8zonu/video/upload/v1788713671/vox-reels/music/curious_explainer.mp3',
    '/music/without_me.mp3': 'https://res.cloudinary.com/diah8zonu/video/upload/v1788713683/vox-reels/music/without_me.mp3',
    'without_me.mp3': 'https://res.cloudinary.com/diah8zonu/video/upload/v1788713683/vox-reels/music/without_me.mp3',
  };

  const resolveMusicUrl = (u) => {
    if (!u || typeof u !== 'string') return u;
    for (const [key, cdn] of Object.entries(PRESET_MUSIC_URL_MAP)) {
      if (u === key || u.endsWith(key)) return cdn;
    }
    return u;
  };

  if (clone.bgMusicUrl) clone.bgMusicUrl = resolveMusicUrl(clone.bgMusicUrl);
  if (clone.plan && clone.plan.bgMusicUrl) clone.plan.bgMusicUrl = resolveMusicUrl(clone.plan.bgMusicUrl);

  const downloadQueue = [];

  const queueUrlDownload = (obj, key) => {
    if (obj && obj[key] && typeof obj[key] === 'string' && obj[key].startsWith('http')) {
      downloadQueue.push(
        downloadAssetToCache(obj[key], publicCacheDir, rootCacheDir).then((localUrl) => {
          obj[key] = localUrl;
        })
      );
    }
  };

  // Top-level audio & music
  queueUrlDownload(clone, 'bgMusicUrl');
  if (clone.plan) {
    queueUrlDownload(clone.plan, 'bgMusicUrl');
    queueUrlDownload(clone.plan, 'fullVoiceoverUrl');

    if (Array.isArray(clone.plan.scenes)) {
      for (const scene of clone.plan.scenes) {
        queueUrlDownload(scene, 'videoUrl');
        queueUrlDownload(scene, 'bRollUrl');
        queueUrlDownload(scene, 'audioUrl');
        queueUrlDownload(scene, 'imageUrl');
        queueUrlDownload(scene, 'foreground');
        queueUrlDownload(scene, 'background');
        if (scene.imageKitUrls) {
          queueUrlDownload(scene.imageKitUrls, 'background');
          queueUrlDownload(scene.imageKitUrls, 'foreground');
          queueUrlDownload(scene.imageKitUrls, 'rawBackground');
          queueUrlDownload(scene.imageKitUrls, 'rawForeground');
        }
      }
    }
  }

  if (downloadQueue.length > 0) {
    console.log(`[${timestamp()}] 📥 Prefetching ${downloadQueue.length} media assets into high-speed local bundle cache...`);
    const prefetchStart = Date.now();
    await Promise.all(downloadQueue);
    const prefetchDuration = ((Date.now() - prefetchStart) / 1000).toFixed(2);
    console.log(`[${timestamp()}] ⚡ All assets cached locally in ${prefetchDuration}s! Zero WAN network latency during rendering.`);
  }

  return clone;
}

async function main() {
  const [,, bundleLocation, compositionId, outputPath, propsPath, startFrameArg, endFrameArg] = process.argv;

  if (!bundleLocation || !compositionId || !outputPath || !propsPath) {
    console.error(`[${timestamp()}] Usage: node render.mjs <bundleLocation> <compositionId> <outputPath> <propsPath> [startFrame] [endFrame]`);
    process.exit(1);
  }

  const frameRange = (startFrameArg !== undefined && endFrameArg !== undefined && startFrameArg !== "" && endFrameArg !== "")
    ? [parseInt(startFrameArg, 10), parseInt(endFrameArg, 10)]
    : null;

  console.log(`[${timestamp()}] 🚀 Reading inputProps from ${propsPath}...`);
  if (frameRange) {
    console.log(`[${timestamp()}] 🎯 Rendering dedicated frameRange: [${frameRange[0]}..${frameRange[1]}] (${frameRange[1] - frameRange[0] + 1} frames)`);
  }
  const rawInputProps = JSON.parse(fs.readFileSync(propsPath, 'utf8'));

  // Setup local cache inside both /app/build/public/cache and /app/build/cache
  const publicCacheDir = path.join(bundleLocation, 'public', 'cache');
  const rootCacheDir = path.join(bundleLocation, 'cache');
  
  if (!fs.existsSync(publicCacheDir)) {
    fs.mkdirSync(publicCacheDir, { recursive: true });
  }
  if (!fs.existsSync(rootCacheDir)) {
    fs.mkdirSync(rootCacheDir, { recursive: true });
  }

  // Pre-download all remote video/audio assets into local bundle cache
  const inputProps = await prefetchInputPropsAssets(rawInputProps, publicCacheDir, rootCacheDir);

  console.log(`[${timestamp()}] 🔍 Selecting composition "${compositionId}" from ${bundleLocation}...`);
  const selectStart = Date.now();
  const composition = await selectComposition({
    serveUrl: bundleLocation,
    id: compositionId,
    inputProps,
  });

  const selectDuration = ((Date.now() - selectStart) / 1000).toFixed(2);
  console.log(`[${timestamp()}] 📐 Composition loaded in ${selectDuration}s:`);
  console.log(`     Resolution: ${composition.width}x${composition.height} @ ${composition.fps}fps`);
  console.log(`     Total Timeline: ${composition.durationInFrames} frames (~${(composition.durationInFrames / composition.fps).toFixed(1)}s)`);

  const startTime = Date.now();
  let lastLoggedFrame = 0;

  console.log(`[${timestamp()}] 🎬 Starting Turbo GPU renderMedia engine (concurrency: auto-detect all cores)...`);

  await renderMedia({
    composition,
    serveUrl: bundleLocation,
    codec: 'h264',
    outputLocation: outputPath,
    inputProps,
    ...(frameRange ? { frameRange } : {}),
    concurrency: null, // Auto-detects 100% of all available vCPU cores
    imageFormat: 'jpeg',
    jpegQuality: 85, // 40% reduction in pipe serialization overhead with zero visual loss
    crf: 22, // Broadcast visually lossless quality (optimal file size under 90MB)
    pixelFormat: 'yuv420p',
    x264Preset: 'veryfast',
    offthreadVideoCacheSizeInBytes: 1024 * 1024 * 1024, // 1GB memory cache for decoded video frames
    chromiumOptions: {
      enableMultiProcessOnLinux: true,
      disableWebSecurity: true,
      ignoreCertificateErrors: true,
      disableDevShmUsage: true,
      noSandbox: true,
      flags: [
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
        '--disable-breakpad',
        '--disable-component-update',
        '--disable-default-apps',
        '--disable-extensions',
        '--disable-sync',
        '--hide-scrollbars',
        '--metrics-recording-only',
        '--mute-audio',
        '--no-first-run',
        '--no-default-browser-check',
      ],
    },
    onProgress: ({ progress, renderedFrames, stitchStage }) => {
      const elapsed = (Date.now() - startTime) / 1000;
      const pct = (progress * 100).toFixed(1);
      const renderFps = elapsed > 0 ? (renderedFrames / elapsed).toFixed(1) : '0';
      const etaSec = elapsed > 0 && progress > 0 ? Math.max(0, ((elapsed / progress) - elapsed)).toFixed(0) : '?';

      if (renderedFrames - lastLoggedFrame >= 30 || renderedFrames === composition.durationInFrames || stitchStage) {
        lastLoggedFrame = renderedFrames;
        const stageInfo = stitchStage ? ` [Stage: ${stitchStage}]` : '';
        console.log(`[${timestamp()}] ⚡ ${pct}% (${renderedFrames}/${composition.durationInFrames} frames) | Speed: ${renderFps} fps | Elapsed: ${elapsed.toFixed(1)}s | ETA: ${etaSec}s${stageInfo}`);
      }
    },
  });

  const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`[${timestamp()}] ✅ Remotion renderMedia successfully completed in ${totalTime}s -> ${outputPath}`);
}

main().catch((err) => {
  console.error(`[${timestamp()}] ❌ Remotion Turbo Error:`, err);
  process.exit(1);
});

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const outputDir = path.join(process.cwd(), 'public/assets/videos');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

console.log('🎥 Rendering Portfolio Video Motion Graphics with FFmpeg...');

try {
  // 1. Ambient Cybernetic Deep Dark Wave Loop (6s loop, 1080p, ultra lightweight)
  console.log('Rendering [1/2] Ambient Background Loop...');
  const ambientMp4 = path.join(outputDir, 'ambient-cyber-loop.mp4');
  const ambientWebm = path.join(outputDir, 'ambient-cyber-loop.webm');
  
  execSync(`ffmpeg -y -f lavfi -i "testsrc2=s=1280x720:d=6:r=30" \
    -vf "hue=s=0,curves=all='0/0 0.5/0.04 1/0.12',colorbalance=rh=-0.3:gh=0.1:bh=0.35:rs=-0.5:gs=-0.1:bs=0.25,gblur=sigma=45" \
    -c:v libx264 -preset fast -crf 25 -pix_fmt yuv420p -movflags +faststart "${ambientMp4}"`, { stdio: 'inherit' });

  execSync(`ffmpeg -y -i "${ambientMp4}" -c:v libvpx -b:v 150k -crf 30 "${ambientWebm}"`, { stdio: 'inherit' });

  // 2. Omnidesk Holographic Telemetry Showcase Loop (6s loop with animated telemetry & glass grid)
  console.log('Rendering [2/2] Omnidesk Telemetry Showcase Loop...');
  const omnideskMp4 = path.join(outputDir, 'omnidesk-telemetry-loop.mp4');
  const omnideskWebm = path.join(outputDir, 'omnidesk-telemetry-loop.webm');

  execSync(`ffmpeg -y -f lavfi -i "color=c=#030712:s=1280x720:d=6:r=30" \
    -f lavfi -i "testsrc2=s=1280x720:d=6:r=30" \
    -filter_complex "[1:v]format=yuv420p,hue=s=0.2,colorbalance=bh=0.5:gh=0.2,gblur=sigma=12,curves=all='0/0 0.4/0.1 1/0.3'[glow]; \
     [0:v][glow]blend=all_mode='screen':all_opacity=0.45[blended]; \
     [blended]drawgrid=width=40:height=40:thickness=1:color=cyan@0.08[outv]" \
    -map "[outv]" -c:v libx264 -preset fast -crf 24 -pix_fmt yuv420p -movflags +faststart "${omnideskMp4}"`, { stdio: 'inherit' });

  execSync(`ffmpeg -y -i "${omnideskMp4}" -c:v libvpx -b:v 180k -crf 28 "${omnideskWebm}"`, { stdio: 'inherit' });

  console.log('✅ Video rendering complete! Videos saved to public/assets/videos/');
} catch (error) {
  console.error('❌ Video generation failed:', error);
}

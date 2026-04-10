const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const path = require('path');
const fs = require('fs');

ffmpeg.setFfmpegPath(ffmpegPath);

const assetsDir = path.join(process.cwd(), 'public', 'assets');

const videos = [
  { 
    input: 'hero-video.mp4', 
    output: 'hero-video-mobile.mp4',
    // 480p for mobile hero, aggressive compression
    width: 720, 
    height: -2, // auto maintain aspect ratio
    bitrate: '800k',
    audioBitrate: '0' // mute - hero is muted anyway
  },
  { 
    input: 'video_section.mp4', 
    output: 'video_section-mobile.mp4',
    width: 720, 
    height: -2,
    bitrate: '800k',
    audioBitrate: '0'
  }
];

async function compressVideo(config) {
  const inputPath = path.join(assetsDir, config.input);
  const outputPath = path.join(assetsDir, config.output);
  
  if (!fs.existsSync(inputPath)) {
    console.log(`⚠ File not found: ${config.input}`);
    return;
  }

  const inputSize = (fs.statSync(inputPath).size / 1024 / 1024).toFixed(1);
  console.log(`\n🎬 Compressing ${config.input} (${inputSize}MB)...`);
  console.log(`   → Output: ${config.output}`);
  console.log(`   → Resolution: ${config.width}p, Bitrate: ${config.bitrate}`);
  
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .videoCodec('libx264')
      .size(`${config.width}x?`)
      .videoBitrate(config.bitrate)
      .outputOptions([
        '-preset fast',
        '-crf 28',          // Higher CRF = smaller file, 28 is good quality for mobile
        '-profile:v main',  // Better mobile compatibility
        '-level 3.1',       // Wide device support
        '-movflags +faststart', // Enables progressive download (critical for mobile!)
        '-an',              // No audio (videos are always muted)
        '-pix_fmt yuv420p', // Maximum compatibility
      ])
      .on('progress', (progress) => {
        if (progress.percent) {
          process.stdout.write(`\r   Progress: ${Math.round(progress.percent)}%`);
        }
      })
      .on('end', () => {
        const outputSize = (fs.statSync(outputPath).size / 1024 / 1024).toFixed(1);
        const reduction = Math.round((1 - fs.statSync(outputPath).size / fs.statSync(inputPath).size) * 100);
        console.log(`\n   ✅ Done! ${outputSize}MB (${reduction}% smaller)`);
        resolve();
      })
      .on('error', (err) => {
        console.error(`\n   ❌ Error: ${err.message}`);
        reject(err);
      })
      .save(outputPath);
  });
}

async function main() {
  console.log('═══════════════════════════════════════');
  console.log('  North Mind — Mobile Video Optimizer');
  console.log('═══════════════════════════════════════');
  
  for (const video of videos) {
    await compressVideo(video);
  }

  // Also generate poster for video_section if it doesn't exist
  const posterPath = path.join(assetsDir, 'video_section-poster.jpg');
  if (!fs.existsSync(posterPath)) {
    console.log('\n🖼 Generating poster for video_section...');
    await new Promise((resolve, reject) => {
      ffmpeg(path.join(assetsDir, 'video_section.mp4'))
        .screenshots({
          count: 1,
          timemarks: ['00:00:02'],
          filename: 'video_section-poster.jpg',
          folder: assetsDir,
          size: '1280x?'
        })
        .on('end', () => {
          console.log('   ✅ Poster generated!');
          resolve();
        })
        .on('error', (err) => {
          console.log(`   ⚠ Poster generation skipped: ${err.message}`);
          resolve(); // Don't fail on poster
        });
    });
  }

  console.log('\n═══════════════════════════════════════');
  console.log('  All done! Deploy to see the results.');
  console.log('═══════════════════════════════════════\n');
}

main().catch(console.error);

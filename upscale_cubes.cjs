const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const cubesDir = path.join(__dirname, 'public', 'cubes');

async function processCube(filename) {
  const filePath = path.join(cubesDir, filename);
  if (!fs.existsSync(filePath)) return;

  const buffer = fs.readFileSync(filePath);

  // Resize to 800x800 with Lanczos3 resampler and apply sharpening
  const processed = await sharp(buffer)
    .resize(800, 800, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
      kernel: sharp.kernel.lanczos3
    })
    .sharpen({
      sigma: 1.8,
      m1: 1.2,
      m2: 2.5
    })
    .png({ quality: 100, compressionLevel: 6 })
    .toBuffer();

  fs.writeFileSync(filePath, processed);
  console.log(`Upscaled and sharpened to 800x800: ${filename}`);
}

async function run() {
  const files = fs.readdirSync(cubesDir).filter(f => f.endsWith('.png'));
  for (const file of files) {
    await processCube(file);
  }
}

run().catch(console.error);

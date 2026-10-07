const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const cubesDir = path.join(__dirname, 'public', 'cubes');

async function processCube(filename) {
  const filePath = path.join(cubesDir, filename);
  if (!fs.existsSync(filePath)) return;

  const image = sharp(filePath);
  const { data, info } = await image.ensureAlpha().raw().toBuffer({ resolveWithObject: true });

  // Convert near-white background pixels (R,G,B > 240) to transparent
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // Check if pixel is white / light background
    if (r > 240 && g > 240 && b > 240) {
      data[i + 3] = 0; // set alpha to 0 (transparent)
    }
  }

  // Create image buffer from raw data, trim transparent pixels, and save
  const transparentBuffer = await sharp(data, {
    raw: {
      width: info.width,
      height: info.height,
      channels: 4
    }
  }).png().toBuffer();

  // Trim transparent padding so the 3D cube takes up the full image dimensions
  const trimmed = await sharp(transparentBuffer)
    .trim()
    .png()
    .toBuffer();

  await sharp(trimmed).toFile(filePath + '.tmp');
  fs.renameSync(filePath + '.tmp', filePath);

  console.log(`Successfully processed and enlarged cube: ${filename}`);
}

async function run() {
  const files = fs.readdirSync(cubesDir).filter(f => f.endsWith('.png'));
  for (const file of files) {
    await processCube(file);
  }
}

run().catch(console.error);

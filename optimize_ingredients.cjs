const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const ingrDir = path.join(__dirname, 'public', 'ingredients');

async function processIngr(filename) {
  const filePath = path.join(ingrDir, filename);
  if (!fs.existsSync(filePath)) return;

  const image = sharp(filePath);
  const { data, info } = await image.ensureAlpha().raw().toBuffer({ resolveWithObject: true });

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // Check if pixel is white / near white
    if (r > 240 && g > 240 && b > 240) {
      data[i + 3] = 0; // set alpha to 0 (transparent)
    }
  }

  const transparentBuffer = await sharp(data, {
    raw: {
      width: info.width,
      height: info.height,
      channels: 4
    }
  }).png().toBuffer();

  const trimmed = await sharp(transparentBuffer)
    .trim()
    .resize(600, 600, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
      kernel: sharp.kernel.lanczos3
    })
    .sharpen({ sigma: 1.5 })
    .png({ quality: 100 })
    .toBuffer();

  fs.writeFileSync(filePath, trimmed);
  console.log(`Successfully optimized ingredient image: ${filename}`);
}

async function run() {
  const files = fs.readdirSync(ingrDir).filter(f => f.endsWith('.png'));
  for (const file of files) {
    await processIngr(file);
  }
}

run().catch(console.error);

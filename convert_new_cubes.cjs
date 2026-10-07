const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const projectDir = __dirname;
const cubesDir = path.join(projectDir, 'public', 'cubes');

if (!fs.existsSync(cubesDir)) {
  fs.mkdirSync(cubesDir, { recursive: true });
}

const mapping = [
  { src: '100.webp', dest: 'cube_m100.png' },
  { src: '150.webp', dest: 'cube_m150.png' },
  { src: '200.webp', dest: 'cube_m200.png' },
  { src: '250.webp', dest: 'cube_m250.png' },
  { src: '300.webp', dest: 'cube_m300.png' },
  { src: '350.webp', dest: 'cube_m350.png' },
  { src: '400.webp', dest: 'cube_m400.png' },
  { src: '450.webp', dest: 'cube_m450.png' },
];

async function convertImage(item) {
  const srcPath = path.join(projectDir, item.src);
  const destPath = path.join(cubesDir, item.dest);

  if (!fs.existsSync(srcPath)) {
    console.error(`Source not found: ${srcPath}`);
    return;
  }

  // Load webp, convert all off-white background pixels (R,G,B > 230) to fully transparent
  const image = sharp(srcPath);
  const { data, info } = await image.ensureAlpha().raw().toBuffer({ resolveWithObject: true });

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // Check for off-white / light background pixels
    if (r > 230 && g > 230 && b > 230) {
      data[i + 3] = 0; // set transparent alpha
    }
  }

  // Re-encode, trim transparent padding, resize to 1000x1000 for maximum HD sharpness
  const transparentBuffer = await sharp(data, {
    raw: {
      width: info.width,
      height: info.height,
      channels: 4
    }
  }).png().toBuffer();

  const trimmed = await sharp(transparentBuffer)
    .trim()
    .resize(1000, 1000, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
      kernel: sharp.kernel.lanczos3
    })
    .png({ quality: 100 })
    .toBuffer();

  fs.writeFileSync(destPath, trimmed);
  console.log(`Successfully converted and placed clean transparent 3D cube ${item.src} -> ${item.dest}`);
}

async function run() {
  for (const item of mapping) {
    await convertImage(item);
  }
}

run().catch(console.error);

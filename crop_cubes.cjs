const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const img1 = 'C:/Users/Azizbek/.gemini/antigravity-ide/brain/231f1e03-07a1-441c-aa07-5837985b5a74/.user_uploaded/media_1790404910125.png';
const img2 = 'C:/Users/Azizbek/.gemini/antigravity-ide/brain/231f1e03-07a1-441c-aa07-5837985b5a74/.user_uploaded/media_1790404925254.png';
const outDir = path.join(__dirname, 'public', 'cubes');

// Exact box boundaries inside the 1024px screenshot
const coordsImg1 = [
  { name: 'cube_m100.png', left: 24, top: 27, width: 231, height: 230 },
  { name: 'cube_m150.png', left: 270, top: 27, width: 231, height: 230 },
  { name: 'cube_m200.png', left: 515, top: 27, width: 231, height: 230 },
  { name: 'cube_m250.png', left: 760, top: 27, width: 231, height: 230 },
];

const coordsImg2 = [
  { name: 'cube_m300.png', left: 24, top: 27, width: 231, height: 230 },
  { name: 'cube_m350.png', left: 270, top: 27, width: 231, height: 230 },
  { name: 'cube_m400.png', left: 515, top: 27, width: 231, height: 230 },
  { name: 'cube_m450.png', left: 760, top: 27, width: 231, height: 230 },
];

async function processImage(inputPath, item) {
  const croppedBuffer = await sharp(inputPath)
    .extract({ left: item.left, top: item.top, width: item.width, height: item.height })
    .toBuffer();

  // Load raw pixels and replace any outer white background pixels (>250) with #f8f8f8 (248, 248, 248)
  const { data, info } = await sharp(croppedBuffer).raw().toBuffer({ resolveWithObject: true });
  
  for (let i = 0; i < data.length; i += info.channels) {
    const r = data[i], g = data[i+1], b = data[i+2];
    // If pixel is pure white or near white (from outer frame), convert it to #f8f8f8
    if (r > 250 && g > 250 && b > 250) {
      data[i] = 248;
      data[i+1] = 248;
      data[i+2] = 248;
    }
  }

  await sharp(data, {
    raw: {
      width: info.width,
      height: info.height,
      channels: info.channels
    }
  })
  .png()
  .toFile(path.join(outDir, item.name));

  console.log('Processed and cleaned:', item.name);
}

async function run() {
  for (const item of coordsImg1) {
    await processImage(img1, item);
  }
  for (const item of coordsImg2) {
    await processImage(img2, item);
  }
}

run().catch(console.error);

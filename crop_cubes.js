const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const img1 = 'C:/Users/Azizbek/.gemini/antigravity-ide/brain/231f1e03-07a1-441c-aa07-5837985b5a74/.user_uploaded/media_1790404910125.png';
const img2 = 'C:/Users/Azizbek/.gemini/antigravity-ide/brain/231f1e03-07a1-441c-aa07-5837985b5a74/.user_uploaded/media_1790404925254.png';
const outDir = path.join(__dirname, 'public', 'cubes');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// 1024 x 423
// 4 cards across.
// Columns around:
// Col 0: left 27, top 27, width 231, height 230
// Col 1: left 273, top 27, width 231, height 230
// Col 2: left 518, top 27, width 231, height 230
// Col 3: left 763, top 27, width 231, height 230

const coordsImg1 = [
  { name: 'cube_m100.png', left: 27, top: 27, width: 231, height: 230 },
  { name: 'cube_m150.png', left: 273, top: 27, width: 231, height: 230 },
  { name: 'cube_m200.png', left: 518, top: 27, width: 231, height: 230 },
  { name: 'cube_m250.png', left: 763, top: 27, width: 231, height: 230 },
];

const coordsImg2 = [
  { name: 'cube_m300.png', left: 27, top: 27, width: 231, height: 230 },
  { name: 'cube_m350.png', left: 273, top: 27, width: 231, height: 230 },
  { name: 'cube_m400.png', left: 518, top: 27, width: 231, height: 230 },
  { name: 'cube_m450.png', left: 763, top: 27, width: 231, height: 230 },
];

async function crop() {
  for (const item of coordsImg1) {
    await sharp(img1)
      .extract({ left: item.left, top: item.top, width: item.width, height: item.height })
      .toFile(path.join(outDir, item.name));
    console.log('Saved', item.name);
  }

  for (const item of coordsImg2) {
    await sharp(img2)
      .extract({ left: item.left, top: item.top, width: item.width, height: item.height })
      .toFile(path.join(outDir, item.name));
    console.log('Saved', item.name);
  }
}

crop().catch(console.error);

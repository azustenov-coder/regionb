const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const img1 = 'C:/Users/Azizbek/.gemini/antigravity-ide/brain/231f1e03-07a1-441c-aa07-5837985b5a74/beton_turlari_cards_1_1790413375622.png';
const img2 = 'C:/Users/Azizbek/.gemini/antigravity-ide/brain/231f1e03-07a1-441c-aa07-5837985b5a74/beton_turlari_cards_2_1790413436556.png';
const outDir = path.join(__dirname, 'public', 'types');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Exact tight crop coordinates without card padding or gray background edges
const coords1 = [
  { name: 'tovar_beton.png', left: 115, top: 242, width: 514, height: 222 },
  { name: 'waterproof_beton.png', left: 695, top: 242, width: 514, height: 222 },
  { name: 'road_beton.png', left: 1275, top: 242, width: 514, height: 222 },
];

const coords2 = [
  { name: 'sand_beton.png', left: 115, top: 242, width: 514, height: 260 },
  { name: 'fine_aggregate_beton.png', left: 695, top: 242, width: 514, height: 260 },
  { name: 'sulfate_beton.png', left: 1275, top: 242, width: 514, height: 260 },
];

async function run() {
  for (const item of coords1) {
    await sharp(img1)
      .extract({ left: item.left, top: item.top, width: item.width, height: item.height })
      .toFile(path.join(outDir, item.name));
    console.log('Saved clean', item.name);
  }

  for (const item of coords2) {
    await sharp(img2)
      .extract({ left: item.left, top: item.top, width: item.width, height: item.height })
      .toFile(path.join(outDir, item.name));
    console.log('Saved clean', item.name);
  }
}

run().catch(console.error);

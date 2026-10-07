const sharp = require('sharp');

async function checkColors() {
  const { data, info } = await sharp('public/logo_brand.png')
    .raw()
    .toBuffer({ resolveWithObject: true });

  let whiteBgCount = 0;
  let transparentCount = 0;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i+1];
    const b = data[i+2];
    const a = data[i+3];

    if (a === 0) transparentCount++;
    if (r > 240 && g > 240 && b > 240 && a > 200) whiteBgCount++;
  }

  console.log('Total pixels:', info.width * info.height);
  console.log('Transparent pixels:', transparentCount);
  console.log('White pixels:', whiteBgCount);
}

checkColors();

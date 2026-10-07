const sharp = require('sharp');

async function recolor() {
  const { data, info } = await sharp('public/logo_brand.png')
    .raw()
    .toBuffer({ resolveWithObject: true });

  const width = info.width;
  const height = info.height;
  const channels = info.channels; // 4 (RGBA)

  const outBuf = Buffer.from(data);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * channels;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const a = data[idx + 3];

      if (a === 0) continue;

      const alphaRatio = a / 255;

      // Detect original green blade pixels:
      const isGreen = (g > r + 12 && g > b + 12);

      if (isGreen) {
        // Emerald green: #10b981 (16, 185, 129)
        outBuf[idx] = Math.round(16 * alphaRatio);
        outBuf[idx + 1] = Math.round(185 * alphaRatio);
        outBuf[idx + 2] = Math.round(129 * alphaRatio);
      } else {
        // Check if part of the S icon on the left
        if (x < width * 0.46 && y < height * 0.62) {
          // Top & Bottom blades of the S icon -> Sky Blue: #0ea5e9 (14, 165, 233)
          outBuf[idx] = Math.round(14 * alphaRatio);
          outBuf[idx + 1] = Math.round(165 * alphaRatio);
          outBuf[idx + 2] = Math.round(233 * alphaRatio);
        } else {
          // Text ("RB" and "Region Beton") -> Pure Crisp White #FFFFFF
          outBuf[idx] = Math.round(255 * alphaRatio);
          outBuf[idx + 1] = Math.round(255 * alphaRatio);
          outBuf[idx + 2] = Math.round(255 * alphaRatio);
        }
      }
    }
  }

  await sharp(outBuf, {
    raw: { width, height, channels }
  })
  .png()
  .toFile('public/logo_brand.png');

  console.log('Successfully updated public/logo_brand.png with vivid colors and crisp white text!');
}

recolor();

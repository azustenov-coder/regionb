const sharp = require('sharp');

async function findAlpha() {
  const { data: d1, info: i1 } = await sharp('public/logo_brand.png').raw().toBuffer({ resolveWithObject: true });
  const { data: d2, info: i2 } = await sharp('public/logo_brand_colored.png').raw().toBuffer({ resolveWithObject: true });

  for (let i = 0; i < d1.length; i += 4) {
    if (d1[i+3] > 200) {
      console.log('logo_brand solid pixel:', d1[i], d1[i+1], d1[i+2], d1[i+3]);
      break;
    }
  }

  for (let i = 0; i < d2.length; i += 4) {
    if (d2[i+3] > 200) {
      console.log('logo_brand_colored solid pixel:', d2[i], d2[i+1], d2[i+2], d2[i+3]);
      break;
    }
  }
}

findAlpha();

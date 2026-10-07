const sharp = require('sharp');

async function checkPixels() {
  const { data: d1 } = await sharp('public/logo_brand.png').raw().toBuffer({ resolveWithObject: true });
  const { data: d2 } = await sharp('public/logo_brand_colored.png').raw().toBuffer({ resolveWithObject: true });

  console.log('logo_brand sample non-transparent pixel (RGBA):', d1[1000], d1[1001], d1[1002], d1[1003]);
  console.log('logo_brand_colored sample non-transparent pixel (RGBA):', d2[1000], d2[1001], d2[1002], d2[1003]);
}

checkPixels();

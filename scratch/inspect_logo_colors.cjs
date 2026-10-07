const sharp = require('sharp');

async function inspectLogos() {
  const meta1 = await sharp('public/logo_brand.png').metadata();
  const meta2 = await sharp('public/logo_brand_colored.png').metadata();
  console.log('logo_brand.png:', meta1);
  console.log('logo_brand_colored.png:', meta2);
}

inspectLogos();

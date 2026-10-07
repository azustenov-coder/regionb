const sharp = require('sharp');

async function check() {
  const meta = await sharp('public/logo_brand.png').metadata();
  console.log('Metadata:', meta);
}
check();

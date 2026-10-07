const sharp = require('sharp');

async function compare() {
  const heroMeta = await sharp('public/hero.jpg').metadata();
  console.log('hero.jpg:', heroMeta);

  const labMeta = await sharp('public/lab.jpg').metadata();
  console.log('lab.jpg:', labMeta);
}

compare();

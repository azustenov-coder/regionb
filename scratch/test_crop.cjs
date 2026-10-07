const sharp = require('sharp');

async function testCrop() {
  // Crop logo areas to inspect exact coordinates
  // Image 1: hero_mixer.jpg
  await sharp('public/hero_mixer.jpg').extract({ left: 450, top: 480, width: 250, height: 150 }).toFile('scratch/hero_mixer_door.jpg');
  await sharp('public/hero_mixer.jpg').extract({ left: 900, top: 200, width: 470, height: 350 }).toFile('scratch/hero_mixer_drum.jpg');

  // Image 2: factory_plant.jpg
  await sharp('public/factory_plant.jpg').extract({ left: 120, top: 120, width: 400, height: 320 }).toFile('scratch/factory_silo.jpg');

  // Image 3: mixer_fleet.jpg
  await sharp('public/mixer_fleet.jpg').extract({ left: 420, top: 350, width: 400, height: 260 }).toFile('scratch/fleet_drum.jpg');

  // Image 4: laboratory.jpg
  await sharp('public/laboratory.jpg').extract({ left: 900, top: 520, width: 240, height: 140 }).toFile('scratch/lab_patch.jpg');

  console.log('Crops saved to scratch/');
}

testCrop();

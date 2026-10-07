const fs = require('fs');
const path = require('path');

const brainDir = 'C:\\Users\\Azizbek\\.gemini\\antigravity-ide\\brain\\610e5f7c-fca9-49a3-93f0-09f771e25904';

const mapping = {
  'hero_mixer': 'public/hero_mixer.jpg',
  'factory_plant': 'public/factory_plant.jpg',
  'mixer_fleet': 'public/mixer_fleet.jpg',
  'laboratory': 'public/laboratory.jpg'
};

const brainFiles = fs.readdirSync(brainDir);

for (const [key, destPath] of Object.entries(mapping)) {
  const file = brainFiles.find(f => f.startsWith(key) && f.endsWith('.jpg'));
  if (file) {
    const srcPath = path.join(brainDir, file);
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied ${srcPath} -> ${destPath}`);
  } else {
    console.error(`Could not find generated file for ${key}`);
  }
}

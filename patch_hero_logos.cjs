const sharp = require('sharp');
const fs = require('fs');

async function patchImages() {
  console.log('Starting photo logo patching...');

  // 1. Prepare clean logo images with Sharp
  const logoHeader = await sharp('public/logo_header.png').toBuffer();
  const logoWhite = await sharp('public/logo_white.png').toBuffer();

  // =========================================================================
  // IMAGE 1: hero_mixer.jpg
  // =========================================================================
  {
    const imgMeta = await sharp('public/hero_mixer.jpg').metadata();
    const width = imgMeta.width;
    const height = imgMeta.height;

    // Resized logo for door panel (width ~130px)
    const doorLogo = await sharp(logoHeader)
      .resize(130)
      .toBuffer();

    // Resized & slightly rotated logo for mixer drum (width ~380px)
    const drumLogo = await sharp(logoHeader)
      .resize(380)
      .rotate(-8, { background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .toBuffer();

    // Patch background boxes for door and drum to erase old mismatched logo graphics
    // Door patch: white rounded rectangle over truck cab door panel (left: 510, top: 505)
    const doorPatch = Buffer.from(`
      <svg width="150" height="70">
        <rect x="0" y="0" width="150" height="70" rx="6" fill="#f8fafc" />
      </svg>
    `);

    // Drum patch: smooth white ellipse/rounded box over drum logo area
    const drumPatch = Buffer.from(`
      <svg width="400" height="260">
        <ellipse cx="200" cy="130" rx="195" ry="120" fill="#ffffff" opacity="0.94" />
      </svg>
    `);

    await sharp('public/hero_mixer.jpg')
      .composite([
        { input: doorPatch, left: 515, top: 505 },
        { input: doorLogo, left: 525, top: 512 },
        { input: drumPatch, left: 930, top: 220 },
        { input: drumLogo, left: 940, top: 235 }
      ])
      .jpeg({ quality: 92 })
      .toFile('public/hero_mixer.jpg.tmp');

    fs.renameSync('public/hero_mixer.jpg.tmp', 'public/hero_mixer.jpg');
    console.log('✔ Patched public/hero_mixer.jpg');
  }

  // =========================================================================
  // IMAGE 2: factory_plant.jpg
  // =========================================================================
  {
    // Silo tower logo overlay (width ~260px)
    const siloLogo = await sharp(logoHeader)
      .resize(270)
      .toBuffer();

    // Silo patch box to cover old mismatched "R" box icon
    const siloPatch = Buffer.from(`
      <svg width="300" height="260">
        <rect x="0" y="0" width="300" height="260" rx="12" fill="#ffffff" opacity="0.96" />
      </svg>
    `);

    // Small mixer truck at bottom right
    const truckLogo = await sharp(logoHeader)
      .resize(120)
      .toBuffer();

    const truckPatch = Buffer.from(`
      <svg width="130" height="55">
        <ellipse cx="65" cy="27" rx="60" ry="24" fill="#ffffff" opacity="0.95" />
      </svg>
    `);

    await sharp('public/factory_plant.jpg')
      .composite([
        { input: siloPatch, left: 160, top: 140 },
        { input: siloLogo, left: 175, top: 160 },
        { input: truckPatch, left: 1010, top: 625 },
        { input: truckLogo, left: 1015, top: 630 }
      ])
      .jpeg({ quality: 92 })
      .toFile('public/factory_plant.jpg.tmp');

    fs.renameSync('public/factory_plant.jpg.tmp', 'public/factory_plant.jpg');
    console.log('✔ Patched public/factory_plant.jpg');
  }

  // =========================================================================
  // IMAGE 3: mixer_fleet.jpg
  // =========================================================================
  {
    // Main foreground drum logo (width ~260px, rotated -14 deg to follow drum curvature)
    const fleetDrumLogo = await sharp(logoHeader)
      .resize(260)
      .rotate(-14, { background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .toBuffer();

    const fleetDrumPatch = Buffer.from(`
      <svg width="320" height="180">
        <ellipse cx="160" cy="90" rx="150" ry="80" fill="#ffffff" opacity="0.95" />
      </svg>
    `);

    // Door logo (width ~110px)
    const fleetDoorLogo = await sharp(logoHeader)
      .resize(110)
      .toBuffer();

    const fleetDoorPatch = Buffer.from(`
      <svg width="120" height="50">
        <rect x="0" y="0" width="120" height="50" rx="4" fill="#ffffff" opacity="0.95" />
      </svg>
    `);

    await sharp('public/mixer_fleet.jpg')
      .composite([
        { input: fleetDrumPatch, left: 470, top: 380 },
        { input: fleetDrumLogo, left: 490, top: 395 },
        { input: fleetDoorPatch, left: 140, top: 625 },
        { input: fleetDoorLogo, left: 145, top: 630 }
      ])
      .jpeg({ quality: 92 })
      .toFile('public/mixer_fleet.jpg.tmp');

    fs.renameSync('public/mixer_fleet.jpg.tmp', 'public/mixer_fleet.jpg');
    console.log('✔ Patched public/mixer_fleet.jpg');
  }

  // =========================================================================
  // IMAGE 4: laboratory.jpg
  // =========================================================================
  {
    // Lab coat patch logo (width ~140px)
    const labPatchLogo = await sharp(logoHeader)
      .resize(140)
      .toBuffer();

    // Fabric patch background: crisp white embroidered badge with subtle rounded border
    const labCoatPatch = Buffer.from(`
      <svg width="165" height="90">
        <rect x="2" y="2" width="161" height="86" rx="10" fill="#ffffff" stroke="#cbd5e1" stroke-width="2" />
      </svg>
    `);

    await sharp('public/laboratory.jpg')
      .composite([
        { input: labCoatPatch, left: 935, top: 540 },
        { input: labPatchLogo, left: 947, top: 552 }
      ])
      .jpeg({ quality: 92 })
      .toFile('public/laboratory.jpg.tmp');

    fs.renameSync('public/laboratory.jpg.tmp', 'public/laboratory.jpg');
    console.log('✔ Patched public/laboratory.jpg');
  }

  console.log('🎉 All 4 hero showcase photos patched with official REGION BETON brand logo!');
}

patchImages().catch(console.error);

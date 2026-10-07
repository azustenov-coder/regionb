const sharp = require('sharp');
const fs = require('fs');

async function inspect() {
  const files = fs.readdirSync('public').filter(f => f.endsWith('.jpg'));
  for (const f of files) {
    const meta = await sharp(`public/${f}`).metadata();
    console.log(f, `${meta.width}x${meta.height}`, meta.format);
  }
}

inspect();

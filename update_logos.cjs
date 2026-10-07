const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

const replacement = `<a href="index.html" class="logo-brand">
          <img src="/logo_brand.png" alt="REGION BETON Logo" class="header-logo-img">
        </a>`;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('logo-icon') || content.includes('logo-text')) {
    content = content.replace(/<a href="index\.html" class="logo-brand">[\s\S]*?<\/a>/, replacement);
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated logo in:', file);
  }
});

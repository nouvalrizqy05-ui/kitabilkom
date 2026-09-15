const fs = require('fs');
let path = 'src/pages/Home.jsx';
let code = fs.readFileSync(path, 'utf8');

// Remove Stats Section
const statsRegex = /{\/\*\s*={20}\s*STATISTIK ILKOM\s*={20}\s*\*\/}[\s\S]*?<\/section>/;
if (code.match(statsRegex)) {
    code = code.replace(statsRegex, '');
    console.log('Stats section removed.');
}

// Update Info Banners to use banner-gold and banner-brown
code = code.replace(/banner-pink/g, 'banner-gold');
code = code.replace(/banner-purple/g, 'banner-brown');

fs.writeFileSync(path, code, 'utf8');

// Update CSS for banners
path = 'src/index.css';
let css = fs.readFileSync(path, 'utf8');

const bannerCSS = `
/* Theme updated Info Banners */
.banner-gold {
  background: linear-gradient(135deg, var(--gold-400), var(--gold-600));
}
.banner-brown {
  background: linear-gradient(135deg, var(--navy-600), var(--navy-800)); /* Navy is mapped to brown */
}
`;

css += '\n' + bannerCSS;
fs.writeFileSync(path, css, 'utf8');
console.log('Home.jsx and CSS updated for banners.');

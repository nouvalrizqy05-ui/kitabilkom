const fs = require('fs');
let appCssPath = 'src/app.css';
let appCss = fs.readFileSync(appCssPath, 'utf8');

// Increase blur effect and slightly increase background opacity for better glass effect
appCss = appCss.replace(/backdrop-filter: blur\(6px\);/, 'backdrop-filter: blur(16px);');
appCss = appCss.replace(/background: rgba\(255,255,255,0\.1\);/, 'background: rgba(255,255,255,0.15);');

fs.writeFileSync(appCssPath, appCss, 'utf8');
console.log('App CSS updated for more blur.');

let jsxPath = 'src/pages/BukuAkademik.jsx';
let jsx = fs.readFileSync(jsxPath, 'utf8');

// Replace the 3 logos with the single image group
const oldLogos = /<img src="\/assets\/unnes-logo\.webp" alt="UNNES" \/>\s*<img src="\/assets\/logo-ilkom\.png" alt="ILKOM" style=\{\{ filter: 'brightness\(0\) invert\(1\)' \}\} \/>\s*<img src="\/assets\/logo-astasae\.png" alt="ASTASAE" \/>/;
const newLogo = `<img src="/assets/Group 100881 (2).png" alt="Logos" />`;

jsx = jsx.replace(oldLogos, newLogo);
fs.writeFileSync(jsxPath, jsx, 'utf8');
console.log('JSX updated with new single image logo.');

let indexCssPath = 'src/index.css';
let indexCss = fs.readFileSync(indexCssPath, 'utf8');

// Update the logo container to be just an image wrapper without border/background
const oldLogoCss = /\.banner-buku-logos-top \{[\s\S]*?\}\s*\.banner-buku-logos-top img \{[\s\S]*?\}/;
const newLogoCss = `.banner-buku-logos-top {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 34px; /* Same height as back button */
}
.banner-buku-logos-top img {
  height: 100%;
  object-fit: contain;
}`;

indexCss = indexCss.replace(oldLogoCss, newLogoCss);
fs.writeFileSync(indexCssPath, indexCss, 'utf8');
console.log('Index CSS updated for the new logo wrapper.');

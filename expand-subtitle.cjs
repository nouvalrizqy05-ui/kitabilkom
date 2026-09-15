const fs = require('fs');
let path = 'src/index.css';
let css = fs.readFileSync(path, 'utf8');

const subRegex = /\.banner-buku-subtitle \{[\s\S]*?letter-spacing: 6px;[\s\S]*?\}/;
const newSubCss = `.banner-buku-subtitle {
  color: #ffffff;
  font-family: var(--font-display);
  font-size: 1.2rem;
  letter-spacing: 12px;
  font-weight: 800;
  margin-bottom: 0.2rem;
  transform: translateX(45px); /* Proportional offset for subtitle */
}`;

css = css.replace(subRegex, newSubCss);
fs.writeFileSync(path, css, 'utf8');
console.log('Subtitle expanded and translated proportionally.');

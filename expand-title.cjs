const fs = require('fs');
let path = 'src/index.css';
let css = fs.readFileSync(path, 'utf8');

const titleRegex = /\.banner-buku-title \{[\s\S]*?letter-spacing: 4px;[\s\S]*?\}/;
const newTitleCss = `.banner-buku-title {
  color: #ffffff;
  font-family: var(--font-display);
  font-size: clamp(2rem, 4vw, 3.5rem);
  font-weight: 900;
  letter-spacing: 18px; /* Increased massively */
  text-transform: uppercase;
  margin: 0;
  text-shadow: 0 4px 10px rgba(0,0,0,0.2);
  line-height: 1.1;
  text-align: center;
  transform: translateX(90px); /* Keeps the 'B' anchored by offsetting the flexbox centering expansion */
}`;

css = css.replace(titleRegex, newTitleCss);
fs.writeFileSync(path, css, 'utf8');
console.log('Title letter spacing expanded and anchored to B.');

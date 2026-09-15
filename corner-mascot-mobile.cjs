const fs = require('fs');
let path = 'src/index.css';
let css = fs.readFileSync(path, 'utf8');

const mobileMascotRegex = /\.banner-buku-mascot-right \{\s*right: 2%;\s*height: 120px;\s*bottom: -25px;\s*\}/;
const mobileMascotNew = `.banner-buku-mascot-right {
    right: 0%;
    height: 130px;
    bottom: -45px;
  }`;

css = css.replace(mobileMascotRegex, mobileMascotNew);

fs.writeFileSync(path, css, 'utf8');
console.log('Mobile mascot cornered.');

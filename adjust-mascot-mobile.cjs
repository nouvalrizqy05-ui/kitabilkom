const fs = require('fs');
let path = 'src/index.css';
let css = fs.readFileSync(path, 'utf8');

const regex = /\.banner-buku-mascot-right \{\s*right: -5%;\s*height: 110px;\s*bottom: -15px;\s*\}/;
const newMascotMobileCss = `.banner-buku-mascot-right {
    right: 2%;
    height: 120px;
    bottom: -25px;
  }`;

css = css.replace(regex, newMascotMobileCss);
fs.writeFileSync(path, css, 'utf8');
console.log('Mobile mascot adjusted.');

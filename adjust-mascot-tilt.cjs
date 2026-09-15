const fs = require('fs');
let path = 'src/index.css';
let css = fs.readFileSync(path, 'utf8');

const regex = /\.banner-buku-mascot-right \{[\s\S]*?filter: drop-shadow[\s\S]*?\}/;
const newMascotCss = `.banner-buku-mascot-right {
  position: absolute;
  right: 8%; /* moved away from right edge */
  bottom: -40px; /* lowered to be sliced off */
  height: 190px; /* slightly larger */
  z-index: 5;
  transform: rotate(-20deg); /* heavier rotation to the left */
  transform-origin: bottom center;
  filter: drop-shadow(0 4px 6px rgba(0,0,0,0.2));
}`;

css = css.replace(regex, newMascotCss);
fs.writeFileSync(path, css, 'utf8');
console.log('Mascot adjusted to tilt left and peek from bottom.');

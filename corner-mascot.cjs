const fs = require('fs');
let path = 'src/index.css';
let css = fs.readFileSync(path, 'utf8');

const mascotRegex = /\.banner-buku-mascot-right \{[\s\S]*?filter: drop-shadow[\s\S]*?\}/;
const newMascotCss = `.banner-buku-mascot-right {
  position: absolute;
  right: 1%; /* Pushed closer to the corner */
  bottom: -70px; /* Drops down past the grey strip, deep into the bottom brown grid */
  height: 200px; /* Slightly larger so it reaches well */
  z-index: 5;
  transform: rotate(-20deg); /* Maintains the tilt */
  transform-origin: bottom right; /* Anchor to the corner */
  filter: drop-shadow(-4px 4px 6px rgba(0,0,0,0.3));
}`;

css = css.replace(mascotRegex, newMascotCss);

fs.writeFileSync(path, css, 'utf8');
console.log('Mascot positioned to pop from bottom corner.');

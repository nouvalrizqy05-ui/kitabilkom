const fs = require('fs');
let path = 'src/index.css';
let css = fs.readFileSync(path, 'utf8');

// 1. Shift speech bubble to the right
css = css.replace(/\.banner-buku-speech-bubble \{[\s\S]*?right: 14%;/, `.banner-buku-speech-bubble {\n  position: absolute;\n  right: 11%;`);
css = css.replace(/\.banner-buku-speech-bubble \{\s*right: 18%;/, `.banner-buku-speech-bubble {\n    right: 14%;`); // Mobile adjust

// 2. Replace pseudo elements for the tail
const oldTails = /\/\* Ekor balon mengarah ke kanan bawah \([\s\S]*?\}\s*\/\* Border untuk ekor balon \*\/[\s\S]*?z-index: -1;\s*\}/;
const newTails = `/* Ekor balon mengarah ke lebah (menggunakan rotated square) */
.banner-buku-speech-bubble::after {
  content: '';
  position: absolute;
  bottom: -7px;
  right: 10px;
  width: 16px;
  height: 16px;
  background: white;
  border-right: 2px solid var(--gold-500, #cf9c2a);
  border-bottom: 2px solid var(--gold-500, #cf9c2a);
  transform: rotate(25deg) skewX(-10deg);
  border-bottom-right-radius: 3px;
  z-index: -1;
}`;
css = css.replace(oldTails, newTails);

// Remove mobile specific pseudo elements overrides if they exist
css = css.replace(/\.banner-buku-speech-bubble::after \{\s*right: 10px;\s*\}\s*\.banner-buku-speech-bubble::before \{\s*right: 8px;\s*\}/, '');

fs.writeFileSync(path, css, 'utf8');
console.log('Speech bubble shifted and tail fixed.');

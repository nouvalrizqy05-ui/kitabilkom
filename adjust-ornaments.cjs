const fs = require('fs');
let path = 'src/index.css';
let css = fs.readFileSync(path, 'utf8');

// Center left ornament vertically
css = css.replace(/\.banner-buku-left-ornament \{[\s\S]*?gap: 12px;\s*\}/, `.banner-buku-left-ornament {
  position: absolute;
  left: 10%;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  gap: 12px;
}`);

// Increase mascot size and move to the corner
css = css.replace(/\.banner-buku-mascot-right \{[\s\S]*?filter: drop-shadow[\s\S]*?\}/, `.banner-buku-mascot-right {
  position: absolute;
  right: -2%;
  bottom: -30px;
  height: 170px;
  z-index: 5;
  filter: drop-shadow(0 4px 6px rgba(0,0,0,0.2));
}`);

// Fix mobile mascot right side
css = css.replace(/\.banner-buku-mascot-right \{[\s\S]*?bottom: -5px;\s*\}/, `.banner-buku-mascot-right {
    right: -5%;
    height: 110px;
    bottom: -15px;
  }`);

fs.writeFileSync(path, css, 'utf8');
console.log('Ornaments adjusted.');

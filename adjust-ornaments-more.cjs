const fs = require('fs');
let path = 'src/index.css';
let css = fs.readFileSync(path, 'utf8');

// 1. Move KITAB ILKOM closer to the center
css = css.replace(/\.banner-buku-left-ornament \{[\s\S]*?left: 10%;/, `.banner-buku-left-ornament {\n  position: absolute;\n  left: 22%;`);

// 2. Add overflow: hidden to .banner-buku-body to slice the bee at the bottom
// Be careful to replace the correct block
css = css.replace(/z-index: 2;\s*\}/, `z-index: 2;\n  overflow: hidden;\n}`);

// 3. Lower the mascot so it gets sliced
css = css.replace(/bottom: -35px;/, `bottom: -45px;`);
// Maybe also rotate the mascot slightly MORE if they felt it wasn't rotated enough?
// "dirotasi sama dengan strip abu abu" - it already is, but maybe adding transform: rotate(-5deg) ?
// Let's just explicitly add rotation just to be sure it feels tilted.
css = css.replace(/z-index: 5;/, `z-index: 5;\n  transform: rotate(-3deg);`);

fs.writeFileSync(path, css, 'utf8');
console.log('Ornaments adjusted: cut off and closer.');

const fs = require('fs');
let path = 'src/index.css';
let css = fs.readFileSync(path, 'utf8');

// Remove the absolute positioning for banner-buku-center-text
const regex = /\.banner-buku-center-text \{[\s\S]*?align-items: flex-start;\s*\}/;
css = css.replace(regex, '');

// Restore text-align center on title and subtitle
css = css.replace(/\.banner-buku-title \{([\s\S]*?)text-align: left;/g, '.banner-buku-title {$1text-align: center;');
css = css.replace(/\.banner-buku-subtitle \{([\s\S]*?)text-align: left;/g, '.banner-buku-subtitle {$1text-align: center;');

fs.writeFileSync(path, css, 'utf8');
console.log('Restored centered layout for banners.');

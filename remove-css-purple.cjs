const fs = require('fs');
let path = 'src/index.css';
let css = fs.readFileSync(path, 'utf8');

// Replace any leftover purple in kegiatan
css = css.replace(/var\(--purple-600\)/g, 'var(--gold-500)');
css = css.replace(/var\(--purple-700\)/g, 'var(--gold-600)');

// Also fix hover border color from primary-300 to gold-300
css = css.replace(/border-color: var\(--primary-300\)/g, 'border-color: var(--gold-300)');

fs.writeFileSync(path, css, 'utf8');
console.log('Removed purple from CSS.');

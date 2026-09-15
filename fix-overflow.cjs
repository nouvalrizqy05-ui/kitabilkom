const fs = require('fs');
let path = 'src/index.css';
let css = fs.readFileSync(path, 'utf8');

css = css.replace(/z-index: 2;\s*\}/, `z-index: 2;\n  overflow: hidden;\n}`);

fs.writeFileSync(path, css, 'utf8');
console.log('Overflow hidden applied.');

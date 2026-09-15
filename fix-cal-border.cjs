const fs = require('fs');
let path = 'src/index.css';
let css = fs.readFileSync(path, 'utf8');

css = css.replace(/border: 1px solid var\(--gray-100\);/g, 'border: 1px solid var(--border-color);');

fs.writeFileSync(path, css, 'utf8');
console.log('Fixed calendar border color for dark mode');

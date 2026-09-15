const fs = require('fs');
const path = 'src/index.css';
let css = fs.readFileSync(path, 'utf8');

css = css.replace(/\/\* Fallback image if local gedung is missing \*\/[\s\n]*\}/g, '');

fs.writeFileSync(path, css, 'utf8');
console.log('Fixed CSS orphaned bracket.');

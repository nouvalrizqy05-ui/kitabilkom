const fs = require('fs');
let path = 'src/index.css';
let css = fs.readFileSync(path, 'utf8');

css = css.replace(/padding: 1\.2rem 1rem;/, 'padding: 0.8rem 1rem 1rem;');

fs.writeFileSync(path, css, 'utf8');
console.log('Mobile padding reduced.');

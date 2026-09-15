const fs = require('fs');
let path = 'src/index.css';
let css = fs.readFileSync(path, 'utf8');

css = css.replace(/padding: 2\.2rem 2rem 2\.8rem;/, 'padding: 1rem 2rem 1.5rem;');

fs.writeFileSync(path, css, 'utf8');
console.log('Padding reduced.');

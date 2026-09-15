const fs = require('fs');
let path = 'src/index.css';
let css = fs.readFileSync(path, 'utf8');

css = css.replace(/font-family: var\(--font-serif\); font-style: italic;/g, 'font-family: var(--font-display); font-style: normal;');

fs.writeFileSync(path, css, 'utf8');

// Also update Calendar title
path = 'src/components/Calendar.jsx';
let code = fs.readFileSync(path, 'utf8');
code = code.replace(/Kalender Prestasi/g, 'Kalender');
fs.writeFileSync(path, code, 'utf8');

console.log('Fixed section title font and Kalender name.');

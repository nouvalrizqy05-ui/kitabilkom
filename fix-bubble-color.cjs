const fs = require('fs');
let path = 'src/index.css';
let css = fs.readFileSync(path, 'utf8');

css = css.replace(/color: var\(--navy-900, #1a202c\);/, 'color: #361d0f; /* Hardcoded brown to prevent inversion in dark mode */');

fs.writeFileSync(path, css, 'utf8');
console.log('Speech bubble text color fixed.');

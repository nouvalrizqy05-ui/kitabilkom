const fs = require('fs');
const path = 'src/index.css';
let css = fs.readFileSync(path, 'utf8');

const fix = `
/* Fix hero subtitle color in dark mode */
.dark .hero-subtitle {
  color: #f8fafc;
}
`;

css += '\n' + fix;
fs.writeFileSync(path, css, 'utf8');
console.log('Hero subtitle dark mode fix applied.');

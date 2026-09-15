const fs = require('fs');
const path = 'src/pages/Home.jsx';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(/color: 'var\(--primary-600\)'/g, "color: 'var(--gold-500)'");
code = code.replace(/stroke="var\(--purple-600\)"/g, 'stroke="var(--gold-500)"');

fs.writeFileSync(path, code, 'utf8');
console.log('Colors tweaked in Home.jsx');

const fs = require('fs');
const path = 'src/pages/Home.jsx';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(/color: 'var\(--navy-800\)'/g, "color: 'var(--text-primary)'");

fs.writeFileSync(path, code, 'utf8');
console.log('Fixed color in Home.jsx');

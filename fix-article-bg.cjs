const fs = require('fs');
let path = 'src/pages/Home.jsx';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(/background: 'var\(--navy-900\)'/g, "background: 'var(--text-primary)'");

fs.writeFileSync(path, code, 'utf8');
console.log('Fixed article image wrapper background.');

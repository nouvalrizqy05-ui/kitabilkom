const fs = require('fs');
let path = 'src/components/Calendar.jsx';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(/var\(--navy-900\)/g, 'var(--text-primary)');
code = code.replace(/var\(--gray-500\)/g, 'var(--text-secondary)');
code = code.replace(/var\(--gray-300\)/g, 'var(--border-color)');
code = code.replace(/rgba\(255,255,255,0\.5\)/g, 'var(--card-bg)');

fs.writeFileSync(path, code, 'utf8');
console.log('Calendar colors updated.');

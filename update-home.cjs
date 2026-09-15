const fs = require('fs');
const path = 'src/pages/Home.jsx';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(/var\(--navy-900\)/g, 'var(--text-primary)');
code = code.replace(/var\(--gray-600\)/g, 'var(--text-secondary)');
code = code.replace(/var\(--gray-400\)/g, 'var(--text-secondary)');
// Adjust colors in the hero title, which was implicitly white before if not set
// Or rather, the hero had `color: white;` in CSS. I already changed it to `var(--text-primary)`.

fs.writeFileSync(path, code, 'utf8');
console.log('Home.jsx updated.');

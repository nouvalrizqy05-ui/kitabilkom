const fs = require('fs');
const path = 'src/pages/Home.jsx';
let code = fs.readFileSync(path, 'utf8');

// The extra </div> is causing the issue.
code = code.replace(/<\/div>\n            <\/div>\n            \n            <p className="hero-subtitle">/g, '</div>\n            \n            <p className="hero-subtitle">');

fs.writeFileSync(path, code, 'utf8');
console.log('Fixed syntax error.');

const fs = require('fs');
let path = 'src/pages/Home.jsx';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(/<\/div>\s*<\/div>\s*<p className="hero-subtitle">/, '</div>\n            \n            <p className="hero-subtitle">');

fs.writeFileSync(path, code, 'utf8');
console.log('Fixed extra </div>');

const fs = require('fs');
let path = 'src/pages/Home.jsx';
let code = fs.readFileSync(path, 'utf8');

// Add the missing </div> back before hero-subtitle
code = code.replace(/<\/div>\s*<p className="hero-subtitle">/, '</div>\n            </div>\n            \n            <p className="hero-subtitle">');

fs.writeFileSync(path, code, 'utf8');
console.log('Fixed missing </div>');

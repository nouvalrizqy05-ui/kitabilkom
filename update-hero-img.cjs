const fs = require('fs');
let path = 'src/pages/Home.jsx';
let code = fs.readFileSync(path, 'utf8');

// Replace hero image
code = code.replace(/<img[\s\n]*src="\/assets\/gedung\.png"[\s\n]*alt="Gedung"/, '<img\n            src="/assets/hero.png"\n            alt="Hero"');

fs.writeFileSync(path, code, 'utf8');
console.log('Hero image updated.');

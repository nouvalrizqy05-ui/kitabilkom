const fs = require('fs');
let path = 'src/index.css';
let css = fs.readFileSync(path, 'utf8');

// Revert title
css = css.replace(/letter-spacing: 18px;[\s\S]*?transform: translateX\(90px\);[\s\S]*?\}/, `letter-spacing: 4px;
  text-transform: uppercase;
  margin: 0;
  text-shadow: 0 4px 10px rgba(0,0,0,0.2);
  line-height: 1.1;
  text-align: center;
}`);

// Revert subtitle
css = css.replace(/letter-spacing: 12px;[\s\S]*?transform: translateX\(45px\);[\s\S]*?\}/, `letter-spacing: 6px;
  font-weight: 800;
  margin-bottom: 0.2rem;
}`);

fs.writeFileSync(path, css, 'utf8');
console.log('Reverted to previous letter spacing.');

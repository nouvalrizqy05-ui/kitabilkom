const fs = require('fs');
let path = 'src/app.css';
let css = fs.readFileSync(path, 'utf8');

css = css.replace(
  /\.auth-box h1 \{[\s\S]*?color:\s*var\(--navy-900\);[\s\S]*?\}/,
  function(match) {
    return match.replace('color: var(--navy-900);', 'color: #361d0f; /* Fixed to brown */');
  }
);

fs.writeFileSync(path, css, 'utf8');
console.log('Login title color fixed.');

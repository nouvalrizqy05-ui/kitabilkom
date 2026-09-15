const fs = require('fs');
let path = 'src/index.css';
let css = fs.readFileSync(path, 'utf8');

// Fix: banner text should always be white on colored backgrounds
css = css.replace(
  /\.info-banner \{([\s\S]*?)color:\s*var\(--text-primary\);/,
  '.info-banner {$1color: #ffffff;'
);

fs.writeFileSync(path, css, 'utf8');
console.log('Banner text now white for contrast.');

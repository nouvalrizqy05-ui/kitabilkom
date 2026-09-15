const fs = require('fs');
let path = 'src/index.css';
let css = fs.readFileSync(path, 'utf8');

// 1. Reduce rotation to -0.5deg and margins to -10px
css = css.replace(/transform: rotate\(-1\.5deg\);/, 'transform: rotate(-0.5deg);');
css = css.replace(/margin-top: -25px;/g, 'margin-top: -10px;');
css = css.replace(/margin-bottom: -25px;/g, 'margin-bottom: -10px;');

// 2. Reduce logo size slightly to 40px
css = css.replace(/height: 48px; \/\* Increased size \*\//, 'height: 40px; /* Adjusted size */');

fs.writeFileSync(path, css, 'utf8');
console.log('Rotation and logo size adjusted.');

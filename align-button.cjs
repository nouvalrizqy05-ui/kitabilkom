const fs = require('fs');
let path = 'src/index.css';
let css = fs.readFileSync(path, 'utf8');

// Update the top position of the back button to center it within the top pattern
css = css.replace(/top: 136px !important;/, 'top: 96px !important;');

fs.writeFileSync(path, css, 'utf8');
console.log('Back button aligned with logos.');

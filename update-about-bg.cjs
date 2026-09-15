const fs = require('fs');
let path = 'src/index.css';
let css = fs.readFileSync(path, 'utf8');

// Replace the Unsplash URL with /assets/about.png
css = css.replace(/url\('https:\/\/images\.unsplash\.com\/photo-1562774053-701939374585\?auto=format&fit=crop&q=80&w=1920'\)/, "url('/assets/about.png')");

fs.writeFileSync(path, css, 'utf8');
console.log('About background updated to about.png');

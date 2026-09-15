const fs = require('fs');
const path = 'index.html';
let html = fs.readFileSync(path, 'utf8');

if (!html.includes('Playfair+Display')) {
    html = html.replace(/<link href="https:\/\/fonts.googleapis.com\/css2\?family=Lexend\+Deca[^"]+" rel="stylesheet">/, 
    '<link href="https://fonts.googleapis.com/css2?family=Lexend+Deca:wght@100..900&family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">');
    fs.writeFileSync(path, html, 'utf8');
}
console.log('Font added.');

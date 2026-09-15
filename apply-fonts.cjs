const fs = require('fs');
const path = 'src/index.css';
let css = fs.readFileSync(path, 'utf8');

if (!css.includes('--font-serif')) {
    css = css.replace(/--font-display: 'Lexend Deca', sans-serif;/, "--font-display: 'Lexend Deca', sans-serif;\n    --font-serif: 'Playfair Display', serif;");
}

css = css.replace(/\.hero-title \{\s*font-family: var\(--font-display\);/g, '.hero-title {\n    font-family: var(--font-serif); font-style: italic;');
css = css.replace(/\.section-title \{\s*font-family: var\(--font-display\);/g, '.section-title {\n    font-family: var(--font-serif); font-style: italic;');

fs.writeFileSync(path, css, 'utf8');
console.log('Fonts applied.');

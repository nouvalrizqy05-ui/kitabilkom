const fs = require('fs');
let path = 'src/index.css';
let css = fs.readFileSync(path, 'utf8');

// 1. Update letter spacing on title and subtitle
css = css.replace(/\.banner-buku-subtitle \{[\s\S]*?letter-spacing: 3px;/, `.banner-buku-subtitle {\n  color: #ffffff;\n  font-family: var(--font-display);\n  font-size: 1.2rem;\n  letter-spacing: 6px;`);

css = css.replace(/\.banner-buku-title \{[\s\S]*?text-transform: uppercase;/, `.banner-buku-title {\n  color: #ffffff;\n  font-family: var(--font-display);\n  font-size: clamp(2rem, 4vw, 3.5rem);\n  font-weight: 900;\n  letter-spacing: 4px;\n  text-transform: uppercase;`);

// 2. Adjust mobile mascot to match user's desktop proportions
css = css.replace(/\.banner-buku-mascot-right \{\s*right: 0%;\s*height: 130px;\s*bottom: -45px;\s*\}/, `.banner-buku-mascot-right {
    right: -6%;
    height: 130px;
    bottom: -35px;
  }`);

fs.writeFileSync(path, css, 'utf8');
console.log('Letter spacing and mobile mascot adjusted.');

const fs = require('fs');
let path = 'src/index.css';
let css = fs.readFileSync(path, 'utf8');

// Find the .hero-custom block and replace its background
css = css.replace(/\.hero-custom\s*\{[^}]*background-color:\s*var\(--bg-surface\);[^}]*\}/, function(match) {
    return match.replace(/background-color:\s*var\(--bg-surface\);/, 'background-color: var(--bg-base);');
});

fs.writeFileSync(path, css, 'utf8');
console.log('Fixed hero-custom background securely.');

const fs = require('fs');
const path = 'src/index.css';
let css = fs.readFileSync(path, 'utf8');

// Replace the invalid @supports fallback and just set the background to a working photo directly so they see it.
css = css.replace(/background-image:\s*url\('\/assets\/gedung\.png'\);/g, "background-image: url('https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=1920');");

// Remove the @supports block if it exists
css = css.replace(/@supports not \(background-image: url\('\/assets\/gedung\.png'\)\) \{[\s\S]*?\}/g, '');

fs.writeFileSync(path, css, 'utf8');
console.log('Fixed background image URL');

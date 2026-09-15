const fs = require('fs');
let path = 'src/index.css';
let css = fs.readFileSync(path, 'utf8');

// Replace any remaining purple
css = css.replace(/var\(--purple-500\)/g, 'var(--gold-600)');

// Add background to kegiatan-section if missing
if (!css.includes('background-color: var(--bg-base);') && css.includes('.kegiatan-section {\\r\\n    padding: var(--section-padding) 0;')) {
    css = css.replace(/\.kegiatan-section \{[\s\S]*?z-index: 10;\r?\n\}/, `.kegiatan-section {\n    padding: var(--section-padding) 0;\n    position: relative;\n    z-index: 10;\n    background-color: var(--bg-base);\n}`);
} else if (css.includes('.kegiatan-section {\n    padding: var(--section-padding) 0;\n    position: relative;\n    z-index: 10;\n}')) {
    css = css.replace(/\.kegiatan-section \{\n    padding: var\(--section-padding\) 0;\n    position: relative;\n    z-index: 10;\n\}/, `.kegiatan-section {\n    padding: var(--section-padding) 0;\n    position: relative;\n    z-index: 10;\n    background-color: var(--bg-base);\n}`);
} else {
    // Just force replace
    css = css.replace(/\.kegiatan-section \{/g, '.kegiatan-section {\n    background-color: var(--bg-base);');
}

fs.writeFileSync(path, css, 'utf8');
console.log('Fixed Database Artikel theme and hover.');

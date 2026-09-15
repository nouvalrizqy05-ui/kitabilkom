const fs = require('fs');
let path = 'src/index.css';
let css = fs.readFileSync(path, 'utf8');

// Update calendar-section
css = css.replace(/background:\s*linear-gradient\(180deg, var\(--gray-50\) 0%, white 100%\);/, 'background-color: var(--bg-surface);');
if (css.includes('.calendar-section {\r\n    padding: 3rem 0;\r\n}')) { // if background was already stripped or something
    css = css.replace(/\.calendar-section \{\r\n    padding: 3rem 0;\r\n\}/, '.calendar-section {\n    padding: 3rem 0;\n    background-color: var(--bg-surface);\n}');
}

// Update kegiatan-section
css = css.replace(/background-color:\s*var\(--bg-base\);/g, 'background-color: var(--bg-surface);');

fs.writeFileSync(path, css, 'utf8');
console.log('Unified background colors to --bg-surface');

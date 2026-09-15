const fs = require('fs');
const path = 'src/index.css';
let css = fs.readFileSync(path, 'utf8');

// Replace white semi-transparent backgrounds to use var(--card-bg) or adaptive values
css = css.replace(/background:\s*rgba\(255,\s*255,\s*255,\s*0\.7\);/g, 'background: rgba(var(--bg-base-rgb, 255, 255, 255), 0.7);');
css = css.replace(/background:\s*rgba\(255,\s*255,\s*255,\s*0\.5\);/g, 'background: rgba(var(--bg-base-rgb, 255, 255, 255), 0.5);');

// Let's add --bg-base-rgb to :root and .dark
if (css.includes('--bg-base: #ffffff;')) {
    css = css.replace(/--bg-base: #ffffff;/g, '--bg-base: #ffffff;\n    --bg-base-rgb: 255, 255, 255;');
}
if (css.includes('--bg-base: #1F1F1F;')) {
    css = css.replace(/--bg-base: #1F1F1F;/g, '--bg-base: #1F1F1F;\n    --bg-base-rgb: 31, 31, 31;');
}

// In .card-3d
css = css.replace(/background:\s*rgba\(255,\s*255,\s*255,\s*0\.7\);/g, 'background: rgba(var(--bg-base-rgb), 0.7);');
css = css.replace(/border:\s*1px solid rgba\(255,255,255,0\.5\);/g, 'border: 1px solid var(--border-color);');
css = css.replace(/background:\s*rgba\(255,255,255,0\.5\);/g, 'background: rgba(var(--bg-base-rgb), 0.5);');
css = css.replace(/border:\s*1px solid rgba\(255,255,255,0\.8\);/g, 'border: 1px solid var(--border-color);');
css = css.replace(/inset 0 2px 0 rgba\(255,255,255,0\.8\)/g, 'inset 0 2px 0 var(--border-color)');

// Update text colors for dark mode in titles
css = css.replace(/color:\s*var\(--navy-800\);/g, 'color: var(--text-primary);');
css = css.replace(/color:\s*var\(--navy-900\);/g, 'color: var(--text-primary);');

fs.writeFileSync(path, css, 'utf8');
console.log('Advanced transparency fixed.');

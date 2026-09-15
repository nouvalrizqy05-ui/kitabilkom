const fs = require('fs');

const path = 'src/index.css';
let css = fs.readFileSync(path, 'utf8');

const rootRegex = /:root\s*\{([\s\S]*?)\}/;
const match = css.match(rootRegex);

if (match) {
    let newRoot = match[1];
    
    // Change navy to brown palette
    newRoot = newRoot.replace(/--navy-50: #eceef5;/g, '--navy-50: #fdf8f6;');
    newRoot = newRoot.replace(/--navy-100: #d5d9ea;/g, '--navy-100: #f2e8e3;');
    newRoot = newRoot.replace(/--navy-200: #a8b0d3;/g, '--navy-200: #e3d1c5;');
    newRoot = newRoot.replace(/--navy-300: #7b87bd;/g, '--navy-300: #d1b5a5;');
    newRoot = newRoot.replace(/--navy-400: #5462a0;/g, '--navy-400: #b58b73;');
    newRoot = newRoot.replace(/--navy-500: #3d4d87;/g, '--navy-500: #966144;'); 
    newRoot = newRoot.replace(/--navy-600: #2f3c6e;/g, '--navy-600: #7a4a30;');
    newRoot = newRoot.replace(/--navy-700: #263058;/g, '--navy-700: #5e3722;');
    newRoot = newRoot.replace(/--navy-800: #1d2543;/g, '--navy-800: #4a2a18;');
    newRoot = newRoot.replace(/--navy-900: #141a2e;/g, '--navy-900: #361d0f;');
    newRoot = newRoot.replace(/--navy-950: #0b0f1a;/g, '--navy-950: #211006;');

    newRoot = newRoot.replace(/--purple-600: #6a55a0;/g, '--purple-600: var(--gold-500);');
    newRoot = newRoot.replace(/--purple-900: #312858;/g, '--purple-900: var(--gold-700);');
    newRoot = newRoot.replace(/--purple-500: #7b68ae;/g, '--purple-500: var(--gold-400);');
    newRoot = newRoot.replace(/--blue-600: var\(--navy-600\);/g, '--blue-600: var(--gold-500);'); // Change accents to gold

    const adaptiveVars = `
    /* ── Adaptive Variables (Light Mode Defaults) ── */
    --bg-base: #ffffff;
    --bg-surface: #f8fafc;
    --text-primary: var(--navy-900);
    --text-secondary: var(--gray-600);
    --border-color: var(--gray-200);
    --card-bg: white;
    --card-border: var(--gray-200);
    --nav-bg: rgba(255, 255, 255, 0.95);
`;
    
    css = css.replace(match[0], `:root {${newRoot}${adaptiveVars}}`);
}

const darkConfig = `
.dark {
    --bg-base: #1F1F1F;
    --bg-surface: #2D2D2D;
    --text-primary: #f8fafc;
    --text-secondary: #94a3b8;
    --border-color: #3f3f46;
    --card-bg: #2D2D2D;
    --card-border: #3f3f46;
    --nav-bg: rgba(31, 31, 31, 0.95);
    
    /* Invert base colors */
    --navy-900: #f8fafc;
    --navy-800: #2D2D2D; 
    --gray-50: #1a1a1a;
    --gray-100: #2a2a2a;
    --gray-200: #3a3a3a;
    --gray-800: #f8fafc;
    --gray-900: #ffffff;
    --white: #1F1F1F;
}

body {
    background-color: var(--bg-base);
    color: var(--text-primary);
    transition: background-color 0.3s ease, color 0.3s ease;
}
`;

if (!css.includes('.dark {') && css.includes(':root {')) {
    css = css.replace(/(:root\s*\{[\s\S]*?\})/, `$1\n${darkConfig}`);
}

css = css.replace(/background:\s*white;/g, 'background: var(--card-bg);');
css = css.replace(/background-color:\s*white;/g, 'background-color: var(--card-bg);');
css = css.replace(/background:\s*#fff;/g, 'background: var(--card-bg);');
css = css.replace(/background-color:\s*#fff;/g, 'background-color: var(--card-bg);');
css = css.replace(/color:\s*var\(--navy-900\);/g, 'color: var(--text-primary);');
css = css.replace(/color:\s*var\(--gray-800\);/g, 'color: var(--text-primary);');
css = css.replace(/border:\s*1px solid var\(--gray-200\);/g, 'border: 1px solid var(--border-color);');
css = css.replace(/border-color:\s*var\(--gray-200\);/g, 'border-color: var(--border-color);');

// Navbar scrolled bg
css = css.replace(/\.navbar\.scrolled \{\s*background: [^;]+;/g, '.navbar.scrolled {\n    background: var(--nav-bg);');

// Modify hero gradient to look more like the HMTI reference (white fading to right)
// For dark mode, it should be dark. We use bg-base to surface.
css = css.replace(/linear-gradient\(135deg,\s*var\(--navy-900\)\s*0%,\s*var\(--purple-900\)\s*100%\)/g, 'linear-gradient(135deg, var(--bg-base) 0%, var(--bg-surface) 100%)');
css = css.replace(/color:\s*white;/g, 'color: var(--text-primary);'); // Since hero was dark, text was white. Now hero is light/dark, so text should adapt.

// In hero specifically, there's a title "Kitab Ilkom" that was white
// Let's replace `--gradient-hero` entirely
css = css.replace(/--gradient-hero:[^;]+;/g, '--gradient-hero: linear-gradient(135deg, var(--bg-base) 0%, var(--bg-surface) 100%);');

fs.writeFileSync(path, css, 'utf8');
console.log('Theme applied successfully.');

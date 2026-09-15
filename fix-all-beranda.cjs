const fs = require('fs');

// ==================== 1. FIX index.css ====================
let cssPath = 'src/index.css';
let css = fs.readFileSync(cssPath, 'utf8');

// --- 1a. Add --bg-base, --bg-surface, --bg-surface-rgb to :root if missing ---
if (!css.includes('--bg-base:')) {
  css = css.replace(
    /--radius-full:\s*9999px;\s*\}/,
    `--radius-full: 9999px;

    /* ── Adaptive Variables (Light Mode Defaults) ── */
    --bg-base: #ffffff;
    --bg-surface: #f8fafc;
    --bg-surface-rgb: 248, 250, 252;
    --bg-base-rgb: 255, 255, 255;
    --text-primary: var(--navy-900);
    --text-secondary: var(--gray-600);
    --border-color: var(--gray-200);
    --card-bg: white;
    --card-border: var(--gray-200);
    --nav-bg: rgba(255, 255, 255, 0.95);
}`
  );
  console.log('Added adaptive variables to :root');
} else if (!css.includes('--bg-surface-rgb:')) {
  // bg-base exists but bg-surface-rgb doesn't
  css = css.replace(
    /--bg-surface:\s*#f8fafc;/,
    '--bg-surface: #f8fafc;\n    --bg-surface-rgb: 248, 250, 252;\n    --bg-base-rgb: 255, 255, 255;'
  );
  console.log('Added --bg-surface-rgb to existing :root');
}

// --- 1b. Add .dark {} block if missing ---
if (!css.includes('.dark {')) {
  const darkBlock = `
/* ── Dark Mode ── */
.dark {
    --bg-base: #1F1F1F;
    --bg-surface: #2D2D2D;
    --bg-surface-rgb: 45, 45, 45;
    --bg-base-rgb: 31, 31, 31;
    --text-primary: #f8fafc;
    --text-secondary: #94a3b8;
    --border-color: #3a3a3a;
    --card-bg: #2D2D2D;
    --card-border: #3a3a3a;
    --nav-bg: rgba(31, 31, 31, 0.95);
    --gradient-footer: linear-gradient(180deg, #2a1a11 0%, #1c100a 50%, #110905 100%);
}
`;
  // Insert after the closing } of :root
  css = css.replace(/(\/\*\s*=+\s*RESET & BASE\s*=+\s*\*\/)/, darkBlock + '\n$1');
  console.log('Added .dark {} block');
} else if (!css.includes('--bg-surface-rgb: 45')) {
  // .dark exists but missing rgb vars
  css = css.replace(
    /\.dark\s*\{([^}]*?)--bg-surface:\s*#2D2D2D;/,
    '.dark {$1--bg-surface: #2D2D2D;\n    --bg-surface-rgb: 45, 45, 45;\n    --bg-base-rgb: 31, 31, 31;'
  );
  console.log('Added --bg-surface-rgb to .dark');
}

// --- 1c. Add .banner-gold and .banner-brown CSS if missing ---
if (!css.includes('.banner-gold')) {
  const bannerCSS = `
/* ── Banner Colors (Gold & Brown) ── */
.banner-gold {
  background: linear-gradient(135deg, #D4A843 0%, #c49630 50%, #a87b22 100%) !important;
}

.banner-brown {
  background: linear-gradient(135deg, #5e3722 0%, #4a2a18 50%, #361d0f 100%) !important;
}
`;
  // Append before HMTI REFERENCE STYLES or at end
  if (css.includes('/* ===== HMTI REFERENCE STYLES =====')) {
    css = css.replace('/* ===== HMTI REFERENCE STYLES =====', bannerCSS + '\n/* ===== HMTI REFERENCE STYLES =====');
  } else {
    css += '\n' + bannerCSS;
  }
  console.log('Added .banner-gold and .banner-brown');
}

fs.writeFileSync(cssPath, css, 'utf8');
console.log('index.css fixed.');

// ==================== 2. FIX Home.jsx — Remove Statistik Ilkom ====================
let homePath = 'src/pages/Home.jsx';
let home = fs.readFileSync(homePath, 'utf8');

// Remove the entire Statistik Ilkom UNNES section
const statsStart = home.indexOf('{/* ==================== STATISTIK ILKOM ====================');
if (statsStart !== -1) {
  // Find the closing </section> after this
  const sectionStart = home.indexOf('<section className="stats-section"', statsStart);
  if (sectionStart !== -1) {
    const closingTag = '</section>';
    let searchFrom = sectionStart;
    let depth = 0;
    let endPos = -1;
    
    // Simple section nesting tracker
    for (let i = sectionStart; i < home.length; i++) {
      if (home.substring(i, i + 8) === '<section') {
        depth++;
      }
      if (home.substring(i, i + 10) === '</section>') {
        depth--;
        if (depth === 0) {
          endPos = i + 10;
          break;
        }
      }
    }
    
    if (endPos !== -1) {
      // Remove from comment start to end of </section>
      home = home.substring(0, statsStart) + home.substring(endPos);
      console.log('Removed Statistik Ilkom UNNES section.');
    }
  }
}

// Also remove unused imports: BarChart3, GraduationCap, Library, Star
// (only if they're no longer used elsewhere)
const removeImports = ['BarChart3', 'GraduationCap', 'Library', 'Star'];
for (const imp of removeImports) {
  // Check if it's still used after stats removal
  const usageCount = (home.match(new RegExp('<' + imp + '\\b', 'g')) || []).length;
  if (usageCount === 0) {
    // Remove from import line
    // Pattern: ImportName, or , ImportName
    home = home.replace(new RegExp(',\\s*' + imp + '(?=[,\\s}])'), '');
    home = home.replace(new RegExp(imp + '\\s*,\\s*'), '');
    console.log(`Removed unused import: ${imp}`);
  }
}

fs.writeFileSync(homePath, home, 'utf8');
console.log('Home.jsx fixed.');

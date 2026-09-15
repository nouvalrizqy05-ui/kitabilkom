const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf8');

// ==================== 1. NAVBAR: Fix colors for light mode ====================
// Navbar background: change purple to brown/gold
css = css.replace(
  /\.navbar \{([\s\S]*?)background:\s*var\(--purple-600\);/,
  '.navbar {$1background: var(--navy-900);'
);

// Navbar scrolled: change purple rgba to brown
css = css.replace(
  /\.navbar\.scrolled \{[\s\S]*?background:\s*rgba\(106, 85, 160, 0\.7\);/,
  `.navbar.scrolled {
    background: rgba(54, 29, 15, 0.85);`
);

console.log('Fixed navbar colors.');

// ==================== 2. SECTION TITLE: Fix dark mode visibility ====================
// .section-title uses color: var(--gray-800) which is dark in both modes
// Change to --text-primary so it adapts
css = css.replace(
  /\.section-title \{([\s\S]*?)color:\s*var\(--gray-800\);/,
  '.section-title {$1color: var(--text-primary);'
);

// Also fix body color
css = css.replace(
  /body \{[\s\S]*?color:\s*var\(--gray-800\);/,
  function(match) {
    return match.replace('color: var(--gray-800);', 'color: var(--text-primary);');
  }
);

// Fix .section-link if it has hardcoded colors
css = css.replace(
  /\.section-link \{([\s\S]*?)color:\s*var\(--gray-800\);/,
  '.section-link {$1color: var(--text-primary);'
);

console.log('Fixed section-title dark mode.');

// ==================== 3. SECONDARY PAGES: Add dark mode background ====================
// The page-content and body need --bg-base in dark mode
// Add comprehensive dark mode overrides if not present already

const darkPageFixes = `
/* ── Dark Mode: Page Backgrounds ── */
.dark body {
  background-color: var(--bg-base);
  color: var(--text-primary);
}

.dark .page-content {
  background-color: var(--bg-base);
}

.dark .page-header {
  background: linear-gradient(135deg, var(--navy-900) 0%, var(--navy-800) 100%);
}

.dark .section-header .section-link {
  color: var(--gold-400);
}

.dark .stat-card,
.dark .card-3d {
  background-color: var(--card-bg);
  border-color: var(--card-border);
}

.dark .kegiatan-section {
  background-color: var(--bg-base);
}

.dark .calendar-section {
  background-color: var(--bg-base);
}

.dark .navbar {
  background: var(--navy-900);
}

.dark .navbar.scrolled {
  background: rgba(31, 31, 31, 0.9);
}

.dark .nav-link-custom {
  color: #f8fafc;
}
`;

if (!css.includes('.dark body {')) {
  // Insert before HMTI REFERENCE STYLES
  if (css.includes('/* ===== HMTI REFERENCE STYLES =====')) {
    css = css.replace('/* ===== HMTI REFERENCE STYLES =====', darkPageFixes + '\n/* ===== HMTI REFERENCE STYLES =====');
  } else {
    css += '\n' + darkPageFixes;
  }
  console.log('Added dark mode page background overrides.');
} else {
  console.log('Dark mode body already exists, skipping.');
}

fs.writeFileSync('src/index.css', css, 'utf8');
console.log('All fixes applied.');

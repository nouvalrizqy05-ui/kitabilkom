const fs = require('fs');

let css = fs.readFileSync('src/app.css', 'utf8');

// 1. Fix the "Unduh" button in dark mode
// It was using var(--bg-body) which is undefined, resulting in white text on white background.
// Change to var(--bg-base) so it becomes dark grey text on white background.
css = css.replace(
  /color:\s*var\(--bg-body\)\s*!important;/g,
  'color: var(--bg-base) !important;'
);

// 2. Fix the "Semua" dropdown selector in dark mode
// The selector was [data-theme='dark'] instead of .dark
css = css.replace(
  /\[data-theme='dark'\]\s*\.search-filter-dropdown/g,
  '.dark .search-filter-dropdown'
);

// To ensure high contrast in BOTH modes for the dropdown:
// If it's light mode (background: var(--gold-100)), text should be brown.
// If it's dark mode (background: rgba(207, 156, 42, 0.15)), text is var(--text-primary) (white) which is fine.
// But wait, in app.css we have:
// .search-filter-dropdown select { color: var(--text-primary); }
// In light mode, var(--text-primary) is navy-900 (#141a2e) or #1d2543, which contrasts well on var(--gold-100) (yellow).
// But in the user's screenshot, it was dark mode, and the background was solid pale yellow!
// That's because the [data-theme='dark'] selector didn't apply, so it stayed var(--gold-100) (yellow) but text became var(--text-primary) (white in dark mode).
// Fixing the selector to `.dark` will make the background `rgba(207, 156, 42, 0.15)` which is dark, and white text will be legible.

fs.writeFileSync('src/app.css', css, 'utf8');
console.log('Fixed button text color and dropdown dark mode background in app.css');

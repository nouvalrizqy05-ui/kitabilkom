const fs = require('fs');

let css = fs.readFileSync('src/index.css', 'utf8');

// 1. Update .navbar-custom background
css = css.replace(
  /\.navbar-custom\s*\{[\s\S]*?z-index:\s*1000;/m,
  `.navbar-custom {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 80px;
  background-color: var(--nav-bg);
  border-bottom: 1px solid var(--border-color);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  z-index: 1000;`
);

// 2. Update .nav-link-custom color (default light mode)
css = css.replace(
  /\.nav-link-custom\s*\{[\s\S]*?text-decoration:\s*none;/m,
  `.nav-link-custom {
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 600;
  color: #5e3722; /* Brown text for light mode */
  text-decoration: none;`
);

// 3. Update .nav-link-custom in dark mode
// Make sure .dark .nav-link-custom uses white
if (css.includes('.dark .nav-link-custom {')) {
  css = css.replace(
    /\.dark\s*\.nav-link-custom\s*\{[\s\S]*?\}/m,
    `.dark .nav-link-custom {
  color: #ffffff;
}`
  );
} else {
  // Append if missing
  css += `\n.dark .nav-link-custom {\n  color: #ffffff;\n}\n`;
}

// 4. Update the Moon/Sun icon color in Navbar if needed.
// Wait, the icons in Navbar.jsx might be hardcoded to white, let's check Navbar.jsx.

fs.writeFileSync('src/index.css', css, 'utf8');
console.log('CSS updated successfully.');

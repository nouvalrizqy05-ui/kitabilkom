const fs = require('fs');

let css = fs.readFileSync('src/index.css', 'utf8');

// The required CSS for navbar
const navbarCSS = `
/* ===== HMTI REFERENCE STYLES ===== */
.navbar-custom {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 80px;
  background-color: var(--nav-bg);
  border-bottom: 1px solid var(--border-color);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  z-index: 1000;
  display: flex;
  align-items: center;
}

.navbar-container-custom {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.navbar-brand-custom {
  display: flex;
  align-items: center;
  text-decoration: none;
}

.navbar-logo-custom {
  height: 50px;
  width: auto;
}

.navbar-nav-custom {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-link-custom {
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 600;
  color: #5e3722; /* Brown text for light mode */
  text-decoration: none;
  position: relative;
  padding: 0.5rem 0;
}

.dark .nav-link-custom {
  color: #ffffff; /* White text for dark mode */
}

.nav-link-custom.active {
  color: var(--gold-500);
}

.dark .nav-link-custom.active {
  color: var(--gold-400);
}

.nav-link-custom.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: var(--gold-500);
}

.dark .nav-link-custom.active::after {
  background-color: var(--gold-400);
}
`;

// Remove any broken nav-link-custom pieces to avoid duplicates
css = css.replace(/\.nav-link-custom\s*\{[\s\S]*?\}/g, '');
css = css.replace(/\.dark\s*\.nav-link-custom\s*\{[\s\S]*?\}/g, '');
css = css.replace(/\.nav-link-custom\.active\s*\{[\s\S]*?\}/g, '');
css = css.replace(/\.nav-link-custom\.active::after\s*\{[\s\S]*?\}/g, '');
css = css.replace(/\.navbar-custom\s*\{[\s\S]*?\}/g, '');
css = css.replace(/\.navbar-container-custom\s*\{[\s\S]*?\}/g, '');
css = css.replace(/\.navbar-brand-custom\s*\{[\s\S]*?\}/g, '');
css = css.replace(/\.navbar-logo-custom\s*\{[\s\S]*?\}/g, '');
css = css.replace(/\.navbar-nav-custom\s*\{[\s\S]*?\}/g, '');

// Append cleanly
css += '\n' + navbarCSS;

fs.writeFileSync('src/index.css', css, 'utf8');
console.log('Cleanly applied navbar CSS.');

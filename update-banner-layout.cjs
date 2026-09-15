const fs = require('fs');
let jsxPath = 'src/pages/BukuAkademik.jsx';
let jsx = fs.readFileSync(jsxPath, 'utf8');

// Replace the current banner structure with the new one where logos are inside the top pattern
const oldStructureRegex = /<div className="banner-buku-pattern top"><\/div>\s*<div className="banner-buku-body">\s*<div className="banner-buku-logos">\s*<img src="\/assets\/unnes-logo\.webp" alt="UNNES" \/>\s*<img src="\/assets\/logo-ilkom\.png" alt="ILKOM" style=\{\{ filter: 'brightness\(0\) invert\(1\)' \}\} \/>\s*<img src="\/assets\/logo-astasae\.png" alt="ASTASAE" \/>\s*<\/div>/;

const newStructure = `<div className="banner-buku-pattern top">
          <div className="banner-buku-logos-top">
            <img src="/assets/unnes-logo.webp" alt="UNNES" />
            <img src="/assets/logo-ilkom.png" alt="ILKOM" style={{ filter: 'brightness(0) invert(1)' }} />
            <img src="/assets/logo-astasae.png" alt="ASTASAE" />
          </div>
        </div>
        <div className="banner-buku-body">`;

jsx = jsx.replace(oldStructureRegex, newStructure);
fs.writeFileSync(jsxPath, jsx, 'utf8');

let cssPath = 'src/index.css';
let css = fs.readFileSync(cssPath, 'utf8');

// Remove old .banner-buku-logos
css = css.replace(/\.banner-buku-logos \{[\s\S]*?\}\s*\.banner-buku-logos img \{[\s\S]*?\}/, '');

// Update banner top pattern to contain the logos
css = css.replace(/\.banner-buku-pattern\.top \{[\s\S]*?\}/, `.banner-buku-pattern.top {
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}`);

// Add logos-top styles
const logosCss = `
.banner-buku-logos-top {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 0.3rem 1.2rem;
  border: 1.5px solid rgba(255,255,255,0.9);
  border-radius: 6px;
  background: rgba(255,255,255,0.1);
  height: 34px;
}
.banner-buku-logos-top img {
  height: 100%;
  object-fit: contain;
}
`;
if (!css.includes('.banner-buku-logos-top')) {
    css += logosCss;
}

// Update back button position to be exactly on the border between top pattern (80px) and body
// The border is at 72px (navbar) + 80px (pattern) = 152px
// Button height is ~32px, so 152 - 16 = 136px top coordinate.
css = css.replace(/top: calc\(72px \+ 16px\) !important;/, 'top: 136px !important;');
// Just in case it was 1.2rem before
css = css.replace(/top: calc\(72px \+ 1\.2rem\) !important;/, 'top: 136px !important;');

// Ensure .banner-buku-body centers text properly
css = css.replace(/padding: 1\.2rem 1rem;/g, 'padding: 1.5rem 1rem;');
css = css.replace(/padding: 1rem 2rem 1\.5rem;/, 'padding: 1.5rem 2rem;');

fs.writeFileSync(cssPath, css, 'utf8');
console.log('Logos moved and button centered.');

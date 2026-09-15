const fs = require('fs');
const path = 'src/pages/Home.jsx';
let code = fs.readFileSync(path, 'utf8');

// Replace the logo and title part in Home.jsx
const oldLogoSection = /<div className="hero-brand-logo">[\s\S]*?<\/div>\s*<\/div>/;

const newLogoSection = `<div className="hero-brand-logo">
              <img src="/assets/logo-ilkom.png" alt="Logo Ilkom" style={{ width: '80px', height: 'auto', objectFit: 'contain' }} />
              <img src="/assets/logo-astasae.png" alt="Logo Astasae" style={{ width: '80px', height: 'auto', objectFit: 'contain' }} />
              <div style={{ marginLeft: '10px' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', fontWeight: 800, color: 'var(--navy-800)', lineHeight: 1, marginBottom: '-5px' }}>Kitab</div>
                <div className="hero-title-main" style={{ fontFamily: 'var(--font-display)', fontSize: '4.5rem', fontWeight: 900 }}>ILKOM</div>
              </div>
            </div>`;

if (code.match(oldLogoSection)) {
    code = code.replace(oldLogoSection, newLogoSection);
    fs.writeFileSync(path, code, 'utf8');
    console.log('Hero logo and text updated.');
} else {
    console.log('Regex did not match in Home.jsx.');
}

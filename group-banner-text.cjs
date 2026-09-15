const fs = require('fs');

// 1. UPDATE JSX
let jsxPath = 'src/pages/BukuAkademik.jsx';
let jsx = fs.readFileSync(jsxPath, 'utf8');

const oldBody = `<div className="banner-buku-body">
            <div className="banner-buku-left-ornament">
               <div className="banner-buku-kitab-ilkom">
                  <span>KITAB</span>
                  <span>ILKOM</span>
               </div>
               <div className="banner-buku-vline"></div>
            </div>
            <div className="banner-buku-center-text">
              <span className="banner-buku-subtitle">DIREKTORI</span>
              <h1 className="banner-buku-title">BUKU AKADEMIK</h1>
            </div>
            <img src="/assets/lebah akasin.png" alt="Lebah Akasin" className="banner-buku-mascot-right" />
          </div>`;

const newBody = `<div className="banner-buku-body">
            <div className="banner-buku-content-wrapper">
              <div className="banner-buku-left-ornament">
                 <div className="banner-buku-kitab-ilkom">
                    <span>KITAB</span>
                    <span>ILKOM</span>
                 </div>
                 <div className="banner-buku-vline"></div>
              </div>
              <div className="banner-buku-center-text">
                <span className="banner-buku-subtitle">DIREKTORI</span>
                <h1 className="banner-buku-title">BUKU AKADEMIK</h1>
              </div>
            </div>
            <img src="/assets/lebah akasin.png" alt="Lebah Akasin" className="banner-buku-mascot-right" />
          </div>`;

jsx = jsx.replace(oldBody, newBody);
fs.writeFileSync(jsxPath, jsx, 'utf8');
console.log('JSX updated with content wrapper.');

// 2. UPDATE CSS
let cssPath = 'src/index.css';
let css = fs.readFileSync(cssPath, 'utf8');

// Replace left ornament CSS
const oldLeftOrnament = /\.banner-buku-left-ornament \{[\s\S]*?gap: 12px;\s*\}/;
const newLeftOrnament = `.banner-buku-content-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2.5rem; /* Tweak this for the distance between the two blocks */
  width: 100%;
}

.banner-buku-left-ornament {
  display: flex;
  align-items: center;
  gap: 1.2rem;
}`;
css = css.replace(oldLeftOrnament, newLeftOrnament);

// Fix mobile left ornament
css = css.replace(/\.banner-buku-left-ornament \{\s*left: 2%;\s*transform: translateY\(-50%\) scale\(0\.7\);\s*\}/, `.banner-buku-content-wrapper {
    flex-direction: column;
    gap: 1rem;
  }
  .banner-buku-left-ornament {
    transform: scale(0.85);
  }`);

fs.writeFileSync(cssPath, css, 'utf8');
console.log('CSS updated for grouped layout.');

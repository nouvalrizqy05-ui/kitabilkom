const fs = require('fs');

// 1. UPDATE JSX (Remove banner-buku-content-wrapper)
let jsxPath = 'src/pages/BukuAkademik.jsx';
let jsx = fs.readFileSync(jsxPath, 'utf8');

const oldBody = `<div className="banner-buku-body">
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

const newBody = `<div className="banner-buku-body">
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

jsx = jsx.replace(oldBody, newBody);
fs.writeFileSync(jsxPath, jsx, 'utf8');
console.log('JSX restored to absolute positioning structure.');

// 2. UPDATE CSS
let cssPath = 'src/index.css';
let css = fs.readFileSync(cssPath, 'utf8');

// Remove .banner-buku-content-wrapper and fix .banner-buku-left-ornament
const oldLeftOrnament = /\.banner-buku-content-wrapper \{[\s\S]*?gap: 1\.2rem;\s*\}/;
const newLeftOrnament = `.banner-buku-left-ornament {
  position: absolute;
  left: 15%; /* The target line! Not too far left (10%) and not too close (22%) */
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  gap: 1.2rem;
}`;
css = css.replace(oldLeftOrnament, newLeftOrnament);

// Fix mobile CSS
const oldMobile = /\.banner-buku-content-wrapper \{[\s\S]*?transform: scale\(0\.85\);\s*\}/;
const newMobile = `.banner-buku-left-ornament {
    left: 2%;
    transform: translateY(-50%) scale(0.7);
  }`;
css = css.replace(oldMobile, newMobile);

fs.writeFileSync(cssPath, css, 'utf8');
console.log('CSS updated: left ornament placed at 15%.');

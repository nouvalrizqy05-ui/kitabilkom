const fs = require('fs');
let jsxPath = 'src/pages/BukuAkademik.jsx';
let jsx = fs.readFileSync(jsxPath, 'utf8');

const oldStructure = `<section className="page-header-buku">
        <BackButton />
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="banner-buku-wrapper">
            <div className="banner-buku-pattern top"></div>
            <div className="banner-buku-body">
              <div className="banner-buku-logos">
                <img src="/assets/unnes-logo.webp" alt="UNNES" />
                <img src="/assets/logo-ilkom.png" alt="ILKOM" style={{ filter: 'brightness(0) invert(1)' }} />
                <img src="/assets/logo-astasae.png" alt="ASTASAE" />
              </div>
              <span className="banner-buku-subtitle">DIREKTORI</span>
              <h1 className="banner-buku-title">BUKU AKADEMIK</h1>
            </div>
            <div className="banner-buku-pattern bottom"></div>
          </div>
        </div>
      </section>`;

const newStructure = `<section className="page-header-buku">
        <BackButton />
        <div className="banner-buku-pattern top"></div>
        <div className="banner-buku-body">
          <div className="banner-buku-logos">
            <img src="/assets/unnes-logo.webp" alt="UNNES" />
            <img src="/assets/logo-ilkom.png" alt="ILKOM" style={{ filter: 'brightness(0) invert(1)' }} />
            <img src="/assets/logo-astasae.png" alt="ASTASAE" />
          </div>
          <span className="banner-buku-subtitle">DIREKTORI</span>
          <h1 className="banner-buku-title">BUKU AKADEMIK</h1>
        </div>
        <div className="banner-buku-pattern bottom"></div>
      </section>`;

jsx = jsx.replace(oldStructure, newStructure);
fs.writeFileSync(jsxPath, jsx, 'utf8');

let cssPath = 'src/index.css';
let css = fs.readFileSync(cssPath, 'utf8');

// Replace the specific CSS rules for the banner
css = css.replace(/\.page-header-buku \{[\s\S]*?\}\s*\.banner-buku-wrapper \{[\s\S]*?\}\s*\.banner-buku-pattern \{[\s\S]*?\}\s*\.banner-buku-body \{[\s\S]*?\}/, `.page-header-buku {
  padding-top: 72px; /* Offset for navbar */
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.page-header-buku .back-btn-page {
  z-index: 10;
  top: calc(72px + 1.2rem) !important; /* Ensure it stays below navbar and visible */
  left: 2rem !important;
}

.banner-buku-pattern {
  height: 24px;
  width: 100%;
  background-color: #8c6a21; /* Gold-brown from the image */
  background-image: 
    radial-gradient(rgba(255,255,255,0.3) 25%, transparent 26%),
    radial-gradient(rgba(255,255,255,0.3) 25%, transparent 26%);
  background-size: 40px 40px;
  background-position: 0 0, 20px 20px;
}

.banner-buku-body {
  background-color: #2F363D; /* Slate/Navy grey from image */
  padding: 2.2rem 2rem 2.8rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  border-top: 3px solid #ffffff;
  border-bottom: 3px solid #ffffff;
  width: 100%;
}`);

// Check if the replace worked
if (!css.includes('width: 100%;\n}')) {
    console.log("CSS replace might have failed, check regex.");
}

fs.writeFileSync(cssPath, css, 'utf8');
console.log('Banner made full width.');

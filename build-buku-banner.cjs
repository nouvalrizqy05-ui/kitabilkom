const fs = require('fs');
let jsxPath = 'src/pages/BukuAkademik.jsx';
let jsx = fs.readFileSync(jsxPath, 'utf8');

const oldHeader = `<section className="page-header">
        <BackButton />
        <div className="container">
          <h1 className="page-title">Buku Akademik Digital</h1>
          <p className="page-subtitle">Temukan dan unduh materi kuliah, e-book, dan modul untuk semester Anda.</p>
        </div>
      </section>`;

const newHeader = `<section className="page-header-buku">
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

jsx = jsx.replace(oldHeader, newHeader);
fs.writeFileSync(jsxPath, jsx, 'utf8');

let cssPath = 'src/index.css';
let css = fs.readFileSync(cssPath, 'utf8');

const customCss = `
/* ==================== BANNER BUKU AKADEMIK ==================== */
.page-header-buku {
  padding: 100px 0 40px; /* Offset for navbar */
  background-color: var(--bg-base);
  position: relative;
}

.banner-buku-wrapper {
  width: 100%;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.15);
  display: flex;
  flex-direction: column;
}

.banner-buku-pattern {
  height: 35px;
  background-color: #8c6a21; /* Gold-brown from the image */
  background-image: 
    radial-gradient(rgba(255,255,255,0.3) 25%, transparent 26%),
    radial-gradient(rgba(255,255,255,0.3) 25%, transparent 26%);
  background-size: 40px 40px;
  background-position: 0 0, 20px 20px;
}

.banner-buku-body {
  background-color: #2F363D; /* Slate/Navy grey from image */
  padding: 3.5rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  border-top: 3px solid #ffffff;
  border-bottom: 3px solid #ffffff;
}

.banner-buku-logos {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 0.5rem 1.2rem;
  border: 1px solid rgba(255,255,255,0.8);
  border-radius: 6px;
  margin-bottom: 1.5rem;
  background: rgba(255,255,255,0.05);
}

.banner-buku-logos img {
  height: 32px;
  object-fit: contain;
}

.banner-buku-subtitle {
  color: #ffffff;
  font-family: var(--font-display);
  font-size: 1.1rem;
  letter-spacing: 3px;
  font-weight: 800;
  margin-bottom: 0.2rem;
}

.banner-buku-title {
  color: #ffffff;
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 5vw, 4.5rem);
  font-weight: 900;
  text-transform: uppercase;
  margin: 0;
  text-shadow: 0 4px 10px rgba(0,0,0,0.2);
  line-height: 1.1;
  text-align: center;
}

@media (max-width: 768px) {
  .banner-buku-body {
    padding: 2.5rem 1rem;
  }
  .banner-buku-logos {
    gap: 1rem;
  }
  .banner-buku-logos img {
    height: 24px;
  }
}
`;

if (!css.includes('.page-header-buku')) {
  css += customCss;
  fs.writeFileSync(cssPath, css, 'utf8');
}

console.log('Buku Akademik banner added.');

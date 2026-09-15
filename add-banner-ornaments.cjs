const fs = require('fs');
let jsxPath = 'src/pages/BukuAkademik.jsx';
let jsx = fs.readFileSync(jsxPath, 'utf8');

const oldBody = `<div className="banner-buku-body">
          <span className="banner-buku-subtitle">DIREKTORI</span>
          <h1 className="banner-buku-title">BUKU AKADEMIK</h1>
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
console.log('JSX updated.');

let cssPath = 'src/index.css';
let css = fs.readFileSync(cssPath, 'utf8');

const newCss = `
.banner-buku-center-text {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.banner-buku-left-ornament {
  position: absolute;
  left: 10%;
  display: flex;
  align-items: center;
  gap: 12px;
}

.banner-buku-kitab-ilkom {
  display: flex;
  flex-direction: column;
  color: white;
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 1.4rem;
  line-height: 1.1;
  text-align: right;
  letter-spacing: 1px;
}

.banner-buku-vline {
  width: 3px;
  height: 48px;
  background-color: white;
  border-radius: 2px;
}

.banner-buku-mascot-right {
  position: absolute;
  right: 5%;
  bottom: -15px;
  height: 120px;
  z-index: 5;
  filter: drop-shadow(0 4px 6px rgba(0,0,0,0.2));
}

@media (max-width: 768px) {
  .banner-buku-left-ornament {
    left: 2%;
    transform: scale(0.7);
  }
  .banner-buku-mascot-right {
    right: 0%;
    height: 80px;
    bottom: -5px;
  }
}
`;

if (!css.includes('.banner-buku-left-ornament')) {
    css += newCss;
    fs.writeFileSync(cssPath, css, 'utf8');
    console.log('CSS updated.');
}

const fs = require('fs');

// 1. UPDATE JSX
let jsxPath = 'src/pages/BukuAkademik.jsx';
let jsx = fs.readFileSync(jsxPath, 'utf8');

const oldMascot = `<img src="/assets/lebah akasin.png" alt="Lebah Akasin" className="banner-buku-mascot-right" />`;
const newMascot = `<div className="banner-buku-speech-bubble">IPK 4 menanti!<br/>Semangat :)</div>
            <img src="/assets/lebah akasin.png" alt="Lebah Akasin" className="banner-buku-mascot-right" />`;

jsx = jsx.replace(oldMascot, newMascot);
fs.writeFileSync(jsxPath, jsx, 'utf8');
console.log('JSX updated with speech bubble.');

// 2. UPDATE CSS
let cssPath = 'src/index.css';
let css = fs.readFileSync(cssPath, 'utf8');

const newCss = `
.banner-buku-speech-bubble {
  position: absolute;
  right: 14%;
  bottom: 30px;
  background: white;
  color: var(--navy-900, #1a202c);
  padding: 0.6rem 1rem;
  border-radius: 12px;
  font-family: var(--font-sans);
  font-size: 0.9rem;
  font-weight: 700;
  text-align: center;
  line-height: 1.3;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
  z-index: 6;
  transform: rotate(-3deg);
  animation: float-bubble 3s ease-in-out infinite;
  border: 2px solid var(--gold-500, #cf9c2a);
}

/* Ekor balon mengarah ke kanan bawah (ke arah kepala lebah) */
.banner-buku-speech-bubble::after {
  content: '';
  position: absolute;
  bottom: -10px;
  right: 15px;
  border-width: 12px 12px 0 0;
  border-style: solid;
  border-color: white transparent transparent transparent;
}
/* Border untuk ekor balon */
.banner-buku-speech-bubble::before {
  content: '';
  position: absolute;
  bottom: -13px;
  right: 13px;
  border-width: 14px 14px 0 0;
  border-style: solid;
  border-color: var(--gold-500, #cf9c2a) transparent transparent transparent;
  z-index: -1;
}

@keyframes float-bubble {
  0%, 100% { transform: translateY(0) rotate(-3deg); }
  50% { transform: translateY(-6px) rotate(-3deg); }
}

@media (max-width: 768px) {
  .banner-buku-speech-bubble {
    right: 18%;
    bottom: 55px;
    font-size: 0.75rem;
    padding: 0.5rem 0.8rem;
  }
  .banner-buku-speech-bubble::after {
    right: 10px;
  }
  .banner-buku-speech-bubble::before {
    right: 8px;
  }
}
`;

if (!css.includes('.banner-buku-speech-bubble')) {
    css += newCss;
    fs.writeFileSync(cssPath, css, 'utf8');
    console.log('CSS updated with speech bubble.');
}

const fs = require('fs');
let path = 'src/index.css';
let css = fs.readFileSync(path, 'utf8');

// The file currently has a broken section at the bottom starting from .banner-buku-center-text
// Let's find where .banner-buku-center-text starts and replace everything after it.
const startIndex = css.indexOf('.banner-buku-center-text {');
if (startIndex !== -1) {
    css = css.substring(0, startIndex);
}

const correctCss = `.banner-buku-center-text {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.banner-buku-left-ornament {
  position: absolute;
  left: 10%;
  top: 50%;
  transform: translateY(-50%);
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
  right: -2%;
  bottom: -35px;
  height: 170px;
  z-index: 5;
  filter: drop-shadow(0 4px 6px rgba(0,0,0,0.2));
}

@media (max-width: 768px) {
  .banner-buku-left-ornament {
    left: 2%;
    transform: translateY(-50%) scale(0.7);
  }
  .banner-buku-mascot-right {
    right: -5%;
    height: 110px;
    bottom: -15px;
  }
}
`;

css += correctCss;
fs.writeFileSync(path, css, 'utf8');
console.log('Restored and corrected bottom CSS.');

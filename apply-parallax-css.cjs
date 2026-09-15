const fs = require('fs');
const path = 'src/index.css';
let css = fs.readFileSync(path, 'utf8');

const parallaxCSS = `
/* ===== PARALLAX & STACKING ===== */
.stacked-section {
  position: relative;
  z-index: 10;
  background-color: var(--bg-base);
  box-shadow: 0 10px 40px rgba(0,0,0,0.15); /* Shadow to overlay below */
}

/* Specific to hero to drop shadow downwards */
.hero-custom.stacked-section {
  box-shadow: 0 15px 40px rgba(0,0,0,0.15);
  margin-bottom: -20px; /* Slight overlap */
  padding-bottom: 20px;
}

/* Info banners to shadow upwards and downwards */
.info-banners.stacked-section {
  box-shadow: 0 -15px 40px rgba(0,0,0,0.15), 0 15px 40px rgba(0,0,0,0.15);
  margin-top: -20px; /* Slight overlap */
  padding-top: calc(4rem + 20px);
}

.about-custom-parallax {
  position: relative;
  padding: 8rem 0; /* Extra padding because of overlap */
  background-image: url('/assets/gedung.png');
  background-attachment: fixed;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  z-index: 1; /* Sits below the stacked sections */
  overflow: hidden;
}

/* Fallback image if local gedung is missing */
@supports not (background-image: url('/assets/gedung.png')) {
  .about-custom-parallax {
    background-image: url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1920');
  }
}

.about-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.85); /* Light mode */
  z-index: 1;
  transition: background-color 0.3s ease;
}

.dark .about-overlay {
  background-color: rgba(31, 31, 31, 0.85); /* Dark mode */
}
`;

css += '\n' + parallaxCSS;
fs.writeFileSync(path, css, 'utf8');
console.log('Parallax CSS appended.');

const fs = require('fs');
const path = 'src/index.css';
let css = fs.readFileSync(path, 'utf8');

const newCSS = `
/* ===== HMTI REFERENCE STYLES ===== */
.navbar-custom {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 80px;
  background-color: var(--bg-base);
  border-bottom: 1px solid var(--border-color);
  z-index: 1000;
  display: flex;
  align-items: center;
}

.navbar-container-custom {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.navbar-brand-custom {
  display: flex;
  align-items: center;
}

.navbar-logo-custom {
  height: 50px;
  width: auto;
}

.navbar-nav-custom {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-link-custom {
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  text-decoration: none;
  position: relative;
  padding: 0.5rem 0;
}

.nav-link-custom.active {
  color: var(--gold-400);
}

.nav-link-custom.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: var(--gold-400);
}

.navbar-actions-custom {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.btn-icon-custom {
  background: transparent;
  border: 1px solid var(--text-primary);
  border-radius: 8px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--text-primary);
  transition: all 0.2s ease;
}

.btn-login-custom {
  background-color: var(--gold-400);
  color: white;
  font-weight: 700;
  padding: 0.6rem 1.8rem;
  border-radius: 6px;
  text-decoration: none;
  font-size: 1rem;
  transition: all 0.2s ease;
  box-shadow: 0 4px 10px rgba(196, 150, 48, 0.3);
}

.btn-login-custom:hover {
  background-color: var(--gold-500);
  transform: translateY(-2px);
}

/* Hero Custom */
.hero-custom {
  padding-top: 80px; /* offset navbar */
  min-height: 100vh;
  display: flex;
  align-items: center;
  background-color: var(--bg-base);
  position: relative;
  overflow: hidden;
}

.hero-custom-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  position: relative;
  z-index: 10;
}

.hero-content-custom {
  max-width: 50%;
}

.hero-brand-logo {
  height: 120px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.hero-brand-logo img {
  height: 100%;
}

.hero-title-cursive {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 3rem;
  color: var(--navy-800);
  font-weight: 400;
  line-height: 1;
  margin-bottom: -10px;
}

.hero-title-main {
  font-family: var(--font-display);
  font-size: 4.5rem;
  font-weight: 900;
  color: var(--gold-400);
  line-height: 1;
  letter-spacing: -1px;
  margin-bottom: 1.5rem;
  text-transform: uppercase;
}

.hero-subtitle {
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--navy-700);
  max-width: 400px;
  line-height: 1.5;
}

.hero-image-wrapper {
  position: absolute;
  top: 0;
  right: 0;
  width: 60%;
  height: 100%;
  z-index: 1;
}

.hero-image-wrapper::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to right, var(--bg-base) 0%, transparent 100%);
  z-index: 2;
}

.hero-image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

/* Responsive */
@media (max-width: 768px) {
  .hero-content-custom {
    max-width: 100%;
  }
  .hero-image-wrapper {
    opacity: 0.3;
    width: 100%;
  }
}
`;

css += '\n' + newCSS;
fs.writeFileSync(path, css, 'utf8');
console.log('CSS appended.');

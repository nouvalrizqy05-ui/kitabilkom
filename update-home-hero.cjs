const fs = require('fs');
const path = 'src/pages/Home.jsx';
let code = fs.readFileSync(path, 'utf8');

// Replace from <section className="hero"> up to the start of info-banners
const heroRegex = /<section className="hero"[\s\S]*?{?\/\*\s*={20}\s*INFO BANNERS\s*={20}\s*\*\/}?\s*<section className="info-banners"/;

const hmtiHero = `
      {/* ==================== HERO HMTI STYLE ==================== */}
      <section className="hero-custom">
        <div className="hero-image-wrapper">
          <img 
            src="/assets/gedung.png" 
            alt="Gedung" 
            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1000'; }}
          />
        </div>
        
        <div className="hero-custom-container">
          <div className="hero-content-custom">
            <div className="hero-brand-logo">
              <img src="/assets/logo-ilkom.png" alt="Logo Ilkom" style={{ width: '120px', height: 'auto' }} />
              <div>
                <div className="hero-title-cursive">Portal</div>
                <div className="hero-title-main">AKADEMIK</div>
              </div>
            </div>
            
            <p className="hero-subtitle">
              Himpunan Mahasiswa Ilmu Komputer<br/>Universitas Negeri Semarang
            </p>
          </div>
        </div>
      </section>

      {/* ==================== INFO BANNERS ==================== */}
      <section className="info-banners"`;

if (code.match(heroRegex)) {
    code = code.replace(heroRegex, hmtiHero);
    fs.writeFileSync(path, code, 'utf8');
    console.log('Hero replaced successfully.');
} else {
    console.log('Regex did not match.');
}

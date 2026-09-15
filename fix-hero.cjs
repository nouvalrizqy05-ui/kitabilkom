const fs = require('fs');

let jsxPath = 'src/pages/Home.jsx';
let jsx = fs.readFileSync(jsxPath, 'utf8');

const regex = /<section className="hero" id="beranda">[\s\S]*?<\/section>/;

const newHero = `      {/* ==================== HERO HMTI STYLE ==================== */}
      <section className="hero-custom">
        <div className="hero-image-wrapper">
          <img 
            src="/assets/hero.png" 
            alt="Hero Background" 
            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1000'; }}
          />
        </div>
        
        <div className="hero-custom-container">
          <div className="hero-content-custom">
            <div className="hero-brand-logo">
              <img src="/assets/logo-ilkom.png" alt="Logo Ilkom" style={{ width: '80px', height: 'auto', objectFit: 'contain' }} />
              <img src="/assets/logo-astasae.png" alt="Logo Astasae" style={{ width: '80px', height: 'auto', objectFit: 'contain' }} />
              <div style={{ marginLeft: '10px' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1, marginBottom: '-5px' }}>Kitab</div>
                <div className="hero-title-main" style={{ fontFamily: 'var(--font-display)', fontSize: '4.5rem', fontWeight: 900 }}>ILKOM</div>
              </div>
            </div>
            
            <p className="hero-subtitle">
              Himpunan Mahasiswa Ilmu Komputer<br/>Universitas Negeri Semarang
            </p>
          </div>
        </div>
      </section>`;

jsx = jsx.replace(regex, newHero);
fs.writeFileSync(jsxPath, jsx, 'utf8');
console.log('Home.jsx hero replaced cleanly.');

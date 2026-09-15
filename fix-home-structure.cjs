const fs = require('fs');
let path = 'src/pages/Home.jsx';
let code = fs.readFileSync(path, 'utf8');

const heroRegex = /<section className="hero-custom stacked-section">[\s\S]*?{?\/\*\s*={20}\s*ABOUT KITAB ILKOM\s*={20}\s*\*\/}?/;

const correctHero = `<section className="hero-custom stacked-section">
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
      </section>

      {/* ==================== ABOUT KITAB ILKOM ==================== */}`;

if (code.match(heroRegex)) {
    code = code.replace(heroRegex, correctHero);
}

// Now replace quick links section to include banners
const quickRegex = /<section className="quick-links-section stacked-section">[\s\S]*?{?\/\*\s*={20}\s*KALENDER PRESTASI\s*={20}\s*\*\/}?/;

const correctQuickLinks = `<section className="quick-links-section stacked-section">
        <div className="container" style={{ padding: '5rem 20px' }}>
          <div className="quick-nav-grid">
            
            <Link to="/buku-akademik" className="quick-nav-card">
              <div className="quick-nav-icon">
                <BookOpen size={42} strokeWidth={1.5} />
              </div>
              <span className="quick-nav-label">Buku Akademik</span>
            </Link>

            <Link to="/info-akademik" className="quick-nav-card">
              <div className="quick-nav-icon">
                <Info size={42} strokeWidth={1.5} />
              </div>
              <span className="quick-nav-label">Info Akademik</span>
            </Link>

            <Link to="/dosen" className="quick-nav-card">
              <div className="quick-nav-icon">
                <Users size={42} strokeWidth={1.5} />
              </div>
              <span className="quick-nav-label">Dosen Ilkom</span>
            </Link>

            <Link to="/publikasi" className="quick-nav-card">
              <div className="quick-nav-icon">
                <CheckSquare size={42} strokeWidth={1.5} />
              </div>
              <span className="quick-nav-label">Unggah Artikel</span>
            </Link>

          </div>

          {/* Info Banners grouped inside Quick Links Section */}
          <div style={{ marginTop: '4rem' }}>
            <div className="banners-grid">
              <Link to="/bantuan" className="info-banner banner-gold" style={{ textDecoration: 'none' }}>
                <div className="banner-content">
                  <h3 className="banner-title">Ada kendala terkait<br/>perkuliahan Ilkom?</h3>
                  <p className="banner-desc">Klik di sini untuk menemukan informasi dan solusi!</p>
                </div>
                <div className="banner-icon">
                  <HelpCircle size={100} color="rgba(255,255,255,0.8)" strokeWidth={1.5} />
                </div>
              </Link>
              <a href="https://forms.gle/cvvpeFXCEd4QLBQn7" target="_blank" rel="noopener noreferrer" className="info-banner banner-brown" style={{ textDecoration: 'none' }}>
                <div className="banner-content">
                  <h3 className="banner-title">Pendataan Prestasi<br/>Mahasiswa Ilmu Komputer</h3>
                  <p className="banner-desc">Klik di sini untuk mengisi form pendataan prestasi resmi dan dapatkan apresiasi!</p>
                </div>
                <div className="banner-icon">
                  <Trophy size={100} color="rgba(255,255,255,0.8)" strokeWidth={1.5} />
                </div>
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* ==================== KALENDER PRESTASI ==================== */}`;

if (code.match(quickRegex)) {
    code = code.replace(quickRegex, correctQuickLinks);
}

// Remove stray duplicate About sections if they exist
const duplicateAboutRegex = /{\/\*\s*={20}\s*ABOUT KITAB ILKOM\s*={20}\s*\*\/}\s*{\/\*\s*={20}\s*ABOUT KITAB ILKOM\s*={20}\s*\*\/}/g;
code = code.replace(duplicateAboutRegex, '{/* ==================== ABOUT KITAB ILKOM ==================== */}');

fs.writeFileSync(path, code, 'utf8');
console.log('Fixed Home.jsx structure fully.');

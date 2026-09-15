const fs = require('fs');
let path = 'src/pages/Home.jsx';
let code = fs.readFileSync(path, 'utf8');

// The exact string to start replacing from
const startStr = '{/* ==================== HERO CAROUSEL ==================== */}';
const endStr = '<Calendar />';

const startIndex = code.indexOf(startStr);
const endIndex = code.indexOf(endStr);

if (startIndex !== -1 && endIndex !== -1) {
    const before = code.substring(0, startIndex);
    const after = code.substring(endIndex); // Keep <Calendar />

    const newSections = `{/* ==================== HERO HMTI STYLE ==================== */}
      <section className="hero-custom stacked-section">
        <div className="hero-image-wrapper">
          <img 
            src="/assets/hero.png" 
            alt="Background" 
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

      {/* ==================== ABOUT KITAB ILKOM ==================== */}
      <section className="about-custom" style={{ position: 'relative', padding: '6rem 0', backgroundColor: 'var(--bg-base)', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.05, zIndex: 0 }}>
          <img src="/assets/about.png" alt="Background" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; }} />
        </div>
        
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '4rem' }}>
            
            <div style={{ flex: '1 1 500px' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '3rem', color: 'var(--text-primary)', lineHeight: 1, marginBottom: '-5px' }}>About</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '4rem', fontWeight: 900, color: 'var(--gold-400)', textTransform: 'uppercase', lineHeight: 1 }}>Kitab Ilkom</div>
              </div>
              
              <p style={{ fontSize: '1.1rem', color: 'var(--text-primary)', lineHeight: 1.7, marginBottom: '1.5rem', textAlign: 'justify' }}>
                <strong>Kitab Ilkom</strong> merupakan sebuah portal akademik terpadu yang dirancang khusus untuk memenuhi kebutuhan mahasiswa Ilmu Komputer Universitas Negeri Semarang (UNNES). Kami hadir sebagai pusat informasi yang memudahkan kegiatan perkuliahan sehari-hari.
              </p>
              
              <p style={{ fontSize: '1.1rem', color: 'var(--text-primary)', lineHeight: 1.7, textAlign: 'justify' }}>
                Melalui platform ini, Anda dapat mengakses <strong>Database Buku Akademik</strong>, mendapatkan <strong>Info Akademik</strong> terkini terkait jadwal, lomba, hingga beasiswa, serta melihat profil lengkap di <strong>Database Dosen</strong>. Selain itu, Kitab Ilkom menyediakan fasilitas bagi mahasiswa untuk mengeksplorasi dan mengunggah karya ke dalam <strong>Database Artikel Publikasi</strong>, menciptakan lingkungan akademik yang kolaboratif dan inovatif.
              </p>
            </div>
            
            <div style={{ flex: '1 1 400px', display: 'flex', justifyContent: 'center' }}>
              <div style={{ 
                position: 'relative', 
                width: '100%', 
                maxWidth: '560px', 
                aspectRatio: '16/9', 
                borderRadius: '16px', 
                overflow: 'hidden',
                boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                <img src="/assets/about.png" alt="Video Thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1000'; }} />
                
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 100%)' }}></div>
                
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '68px', height: '48px', background: '#ff0000', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'transform 0.2s' }} onMouseOver={(e) => e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.1)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)'}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 3L19 12L5 21V3Z" />
                  </svg>
                </a>
                
                <div style={{ position: 'absolute', bottom: '20px', left: '20px', right: '20px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-display)', marginBottom: '4px' }}>Mengenal Kitab Ilkom</div>
                    <div style={{ fontSize: '0.9rem', opacity: 0.9, fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>Ilmu Komputer UNNES</div>
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    Tonton di <strong>YouTube</strong>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* ==================== QUICK LINKS NAV ==================== */}
      <section className="quick-links-section stacked-section">
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

            <a href="https://forms.google.com/" target="_blank" rel="noopener noreferrer" className="quick-nav-card">
              <div className="quick-nav-icon">
                <CheckSquare size={42} strokeWidth={1.5} />
              </div>
              <span className="quick-nav-label">Unggah Artikel</span>
            </a>

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

      `;

    code = before + newSections + after;

    // Apply color and UI fixes
    code = code.replace(/color: 'var\(--navy-800\)'/g, "color: 'var(--text-primary)'");
    code = code.replace(/color: 'var\(--primary-600\)'/g, "color: 'var(--gold-500)'");
    code = code.replace(/stroke="var\(--purple-600\)"/g, 'stroke="var(--gold-500)"');

    // Make sure AlertTriangle is imported!
    if (!code.includes('AlertTriangle')) {
        code = code.replace(/Trophy, Camera \} from 'lucide-react';/, "Trophy, Camera, AlertTriangle } from 'lucide-react';");
    }

    // Apply Empty State Fix
    const oldEmpty = /<p>Belum ada artikel publikasi terbaru\.<\/p>/;
    const newEmpty = `<div style={{ background: 'var(--card-bg)', borderRadius: 'var(--radius-2xl)', padding: '4rem 2rem', textAlign: 'center', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gridColumn: '1 / -1' }}>
                <AlertTriangle size={56} strokeWidth={1.5} color="var(--gold-500)" style={{ marginBottom: '1.5rem', opacity: 0.8 }} />
                <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Belum ada artikel publikasi terbaru.</p>
              </div>`;
    code = code.replace(oldEmpty, newEmpty);

    fs.writeFileSync(path, code, 'utf8');
    console.log('Home.jsx fully and safely restored!');
} else {
    console.log('Could not find start or end markers!');
}

const fs = require('fs');
const path = 'src/pages/Home.jsx';
let code = fs.readFileSync(path, 'utf8');

// 1. Modify the About section to use a CSS class for the background and overlay
const aboutRegex = /<section className="about-custom"[\s\S]*?{?\/\*\s*={20}\s*INFO BANNERS\s*={20}\s*\*\/}?\s*<section className="info-banners"/;

const newAbout = `
      {/* ==================== ABOUT KITAB ILKOM ==================== */}
      <section className="about-custom-parallax">
        <div className="about-overlay"></div>
        
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
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
                <img src="/assets/gedung.png" alt="Video Thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1000'; }} />
                
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

      {/* ==================== INFO BANNERS ==================== */}
      <section className="info-banners stacked-section" id="info-banners"`;

if (code.match(aboutRegex)) {
    code = code.replace(aboutRegex, newAbout);
    
    // Add "stacked-section" class to Hero as well
    code = code.replace(/<section className="hero-custom">/, '<section className="hero-custom stacked-section">');
    
    fs.writeFileSync(path, code, 'utf8');
    console.log('Home.jsx updated with parallax structures.');
} else {
    console.log('Regex did not match.');
}

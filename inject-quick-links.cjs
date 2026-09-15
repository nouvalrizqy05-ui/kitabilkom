const fs = require('fs');
let path = 'src/pages/Home.jsx';
let code = fs.readFileSync(path, 'utf8');

const target = '{/* ==================== INFO BANNERS ==================== */}';

const quickLinks = `
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

            <Link to="/publikasi" className="quick-nav-card">
              <div className="quick-nav-icon">
                <CheckSquare size={42} strokeWidth={1.5} />
              </div>
              <span className="quick-nav-label">Unggah Artikel</span>
            </Link>

          </div>
        </div>
      </section>

      `;

if (code.includes(target) && !code.includes('QUICK LINKS NAV')) {
    code = code.replace(target, quickLinks + target);
    // Also fix the duplicate id="info-banners"
    code = code.replace(/id="info-banners" id="info-banners"/g, 'id="info-banners"');
    // Remove stacked-section from info-banners since quick-links will be the one overlapping About
    code = code.replace(/<section className="info-banners stacked-section"/g, '<section className="info-banners"');
    
    fs.writeFileSync(path, code, 'utf8');
    console.log('Quick Links added to Home.jsx');
}

// Update CSS
path = 'src/index.css';
let css = fs.readFileSync(path, 'utf8');

const cssAdd = `
/* ===== QUICK NAV SECTION ===== */
.quick-links-section.stacked-section {
  box-shadow: 0 -15px 40px rgba(0,0,0,0.15), 0 15px 40px rgba(0,0,0,0.05);
  margin-top: -20px;
  background-color: var(--bg-surface);
}

.quick-nav-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 2rem;
  max-width: 1000px;
  margin: 0 auto;
}

.quick-nav-card {
  background-color: var(--card-bg);
  border-radius: 20px;
  padding: 2.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  box-shadow: 0 10px 25px rgba(0,0,0,0.05);
  transition: all 0.3s ease;
  border: 1px solid var(--border-color);
}

.quick-nav-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 35px rgba(0,0,0,0.1);
  border-color: var(--gold-400);
}

.quick-nav-icon {
  color: var(--gold-400);
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
}

.quick-nav-card:hover .quick-nav-icon {
  transform: scale(1.1);
  color: var(--gold-500);
}

.quick-nav-label {
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
  text-align: center;
}
`;

if (!css.includes('QUICK NAV SECTION')) {
    // Remove the info-banners stacked-section shadow rules since we moved it to quick-links-section
    css = css.replace(/\.info-banners\.stacked-section \{[^}]+\}/, '');
    
    css += '\n' + cssAdd;
    fs.writeFileSync(path, css, 'utf8');
    console.log('Quick Links CSS added.');
}

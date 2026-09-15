const fs = require('fs');
let path = 'src/pages/Home.jsx';
let code = fs.readFileSync(path, 'utf8');

// 1. Group Quick Links and Info Banners into a single section
const quickLinksStart = '{/* ==================== QUICK LINKS NAV ==================== */}';
const infoBannersStart = '{/* ==================== INFO BANNERS ==================== */}';
const databaseStart = '{/* ==================== ARTIKEL MAHASISWA ==================== */}';

// Extract Info Banners content
let infoBannersRegex = /{\/\*\s*={20}\s*INFO BANNERS\s*={20}\s*\*\/}[\s\S]*?<section className="info-banners"[^>]*>[\s\S]*?<div className="container"[^>]*>([\s\S]*?)<\/div>\s*<\/section>/;

let bannersMatch = code.match(infoBannersRegex);
if (bannersMatch) {
    let bannersContent = bannersMatch[1]; // This is the .banners-grid div
    
    // Remove the original Info Banners section completely
    code = code.replace(infoBannersRegex, '');
    
    // Inject the banners content at the end of the Quick Links container
    let quickLinksEndRegex = /(<section className="quick-links-section[^>]*>[\s\S]*?<div className="container"[^>]*>[\s\S]*?<\/div>\s*)(<\/div>\s*<\/section>)/;
    
    // Wait, let's just do a simpler replace. Find the end of quick-nav-grid
    let appendTarget = '</div>\n        </div>\n      </section>';
    if (code.includes(appendTarget)) {
        // We will append a divider or just the banners grid inside the container
        let grouped = `
          {/* Info Banners inside Quick Links Section */}
          <div style={{ marginTop: '3rem' }}>
            ${bannersContent}
          </div>
        </div>
      </section>`;
        code = code.replace(appendTarget, grouped);
    }
}

// 2. Remove any remaining purple in Database Artikel
code = code.replace(/var\(--purple-600\)/g, 'var(--gold-600)');
code = code.replace(/var\(--purple-500\)/g, 'var(--gold-500)');
code = code.replace(/banner-purple/g, 'banner-brown');

fs.writeFileSync(path, code, 'utf8');
console.log('Grouped Quick Links with Info Banners, removed purples.');

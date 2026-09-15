const fs = require('fs');

let home = fs.readFileSync('src/pages/Home.jsx', 'utf8');

if (!home.includes('Lock')) {
    home = home.replace(
        /AlertTriangle \} from 'lucide-react';/,
        "AlertTriangle, Lock } from 'lucide-react';"
    );
}

const oldBlock = `<div style={{ 
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
                </div>`;

const newBlock = `<div style={{ 
                  position: 'relative', 
                  width: '100%', 
                  maxWidth: '560px', 
                  aspectRatio: '16/9', 
                  borderRadius: '16px', 
                  overflow: 'hidden',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}>
                  <img src="/assets/about.png" alt="Video Thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(100%) brightness(50%)' }} onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1000'; }} />
                  
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.5) 100%)' }}></div>
                  
                  {/* Sabuk Bergembok */}
                  <div style={{ position: 'absolute', top: '50%', left: 0, width: '100%', height: '60px', transform: 'translateY(-50%)', background: 'rgba(30,30,30,0.85)', backdropFilter: 'blur(8px)', borderTop: '2px solid rgba(255,255,255,0.1)', borderBottom: '2px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, boxShadow: '0 4px 15px rgba(0,0,0,0.5)' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Lock size={20} color="var(--gray-400)" />
                    </div>
                  </div>
                  
                  <div style={{ position: 'absolute', bottom: '20px', left: '20px', right: '20px', color: 'var(--gray-400)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', userSelect: 'none' }}>
                    <div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-display)', marginBottom: '4px' }}>Mengenal Kitab Ilkom</div>
                      <div style={{ fontSize: '0.9rem', opacity: 0.9, fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>Segera Hadir</div>
                    </div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', opacity: 0.6 }}>
                      Tonton di <strong>YouTube</strong>
                    </div>
                  </div>
                </div>`;

home = home.replace(oldBlock, newBlock);

fs.writeFileSync('src/pages/Home.jsx', home, 'utf8');
console.log('Home.jsx updated with locked thumbnail.');

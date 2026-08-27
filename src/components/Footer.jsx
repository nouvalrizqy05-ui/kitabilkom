import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';

export default function Footer() {
  const [showBackToTop, setShowBackToTop] = useState(false);

  // FIX: Tombol kembali ke atas hanya tampil setelah scroll 300px
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <footer className="footer-3d" id="tentang">
        {/* FIX: Hapus dead code footer-wave yang disembunyikan CSS */}
        <div className="footer-3d-bg">
          <div className="grid-3d"></div>
          <div className="footer-particles">
            <div className="particle p1"></div>
            <div className="particle p2"></div>
            <div className="particle p3"></div>
            <div className="particle p4"></div>
            <div className="particle p5"></div>
            <div className="particle p6"></div>
            <div className="particle p7"></div>
            <div className="particle p8"></div>
          </div>
          <div className="glow-orb orb-1"></div>
          <div className="glow-orb orb-2"></div>
          <div className="glow-orb orb-3"></div>
        </div>
        <div className="footer-content">
          <div className="container">
            <div className="footer-main">
              <div className="footer-brand">
                <div className="footer-logos">
                  <img src="/assets/logo-ilkom.png" alt="Logo Ilmu Komputer" className="footer-logo-img" />
                  <img src="/assets/logo-astasae.png" alt="Logo Astasae" className="footer-logo-img" />
                </div>
                <div className="footer-brand-info">
                  <h3 className="footer-brand-title">Kitab Ilkom</h3>
                  <p className="footer-brand-subtitle">Himpunan Mahasiswa Ilmu Komputer<br/>Universitas Negeri Semarang</p>
                </div>
                <p className="footer-address">
                  Gedung PKM FMIPA, Kampus Sekaran, Gunungpati,<br/>
                  Kota Semarang, Jawa Tengah 50229
                </p>
              </div>
              <div className="footer-links-group">
                <h4 className="footer-links-title">Menu</h4>
                <Link to="/" className="footer-link" onClick={scrollToTop}>Beranda</Link>
                <Link to="/buku-akademik" className="footer-link" onClick={scrollToTop}>Buku Akademik</Link>
                <Link to="/info-akademik" className="footer-link" onClick={scrollToTop}>Info Akademik</Link>
              </div>
              <div className="footer-links-group">
                <h4 className="footer-links-title">Lainnya</h4>
                <Link to="/dosen" className="footer-link" onClick={scrollToTop}>Dosen Ilkom</Link>
                <Link to="/vote" className="footer-link" onClick={scrollToTop}>Vote Tutorin</Link>
              </div>
              <div className="footer-social-group">
                <h4 className="footer-links-title">Ikuti Kami</h4>
                <div className="footer-social-icons">
                  <a href="https://instagram.com/himailkomunnes" target="_blank" rel="noopener noreferrer" className="social-icon" id="social-ig" aria-label="Instagram HIMA Ilkom UNNES">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                    </svg>
                  </a>
                  <a href="https://www.tiktok.com/@himailkomunnes" target="_blank" rel="noopener noreferrer" className="social-icon" id="social-tt" aria-label="TikTok HIMA Ilkom UNNES">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/>
                    </svg>
                  </a>
                  <a href="https://youtube.com/@himailkomunnes271?si=xyrHKIC06RkrDbFV" target="_blank" rel="noopener noreferrer" className="social-icon" id="social-yt" aria-label="YouTube HIMA Ilkom UNNES">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M2.5 7.1C2.5 7.1 2 9.5 2 12c0 2.5.5 4.9.5 4.9S3.5 19 6 19.5c2.5.5 6 .5 6 .5s3.5 0 6-.5c2.5-.5 3.5-2.6 3.5-2.6s.5-2.4.5-4.9c0-2.5-.5-4.9-.5-4.9C20.5 4.5 18 4 18 4s-3.5-.5-6-.5C9.5 3.5 6 4 6 4s-2.5.5-3.5 3.1z"/>
                      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            <div className="footer-bottom">
              <p className="footer-copyright">© 2026 Kitab Ilkom — HIMA Ilmu Komputer UNNES. All rights reserved.</p>
              <p className="footer-powered">Di bawah olahan Divisi Akademik Sinergi</p>
            </div>
          </div>
        </div>
      </footer>

      {/* FIX: Tampil hanya setelah scroll 300px */}
      {showBackToTop && (
        <button
          className="back-to-top show"
          id="back-to-top"
          aria-label="Kembali ke atas halaman"
          onClick={scrollToTop}
        >
          <ArrowUp size={20} strokeWidth={2.5} />
        </button>
      )}
    </>
  );
}

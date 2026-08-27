import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ChevronDown, LogOut } from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAkademikDropdownOpen, setIsAkademikDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const location = useLocation();
  const { user, profile, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsAkademikDropdownOpen(false);
    setIsUserDropdownOpen(false);
  }, [location]);

  const handleLogoutConfirm = () => {
    setShowLogoutModal(false);
    signOut();
  };

  return (
    <>
      <header className={`navbar ${isScrolled ? 'scrolled' : ''}`} id="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-brand" id="navbar-brand">
            <img src="/assets/logo-ilkom.png" alt="Logo Ilmu Komputer" className="navbar-logo-img" />
            <img src="/assets/logo-astasae.png" alt="Logo Astasae" className="navbar-logo-img" />
            <div className="navbar-brand-text">
              <span className="brand-title">Kitab</span>
              <span className="brand-subtitle">Ilkom</span>
            </div>
          </Link>
          
          <button 
            className={`navbar-toggle ${isMobileMenuOpen ? 'active' : ''}`} 
            id="navbar-toggle" 
            aria-label="Toggle navigation"
            aria-expanded={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>
          
          <nav className={`navbar-nav ${isMobileMenuOpen ? 'open' : ''}`} id="navbar-nav">
            <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Beranda</Link>
            
            <div 
              className={`nav-dropdown ${isAkademikDropdownOpen ? 'open' : ''}`}
            >
              <button
                className="nav-link dropdown-toggle"
                aria-haspopup="true"
                aria-expanded={isAkademikDropdownOpen}
                onClick={() => setIsAkademikDropdownOpen(!isAkademikDropdownOpen)}
              >
                Akademik
                <ChevronDown className="dropdown-arrow" size={14} strokeWidth={2.5} />
              </button>
              <div className="dropdown-menu" role="menu">
                <Link to="/buku-akademik" className="dropdown-item" role="menuitem">Buku Akademik</Link>
                <Link to="/info-akademik" className="dropdown-item" role="menuitem">Info Akademik</Link>
                <Link to="/dosen" className="dropdown-item" role="menuitem">Dosen Ilkom</Link>
                <Link to="/bantuan" className="dropdown-item" role="menuitem">Pusat Bantuan</Link>
              </div>
            </div>
            
            <Link to="/vote" className={`nav-link ${location.pathname === '/vote' ? 'active' : ''}`}>Vote Tutorin</Link>
            
            {user ? (
              <div 
                className={`nav-dropdown ${isUserDropdownOpen ? 'open' : ''}`}
                style={{ marginLeft: '10px' }}
              >
                <button
                  className="nav-link dropdown-toggle"
                  style={{ background: 'rgba(255,255,255,0.2)' }}
                  aria-haspopup="true"
                  aria-expanded={isUserDropdownOpen}
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                >
                  Hi, {profile?.nama?.split(' ')[0] || 'User'}
                  <ChevronDown className="dropdown-arrow" size={14} strokeWidth={2.5} />
                </button>
                <div className="dropdown-menu" role="menu">
                  <Link to="/profil" className="dropdown-item" role="menuitem">Profil Saya</Link>
                  {profile?.role === 'admin' && (
                    <Link to="/admin" className="dropdown-item" role="menuitem">Admin Dashboard</Link>
                  )}
                  {/* FIX: Konfirmasi logout sebelum keluar */}
                  <button
                    onClick={() => setShowLogoutModal(true)}
                    className="dropdown-item"
                    style={{ width: '100%', textAlign: 'left', color: 'var(--rose-500)' }}
                    role="menuitem"
                  >
                    <LogOut size={14} style={{ marginRight: '6px', display: 'inline' }} />
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="nav-link" style={{ background: 'rgba(255,255,255,0.2)', marginLeft: '10px' }}>Login / Daftar</Link>
            )}
          </nav>
        </div>
      </header>

      {/* ===== MODAL KONFIRMASI LOGOUT ===== */}
      {showLogoutModal && (
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="logout-modal-title"
          onClick={(e) => { if (e.target === e.currentTarget) setShowLogoutModal(false); }}
        >
          <div className="modal-box" style={{ maxWidth: '380px', textAlign: 'center' }}>
            <LogOut size={40} style={{ color: 'var(--rose-500)', marginBottom: '1rem' }} />
            <h2 id="logout-modal-title" style={{ fontFamily: 'var(--font-display)', color: 'var(--navy-900)', marginBottom: '0.5rem' }}>Keluar dari Akun?</h2>
            <p style={{ color: 'var(--gray-500)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
              Anda akan keluar dari sesi Kitab Ilkom. Pastikan pekerjaan Anda sudah tersimpan.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                onClick={() => setShowLogoutModal(false)}
                style={{ padding: '0.7rem 1.5rem', borderRadius: 'var(--radius-full)', border: '1.5px solid var(--gray-300)', background: 'white', fontWeight: 600, cursor: 'pointer', color: 'var(--gray-700)' }}
              >
                Batal
              </button>
              <button
                onClick={handleLogoutConfirm}
                style={{ padding: '0.7rem 1.5rem', borderRadius: 'var(--radius-full)', border: 'none', background: 'var(--rose-500)', color: 'white', fontWeight: 600, cursor: 'pointer' }}
              >
                Ya, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ChevronDown } from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAkademikDropdownOpen, setIsAkademikDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const location = useLocation();
  const { user, profile, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
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

  return (
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
            onClick={() => setIsAkademikDropdownOpen(!isAkademikDropdownOpen)}
          >
            <button className="nav-link dropdown-toggle" style={{cursor: 'pointer'}}>
              Akademik
              <ChevronDown className="dropdown-arrow" size={14} strokeWidth={2.5} />
            </button>
            <div className="dropdown-menu">
              <Link to="/buku-akademik" className="dropdown-item">Buku Akademik</Link>
              <Link to="/info-akademik" className="dropdown-item">Info Akademik</Link>
              <Link to="/dosen" className="dropdown-item">Dosen Ilkom</Link>
              <Link to="/bantuan" className="dropdown-item">Pusat Bantuan</Link>
            </div>
          </div>
          
          <Link to="/vote" className={`nav-link ${location.pathname === '/vote' ? 'active' : ''}`}>Vote Tutorin</Link>
          
          {user ? (
            <div 
              className={`nav-dropdown ${isUserDropdownOpen ? 'open' : ''}`} 
              style={{ marginLeft: '10px' }}
              onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
            >
              <button className="nav-link dropdown-toggle" style={{cursor: 'pointer', background: 'rgba(255,255,255,0.2)'}}>
                Hi, {profile?.nama?.split(' ')[0] || 'User'}
                <ChevronDown className="dropdown-arrow" size={14} strokeWidth={2.5} />
              </button>
              <div className="dropdown-menu">
                <Link to="/profil" className="dropdown-item">Profil Saya</Link>
                {profile?.role === 'admin' && (
                  <Link to="/admin" className="dropdown-item">Admin Dashboard</Link>
                )}
                <button onClick={signOut} className="dropdown-item" style={{ width: '100%', textAlign: 'left', color: 'red' }}>Logout</button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="nav-link" style={{background: 'rgba(255,255,255,0.2)', marginLeft: '10px'}}>Login / Daftar</Link>
          )}
        </nav>
      </div>
    </header>
  );
}

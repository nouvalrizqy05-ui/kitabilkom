import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark' || 
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem('theme', !isDarkMode ? 'dark' : 'light');
  };

  return (
    <header className={`navbar-custom ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container-custom">
        {/* Logo Section */}
        <Link to="/" className="navbar-brand-custom">
          <img src="/assets/logo-ilkom.png" alt="Logo" className="navbar-logo-custom" />
          <span className="navbar-brand-text">KITAB ILKOM</span>
        </Link>

        <button
          type="button"
          className="navbar-menu-toggle"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-label={isMenuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
        
        {/* Navigation Links */}
        <nav className={`navbar-nav-custom ${isMenuOpen ? 'is-open' : ''}`}>
          <Link to="/" className={`nav-link-custom ${location.pathname === '/' ? 'active' : ''}`}>Beranda</Link>
          <Link to="/buku-akademik" className={`nav-link-custom ${location.pathname === '/buku-akademik' ? 'active' : ''}`}>Buku Akademik</Link>
          <Link to="/info-akademik" className={`nav-link-custom ${location.pathname === '/info-akademik' ? 'active' : ''}`}>Info Akademik</Link>
          <Link to="/dosen" className={`nav-link-custom ${location.pathname === '/dosen' ? 'active' : ''}`}>Dosen</Link>
          <Link to="/publikasi" className={`nav-link-custom ${location.pathname === '/publikasi' ? 'active' : ''}`}>Database Artikel</Link>
            {isAdmin && (
              <Link to="/admin" className={`nav-link-custom ${location.pathname.startsWith('/admin') ? 'active' : ''}`}>Dashboard Admin</Link>
            )}
        </nav>
        
        {/* Actions */}
        <div className={`navbar-actions-custom ${isMenuOpen ? 'is-open' : ''}`}>
          <button 
            onClick={toggleDarkMode} 
            className="btn-icon-custom"
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <Link to={user ? "/profil" : "/login"} className="btn-login-custom">
            {user ? "Profil" : "Login"}
          </Link>
        </div>
      </div>
    </header>
  );
}

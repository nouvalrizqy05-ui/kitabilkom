import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Moon, Sun, X, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark' || 
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [unreadNotif, setUnreadNotif] = useState(0);
  const location = useLocation();
  const { user, isAdmin } = useAuth();

  // Read unread aspirasi notifications count from localStorage
  const readUnreadCount = () => {
    try {
      const saved = localStorage.getItem('aspirasi_notifications');
      const notifs = saved ? JSON.parse(saved) : [];
      return notifs.filter(n => !n.read).length;
    } catch { return 0; }
  };

  useEffect(() => {
    setUnreadNotif(readUnreadCount());
    // Listen for storage changes (when Aspirasi page updates notifications)
    const onStorage = (e) => {
      if (e.key === 'aspirasi_notifications') setUnreadNotif(readUnreadCount());
    };
    window.addEventListener('storage', onStorage);
    // Also poll every 30 seconds in case of same-tab updates
    const timer = setInterval(() => setUnreadNotif(readUnreadCount()), 30000);
    return () => { window.removeEventListener('storage', onStorage); clearInterval(timer); };
  }, []);

  // Re-read after navigating (e.g. user visited aspirasi, notifications got marked read)
  useEffect(() => {
    setUnreadNotif(readUnreadCount());
  }, [location.pathname]);

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
          <img src="/assets/logo-ilkom-benar.png" alt="Logo" className="navbar-logo-custom" />
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
          <Link to="/publikasi" className={`nav-link-custom ${location.pathname === '/publikasi' ? 'active' : ''}`}>Publikasi</Link>
          {isAdmin && (
            <Link to="/admin" className={`nav-link-custom ${location.pathname.startsWith('/admin') ? 'active' : ''}`}>Dashboard Admin</Link>
          )}
        </nav>
        
        {/* Actions */}
        <div className={`navbar-actions-custom ${isMenuOpen ? 'is-open' : ''}`}>
          {/* Aspirasi Notification Bell — only for logged-in users */}
          {user && (
            <Link
              to="/bantuan/aspirasi"
              className="navbar-notif-btn"
              title="Notifikasi balasan aspirasi"
              aria-label={unreadNotif > 0 ? `${unreadNotif} notifikasi belum dibaca` : 'Notifikasi aspirasi'}
            >
              <Bell size={20} />
              {unreadNotif > 0 && (
                <span className="navbar-notif-badge">{unreadNotif > 9 ? '9+' : unreadNotif}</span>
              )}
            </Link>
          )}

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

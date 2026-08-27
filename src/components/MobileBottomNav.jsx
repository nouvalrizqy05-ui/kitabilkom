import { NavLink } from 'react-router-dom';
import { Home, BookOpen, FileText, User } from 'lucide-react';

export default function MobileBottomNav() {
  return (
    <nav className="mobile-bottom-nav">
      <NavLink to="/" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}>
        <Home size={24} />
        <span>Beranda</span>
      </NavLink>
      <NavLink to="/buku-akademik" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}>
        <BookOpen size={24} />
        <span>Buku</span>
      </NavLink>
      <NavLink to="/info-akademik" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}>
        <FileText size={24} />
        <span>Info</span>
      </NavLink>
      <NavLink to="/profil" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}>
        <User size={24} />
        <span>Akun</span>
      </NavLink>
    </nav>
  );
}

const fs = require('fs');
let path = 'src/components/Navbar.jsx';
let jsx = fs.readFileSync(path, 'utf8');

// 1. Destructure isAdmin from useAuth
jsx = jsx.replace(/const \{ user \} = useAuth\(\);/, 'const { user, isAdmin } = useAuth();');

// 2. Add the Dashboard Admin link after Database Artikel
const dbArtikelStr = '<Link to="/publikasi" className={`nav-link-custom ${location.pathname === \'/publikasi\' ? \'active\' : \'\'}`}>Database Artikel</Link>';
const adminStr = `\n            {isAdmin && (
              <Link to="/admin" className={\`nav-link-custom \${location.pathname.startsWith('/admin') ? 'active' : ''}\`}>Dashboard Admin</Link>
            )}`;

jsx = jsx.replace(dbArtikelStr, dbArtikelStr + adminStr);

fs.writeFileSync(path, jsx, 'utf8');
console.log('Navbar updated with Dashboard Admin link for admins.');

const fs = require('fs');
const path = 'src/components/Navbar.jsx';
let code = fs.readFileSync(path, 'utf8');

const oldLogo = /<img src="\/assets\/logo-ilkom\.png" alt="Logo" className="navbar-logo-custom" \/>/;
const newLogo = `<img src="/assets/logo-ilkom.png" alt="Logo Ilkom" className="navbar-logo-custom" />\n          <img src="/assets/logo-astasae.png" alt="Logo Astasae" className="navbar-logo-custom" />`;

if (code.match(oldLogo)) {
    code = code.replace(oldLogo, newLogo);
    fs.writeFileSync(path, code, 'utf8');
    console.log('Navbar logos updated.');
} else {
    console.log('Navbar regex did not match.');
}

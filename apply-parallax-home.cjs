const fs = require('fs');
let path = 'src/pages/Home.jsx';
let code = fs.readFileSync(path, 'utf8');

const regex = /<section className="about-custom"[\s\S]*?<div className="container" style={{ position: 'relative', zIndex: 1 }}>/;

const replacement = `<section className="about-custom-parallax">
        <div className="about-overlay"></div>
        
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>`;

if (code.match(regex)) {
    code = code.replace(regex, replacement);
    fs.writeFileSync(path, code, 'utf8');
    console.log('Parallax classes applied to Home.jsx');
} else {
    console.log('Regex did not match in Home.jsx!');
}

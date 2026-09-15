const fs = require('fs');
let path = 'src/index.css';
let css = fs.readFileSync(path, 'utf8');

// 1. Add overflow: hidden to .page-header-buku
css = css.replace(/\.page-header-buku \{[\s\S]*?width: 100%;\s*\}/, `.page-header-buku {
  padding-top: 72px; /* Offset for navbar */
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: hidden;
}`);

// 2. Adjust back button top position
css = css.replace(/top: 96px !important;/, 'top: 106px !important;');

// 3. Transform .banner-buku-body
css = css.replace(/\.banner-buku-body \{[\s\S]*?width: 100%;\s*\}/, `.banner-buku-body {
  background-color: #2F363D; /* Slate/Navy grey from image */
  padding: 1.5rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  border-top: 3px solid #ffffff;
  border-bottom: 3px solid #ffffff;
  width: 104%;
  left: -2%;
  transform: rotate(-1.5deg);
  margin-top: -25px;
  margin-bottom: -25px;
  z-index: 2;
}`);

// 4. Update heights at the bottom of the file
css = css.replace(/\.banner-buku-pattern\.top \{[\s\S]*?height: 80px;/, '.banner-buku-pattern.top {\n  height: 100px;');
css = css.replace(/\.banner-buku-pattern\.bottom \{[\s\S]*?height: 40px;/, '.banner-buku-pattern.bottom {\n  height: 60px;');
css = css.replace(/\.banner-buku-logos-top \{[\s\S]*?height: 34px;[\s\S]*?\}/, `.banner-buku-logos-top {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 48px; /* Increased size */
}`);

fs.writeFileSync(path, css, 'utf8');
console.log('CSS updated for rotation and larger logo.');

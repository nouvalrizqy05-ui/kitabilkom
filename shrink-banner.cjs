const fs = require('fs');
let path = 'src/index.css';
let css = fs.readFileSync(path, 'utf8');

// Reduce body padding from 3.5rem to 1.5rem
css = css.replace(/padding: 3\.5rem 2rem;/, 'padding: 1.8rem 2rem;');
css = css.replace(/padding: 2\.5rem 1rem;/, 'padding: 1.2rem 1rem;');

// Reduce pattern height from 35px to 20px
css = css.replace(/height: 35px;/g, 'height: 24px;');

// Reduce logo box margin bottom
css = css.replace(/margin-bottom: 1\.5rem;/g, 'margin-bottom: 0.8rem;');

// Reduce title size slightly to fit the shorter banner better
css = css.replace(/font-size: clamp\(2\.5rem, 5vw, 4\.5rem\);/, 'font-size: clamp(2rem, 4vw, 3.5rem);');

// Reduce page-header padding
css = css.replace(/padding: 100px 0 40px;/, 'padding: 85px 0 20px;');

fs.writeFileSync(path, css, 'utf8');
console.log('Banner size reduced.');

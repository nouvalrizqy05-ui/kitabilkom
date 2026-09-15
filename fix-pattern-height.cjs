const fs = require('fs');
let path = 'src/index.css';
let css = fs.readFileSync(path, 'utf8');

// Add specific heights for top and bottom patterns
const newPatternCss = `
.banner-buku-pattern.top {
  height: 70px;
}
.banner-buku-pattern.bottom {
  height: 40px;
}
`;

if (!css.includes('.banner-buku-pattern.top')) {
    css += newPatternCss;
}

// Adjust the back button slightly so it sits perfectly centered in the top pattern
css = css.replace(/top: calc\(72px \+ 1\.2rem\) !important;/, 'top: calc(72px + 16px) !important;');

fs.writeFileSync(path, css, 'utf8');
console.log('Top pattern height increased to avoid back button.');

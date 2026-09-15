const fs = require('fs');
let path = 'src/index.css';
let css = fs.readFileSync(path, 'utf8');

// Update footer gradient to match new brown theme
css = css.replace(/--gradient-footer: linear-gradient\(180deg, #1d2543 0%, #141a2e 50%, #0b0f1a 100%\);/, '--gradient-footer: linear-gradient(180deg, #2a1a11 0%, #1c100a 50%, #110905 100%);');

// Update footer box-shadow to be brown/neutral instead of purple-blue
css = css.replace(/0 -12px 40px rgba\(20, 26, 46, 0\.45\),/, '0 -12px 40px rgba(42, 26, 17, 0.45),');
css = css.replace(/0 -4px 16px rgba\(29, 37, 67, 0\.35\),/, '0 -4px 16px rgba(28, 16, 10, 0.35),');
css = css.replace(/0 -1px 4px rgba\(47, 60, 110, 0\.25\);/, '0 -1px 4px rgba(17, 9, 5, 0.25);');

fs.writeFileSync(path, css, 'utf8');
console.log('Fixed Footer theme.');

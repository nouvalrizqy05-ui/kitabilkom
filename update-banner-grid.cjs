const fs = require('fs');
let path = 'src/index.css';
let css = fs.readFileSync(path, 'utf8');

// Replace the polka dot pattern with the new grid pattern + radial glow
const oldPattern = /\.banner-buku-pattern \{[\s\S]*?background-position: 0 0, 20px 20px;\s*\}/;

const newPattern = `.banner-buku-pattern {
  height: 28px; /* Slightly taller to show the grid better */
  width: 100%;
  background-color: var(--gold-600, #a87b22); /* Brown background */
  
  /* Grid pattern + Center Glow */
  background-image: 
    radial-gradient(ellipse at center, rgba(255, 255, 255, 0.4) 0%, transparent 60%), /* Cahaya putih (glow) */
    linear-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px), /* Garis horizontal */
    linear-gradient(90deg, rgba(255, 255, 255, 0.15) 1px, transparent 1px); /* Garis vertikal */
    
  background-size: 
    100% 100%, /* Glow fills the element */
    12px 12px, /* Grid size */
    12px 12px;
  background-position: center center;
}`;

if (oldPattern.test(css)) {
    css = css.replace(oldPattern, newPattern);
    fs.writeFileSync(path, css, 'utf8');
    console.log('Grid pattern updated successfully.');
} else {
    console.log('Could not find the old pattern to replace.');
}

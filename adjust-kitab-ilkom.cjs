const fs = require('fs');
let path = 'src/index.css';
let css = fs.readFileSync(path, 'utf8');

css = css.replace(/\.banner-buku-kitab-ilkom \{[\s\S]*?letter-spacing: 1px;\s*\}/, `.banner-buku-kitab-ilkom {
  display: flex;
  flex-direction: column;
  color: white;
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 1.4rem;
  line-height: 1.1;
  text-align: right;
  letter-spacing: 4px;
  margin-right: -4px; /* Compensate for letter-spacing on the right aligned text so it stays flush with the line */
  text-transform: uppercase;
}`);

fs.writeFileSync(path, css, 'utf8');
console.log('KITAB ILKOM adjusted.');

const fs = require('fs');
let path = 'src/index.css';
let css = fs.readFileSync(path, 'utf8');

// Replace the current gradient with a much smoother, wider fade
// The key is: start fully opaque, stay opaque longer, then fade very gradually
css = css.replace(
  /\.hero-image-wrapper::before \{[\s\S]*?z-index: 2;\s*\}/,
  `.hero-image-wrapper::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    /* Smooth multi-stop gradient from left: solid -> very gradual fade */
    background: 
      linear-gradient(to right, 
        var(--bg-base) 0%, 
        var(--bg-base) 15%, 
        rgba(var(--bg-base-rgb), 0.95) 25%, 
        rgba(var(--bg-base-rgb), 0.8) 35%, 
        rgba(var(--bg-base-rgb), 0.5) 50%, 
        rgba(var(--bg-base-rgb), 0.2) 65%, 
        rgba(var(--bg-base-rgb), 0.05) 80%, 
        transparent 100%
      ),
      /* Bottom fade for smooth section transition */
      linear-gradient(to top, 
        var(--bg-base) 0%, 
        rgba(var(--bg-base-rgb), 0.8) 8%, 
        rgba(var(--bg-base-rgb), 0.3) 20%, 
        transparent 35%
      );
    z-index: 2;
  }`
);

fs.writeFileSync(path, css, 'utf8');
console.log('Hero gradient now ultra-smooth like Kabinet Elaborasi.');

const fs = require('fs');
let path = 'src/index.css';
let css = fs.readFileSync(path, 'utf8');

// The root cause: .stacked-section sets bg-surface, but hero gradient fades to bg-base (white).
// These don't match, creating a visible line.
// 
// Fix: Make the hero use bg-surface everywhere (both background AND gradient),
// so the hero background and gradient color are identical = no line.
// Then the transition to sections below (also bg-surface) will be seamless too.

// 1. Update gradient overlay to use bg-surface instead of bg-base
//    We need a new CSS variable for the surface rgb values
const surfaceRgbLight = '248, 250, 252'; // #f8fafc
const surfaceRgbDark = '45, 45, 45'; // #2D2D2D

// Add --bg-surface-rgb variable in light mode
css = css.replace(
  /--bg-surface:\s*#f8fafc;/,
  '--bg-surface: #f8fafc;\n    --bg-surface-rgb: ' + surfaceRgbLight + ';'
);

// Add --bg-surface-rgb variable in dark mode
css = css.replace(
  /--bg-surface:\s*#2D2D2D;/,
  '--bg-surface: #2D2D2D;\n    --bg-surface-rgb: ' + surfaceRgbDark + ';'
);

// 2. Update the hero gradient overlay to use bg-surface-rgb instead of bg-base-rgb
css = css.replace(
  /\.hero-image-wrapper::before \{[\s\S]*?z-index: 2;\s*\}/,
  `.hero-image-wrapper::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      linear-gradient(to right, 
        var(--bg-surface) 0%, 
        var(--bg-surface) 15%, 
        rgba(var(--bg-surface-rgb), 0.95) 25%, 
        rgba(var(--bg-surface-rgb), 0.8) 35%, 
        rgba(var(--bg-surface-rgb), 0.5) 50%, 
        rgba(var(--bg-surface-rgb), 0.2) 65%, 
        rgba(var(--bg-surface-rgb), 0.05) 80%, 
        transparent 100%
      ),
      linear-gradient(to top, 
        var(--bg-surface) 0%, 
        rgba(var(--bg-surface-rgb), 0.8) 8%, 
        rgba(var(--bg-surface-rgb), 0.3) 20%, 
        transparent 35%
      );
    z-index: 2;
  }`
);

// 3. Make sure .hero-custom background is bg-surface (same as stacked-section)
css = css.replace(
  /\.hero-custom\s*\{[^}]*background-color:\s*var\(--bg-base\);/,
  function(match) {
    return match.replace('background-color: var(--bg-base);', 'background-color: var(--bg-surface);');
  }
);

fs.writeFileSync(path, css, 'utf8');
console.log('Hero gradient and background now perfectly matched - no more visible line.');

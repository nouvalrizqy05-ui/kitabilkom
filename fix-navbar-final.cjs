const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf8');

// Fix the corrupted area: there's an orphaned "}" at line 3008 and missing .navbar-custom + .navbar-container-custom + .navbar-brand-custom
// Replace the broken section
const broken = `.dark .nav-link-custom {
  color: #f8fafc;
}

}\r
\r
.navbar-logo-custom {`;

const fixed = `.dark .nav-link-custom {
  color: #f8fafc;
}

/* ===== HMTI REFERENCE STYLES ===== */
.navbar-custom {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 80px;
  background-color: #361d0f;
  border-bottom: none;
  z-index: 1000;
  display: flex;
  align-items: center;
}

.navbar-container-custom {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.navbar-brand-custom {
  display: flex;
  align-items: center;
}

.navbar-logo-custom {`;

if (css.includes('}\r\n\r\n.navbar-logo-custom {')) {
  // Use indexOf for precision
  const anchor = '.dark .nav-link-custom {\n  color: #f8fafc;\n}\n\n';
  const anchorIdx = css.indexOf('.dark .nav-link-custom {');
  if (anchorIdx !== -1) {
    // Find the orphaned } after this block
    const afterDarkBlock = css.indexOf('}', anchorIdx + 10); // end of .dark .nav-link-custom
    const afterOrphan = css.indexOf('.navbar-logo-custom {', afterDarkBlock);
    
    if (afterOrphan !== -1) {
      // Replace from anchorIdx to afterOrphan with the fixed version
      const before = css.substring(0, anchorIdx);
      const after = css.substring(afterOrphan);
      
      css = before + `.dark .nav-link-custom {
  color: #f8fafc;
}

/* ===== HMTI REFERENCE STYLES ===== */
.navbar-custom {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 80px;
  background-color: #361d0f;
  border-bottom: none;
  z-index: 1000;
  display: flex;
  align-items: center;
}

.navbar-container-custom {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.navbar-brand-custom {
  display: flex;
  align-items: center;
}

` + after;
      console.log('Fixed corrupted navbar-custom section.');
    }
  }
} else {
  console.log('Could not find broken pattern.');
}

// Also change nav-link-custom color from white to dark brown for light mode
css = css.replace(
  /\.nav-link-custom \{([\s\S]*?)color:\s*#ffffff;/,
  '.nav-link-custom {$1color: rgba(255,255,255,0.85);'
);

fs.writeFileSync('src/index.css', css, 'utf8');
console.log('Done.');

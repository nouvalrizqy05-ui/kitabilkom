const fs = require('fs');

// 1. Fix index.css
let cssPath = 'src/index.css';
let css = fs.readFileSync(cssPath, 'utf8');

// Remove background-color: #b5c4df; from body
css = css.replace(/background-color:\s*#b5c4df;/g, '');

// Fix any lingering purple in footer
css = css.replace(/rgba\(123,\s*104,\s*174,\s*0\.15\)/g, 'rgba(42, 26, 17, 0.15)'); // footer-main border
css = css.replace(/rgba\(123,\s*104,\s*174,\s*0\.3\)/g, 'rgba(42, 26, 17, 0.3)'); // social-icon shadow

fs.writeFileSync(cssPath, css, 'utf8');

// 2. Fix Home.jsx
let jsxPath = 'src/pages/Home.jsx';
let jsx = fs.readFileSync(jsxPath, 'utf8');

// Add AlertTriangle to imports
jsx = jsx.replace(/import \{([^}]+)\} from 'lucide-react';/, "import {$1, AlertTriangle} from 'lucide-react';");

// Replace empty state
const oldEmptyState = '<p>Belum ada artikel publikasi terbaru.</p>';
const newEmptyState = `<div style={{ background: 'var(--card-bg)', borderRadius: 'var(--radius-2xl)', padding: '4rem 2rem', textAlign: 'center', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gridColumn: '1 / -1' }}>
                <AlertTriangle size={56} strokeWidth={1.5} color="var(--gold-500)" style={{ marginBottom: '1.5rem', opacity: 0.8 }} />
                <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Belum ada artikel publikasi terbaru.</p>
              </div>`;

jsx = jsx.replace(oldEmptyState, newEmptyState);

fs.writeFileSync(jsxPath, jsx, 'utf8');
console.log('Fixed body background and Database empty state.');

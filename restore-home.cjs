const fs = require('fs');
let path = 'src/pages/Home.jsx';
let jsx = fs.readFileSync(path, 'utf8');

// 1. Color replacements
jsx = jsx.replace(/color: 'var\(--navy-800\)'/g, "color: 'var(--text-primary)'");
jsx = jsx.replace(/color: 'var\(--primary-600\)'/g, "color: 'var(--gold-500)'");
jsx = jsx.replace(/stroke="var\(--purple-600\)"/g, 'stroke="var(--gold-500)"');

// 2. Empty state replacement
const oldEmpty = /<p>Belum ada artikel publikasi terbaru\.<\/p>/;
const newEmpty = `<div style={{ background: 'var(--card-bg)', borderRadius: 'var(--radius-2xl)', padding: '4rem 2rem', textAlign: 'center', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gridColumn: '1 / -1' }}>
                <AlertTriangle size={56} strokeWidth={1.5} color="var(--gold-500)" style={{ marginBottom: '1.5rem', opacity: 0.8 }} />
                <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Belum ada artikel publikasi terbaru.</p>
              </div>`;
jsx = jsx.replace(oldEmpty, newEmpty);

fs.writeFileSync(path, jsx, 'utf8');
console.log('Home.jsx colors and UI restored.');

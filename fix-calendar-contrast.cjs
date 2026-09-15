const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf8');

// Fix .calendar-matrix-container background
css = css.replace(
  /\.calendar-matrix-container\s*\{[\s\S]*?background:\s*white;/,
  match => match.replace('background: white;', 'background: var(--card-bg);')
);

// Fix .calendar-month-header color
css = css.replace(
  /\.calendar-month-header\s*\{([\s\S]*?)color:\s*var\(--navy-900\);/,
  '.calendar-month-header {$1color: var(--text-primary);'
);

// Fix .events-date-title color
css = css.replace(
  /\.events-date-title\s*\{([\s\S]*?)color:\s*var\(--navy-900\);/,
  '.events-date-title {$1color: var(--text-primary);'
);

// Ensure .dark overrides for hover on cal-day
const darkOverrides = `
.dark .cal-day:not(.empty):hover {
    background: var(--card-border);
    color: var(--text-primary);
}
.dark .calendar-month-header button {
    color: var(--text-primary) !important;
}
`;
if (!css.includes('.dark .cal-day:not(.empty):hover')) {
  css += '\n' + darkOverrides;
}

fs.writeFileSync('src/index.css', css, 'utf8');
console.log('Fixed calendar CSS colors.');

let jsx = fs.readFileSync('src/components/Calendar.jsx', 'utf8');

// Fix gradient of CalendarDays icon for Kalender Prestasi
jsx = jsx.replace(
  /<stop offset="0" stopColor="#2F3C6E" \/>/g,
  '<stop offset="0" stopColor="var(--gold-400, #d4a843)" />'
);
jsx = jsx.replace(
  /<stop offset="1" stopColor="#7B68AE" \/>/g,
  '<stop offset="1" stopColor="var(--gold-500, #c49630)" />'
);

// Alternatively, just replace the SVG stroke directly
jsx = jsx.replace(
  /stroke="url\(#calTitleGrad\)"/g,
  'stroke="var(--gold-500)"'
);

// Fix the "today" border/color which uses --primary-700
jsx = jsx.replace(
  /color:\s*'var\(--primary-700\)'/g,
  "color: 'var(--text-primary)'"
);
jsx = jsx.replace(
  /border:\s*'2px solid var\(--primary-400\)'/g,
  "border: '2px solid var(--gold-500)'"
);

fs.writeFileSync('src/components/Calendar.jsx', jsx, 'utf8');
console.log('Fixed Calendar.jsx icon and active day styling.');

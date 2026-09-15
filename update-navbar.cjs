const fs = require('fs');
const path = 'src/components/Navbar.jsx';
let code = fs.readFileSync(path, 'utf8');

// 1. Add Moon, Sun to lucide-react imports
code = code.replace(/import\s*\{\s*ChevronDown,\s*LogOut\s*\}\s*from\s*'lucide-react';/, "import { ChevronDown, LogOut, Moon, Sun } from 'lucide-react';");

// 2. Inject states and useEffects inside Navbar function
const hooksInjection = `
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark' || 
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem('theme', !isDarkMode ? 'dark' : 'light');
  };
`;

code = code.replace(/const location = useLocation\(\);/, `const location = useLocation();\n${hooksInjection}`);

// 3. Add the toggle button before the User Profile/Login button
const toggleButton = `
            <button 
              onClick={toggleDarkMode} 
              className="nav-link" 
              style={{ background: 'transparent', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '0.4rem 0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 'auto' }}
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
`;

code = code.replace(/\{user \? \(/, `${toggleButton}\n            {user ? (`);

// Save back
fs.writeFileSync(path, code, 'utf8');
console.log('Navbar updated successfully.');

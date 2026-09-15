const fs = require('fs');
let path = 'src/pages/Home.jsx';
let code = fs.readFileSync(path, 'utf8');

// Add AlertTriangle to the lucide-react import
code = code.replace(/Trophy, Camera \} from 'lucide-react';/, "Trophy, Camera, AlertTriangle } from 'lucide-react';");

fs.writeFileSync(path, code, 'utf8');
console.log('AlertTriangle import added to Home.jsx');

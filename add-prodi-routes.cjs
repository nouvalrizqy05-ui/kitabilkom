const fs = require('fs');

// 1. Update App.jsx to include the optional :prodi param
let appJsx = fs.readFileSync('src/App.jsx', 'utf8');

if (!appJsx.includes('path="/buku-akademik/:prodi"')) {
  appJsx = appJsx.replace(
    /path="\/buku-akademik"[\s\S]*?<\/ProtectedRoute>\s*\}/,
    `path="/buku-akademik"
              element={
                <ProtectedRoute>
                  <PageTransition><BukuAkademik /></PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/buku-akademik/:prodi"
              element={
                <ProtectedRoute>
                  <PageTransition><BukuAkademik /></PageTransition>
                </ProtectedRoute>
              }`
  );
  fs.writeFileSync('src/App.jsx', appJsx, 'utf8');
  console.log('App.jsx updated with /buku-akademik/:prodi route');
} else {
  console.log('App.jsx already has the route');
}

// 2. Update BukuAkademik.jsx
let bukuJsx = fs.readFileSync('src/pages/BukuAkademik.jsx', 'utf8');

// Ensure useParams and useNavigate are imported
if (!bukuJsx.includes('useParams')) {
  bukuJsx = bukuJsx.replace(
    /import { Link, useLocation } from 'react-router-dom'/,
    "import { Link, useLocation, useParams, useNavigate } from 'react-router-dom'"
  );
  // If Link, useLocation weren't there (wait, BukuAkademik might not have them)
}
if (!bukuJsx.includes('useParams') && !bukuJsx.includes('import { useParams')) {
  // Try to find any react-router-dom import
  if (bukuJsx.includes("from 'react-router-dom'")) {
    bukuJsx = bukuJsx.replace(
      /import\s+{([^}]*)}\s+from\s+'react-router-dom'/,
      (match, p1) => `import { ${p1}, useParams, useNavigate } from 'react-router-dom'`
    );
  } else {
    // Just add it at the top
    bukuJsx = "import { useParams, useNavigate } from 'react-router-dom';\n" + bukuJsx;
  }
}

// Replace the selectedProdi state with derived state from URL
bukuJsx = bukuJsx.replace(
  /const \[selectedProdi, setSelectedProdi\] = useState\(null\)/,
  `const { prodi: prodiParam } = useParams()
  const navigate = useNavigate()
  
  // Convert URL param to exact prodi string
  const selectedProdi = useMemo(() => {
    if (prodiParam === 'ti') return 'S1 Teknik Informatika'
    if (prodiParam === 'si') return 'S1 Sistem Informasi'
    return null
  }, [prodiParam])`
);

// Replace setSelectedProdi calls with navigate
bukuJsx = bukuJsx.replace(
  /onClick=\{\(\) => setSelectedProdi\('S1 Teknik Informatika'\)\}/,
  "onClick={() => navigate('/buku-akademik/ti')}"
);
bukuJsx = bukuJsx.replace(
  /onClick=\{\(\) => setSelectedProdi\('S1 Sistem Informasi'\)\}/,
  "onClick={() => navigate('/buku-akademik/si')}"
);
bukuJsx = bukuJsx.replace(
  /onClick=\{\(\) => setSelectedProdi\(null\)\}/,
  "onClick={() => navigate('/buku-akademik')}"
);

// We need to fix the dependency array for filtered useMemo which had selectedProdi
bukuJsx = bukuJsx.replace(
  /\[items, activeTab, selectedProdi, searchQuery\]/g,
  "[items, activeTab, selectedProdi, searchQuery]" // Already handled correctly because selectedProdi is a constant now
);

fs.writeFileSync('src/pages/BukuAkademik.jsx', bukuJsx, 'utf8');
console.log('BukuAkademik.jsx updated to use URL params for Prodi');

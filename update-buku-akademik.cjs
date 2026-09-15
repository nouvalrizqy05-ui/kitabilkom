const fs = require('fs');

let buku = fs.readFileSync('src/pages/BukuAkademik.jsx', 'utf8');

// 1. Import Folder icon and MATAKULIAH_DATA
if (!buku.includes('Folder')) {
  buku = buku.replace(
    /import { Download, FileText, Eye, Search, ChevronDown } from 'lucide-react'/,
    "import { Download, FileText, Eye, Search, ChevronDown, Folder } from 'lucide-react'\nimport { MATAKULIAH_DATA } from '../lib/matakuliahData'"
  );
}

// 2. Add selectedMatkul state and reset effect
if (!buku.includes('selectedMatkul')) {
  buku = buku.replace(
    /const \[searchQuery, setSearchQuery\] = useState\(''\)/,
    `const [searchQuery, setSearchQuery] = useState('')
  const [selectedMatkul, setSelectedMatkul] = useState(null)
  
  useEffect(() => {
    setSelectedMatkul(null)
  }, [selectedProdi, activeTab])`
  );
}

// 3. Add availableCourses useMemo
if (!buku.includes('availableCourses')) {
  buku = buku.replace(
    /const filtered = useMemo/,
    `const availableCourses = useMemo(() => {
    if (!selectedProdi) return [];
    const courses = new Set();
    
    // Add predefined courses
    if (activeTab === 'Semua') {
      Object.values(MATAKULIAH_DATA[selectedProdi] || {}).flat().forEach(c => courses.add(c));
    } else {
      (MATAKULIAH_DATA[selectedProdi]?.[activeTab] || []).forEach(c => courses.add(c));
    }
    
    // Add dynamically from items
    items.forEach(item => {
      if (item.prodi === selectedProdi && (activeTab === 'Semua' || String(item.semester) === String(activeTab))) {
        if (item.mata_kuliah) courses.add(item.mata_kuliah);
      }
    });
    
    return Array.from(courses).sort();
  }, [items, selectedProdi, activeTab])

  const filtered = useMemo`
  );
}

// 4. Update filtered logic to handle selectedMatkul
buku = buku.replace(
  /if \(searchQuery\) \{[\s\S]*?\} else if \(selectedMatkul\) \{/m, // just in case it was already replaced
  "// temp"
);
buku = buku.replace(
  /if \(searchQuery\) \{[\s\S]*?\}[\s\n]*return result/m,
  `if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(item => 
        (item.judul && item.judul.toLowerCase().includes(q)) ||
        (item.mata_kuliah && item.mata_kuliah.toLowerCase().includes(q)) ||
        (item.dosen && item.dosen.toLowerCase().includes(q)) ||
        (item.kategori && item.kategori.toLowerCase().includes(q))
      )
    } else if (selectedMatkul) {
      result = result.filter(item => item.mata_kuliah === selectedMatkul)
    }
    return result`
);

buku = buku.replace(/\[items, activeTab, selectedProdi, searchQuery\]/g, '[items, activeTab, selectedProdi, searchQuery, selectedMatkul]');


// 5. Replace the rendering of books with the new logic
const oldRenderBlock = `{loading ? (
                <p className="empty-state">Memuat materi...</p>
              ) : filtered.length === 0 ? (
                <p className="empty-state">Belum ada materi untuk kategori ini. Admin bisa menambahkannya lewat panel Admin.</p>
              ) : (
                <div className="buku-cards-grid">
                  {filtered.map((item) => (
                    <div className="card-3d buku-card-custom" key={item.id}>
                      <div className="buku-card-content">
                        <div className="card-image-wrap">
                          <span className="card-badge">{item.kategori}</span>
                          <FileText size={48} />
                        </div>
                        <h3 className="card-title">{item.judul}</h3>
                        <p className="card-meta">Mata Kuliah: {item.mata_kuliah || '-'}</p>
                        <p className="card-meta">Dosen: {item.dosen || '-'}</p>
                      </div>
                      <div className="buku-card-actions">
                        <button
                          className="btn-outline-small"
                          onClick={() => handlePreview(item)}
                          disabled={!item.file_url || previewingId === item.id}
                        >
                          <Eye size={16} /> {previewingId === item.id ? 'Memuat...' : 'Preview'}
                        </button>
                        <button
                          className="btn-primary-small"
                          onClick={() => handleDownload(item)}
                          disabled={!item.file_url || downloadingId === item.id}
                        >
                          <Download size={16} /> {downloadingId === item.id ? 'Menyiapkan...' : 'Unduh'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}`;

const newRenderBlock = `{loading ? (
                <p className="empty-state">Memuat materi...</p>
              ) : searchQuery ? (
                filtered.length === 0 ? (
                  <p className="empty-state">Tidak ada materi yang sesuai dengan pencarian Anda.</p>
                ) : (
                  <div className="buku-cards-grid">
                    {filtered.map((item) => (
                      <div className="card-3d buku-card-custom" key={item.id}>
                        <div className="buku-card-content">
                          <div className="card-image-wrap">
                            <span className="card-badge">{item.kategori}</span>
                            <FileText size={48} />
                          </div>
                          <h3 className="card-title">{item.judul}</h3>
                          <p className="card-meta">Mata Kuliah: {item.mata_kuliah || '-'}</p>
                          <p className="card-meta">Dosen: {item.dosen || '-'}</p>
                        </div>
                        <div className="buku-card-actions">
                          <button
                            className="btn-outline-small"
                            onClick={() => handlePreview(item)}
                            disabled={!item.file_url || previewingId === item.id}
                          >
                            <Eye size={16} /> {previewingId === item.id ? 'Memuat...' : 'Preview'}
                          </button>
                          <button
                            className="btn-primary-small"
                            onClick={() => handleDownload(item)}
                            disabled={!item.file_url || downloadingId === item.id}
                          >
                            <Download size={16} /> {downloadingId === item.id ? 'Menyiapkan...' : 'Unduh'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              ) : !selectedMatkul ? (
                <div className="prodi-gate-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
                  {availableCourses.length === 0 ? (
                    <p className="empty-state" style={{ gridColumn: '1 / -1' }}>Belum ada daftar mata kuliah untuk kategori ini.</p>
                  ) : availableCourses.map(mk => {
                    const count = items.filter(i => i.prodi === selectedProdi && (activeTab === 'Semua' || String(i.semester) === String(activeTab)) && i.mata_kuliah === mk).length;
                    return (
                      <button key={mk} className="prodi-gate-card" onClick={() => setSelectedMatkul(mk)} style={{ padding: '1.5rem', minHeight: 'auto', textAlign: 'left', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <div className="prodi-gate-icon" style={{ color: 'var(--gold-400)', marginBottom: '1rem', alignSelf: 'center' }}>
                          <Folder size={48} />
                        </div>
                        <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', fontFamily: 'var(--font-sans)', color: 'var(--text-primary)', textAlign: 'center', width: '100%' }}>{mk}</h4>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center', width: '100%', margin: 0 }}>{count} Dokumen</p>
                      </button>
                    )
                  })}
                </div>
              ) : (
                <>
                  <button 
                    onClick={() => setSelectedMatkul(null)} 
                    style={{ marginBottom: '1.5rem', background: 'transparent', border: 'none', color: 'var(--text-secondary)', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem' }}
                  >
                    &larr; Kembali ke Daftar Mata Kuliah
                  </button>
                  {filtered.length === 0 ? (
                    <p className="empty-state">Belum ada materi untuk mata kuliah ini.</p>
                  ) : (
                    <div className="buku-cards-grid">
                      {filtered.map((item) => (
                        <div className="card-3d buku-card-custom" key={item.id}>
                          <div className="buku-card-content">
                            <div className="card-image-wrap">
                              <span className="card-badge">{item.kategori}</span>
                              <FileText size={48} />
                            </div>
                            <h3 className="card-title">{item.judul}</h3>
                            <p className="card-meta">Mata Kuliah: {item.mata_kuliah || '-'}</p>
                            <p className="card-meta">Dosen: {item.dosen || '-'}</p>
                          </div>
                          <div className="buku-card-actions">
                            <button
                              className="btn-outline-small"
                              onClick={() => handlePreview(item)}
                              disabled={!item.file_url || previewingId === item.id}
                            >
                              <Eye size={16} /> {previewingId === item.id ? 'Memuat...' : 'Preview'}
                            </button>
                            <button
                              className="btn-primary-small"
                              onClick={() => handleDownload(item)}
                              disabled={!item.file_url || downloadingId === item.id}
                            >
                              <Download size={16} /> {downloadingId === item.id ? 'Menyiapkan...' : 'Unduh'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}`;

buku = buku.replace(oldRenderBlock, newRenderBlock);

fs.writeFileSync('src/pages/BukuAkademik.jsx', buku, 'utf8');
console.log('BukuAkademik.jsx updated with matkul gate.');

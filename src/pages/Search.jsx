import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Search as SearchIcon, BookOpen, Info, Users, AlertCircle, ArrowRight } from 'lucide-react';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const initialCategory = searchParams.get('c') || 'Semua';

  const [activeTab, setActiveTab] = useState(initialCategory);
  const [loading, setLoading] = useState(true);
  
  const [results, setResults] = useState({
    buku: [],
    info: [],
    dosen: []
  });

  useEffect(() => {
    setActiveTab(initialCategory);
  }, [initialCategory]);

  useEffect(() => {
    if (!query) return;

    let isMounted = true;
    const fetchResults = async () => {
      setLoading(true);
      const searchTerm = `%${query}%`;

      const [bukuRes, infoRes, dosenRes] = await Promise.all([
        supabase.from('buku_akademik').select('id, judul, mata_kuliah, penulis').or(`judul.ilike.${searchTerm},mata_kuliah.ilike.${searchTerm}`),
        supabase.from('info_akademik').select('id, judul, kategori, tanggal').or(`judul.ilike.${searchTerm},konten.ilike.${searchTerm}`),
        supabase.from('dosen').select('id, nama, bidang_keahlian, email').or(`nama.ilike.${searchTerm},bidang_keahlian.ilike.${searchTerm}`)
      ]);

      if (isMounted) {
        setResults({
          buku: bukuRes.data || [],
          info: infoRes.data || [],
          dosen: dosenRes.data || []
        });
        setLoading(false);
      }
    };

    fetchResults();
    return () => { isMounted = false; };
  }, [query]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const q = formData.get('q');
    if (q.trim()) {
      setSearchParams({ q, c: activeTab });
    }
  };

  const getFilteredResults = () => {
    if (activeTab === 'Buku Akademik') return { buku: results.buku, info: [], dosen: [] };
    if (activeTab === 'Info Akademik') return { buku: [], info: results.info, dosen: [] };
    if (activeTab === 'Dosen Ilkom') return { buku: [], info: [], dosen: results.dosen };
    return results; // 'Semua'
  };

  const filtered = getFilteredResults();
  const totalFound = filtered.buku.length + filtered.info.length + filtered.dosen.length;

  return (
    <>
      {/* Navbar sudah dirender di App.jsx — tidak perlu dirender ulang di sini */}
      <div className="page-header" style={{ paddingTop: '120px' }}>
        <div className="container">
          {/* FIX: Satu h1 saja per halaman */}
          <h1 className="page-title">Hasil Pencarian</h1>
          <p className="page-subtitle">Menampilkan hasil untuk: <strong>"{query}"</strong></p>
          
          <form className="search-page-form" onSubmit={handleSearchSubmit} role="search">
            <label htmlFor="search-query" className="sr-only">Kata kunci pencarian</label>
            <input
              id="search-query"
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Ketik kata kunci pencarian..."
              className="search-page-input"
              aria-label="Kata kunci pencarian"
            />
            <button type="submit" className="search-page-btn" aria-label="Cari">
              <SearchIcon size={20} /> Cari
            </button>
          </form>
        </div>
      </div>

      <div className="container search-content-container">
        {/* TAB FILTER */}
        <div className="search-tabs" role="tablist" aria-label="Filter kategori pencarian">
          {['Semua', 'Buku Akademik', 'Info Akademik', 'Dosen Ilkom'].map(tab => (
            <button 
              key={tab} 
              role="tab"
              aria-selected={activeTab === tab}
              className={`search-tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => {
                setActiveTab(tab);
                setSearchParams({ q: query, c: tab });
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading-state" aria-live="polite" aria-busy="true">
            <div className="spinner"></div>
            <p>Mencari di dalam database...</p>
          </div>
        ) : totalFound === 0 ? (
          <div className="empty-state-search" role="status">
            <AlertCircle size={48} color="var(--gray-400)" aria-hidden="true" />
            <h3>Hasil Tidak Ditemukan</h3>
            <p>Maaf, kami tidak menemukan hasil yang cocok dengan kata kunci "{query}" di kategori {activeTab}.</p>
          </div>
        ) : (
          <div className="search-results-grid">
            
            {/* BUKU AKADEMIK */}
            {filtered.buku.length > 0 && (
              <div className="search-category-section">
                <h2 className="search-category-title"><BookOpen size={20} aria-hidden="true" /> Buku Akademik</h2>
                <div className="search-cards-list">
                  {filtered.buku.map(buku => (
                    <div key={buku.id} className="search-result-card">
                      <div className="search-card-content">
                        <h3>{buku.judul}</h3>
                        <p>{buku.mata_kuliah} • {buku.penulis}</p>
                      </div>
                      <Link to="/buku-akademik" className="search-card-link" aria-label={`Lihat detail ${buku.judul}`}><ArrowRight size={18} /></Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* INFO AKADEMIK */}
            {filtered.info.length > 0 && (
              <div className="search-category-section">
                <h2 className="search-category-title"><Info size={20} aria-hidden="true" /> Informasi & Artikel</h2>
                <div className="search-cards-list">
                  {filtered.info.map(info => (
                    <div key={info.id} className="search-result-card">
                      <div className="search-card-content">
                        <span className="search-tag">{info.kategori}</span>
                        <h3>{info.judul}</h3>
                        <p>{new Date(info.tanggal).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year:'numeric'})}</p>
                      </div>
                      <Link to={info.kategori === 'Artikel Publikasi' ? '/publikasi' : '/info-akademik'} className="search-card-link" aria-label={`Baca selengkapnya ${info.judul}`}><ArrowRight size={18} /></Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* DOSEN ILKOM */}
            {filtered.dosen.length > 0 && (
              <div className="search-category-section">
                <h2 className="search-category-title"><Users size={20} aria-hidden="true" /> Dosen Ilkom</h2>
                <div className="search-cards-list">
                  {filtered.dosen.map(dosen => (
                    <div key={dosen.id} className="search-result-card">
                      <div className="search-card-content">
                        <h3>{dosen.nama}</h3>
                        <p>{dosen.bidang_keahlian || 'Dosen Ilmu Komputer'}</p>
                      </div>
                      <Link to="/dosen" className="search-card-link" aria-label={`Lihat profil ${dosen.nama}`}><ArrowRight size={18} /></Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}
      </div>
      {/* Footer sudah dirender di App.jsx — tidak perlu dirender ulang di sini */}
    </>
  );
}

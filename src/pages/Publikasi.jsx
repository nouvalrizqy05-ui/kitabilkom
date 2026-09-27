import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import Modal from '../components/Modal'
import { ExternalLink, BookOpen, Search, Filter, X } from 'lucide-react'
import BackButton from '../components/BackButton'

export default function Publikasi() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedYear, setSelectedYear] = useState('Semua')
  const [selectedArticle, setSelectedArticle] = useState(null)

  useEffect(() => {
    let isMounted = true
    async function loadPublikasi() {
      const { data, error } = await supabase
        .from('artikel_publikasi')
        .select('id, judul, penulis, nama_jurnal, tahun, abstrak, link_url')
        .order('tahun', { ascending: false })
      if (isMounted) {
        if (error) console.error(error)
        setItems(data ?? [])
        setLoading(false)
      }
    }
    loadPublikasi()
    return () => {
      isMounted = false
    }
  }, [])

  const years = ['Semua', ...new Set(items.map(i => i.tahun).filter(Boolean).sort((a,b)=>b-a))]
  
  const filteredItems = items.filter(item => {
    const matchSearch = (item.judul || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                        (item.penulis || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchYear = selectedYear === 'Semua' || String(item.tahun) === String(selectedYear);
    return matchSearch && matchYear;
  });

  return (
    <>
      <section className="page-header-buku">
        <BackButton to="/" />
        <div className="banner-buku-pattern top">
          <div className="banner-buku-logos-top">
            <img src="/assets/Group 100881 (2).png" alt="Logos" />
          </div>
        </div>
        <div className="banner-buku-body">
          <div className="banner-buku-left-ornament">
             <div className="banner-buku-kitab-ilkom">
                <span>KITAB</span>
                <span>ILKOM</span>
             </div>
             <div className="banner-buku-vline"></div>
          </div>
          <div className="banner-buku-center-text">
            <span className="banner-buku-subtitle">DATABASE</span>
            <h1 className="banner-buku-title">PUBLIKASI ILMIAH</h1>
          </div>
          <div className="banner-buku-speech-bubble">IPK 4 menanti!<br/>Semangat :)</div>
          <img src="/assets/lebah akasin.png" alt="Lebah Akasin" className="banner-buku-mascot-right" />
        </div>
        <div className="banner-buku-pattern bottom"></div>
      </section>

      <section className="page-content">
        <div className="container">
          
          <div className="info-tools-bar">
            <div className="info-search-wrapper">
              <Search className="info-search-icon" size={18} />
              <input
                type="text"
                placeholder="Cari judul, penulis..."
                className="info-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="info-filter-group" style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '5px' }}>
              {years.map(yr => (
                <button
                  key={yr}
                  className={`info-filter-btn ${selectedYear === yr ? 'active' : ''}`}
                  onClick={() => setSelectedYear(yr)}
                  style={{ whiteSpace: 'nowrap' }}
                >
                  {yr === 'Semua' ? 'Semua Tahun' : yr}
                </button>
              ))}
            </div>
          </div>

        {loading ? (
          <p className="empty-state">Memuat artikel...</p>
        ) : filteredItems.length === 0 ? (
          <p className="empty-state">Belum ada publikasi artikel yang sesuai pencarian.</p>
        ) : (
          <div className="cards-grid">
            {filteredItems.map((item) => (
              <div className="card-3d" key={item.id} style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <span className="card-badge" style={{ position: 'static', background: 'rgba(212, 168, 67, 0.15)', color: 'var(--gold-600)', margin: 0, fontWeight: 700, border: '1px solid rgba(212, 168, 67, 0.3)', boxShadow: 'none' }}>
                    <BookOpen size={12} style={{ display: 'inline', marginRight: '4px' }} />
                    Jurnal
                  </span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{item.tahun}</span>
                </div>
                
                <h3 className="card-title" style={{ fontSize: '1.2rem', marginBottom: '0.5rem', lineHeight: 1.4, color: 'var(--text-primary)' }}>
                  {item.judul}
                </h3>
                
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.25rem', fontWeight: 500 }}>
                  Penulis: <span style={{ color: 'var(--text-primary)' }}>{item.penulis}</span>
                </p>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem', fontStyle: 'italic' }}>
                  Dipublikasikan di: {item.nama_jurnal}
                </p>
                
                <div style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', flexGrow: 1, border: '1px solid var(--border-color)' }}>
                  <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.5rem', letterSpacing: '0.5px' }}>Abstrak</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {item.abstrak}
                  </p>
                </div>
                
                <button 
                  onClick={() => setSelectedArticle(item)}
                  className="btn-primary" 
                  style={{ textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', width: '100%', cursor: 'pointer', border: 'none' }}
                >
                  Lihat Detail Artikel
                </button>
              </div>
            ))}
          </div>
        )}
        </div>
      </section>

      {/* Modal Detail Artikel */}
      {selectedArticle && (
        <Modal title="Detail Publikasi" onClose={() => setSelectedArticle(null)}>
          <div style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <span style={{ background: 'rgba(212, 168, 67, 0.15)', color: 'var(--gold-600)', padding: '0.3rem 0.8rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 700 }}>
                JURNAL AKADEMIK
              </span>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600 }}>
                • {selectedArticle.tahun}
              </span>
            </div>
            
            <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1rem', lineHeight: 1.4 }}>
              {selectedArticle.judul}
            </h2>
            
            <div style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid var(--border-color)' }}>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
                <strong style={{ color: 'var(--text-primary)' }}>Penulis:</strong> {selectedArticle.penulis}
              </p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                <strong style={{ color: 'var(--text-primary)' }}>Dipublikasikan di:</strong> {selectedArticle.nama_jurnal}
              </p>
            </div>
            
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '0.8rem' }}>Abstrak</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.95rem', whiteSpace: 'pre-wrap' }}>
                {selectedArticle.abstrak}
              </p>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
              <button onClick={() => setSelectedArticle(null)} className="btn-outline" style={{ cursor: 'pointer' }}>
                Tutup
              </button>
              {selectedArticle.link_url && (
                <a href={selectedArticle.link_url} target="_blank" rel="noreferrer" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                  Kunjungi Tautan <ExternalLink size={18} />
                </a>
              )}
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}

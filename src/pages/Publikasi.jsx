import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { BookOpen, Search, Tag, ArrowRight } from 'lucide-react'
import BackButton from '../components/BackButton'

const KATEGORI_OPTIONS = [
  'Semua',
  'Ilmu Komputer',
  'Sistem Informasi',
  'Teknologi Informasi',
  'Kecerdasan Buatan',
  'Jaringan & Keamanan',
  'Rekayasa Perangkat Lunak',
  'Lainnya',
]

const ITEMS_PER_PAGE = 9

export default function Publikasi() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedKategori, setSelectedKategori] = useState('Semua')
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    let isMounted = true
    async function loadPublikasi() {
      const { data, error } = await supabase
        .from('artikel_publikasi')
        .select('id, judul, penulis, nama_jurnal, tahun, abstrak, link_url, jenis_publikasi, kategori_publikasi')
        .order('tahun', { ascending: false })
      if (isMounted) {
        if (error) console.error(error)
        setItems(data ?? [])
        setLoading(false)
      }
    }
    loadPublikasi()
    return () => { isMounted = false }
  }, [])

  const filteredItems = items.filter(item => {
    const matchSearch =
      (item.judul || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.penulis || '').toLowerCase().includes(searchQuery.toLowerCase())
    const matchKategori =
      selectedKategori === 'Semua' || item.kategori_publikasi === selectedKategori
    return matchSearch && matchKategori
  })

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE)
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const handleFilterChange = (kat) => {
    setSelectedKategori(kat)
    setCurrentPage(1)
  }

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1)
  }

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
          <div className="banner-buku-speech-bubble">IPK 4 menanti!<br />Semangat :)</div>
          <img src="/assets/lebah akasin.png" alt="Lebah Akasin" className="banner-buku-mascot-right" />
        </div>
        <div className="banner-buku-pattern bottom"></div>
      </section>

      <section className="page-content">
        <div className="container">

          {/* Search & Filter Bar */}
          <div className="info-tools-bar">
            <div className="info-search-wrapper">
              <Search className="info-search-icon" size={18} />
              <input
                type="text"
                placeholder="Cari judul, penulis..."
                className="info-search-input"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
            <div className="info-filter-group" style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '5px' }}>
              {KATEGORI_OPTIONS.map(kat => (
                <button
                  key={kat}
                  className={`info-filter-btn ${selectedKategori === kat ? 'active' : ''}`}
                  onClick={() => handleFilterChange(kat)}
                  style={{ whiteSpace: 'nowrap' }}
                >
                  {kat}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <p className="empty-state">Memuat artikel...</p>
          ) : filteredItems.length === 0 ? (
            <p className="empty-state">Belum ada publikasi yang sesuai pencarian.</p>
          ) : (
            <>
              <div className="cards-grid">
                {paginatedItems.map((item) => (
                  <div className="card-3d" key={item.id} style={{ display: 'flex', flexDirection: 'column' }}>
                    {/* Badges */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1rem' }}>
                      {item.jenis_publikasi && (
                        <span style={{
                          position: 'static', background: 'rgba(212,168,67,0.18)', color: 'var(--gold-700)',
                          padding: '0.25rem 0.65rem', borderRadius: '4px', fontSize: '0.73rem',
                          fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px',
                          border: '1px solid rgba(212,168,67,0.35)', boxShadow: 'none'
                        }}>
                          <BookOpen size={11} /> {item.jenis_publikasi}
                        </span>
                      )}
                      {item.kategori_publikasi && (
                        <span style={{
                          position: 'static', background: 'rgba(168,123,34,0.1)', color: 'var(--gold-600)',
                          padding: '0.25rem 0.65rem', borderRadius: '4px', fontSize: '0.73rem',
                          fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px',
                          border: '1px solid rgba(168,123,34,0.25)', boxShadow: 'none'
                        }}>
                          <Tag size={11} /> {item.kategori_publikasi}
                        </span>
                      )}
                      <span style={{ marginLeft: 'auto', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                        {item.tahun}
                      </span>
                    </div>

                    {/* Judul */}
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', lineHeight: 1.4, color: 'var(--text-primary)' }}>
                      {item.judul}
                    </h3>

                    {/* Penulis & Jurnal */}
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '0.25rem', fontWeight: 500 }}>
                      <span style={{ color: 'var(--gold-600)' }}>Penulis:</span> {item.penulis}
                    </p>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1rem', fontStyle: 'italic' }}>
                      {item.nama_jurnal}
                    </p>

                    {/* Abstrak preview */}
                    <div style={{
                      background: 'var(--bg-surface)', padding: '0.85rem', borderRadius: '8px',
                      marginBottom: '1.5rem', flexGrow: 1, border: '1px solid var(--border-color)'
                    }}>
                      <p style={{
                        fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6,
                        display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                        margin: 0
                      }}>
                        {item.abstrak ? item.abstrak.replace(/<[^>]*>/g, '') : 'Abstrak tidak tersedia.'}
                      </p>
                    </div>

                    {/* Link ke halaman detail */}
                    <Link
                      to={`/publikasi/${item.id}`}
                      className="btn-view-detail"
                      style={{
                        textAlign: 'center', display: 'flex', justifyContent: 'center',
                        alignItems: 'center', gap: '8px', textDecoration: 'none', width: '100%',
                        marginTop: 'auto'
                      }}
                    >
                      Lihat Detail <ArrowRight size={16} />
                    </Link>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination-container">
                  <button
                    className="pagination-btn"
                    onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    &laquo;
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    className="pagination-btn"
                    onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    &raquo;
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

    </>
  )
}

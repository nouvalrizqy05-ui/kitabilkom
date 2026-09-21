import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import BackButton from '../components/BackButton'
import { Search, X, ExternalLink, AlertCircle, Trophy, GraduationCap, Rocket } from 'lucide-react'
import Spinner from '../components/Spinner'
import { useParams, useNavigate } from 'react-router-dom'

const getDriveImageUrl = (url) => {
  if (!url) return '';
  let id = null;
  const matchD = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  const matchId = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (matchD) id = matchD[1];
  else if (matchId) id = matchId[1];
  
  if (id) {
    return `https://drive.google.com/thumbnail?id=${id}&sz=w1000`;
  }
  return url;
};

export default function InfoAkademik() {
  const { kategori } = useParams()
  const navigate = useNavigate()
  
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [selected, setSelected] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('Semua') // Semua, Buka, Tutup
  const [subKategoriFilter, setSubKategoriFilter] = useState('Semua') // Untuk lomba IT

  // Sub kategori lomba IT
  const LOMBA_IT_CATEGORIES = ['Semua', 'Web Dev', 'Game Dev', 'UI/UX Design', 'Businessplan', 'Lainnya']

  useEffect(() => {
    // Only load items if we are in a specific kategori route
    if (!kategori) return;

    let isMounted = true
    async function loadInfo() {
      setLoading(true)
      // Capitalize first letter of kategori to match DB (e.g. 'lomba' -> 'Lomba')
      const dbKategori = kategori.charAt(0).toUpperCase() + kategori.slice(1)
      
      const { data, error } = await supabase
        .from('info_akademik')
        .select('*')
        .eq('kategori', dbKategori)
        .order('tanggal', { ascending: false })
        
      if (isMounted) {
        if (error) {
          console.error(error)
          setErrorMsg(error.message)
        } else {
          setItems(data ?? [])
        }
        setLoading(false)
      }
    }
    loadInfo()
    return () => {
      isMounted = false
    }
  }, [kategori])

  // Filter Logic
  const filteredItems = items.filter(item => {
    const matchesSearch = item.judul?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.konten?.toLowerCase().includes(searchQuery.toLowerCase())
    
    let matchesSubKategori = true
    if (kategori === 'lomba' && subKategoriFilter !== 'Semua') {
      if (subKategoriFilter === 'Lainnya') {
        const predefined = LOMBA_IT_CATEGORIES.filter(c => c !== 'Semua' && c !== 'Lainnya')
        matchesSubKategori = !predefined.includes(item.sub_kategori)
      } else {
        matchesSubKategori = item.sub_kategori === subKategoriFilter
      }
    }

    return matchesSearch && matchesSubKategori
  })

  // Excerpt Helper for HTML content
  const createExcerpt = (htmlContent, maxLen = 90) => {
    if (!htmlContent) return ''
    const tmp = document.createElement("DIV")
    tmp.innerHTML = htmlContent
    const raw = (tmp.textContent || tmp.innerText || "")
      .replace(/[\u00a0\u1680\u180e\u2000-\u200b\u202f\u205f\u3000\ufeff]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
    if (raw.length <= maxLen) return raw
    return raw.substring(0, maxLen).trim() + '...'
  }

  // Format Date Helper
  const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    const date = new Date(dateStr)
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  // RENDER GATES
  if (!kategori) {
    return (
      <>
        <section className="page-header-buku">
          <BackButton to="/" />
          <div className="banner-buku-pattern top"></div>
          <div className="banner-buku-body">
            <div className="banner-buku-left-ornament">
               <div className="banner-buku-kitab-ilkom">
                  <span>KITAB</span>
                  <span>ILKOM</span>
               </div>
               <div className="banner-buku-vline"></div>
            </div>
            <div className="banner-buku-center-text">
              <span className="banner-buku-subtitle">PENGUMUMAN</span>
              <h1 className="banner-buku-title">INFO AKADEMIK</h1>
            </div>
            <div className="banner-buku-speech-bubble">Ayo ikuti lomba &amp;<br/>acara seru!</div>
            <img src="/assets/lebah akasin.png" alt="Lebah Akasin" className="banner-buku-mascot-right" />
          </div>
          <div className="banner-buku-pattern bottom"></div>
        </section>

        <section className="page-content" style={{ padding: '4rem 20px', minHeight: '60vh' }}>
          <div className="container" style={{ maxWidth: '900px' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '3rem', color: 'var(--text-dark)' }}>Pilih Kategori Info</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
              
              <div 
                className="buku-card-custom" 
                onClick={() => navigate('/info-akademik/lomba')}
                style={{ cursor: 'pointer', textAlign: 'center', padding: '3rem 2rem' }}
              >
                <div style={{ width: '80px', height: '80px', background: 'rgba(255,193,7,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
                  <Trophy size={40} color="var(--gold-500)" />
                </div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-dark)' }}>Info Lomba</h3>
                <p style={{ color: 'var(--text-muted)' }}>Temukan info kompetisi IT dan event seru lainnya.</p>
              </div>

              <div 
                className="buku-card-custom" 
                onClick={() => navigate('/info-akademik/beasiswa')}
                style={{ cursor: 'pointer', textAlign: 'center', padding: '3rem 2rem' }}
              >
                <div style={{ width: '80px', height: '80px', background: 'rgba(255,193,7,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
                  <GraduationCap size={40} color="var(--gold-500)" />
                </div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-dark)' }}>Info Beasiswa</h3>
                <p style={{ color: 'var(--text-muted)' }}>Beragam informasi beasiswa untuk membantu studimu.</p>
              </div>

              <div 
                className="buku-card-custom" 
                onClick={() => navigate('/info-akademik/bootcamp')}
                style={{ cursor: 'pointer', textAlign: 'center', padding: '3rem 2rem' }}
              >
                <div style={{ width: '80px', height: '80px', background: 'rgba(255,193,7,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
                  <Rocket size={40} color="var(--gold-500)" />
                </div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-dark)' }}>Info Bootcamp</h3>
                <p style={{ color: 'var(--text-muted)' }}>Tingkatkan skill IT-mu dengan bootcamp pilihan.</p>
              </div>

            </div>
          </div>
        </section>
      </>
    )
  }

  // RENDER LIST BASED ON KATEGORI
  const kategoriTitle = kategori.charAt(0).toUpperCase() + kategori.slice(1)

  return (
    <>
      <section className="page-header-buku">
        <BackButton to="/info-akademik" />
        <div className="banner-buku-pattern top"></div>
        <div className="banner-buku-body">
          <div className="banner-buku-left-ornament">
             <div className="banner-buku-kitab-ilkom">
                <span>INFO</span>
                <span>AKADEMIK</span>
             </div>
             <div className="banner-buku-vline"></div>
          </div>
          <div className="banner-buku-center-text">
            <span className="banner-buku-subtitle">DAFTAR INFORMASI</span>
            <h1 className="banner-buku-title">{kategoriTitle.toUpperCase()}</h1>
          </div>
          <div className="banner-buku-speech-bubble">Ayo ikuti lomba &amp;<br/>acara seru!</div>
          <img src="/assets/lebah akasin.png" alt="Lebah Akasin" className="banner-buku-mascot-right" />
        </div>
        <div className="banner-buku-pattern bottom"></div>
      </section>

      <section className="page-content" style={{ padding: '2rem 20px', minHeight: '60vh' }}>
        <div className="container">

          {/* SEARCH & FILTER BAR */}
          <div className="info-tools-bar" style={{ flexWrap: 'wrap', gap: '1rem' }}>
            <div className="info-search-wrapper" style={{ flex: '1 1 300px' }}>
              <input 
                type="text" 
                placeholder={`Cari nama ${kategoriTitle.toLowerCase()}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="info-search-input"
              />
              <Search size={18} className="info-search-icon" />
            </div>

            {/* Sub Kategori Filter for Lomba */}
            {kategori === 'lomba' && (
              <div className="info-filter-group" style={{ overflowX: 'auto', flexWrap: 'nowrap' }}>
                <span style={{ padding: '0.5rem', fontWeight: 600, color: 'var(--text-dark)' }}>Bidang:</span>
                {LOMBA_IT_CATEGORIES.map(sub => (
                  <button 
                    key={sub}
                    className={`info-filter-btn ${subKategoriFilter === sub ? 'active' : ''}`}
                    onClick={() => setSubKategoriFilter(sub)}
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            )}

            {/* Status filter removed */}
          </div>

          {/* CONTENT GRID */}
          {errorMsg && (
            <div className="alert-error" style={{ margin: '1rem 0' }}>
              <AlertCircle size={20} />
              <span>{errorMsg}</span>
            </div>
          )}

          {loading ? (
            <Spinner text={`Memuat info ${kategoriTitle.toLowerCase()}...`} />
          ) : filteredItems.length === 0 ? (
            <p className="empty-state">Tidak ada informasi yang sesuai dengan filter/pencarian Anda.</p>
          ) : (
            <div className="info-grid">
              {filteredItems.map((item) => {
                return (
                <div className="info-card" key={item.id}>
                  {/* Poster Area */}
                  <div className="info-card-poster">
                    {item.poster_url ? (
                      <img src={getDriveImageUrl(item.poster_url)} alt={item.judul} />
                    ) : (
                      <div className="info-card-no-poster">Tanpa Poster</div>
                    )}
                  </div>
                  
                  {/* Body Area */}
                  <div className="info-card-body">
                    <div className="info-card-header">
                      <h3 className="info-card-title">{item.judul}</h3>
                    </div>

                    <div className="info-card-deadline">
                      Batas Pendaftaran : {formatDate(item.batas_pendaftaran || item.tanggal)}
                    </div>
                    
                    {kategori === 'lomba' && item.sub_kategori && (
                      <div style={{ display: 'inline-block', background: 'rgba(255,193,7,0.2)', color: 'var(--gold-600)', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                        {item.sub_kategori}
                      </div>
                    )}

                    <div className="info-card-excerpt">
                      {createExcerpt(item.konten)}
                    </div>

                    <div className="info-card-footer">
                      <button className="info-btn-outline" onClick={() => setSelected(item)}>
                        Lihat Detail &rarr;
                      </button>
                    </div>
                  </div>
                </div>
              )})}
            </div>
          )}
        </div>

        {/* CUSTOM POPUP MODAL FOR INFO */}
        {selected && (
          <div className="info-modal-overlay" onClick={() => setSelected(null)}>
            <div className="info-modal-container" onClick={e => e.stopPropagation()}>
              
              <button className="info-modal-close" onClick={() => setSelected(null)}>
                <X size={24} />
              </button>

              <div className="info-modal-layout">
                {/* Left Column: Poster */}
                <div className="info-modal-left">
                  {selected.poster_url ? (
                    <img src={getDriveImageUrl(selected.poster_url)} alt={selected.judul} className="info-modal-poster" />
                  ) : (
                    <div className="info-modal-no-poster">Tidak ada poster</div>
                  )}
                </div>

                {/* Right Column: Content */}
                <div className="info-modal-right">
                  <div className="info-modal-content-scroll">
                    <h2 className="info-modal-title">{selected.judul}</h2>
                    <div className="info-modal-deadline">
                      Batas Pendaftaran : {formatDate(selected.batas_pendaftaran || selected.tanggal)}
                    </div>
                    {kategori === 'lomba' && selected.sub_kategori && (
                      <div style={{ marginBottom: '1rem', display: 'inline-block', background: 'rgba(255,193,7,0.2)', color: 'var(--gold-600)', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600 }}>
                        Bidang: {selected.sub_kategori}
                      </div>
                    )}
                    
                    <div className="info-modal-html-content rich-text-content" dangerouslySetInnerHTML={{ __html: selected.konten }}></div>
                  </div>

                  <div className="info-modal-actions">
                    {selected.link_pendaftaran ? (
                      <a href={selected.link_pendaftaran} target="_blank" rel="noopener noreferrer" className="info-btn-solid">
                        Daftar / Lihat Guidebook &rarr;
                      </a>
                    ) : (
                      <button className="info-btn-solid disabled" disabled>
                        Link Tidak Tersedia
                      </button>
                    )}
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        )}
      </section>
    </>
  )
}

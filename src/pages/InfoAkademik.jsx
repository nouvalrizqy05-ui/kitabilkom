import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import BackButton from '../components/BackButton'
import { Search, X, ExternalLink, AlertCircle } from 'lucide-react'
import Spinner from '../components/Spinner'

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
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')
  const [selected, setSelected] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('Semua') // Semua, Buka, Tutup

  useEffect(() => {
    let isMounted = true
    async function loadInfo() {
      // Fetch all info including new columns
      const { data, error } = await supabase
        .from('info_akademik')
        .select('*')
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
  }, [])

  // Filter Logic
  const filteredItems = items.filter(item => {
    const matchesSearch = item.judul?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.konten?.toLowerCase().includes(searchQuery.toLowerCase())
    
    let matchesStatus = true
    if (statusFilter !== 'Semua') {
      matchesStatus = (item.status || 'Buka') === statusFilter
    }

    return matchesSearch && matchesStatus
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
            <span className="banner-buku-subtitle">PENGUMUMAN</span>
            <h1 className="banner-buku-title">INFO AKADEMIK</h1>
          </div>
          <div className="banner-buku-speech-bubble">Ayo ikuti lomba &amp;<br/>acara seru!</div>
          <img src="/assets/lebah akasin.png" alt="Lebah Akasin" className="banner-buku-mascot-right" />
        </div>
        <div className="banner-buku-pattern bottom"></div>
      </section>

      <section className="page-content" style={{ padding: '2rem 20px', minHeight: '60vh' }}>
        <div className="container">

          {/* SEARCH & FILTER BAR */}
          <div className="info-tools-bar">
            <div className="info-search-wrapper">
              <input 
                type="text" 
                placeholder="Cari nama lomba..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="info-search-input"
              />
              <Search size={18} className="info-search-icon" />
            </div>

            <div className="info-filter-group">
              {['Semua', 'Buka', 'Tutup'].map(status => (
                <button 
                  key={status}
                  className={`info-filter-btn ${statusFilter === status ? 'active' : ''}`}
                  onClick={() => setStatusFilter(status)}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* CONTENT GRID */}
          {errorMsg && (
            <div className="alert-error" style={{ margin: '1rem 0' }}>
              <AlertCircle size={20} />
              <span>{errorMsg}</span>
            </div>
          )}

          {loading ? (
            <Spinner text="Memuat info akademik..." />
          ) : filteredItems.length === 0 ? (
            <p className="empty-state">Tidak ada informasi yang sesuai dengan filter/pencarian Anda.</p>
          ) : (
            <div className="info-grid">
              {filteredItems.map((item) => {
                const itemStatus = item.status || 'Buka';
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
                      <span className={`info-status-badge ${itemStatus.toLowerCase()}`}>
                        {itemStatus}
                      </span>
                    </div>

                    <div className="info-card-deadline">
                      Batas Pendaftaran : {formatDate(item.batas_pendaftaran || item.tanggal)}
                    </div>

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

import { useEffect, useMemo, useState } from 'react'
import { Search, GraduationCap, Mail, Briefcase, Fingerprint } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import BackButton from '../components/BackButton'

export default function DosenIlkom() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [activeTab, setActiveTab] = useState('semua')

  useEffect(() => {
    let isMounted = true
    async function loadDosen() {
      const { data, error } = await supabase
        .from('dosen')
        .select('id, nama, bidang, nip, foto_url, email, jabatan, prodi')
        .order('nama', { ascending: true })
      if (isMounted) {
        if (error) console.error(error)
        setItems(data ?? [])
        setLoading(false)
      }
    }
    loadDosen()
    return () => {
      isMounted = false
    }
  }, [])

  const filtered = useMemo(() => {
    let result = items
    // Filter by prodi tab
    if (activeTab === 'ti') {
      result = result.filter(d => d.prodi?.toUpperCase() === 'TI')
    } else if (activeTab === 'si') {
      result = result.filter(d => d.prodi?.toUpperCase() === 'SI')
    }
    // Filter by search query
    const q = query.trim().toLowerCase()
    if (q) {
      result = result.filter(
        (d) => d.nama?.toLowerCase().includes(q) || d.bidang?.toLowerCase().includes(q) || d.email?.toLowerCase().includes(q)
      )
    }
    return result
  }, [items, query, activeTab])

  // Count per prodi
  const countTI = items.filter(d => d.prodi?.toUpperCase() === 'TI').length
  const countSI = items.filter(d => d.prodi?.toUpperCase() === 'SI').length

  return (
    <>
      <section className="page-header">
        <BackButton />
        <div className="container">
          <h1 className="page-title">Direktori Dosen Ilkom</h1>
          <p className="page-subtitle">Lengkap dengan kontak dan info lainnya</p>
        </div>
      </section>

      <section className="page-content">
        <div className="container">

          {/* Tabs */}
          <div className="dosen-tabs" role="tablist">
            <button
              className={`dosen-tab ${activeTab === 'semua' ? 'active' : ''}`}
              onClick={() => setActiveTab('semua')}
              role="tab"
              aria-selected={activeTab === 'semua'}
            >
              Semua <span className="tab-count">{items.length}</span>
            </button>
            <button
              className={`dosen-tab ${activeTab === 'ti' ? 'active' : ''}`}
              onClick={() => setActiveTab('ti')}
              role="tab"
              aria-selected={activeTab === 'ti'}
            >
              Teknik Informatika <span className="tab-count">{countTI}</span>
            </button>
            <button
              className={`dosen-tab ${activeTab === 'si' ? 'active' : ''}`}
              onClick={() => setActiveTab('si')}
              role="tab"
              aria-selected={activeTab === 'si'}
            >
              Sistem Informasi <span className="tab-count">{countSI}</span>
            </button>
          </div>

          {/* Search */}
          <div className="search-wrap" style={{ marginBottom: '2rem' }}>
            <Search size={18} aria-hidden="true" />
            <label htmlFor="dosen-search-input" className="sr-only">Cari nama dosen atau bidang keahlian</label>
            <input
              id="dosen-search-input"
              type="text"
              className="search-input"
              placeholder="Cari nama dosen, email, atau bidang keahlian..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Cari nama dosen atau bidang keahlian"
            />
          </div>

          {loading ? (
            <p className="empty-state">Memuat data dosen...</p>
          ) : filtered.length === 0 ? (
            <p className="empty-state">Tidak ada dosen yang cocok dengan pencarian.</p>
          ) : (
            <div className="dosen-card-grid">
              {filtered.map((dosen) => (
                <div className="dosen-card-3d" key={dosen.id}>
                  {/* Logo UNNES kecil */}
                  <img
                    src="/assets/unnes-logo.webp"
                    alt=""
                    className="dosen-card-logo"
                    aria-hidden="true"
                  />

                  {/* Badge prodi */}
                  {dosen.prodi && (
                    <span className="dosen-card-prodi">{dosen.prodi}</span>
                  )}

                  {/* Teks UNNES dekoratif vertical */}
                  <span className="dosen-card-watermark" aria-hidden="true">UNNES</span>

                  {/* Foto dosen */}
                  <div className="dosen-card-photo">
                    {dosen.foto_url ? (
                      <img src={dosen.foto_url} alt={dosen.nama} loading="lazy" />
                    ) : (
                      <img src="/assets/dosen-placeholder.png" alt={dosen.nama} loading="lazy" />
                    )}
                  </div>

                  {/* Info overlay bawah */}
                  <div className="dosen-card-info">
                    <h3 className="dosen-card-name">{dosen.nama}</h3>

                    {dosen.email && (
                      <div className="dosen-card-detail">
                        <Mail size={14} />
                        <span>{dosen.email}</span>
                      </div>
                    )}

                    {dosen.jabatan && (
                      <div className="dosen-card-detail">
                        <Briefcase size={14} />
                        <span>{dosen.jabatan}</span>
                      </div>
                    )}

                    {dosen.bidang && (
                      <div className="dosen-card-detail">
                        <GraduationCap size={14} />
                        <span>{dosen.bidang}</span>
                      </div>
                    )}

                    {dosen.nip && (
                      <div className="dosen-card-detail">
                        <Fingerprint size={14} />
                        <span>{dosen.nip}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}

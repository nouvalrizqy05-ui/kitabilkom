import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react'
import { Download, FileText, Eye, Search, ChevronDown, Folder, AlertCircle } from 'lucide-react'
import { MATAKULIAH_DATA } from '../lib/matakuliahData'
import { supabase } from '../lib/supabaseClient'
import BackButton from '../components/BackButton'
import DocumentPreviewModal from '../components/DocumentPreviewModal'
import Spinner from '../components/Spinner'

const TABS = ['Semua', 1, 2, 3, 4, 5, 6, 7, 8]

export default function BukuAkademik() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('Semua')
  const [downloadingId, setDownloadingId] = useState(null)
  const [previewingId, setPreviewingId] = useState(null)
  const [previewData, setPreviewData] = useState(null)
  const { prodi: prodiParam, matkul: matkulParam } = useParams()
  const navigate = useNavigate()

  const selectedProdi = useMemo(() => {
    if (prodiParam === 'ti') return 'S1 Teknik Informatika'
    if (prodiParam === 'si') return 'S1 Sistem Informasi'
    return null
  }, [prodiParam])

  const [errorMsg, setErrorMsg] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const selectedMatkul = matkulParam ? decodeURIComponent(matkulParam) : null

  useEffect(() => {
    let isMounted = true
    async function loadBuku() {
      const { data, error } = await supabase
        .from('buku_akademik')
        .select('id, judul, mata_kuliah, kategori, semester, file_url, prodi')
        .order('created_at', { ascending: false })
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
    loadBuku()
    return () => {
      isMounted = false
    }
  }, [])

  const availableCourses = useMemo(() => {
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

  const filtered = useMemo(() => {
    let result = items
    if (selectedProdi) {
      result = result.filter(item => item.prodi === selectedProdi)
    }
    if (activeTab !== 'Semua') {
      result = result.filter((item) => String(item.semester) === String(activeTab))
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(item =>
        (item.judul && item.judul.toLowerCase().includes(q)) ||
        (item.mata_kuliah && item.mata_kuliah.toLowerCase().includes(q)) ||
        (item.kategori && item.kategori.toLowerCase().includes(q))
      )
    } else if (selectedMatkul) {
      result = result.filter(item => item.mata_kuliah === selectedMatkul)
    }
    return result
  }, [items, activeTab, selectedProdi, searchQuery, selectedMatkul])

  const handleDownload = async (item) => {
    if (!item.file_url) return
    setDownloadingId(item.id)
    const ext = item.file_url.split('.').pop()
    const downloadFilename = `${item.judul}.${ext}`
    const { data, error } = await supabase.storage.from('buku-files').createSignedUrl(item.file_url, 60, { download: downloadFilename })
    setDownloadingId(null)
    if (error) {
      setErrorMsg('Gagal membuat link unduhan: ' + error.message)
      return
    }
    window.open(data.signedUrl, '_blank', 'noopener,noreferrer')
  }

  const handlePreview = async (item) => {
    if (!item.file_url) return
    setPreviewingId(item.id)
    const { data, error } = await supabase.storage.from('buku-files').createSignedUrl(item.file_url, 60)
    setPreviewingId(null)
    if (error) {
      setErrorMsg('Gagal membuat link preview: ' + error.message)
      return
    }
    setPreviewData({
      item,
      url: data.signedUrl,
      title: item.judul
    })
  }

  return (
    <>
      <section className="page-header-buku">
        {!selectedProdi && <BackButton to="/" />}
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
            <span className="banner-buku-subtitle">DIREKTORI</span>
            <h1 className="banner-buku-title">BUKU AKADEMIK</h1>
          </div>
          <div className="banner-buku-speech-bubble">IPK 4 menanti!<br />Semangat :)</div>
          <img src="/assets/lebah akasin.png" alt="Lebah Akasin" className="banner-buku-mascot-right" />
        </div>
        <div className="banner-buku-pattern bottom"></div>
      </section>

      <section className="page-content">
        <div className="container">
          {errorMsg && (
            <div role="alert" style={{ background: 'var(--rose-50)', color: 'var(--rose-500)', padding: '0.8rem 1.2rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', border: '1px solid var(--rose-400)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{errorMsg}</span>
              <button onClick={() => setErrorMsg('')} aria-label="Tutup pesan error" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--rose-500)', fontWeight: 700 }}>✕</button>
            </div>
          )}
          {!selectedProdi ? (
            <div className="prodi-gate-container">
              <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>Pilih Program Studi</h2>
              <div className="prodi-gate-grid">
                <button className="prodi-gate-card" onClick={() => navigate('/buku-akademik/ti')}>
                  <div className="prodi-gate-icon" style={{ color: 'var(--gold-400)' }}>
                    <FileText size={40} aria-hidden="true" />
                  </div>
                  <h3>S1 Teknik Informatika</h3>
                  <p>Kumpulan buku akademik khusus mahasiswa Teknik Informatika.</p>
                </button>
                <button className="prodi-gate-card" onClick={() => navigate('/buku-akademik/si')}>
                  <div className="prodi-gate-icon" style={{ color: 'var(--gold-400)' }}>
                    <FileText size={40} aria-hidden="true" />
                  </div>
                  <h3>S1 Sistem Informasi</h3>
                  <p>Kumpulan buku akademik khusus mahasiswa Sistem Informasi.</p>
                </button>
              </div>
            </div>
          ) : (
            <>
              {!selectedMatkul && (
                <button
                  onClick={() => navigate('/buku-akademik')}
                  style={{ marginBottom: '2rem', background: 'transparent', border: 'none', color: 'var(--text-secondary)', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem' }}
                >
                  &larr; Kembali Pilih Prodi
                </button>
              )}


              <h2 style={{ marginBottom: '1.5rem', fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>Perpustakaan {selectedProdi}</h2>

              <div className="search-filter-bar">
                <div className="search-filter-dropdown">
                  <select value={activeTab} onChange={(e) => setActiveTab(e.target.value)}>
                    {TABS.map((tab) => (
                      <option key={tab} value={tab}>{tab === 'Semua' ? 'Semua' : `Semester ${tab}`}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} />
                </div>
                <input
                  type="text"
                  placeholder="Cari Mata Kuliah, Judul, Info..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="search-btn"><Search size={20} /></button>
              </div>

              {errorMsg && (
                <div className="alert-error" style={{ margin: '1rem 0' }}>
                  <AlertCircle size={20} />
                  <span>{errorMsg}</span>
                </div>
              )}

              {loading ? (
                <Spinner text="Memuat materi..." />
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
                      <button key={mk} className="prodi-gate-card" onClick={() => navigate(`/buku-akademik/${prodiParam}/${encodeURIComponent(mk)}`)} style={{ padding: '1.5rem', minHeight: 'auto', textAlign: 'left', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
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
                    onClick={() => navigate(`/buku-akademik/${prodiParam}`)}
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
              )}
            </>
          )}
        </div>
      </section>

      <DocumentPreviewModal
        data={previewData}
        onClose={() => setPreviewData(null)}
      />
    </>
  )
}

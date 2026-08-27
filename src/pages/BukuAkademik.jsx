import { useEffect, useMemo, useState } from 'react'
import { Download, FileText, Eye } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import BackButton from '../components/BackButton'
import DocumentPreviewModal from '../components/DocumentPreviewModal'

const TABS = ['Semua', 1, 2, 3, 4, 5, 6, 7, 8]

export default function BukuAkademik() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('Semua')
  const [downloadingId, setDownloadingId] = useState(null)
  const [previewingId, setPreviewingId] = useState(null)
  const [previewData, setPreviewData] = useState(null)
  const [selectedProdi, setSelectedProdi] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    let isMounted = true
    async function loadBuku() {
      const { data, error } = await supabase
        .from('buku_akademik')
        .select('id, judul, mata_kuliah, dosen, kategori, semester, file_url, prodi')
        .order('created_at', { ascending: false })
      if (isMounted) {
        if (error) console.error(error)
        setItems(data ?? [])
        setLoading(false)
      }
    }
    loadBuku()
    return () => {
      isMounted = false
    }
  }, [])

  const filtered = useMemo(() => {
    let result = items
    if (selectedProdi) {
      result = result.filter(item => item.prodi === selectedProdi)
    }
    if (activeTab !== 'Semua') {
      result = result.filter((item) => item.semester === activeTab)
    }
    return result
  }, [items, activeTab, selectedProdi])

  const handleDownload = async (item) => {
    if (!item.file_url) return
    setDownloadingId(item.id)
    const { data, error } = await supabase.storage.from('buku-files').createSignedUrl(item.file_url, 60, { download: item.judul })
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
      <section className="page-header">
        <BackButton />
        <div className="container">
          <h1 className="page-title">Buku Akademik Digital</h1>
          <p className="page-subtitle">Temukan dan unduh materi kuliah, e-book, dan modul untuk semester Anda.</p>
        </div>
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
              <h2 style={{textAlign: 'center', marginBottom: '2rem', fontFamily: 'var(--font-display)', color: 'var(--navy-900)'}}>Pilih Program Studi</h2>
              <div className="prodi-gate-grid">
                {/* FIX: Gunakan <button> semantik agar bisa diakses via keyboard */}
                <button className="prodi-gate-card" onClick={() => setSelectedProdi('S1 Teknik Informatika')}>
                  <div className="prodi-gate-icon" style={{background: 'var(--blue-50)', color: 'var(--blue-600)'}}>  
                    <FileText size={40} aria-hidden="true" />
                  </div>
                  <h3>S1 Teknik Informatika</h3>
                  <p>Materi, modul, dan buku panduan khusus mahasiswa Teknik Informatika.</p>
                </button>
                <button className="prodi-gate-card" onClick={() => setSelectedProdi('S1 Sistem Informasi')}>
                  <div className="prodi-gate-icon" style={{background: 'var(--purple-50)', color: 'var(--purple-600)'}}>
                    <FileText size={40} aria-hidden="true" />
                  </div>
                  <h3>S1 Sistem Informasi</h3>
                  <p>Materi, modul, dan buku panduan khusus mahasiswa Sistem Informasi.</p>
                </button>
              </div>
            </div>
          ) : (
            <>
              <button 
                onClick={() => setSelectedProdi(null)} 
                style={{ marginBottom: '2rem', background: 'transparent', border: 'none', color: 'var(--gray-500)', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem' }}
              >
                &larr; Kembali Pilih Prodi
              </button>
              
              <h2 style={{marginBottom: '1.5rem', fontFamily: 'var(--font-display)', color: 'var(--navy-900)'}}>Perpustakaan {selectedProdi}</h2>
              
              <div className="page-tabs">
                {TABS.map((tab) => (
                  <button
                    key={tab}
                    className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab === 'Semua' ? 'Semua' : `Semester ${tab}`}
                  </button>
                ))}
              </div>

              {loading ? (
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
              )}
            </>
          )}
        </div>
      </section>
      
      <DocumentPreviewModal 
        data={previewData} 
        onClose={() => setPreviewData(null)} 
        onDownload={handleDownload} 
      />
    </>
  )
}

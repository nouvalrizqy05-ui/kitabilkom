import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import Modal from '../components/Modal'
import BackButton from '../components/BackButton'

export default function InfoAkademik() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    let isMounted = true
    async function loadInfo() {
      const { data, error } = await supabase
        .from('info_akademik')
        .select('id, judul, kategori, tanggal, konten')
        .order('tanggal', { ascending: false })
      if (isMounted) {
        if (error) console.error(error)
        setItems(data ?? [])
        setLoading(false)
      }
    }
    loadInfo()
    return () => {
      isMounted = false
    }
  }, [])

  return (
    <>
      <section className="page-header">
        <BackButton />
        <div className="container">
          <h1 className="page-title">Info Akademik</h1>
          <p className="page-subtitle">Pengumuman, berita, dan informasi terbaru seputar Jurusan Ilmu Komputer.</p>
        </div>
      </section>

      <section className="page-content">
        <div className="container">

        {loading ? (
          <p className="empty-state">Memuat info...</p>
        ) : items.length === 0 ? (
          <p className="empty-state">Belum ada info akademik yang dipublikasikan.</p>
        ) : (
          <div className="cards-grid">
            {items.map((item) => (
              <div className="card-3d" key={item.id}>
                <span className="card-badge">{item.kategori || 'Info'}</span>
                <h3 className="card-title">{item.judul}</h3>
                <p className="card-meta">
                  {item.tanggal
                    ? new Date(item.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
                    : ''}
                </p>
                <button className="btn-outline-small" onClick={() => setSelected(item)}>
                  Baca Selengkapnya
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

        {selected && (
          <Modal title={selected.judul} onClose={() => setSelected(null)}>
            <p className="card-meta" style={{ marginBottom: '1rem' }}>
              {selected.kategori} •{' '}
              {selected.tanggal
                ? new Date(selected.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
                : ''}
            </p>
            <div className="rich-text-content" dangerouslySetInnerHTML={{ __html: selected.konten }}></div>
          </Modal>
        )}
      </section>
    </>
  )
}

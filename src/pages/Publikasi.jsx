import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import Modal from '../components/Modal'

import { ExternalLink, BookOpen } from 'lucide-react'
import BackButton from '../components/BackButton'

export default function Publikasi() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

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

  return (
    <>
      <section className="page-header">
        <BackButton />
        <div className="container">
          <h1 className="page-title">Database Publikasi Artikel</h1>
          <p className="page-subtitle">Daftar jurnal dan karya ilmiah yang diterbitkan oleh mahasiswa Ilmu Komputer.</p>
        </div>
      </section>

      <section className="page-content">
        <div className="container">
        {loading ? (
          <p className="empty-state">Memuat artikel...</p>
        ) : items.length === 0 ? (
          <p className="empty-state">Belum ada publikasi artikel terbaru.</p>
        ) : (
          <div className="cards-grid">
            {items.map((item) => (
              <div className="card-3d" key={item.id} style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <span className="card-badge" style={{ background: 'var(--purple-100)', color: 'var(--purple-700)', margin: 0 }}>
                    <BookOpen size={12} style={{ display: 'inline', marginRight: '4px' }} />
                    Jurnal
                  </span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--gray-500)', fontWeight: 600 }}>{item.tahun}</span>
                </div>
                
                <h3 className="card-title" style={{ fontSize: '1.2rem', marginBottom: '0.5rem', lineHeight: 1.4 }}>
                  {item.judul}
                </h3>
                
                <p style={{ fontSize: '0.9rem', color: 'var(--gray-600)', marginBottom: '0.25rem', fontWeight: 500 }}>
                  Penulis: <span style={{ color: 'var(--navy-900)' }}>{item.penulis}</span>
                </p>
                <p style={{ fontSize: '0.9rem', color: 'var(--gray-600)', marginBottom: '1rem', fontStyle: 'italic' }}>
                  Dipublikasikan di: {item.nama_jurnal}
                </p>
                
                <div style={{ background: 'var(--gray-50)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', flexGrow: 1 }}>
                  <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--gray-500)', marginBottom: '0.5rem', letterSpacing: '0.5px' }}>Abstrak</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--gray-700)', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {item.abstrak}
                  </p>
                </div>
                
                <a 
                  href={item.link_url} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="btn-primary" 
                  style={{ textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', width: '100%' }}
                >
                  <ExternalLink size={18} /> Baca Artikel Penuh
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
      </section>
    </>
  )
}

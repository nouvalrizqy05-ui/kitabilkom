import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { ArrowLeft, BookOpen, Tag, User, Calendar, Newspaper, ExternalLink } from 'lucide-react'

export default function PublikasiDetail() {
  const { id } = useParams()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    let isMounted = true
    async function load() {
      const { data, error } = await supabase
        .from('artikel_publikasi')
        .select('*')
        .eq('id', id)
        .single()
      if (isMounted) {
        if (error || !data) setNotFound(true)
        else setItem(data)
        setLoading(false)
      }
    }
    load()
    return () => { isMounted = false }
  }, [id])

  if (loading) {
    return (
      <section className="page-content">
        <div className="container" style={{ textAlign: 'center', padding: '6rem 0' }}>
          <p className="empty-state">Memuat artikel...</p>
        </div>
      </section>
    )
  }

  if (notFound) {
    return (
      <section className="page-content">
        <div className="container" style={{ textAlign: 'center', padding: '6rem 0' }}>
          <p className="empty-state">Artikel tidak ditemukan.</p>
          <Link to="/publikasi" className="pub-back-link" style={{ marginTop: '1rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <ArrowLeft size={16} /> Kembali ke Publikasi
          </Link>
        </div>
      </section>
    )
  }

  return (
    <>
      {/* Banner Header */}
      <section className="page-header-buku">
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
            <span className="banner-buku-subtitle">DETAIL</span>
            <h1 className="banner-buku-title">PUBLIKASI</h1>
          </div>
          <div className="banner-buku-speech-bubble">Keep writing!<br />Stay curious :)</div>
          <img src="/assets/lebah akasin.png" alt="Lebah Akasin" className="banner-buku-mascot-right" />
        </div>
        <div className="banner-buku-pattern bottom"></div>
      </section>

      <section className="page-content">
        <div className="container" style={{ maxWidth: '860px' }}>
          {/* Back Button */}
          <Link to="/publikasi" className="pub-back-link">
            <ArrowLeft size={16} /> Kembali ke Daftar Publikasi
          </Link>

          <div className="pub-detail-card">
            {/* Badges */}
            <div className="pub-detail-badges">
              {item.jenis_publikasi && (
                <span className="pub-badge-jenis">
                  <BookOpen size={13} /> {item.jenis_publikasi}
                </span>
              )}
              {item.kategori_publikasi && (
                <span className="pub-badge-kategori">
                  <Tag size={13} /> {item.kategori_publikasi}
                </span>
              )}
              <span className="pub-badge-tahun">
                <Calendar size={13} /> {item.tahun}
              </span>
            </div>

            {/* Judul */}
            <h1 className="pub-detail-title">{item.judul}</h1>

            {/* Meta info */}
            <div className="pub-detail-meta">
              <div className="pub-meta-row">
                <User size={16} className="pub-meta-icon" />
                <div>
                  <span className="pub-meta-label">Penulis</span>
                  <span className="pub-meta-value">{item.penulis}</span>
                </div>
              </div>
              <div className="pub-meta-row">
                <Newspaper size={16} className="pub-meta-icon" />
                <div>
                  <span className="pub-meta-label">Dipublikasikan di</span>
                  <span className="pub-meta-value">{item.nama_jurnal}</span>
                </div>
              </div>
            </div>

            <hr className="pub-detail-divider" />

            {/* Abstrak */}
            <div className="pub-detail-section">
              <h2 className="pub-section-heading">Abstrak</h2>
              <div
                className="pub-abstrak-content"
                dangerouslySetInnerHTML={item.abstrak ? { __html: item.abstrak } : undefined}
              >
                {!item.abstrak && <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>Abstrak tidak tersedia.</p>}
              </div>
            </div>

            {/* Tautan DOI */}
            {item.link_url && (
              <>
                <hr className="pub-detail-divider" />
                <div className="pub-detail-section">
                  <h2 className="pub-section-heading">Tautan Artikel</h2>
                  <a
                    href={item.link_url}
                    target="_blank"
                    rel="noreferrer"
                    className="pub-doi-link"
                  >
                    <ExternalLink size={15} />
                    <span>{item.link_url}</span>
                  </a>
                  <p className="pub-doi-note">
                    Klik tautan di atas untuk membaca artikel lengkap di sumber aslinya (jurnal / DOI / repositori).
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  )
}

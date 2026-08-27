import { useEffect, useMemo, useState } from 'react'
import { Search, GraduationCap } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import BackButton from '../components/BackButton'

export default function DosenIlkom() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')

  useEffect(() => {
    let isMounted = true
    async function loadDosen() {
      const { data, error } = await supabase
        .from('dosen')
        .select('id, nama, bidang, nip, foto_url')
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
    const q = query.trim().toLowerCase()
    if (!q) return items
    return items.filter(
      (d) => d.nama?.toLowerCase().includes(q) || d.bidang?.toLowerCase().includes(q)
    )
  }, [items, query])

  return (
    <>
      <section className="page-header">
        <BackButton />
        <div className="container">
          <h1 className="page-title">Direktori Dosen</h1>
          <p className="page-subtitle">Kenali lebih dekat profil dan bidang keahlian dosen-dosen Ilmu Komputer UNNES.</p>
        </div>
      </section>

      <section className="page-content">
        <div className="container">

        <div className="search-wrap">
          <Search size={18} aria-hidden="true" />
          <label htmlFor="dosen-search-input" className="sr-only">Cari nama dosen atau bidang keahlian</label>
          <input
            id="dosen-search-input"
            type="text"
            className="search-input"
            placeholder="Cari nama dosen atau bidang keahlian..."
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
          <div className="cards-grid">
            {filtered.map((dosen) => (
              <div className="card-3d card-row" key={dosen.id}>
                <div className="dosen-avatar">
                  {dosen.foto_url ? (
                    <img src={dosen.foto_url} alt={dosen.nama} />
                  ) : (
                    <GraduationCap size={28} />
                  )}
                </div>
                <div>
                  <h3 className="card-title" style={{ fontSize: '1.05rem', marginBottom: '0.2rem' }}>
                    {dosen.nama}
                  </h3>
                  <p className="card-meta" style={{ color: 'var(--primary-600)', fontWeight: 600 }}>
                    {dosen.bidang || '-'}
                  </p>
                  {dosen.nip && <p className="dosen-nip">NIP: {dosen.nip}</p>}
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

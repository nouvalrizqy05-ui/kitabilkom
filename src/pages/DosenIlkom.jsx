import { useMemo, useState } from 'react'
import { Search, Mail, Briefcase, Fingerprint, GraduationCap } from 'lucide-react'
import BackButton from '../components/BackButton'
import DosenCard from '../components/DosenCard'

// Data dosen hardcode — direplikasi dari capek-kuliah-main/data/dosen.ts
const dosenTI = [
  {
    id: 'ti-1',
    nama: 'Riza Arifudin, S.Pd., M.Cs',
    foto_url: 'https://simpeg2.unnes.ac.id/photo/132308204',
    email: 'rizaarifudin@mail.unnes.ac.id',
    jabatan: 'Lektor Kepala (koordinator program studi sistem informasi)',
    prodi: 'TI',
    nip: 'NIP-198005252005011001',
  },
  {
    id: 'ti-2',
    nama: 'Endang Sugiharti, S.Si., M.Kom.',
    foto_url: 'https://simpeg2.unnes.ac.id/photo/132231407',
    email: 'endangsugiharti@mail.unnes.ac.id',
    jabatan: 'Lektor Kepala',
    prodi: 'TI',
    nip: 'NIP-197401071999032001',
  },
  {
    id: 'ti-3',
    nama: 'Anggy Trisnawan Putra, S.Si., M.Si',
    foto_url: 'https://simpeg2.unnes.ac.id/photo/198707062014041003',
    email: 'anggy.trisnawan@mail.unnes.ac.id',
    jabatan: 'Lektor',
    prodi: 'TI',
    nip: 'NIP-198707062014041003',
  },
  {
    id: 'ti-4',
    nama: 'Budi Prasetiyo, S.Si., M.Kom',
    foto_url: 'https://simpeg2.unnes.ac.id/photo/198805012014041001',
    email: 'bprasetiyo@mail.unnes.ac.id',
    jabatan: 'Lektor, Koordinator Laboratorium Ilmu Komputer, Inkubator Unit Bisnis LPPM UNNES, gugus Jurnal SINTA 2',
    prodi: 'TI',
    nip: 'NIP-198805012014041001',
  },
  {
    id: 'ti-5',
    nama: 'M. Faris Al Hakim, S.Pd., M.Cs.',
    foto_url: 'https://simpeg2.unnes.ac.id/photo/199203272022031003',
    email: 'farishakim@mail.unnes.ac.id',
    jabatan: 'Lektor',
    prodi: 'TI',
    nip: 'NIP-199203272022031003',
  },
  {
    id: 'ti-6',
    nama: 'Aji Purwinarko, S.Si., M.Cs.',
    foto_url: 'https://simpeg2.unnes.ac.id/photo/198509102015041001',
    email: 'aji.purwinarko@mail.unnes.ac.id',
    jabatan: 'Lektor',
    prodi: 'TI',
    nip: 'NIP-198509102015041001',
  },
  {
    id: 'ti-7',
    nama: 'Abas Setiawan, S.Kom., M.Cs.',
    foto_url: 'https://simpeg2.unnes.ac.id/photo/199110302022031006',
    email: 'abas.setiawan@mail.unnes.ac.id',
    jabatan: 'Lektor',
    prodi: 'TI',
    nip: 'NIP-199110302022031006',
  },
  {
    id: 'ti-8',
    nama: 'Ir. Jumanto, S.Kom., M.Cs.',
    foto_url: 'https://simpeg2.unnes.ac.id/photo/199202072023211024',
    email: 'jumanto@mail.unnes.ac.id',
    jabatan: 'Asisten Ahli',
    prodi: 'TI',
    nip: 'NIP-199202072023211024',
  },
  {
    id: 'ti-9',
    nama: 'Ir. Much Aziz Muslim, S.Kom., M.Kom., Ph.D.',
    foto_url: '',
    email: 'a212muslim@mail.unnes.ac.id',
    jabatan: 'Lektor Kepala',
    prodi: 'TI',
    nip: 'NIP-197404202008121001',
  },
  {
    id: 'ti-10',
    nama: 'Dr. Alamsyah, S.Si., M.Kom.',
    foto_url: 'https://simpeg2.unnes.ac.id/photo/132320168',
    email: 'alamsyah@mail.unnes.ac.id',
    jabatan: 'Lektor Kepala (Koordinator Program Studi Teknik Informatika)',
    prodi: 'TI',
    nip: 'NIP-197405172006041001',
  },
  {
    id: 'ti-11',
    nama: 'Florentina Yuni Arini, S.Kom., M.Cs., Ph.D.',
    foto_url: '',
    email: 'floyuna@mail.unnes.ac.id',
    jabatan: 'Lektor',
    prodi: 'TI',
    nip: 'NIP-197810252003122001',
  }
]

const dosenSI = [
  {
    id: 'si-1',
    nama: 'Zaenal Abidin, S.Si., M.Cs., Ph.D.',
    foto_url: 'https://simpeg2.unnes.ac.id/photo/132308201',
    email: 'z.abidin@mail.unnes.ac.id',
    jabatan: 'Lektor Kepala (WD 1)',
    prodi: 'SI',
    nip: 'NIP-198205042005011001',
  },
  {
    id: 'si-2',
    nama: 'Devi Ajeng Efrilianda, S.Kom., M.Kom.',
    foto_url: 'https://simpeg2.unnes.ac.id/photo/199304152019032012',
    email: 'deviajeng@mail.unnes.ac.id',
    jabatan: 'Lektor',
    prodi: 'SI',
    nip: 'NIP-199304152019032012',
  },
  {
    id: 'si-3',
    nama: 'Shona Chayy Bilqisth, S.Kom., M.Cs.',
    foto_url: '/assets/shona.png',
    email: '',
    jabatan: 'Asisten Ahli',
    prodi: 'SI',
    nip: 'NIP-199408162024061001',
  },
  {
    id: 'si-4',
    nama: 'Subhan S.Pd., M.Pd., M.Kom.',
    foto_url: 'https://simpeg2.unnes.ac.id/photo/198909042019031014',
    email: 'subhan@mail.unnes.ac.id',
    jabatan: 'Lektor',
    prodi: 'SI',
    nip: 'NIP-198909042019031014',
  },
  {
    id: 'si-5',
    nama: 'Yahya Nur Ifriza S.Pd., M.Kom.',
    foto_url: 'https://simpeg2.unnes.ac.id/photo/199001172022031008',
    email: 'yahyanurifriza@mail.unnes.ac.id',
    jabatan: 'Lektor',
    prodi: 'SI',
    nip: 'NIP-199001172022031008',
  },
  {
    id: 'si-6',
    nama: 'Alya Aulia Nurdin, S.Kom., M.Kom.',
    foto_url: '/assets/Alya.png',
    email: '',
    jabatan: 'Tenaga Pengajar',
    prodi: 'SI',
    nip: 'NIP-2001021920260622001',
  },
  {
    id: 'si-7',
    nama: 'Bagus Winarko Nugroho, S.Pd., M.Kom.',
    foto_url: '',
    email: '',
    jabatan: 'Asisten Ahli',
    prodi: 'SI',
    nip: 'NIP-199110042024061001',
  },
  {
    id: 'si-8',
    nama: 'Kholiq Budiman, S.Pd., M.Kom.',
    foto_url: 'https://simpeg2.unnes.ac.id/photo/199209242019031013',
    email: 'kholiq.budiman@mail.unnes.ac.id',
    jabatan: 'Lektor',
    prodi: 'SI',
    nip: 'NIP-199209242019031013',
  },
]

const allDosen = [...dosenTI, ...dosenSI]

export default function DosenIlkom() {
  const [query, setQuery] = useState('')
  const [activeTab, setActiveTab] = useState('semua')

  const items = activeTab === 'ti' ? dosenTI : activeTab === 'si' ? dosenSI : allDosen

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items
    return items.filter(
      (d) => d.nama?.toLowerCase().includes(q) || d.email?.toLowerCase().includes(q) || d.jabatan?.toLowerCase().includes(q)
    )
  }, [items, query])

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
              Semua <span className="tab-count">{allDosen.length}</span>
            </button>
            <button
              className={`dosen-tab ${activeTab === 'ti' ? 'active' : ''}`}
              onClick={() => setActiveTab('ti')}
              role="tab"
              aria-selected={activeTab === 'ti'}
            >
              Teknik Informatika <span className="tab-count">{dosenTI.length}</span>
            </button>
            <button
              className={`dosen-tab ${activeTab === 'si' ? 'active' : ''}`}
              onClick={() => setActiveTab('si')}
              role="tab"
              aria-selected={activeTab === 'si'}
            >
              Sistem Informasi <span className="tab-count">{dosenSI.length}</span>
            </button>
          </div>

          {/* Search */}
          <div className="search-wrap" style={{ marginBottom: '2rem' }}>
            <Search size={18} aria-hidden="true" />
            <label htmlFor="dosen-search-input" className="sr-only">Cari nama dosen atau email</label>
            <input
              id="dosen-search-input"
              type="text"
              className="search-input"
              placeholder="Cari nama dosen, email, atau jabatan..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Cari nama dosen atau email"
            />
          </div>

          {filtered.length === 0 ? (
            <p className="empty-state">Tidak ada dosen yang cocok dengan pencarian.</p>
          ) : (
            <div className="dosen-card-grid">
              {filtered.map((dosen) => (
                <DosenCard key={dosen.id} dosen={dosen} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}

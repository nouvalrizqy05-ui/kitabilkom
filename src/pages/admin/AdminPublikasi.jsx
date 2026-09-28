import { useEffect, useState, useRef } from 'react'
import { Pencil, Trash2, Plus, ExternalLink, Search } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../context/AuthContext'
import Modal from '../../components/Modal'
import RichTextEditor from '../../components/RichTextEditor'

const JENIS_OPTIONS = ['Jurnal Nasional', 'Jurnal Internasional', 'Prosiding/Konferensi', 'Skripsi/Tugas Akhir', 'Buku', 'Artikel Ilmiah', 'Lainnya']
const KATEGORI_OPTIONS = ['Ilmu Komputer', 'Sistem Informasi', 'Teknologi Informasi', 'Kecerdasan Buatan', 'Jaringan & Keamanan', 'Rekayasa Perangkat Lunak', 'Lainnya']
const emptyForm = { judul: '', penulis: '', nama_jurnal: '', tahun: new Date().getFullYear(), abstrak: '', link_url: '', jenis_publikasi: 'Jurnal Nasional', kategori_publikasi: 'Ilmu Komputer' }
const PAGE_SIZE = 10

export default function AdminPublikasi() {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterKategori, setFilterKategori] = useState('Semua')
  const [currentPage, setCurrentPage] = useState(1)
  const initialFormRef = useRef(emptyForm)

  const load = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('artikel_publikasi').select('*').order('tahun', { ascending: false })
    if (error) console.error(error)
    setItems(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    initialFormRef.current = emptyForm
    setError('')
    setModalOpen(true)
  }

  const openEdit = (item) => {
    setEditing(item)
    const f = {
      judul: item.judul || '',
      penulis: item.penulis || '',
      nama_jurnal: item.nama_jurnal || '',
      tahun: item.tahun || new Date().getFullYear(),
      abstrak: item.abstrak || '',
      link_url: item.link_url || '',
      jenis_publikasi: item.jenis_publikasi || 'Jurnal Nasional',
      kategori_publikasi: item.kategori_publikasi || 'Ilmu Komputer',
    }
    setForm(f)
    initialFormRef.current = f
    setError('')
    setModalOpen(true)
  }

  const handleClose = () => {
    const isDirty = JSON.stringify(form) !== JSON.stringify(initialFormRef.current)
    if (isDirty && !confirm('Data belum disimpan. Yakin ingin keluar?')) return
    setModalOpen(false)
  }

  const handleDelete = async (item) => {
    if (!confirm(`Hapus artikel "${item.judul}"?`)) return
    const { error } = await supabase.from('artikel_publikasi').delete().eq('id', item.id)
    if (error) { alert('Gagal menghapus: ' + error.message); return }
    load()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    const payload = {
      judul: form.judul,
      penulis: form.penulis,
      nama_jurnal: form.nama_jurnal,
      tahun: Number(form.tahun),
      abstrak: form.abstrak,
      link_url: form.link_url,
      jenis_publikasi: form.jenis_publikasi,
      kategori_publikasi: form.kategori_publikasi,
    }

    const query = editing
      ? supabase.from('artikel_publikasi').update(payload).eq('id', editing.id)
      : supabase.from('artikel_publikasi').insert({ ...payload, created_by: user.id })

    const { error: saveError } = await query
    setSaving(false)

    if (saveError) { setError('Gagal menyimpan: ' + saveError.message); return }
    setModalOpen(false)
    load()
  }

  const filtered = items.filter(item => {
    const matchKategori = filterKategori === 'Semua' || item.kategori_publikasi === filterKategori
    const q = searchQuery.toLowerCase()
    const matchSearch = !q || item.judul?.toLowerCase().includes(q) || item.penulis?.toLowerCase().includes(q) || item.nama_jurnal?.toLowerCase().includes(q)
    return matchKategori && matchSearch
  })
  
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  return (
    <div>
      <div className="admin-panel-header">
        <h2>Artikel Publikasi ({filtered.length})</h2>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="admin-search-box">
            <Search size={15} className="admin-search-icon" />
            <input className="admin-search-input" placeholder="Cari judul, penulis, jurnal..." value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1) }} />
          </div>
          <select className="admin-filter-select" value={filterKategori} onChange={(e) => { setFilterKategori(e.target.value); setCurrentPage(1) }}>
            <option value="Semua">Semua Kategori</option>
            {KATEGORI_OPTIONS.map(k => <option key={k} value={k}>{k}</option>)}
          </select>
          <button className="btn-primary-small" onClick={openCreate}><Plus size={16} /> Tambah Artikel</button>
        </div>
      </div>

      {loading ? <p className="empty-state">Memuat...</p> : (
        <>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Judul Artikel</th><th>Penulis</th><th>Jenis</th><th>Kategori</th><th>Tahun</th><th>Tautan</th><th></th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr><td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>Tidak ada data ditemukan.</td></tr>
              ) : paginated.map((item) => (
                <tr key={item.id}>
                  <td>{item.judul}</td>
                  <td>{item.penulis}</td>
                  <td>
                    <span style={{ background: 'rgba(212,168,67,0.15)', color: 'var(--gold-700)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700, whiteSpace: 'nowrap' }}>
                      {item.jenis_publikasi || '—'}
                    </span>
                  </td>
                  <td>
                    <span style={{ background: 'rgba(212,168,67,0.08)', color: 'var(--gold-600)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, border: '1px solid rgba(212,168,67,0.2)', whiteSpace: 'nowrap' }}>
                      {item.kategori_publikasi || '—'}
                    </span>
                  </td>
                  <td>{item.tahun}</td>
                  <td>
                    {item.link_url ? (
                      <a href={item.link_url} target="_blank" rel="noreferrer" style={{color: 'var(--gold-600)', display: 'flex', alignItems: 'center', gap: '4px'}}>
                        <ExternalLink size={14}/> Buka
                      </a>
                    ) : '-'}
                  </td>
                  <td className="admin-table-actions">
                    <button onClick={() => openEdit(item)} aria-label="Edit"><Pencil size={16} /></button>
                    <button onClick={() => handleDelete(item)} aria-label="Hapus" className="danger"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {totalPages > 1 && (
            <div className="admin-pagination">
              <button className="pagination-btn" onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage===1}>&laquo;</button>
              {[...Array(totalPages)].map((_, i) => (
                <button key={i} className={`pagination-btn ${currentPage===i+1?'active':''}`} onClick={() => setCurrentPage(i+1)}>{i+1}</button>
              ))}
              <button className="pagination-btn" onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage===totalPages}>&raquo;</button>
            </div>
          )}
        </>
      )}

      {modalOpen && (
        <Modal title={editing ? 'Edit Artikel' : 'Tambah Artikel'} onClose={handleClose}>
          <form onSubmit={handleSubmit} className="admin-form">
            <label>
              Judul Artikel / Publikasi
              <input required value={form.judul} onChange={(e) => setForm({ ...form, judul: e.target.value })} />
            </label>
            <label>
              Nama Penulis (Mahasiswa / Dosen)
              <input required value={form.penulis} placeholder="Misal: Budi Santoso, dkk" onChange={(e) => setForm({ ...form, penulis: e.target.value })} />
            </label>
            <label>
              Jenis Publikasi
              <select value={form.jenis_publikasi} onChange={(e) => setForm({ ...form, jenis_publikasi: e.target.value })}>
                {JENIS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </label>
            <label>
              Kategori Publikasi
              <select value={form.kategori_publikasi} onChange={(e) => setForm({ ...form, kategori_publikasi: e.target.value })}>
                {KATEGORI_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </label>
            <label>
              Nama Jurnal / Konferensi / Penerbit
              <input required value={form.nama_jurnal} placeholder="Misal: Jurnal Ilmu Komputer" onChange={(e) => setForm({ ...form, nama_jurnal: e.target.value })} />
            </label>
            <label>
              Tahun Terbit
              <input type="number" required value={form.tahun} onChange={(e) => setForm({ ...form, tahun: e.target.value })} />
            </label>
            <label>
              Tautan Eksternal (URL / DOI)
              <input type="url" value={form.link_url} placeholder="https://doi.org/... atau link jurnal" onChange={(e) => setForm({ ...form, link_url: e.target.value })} />
            </label>
            <label className="admin-field">
              <span>Abstrak</span>
              <RichTextEditor
                value={form.abstrak}
                onChange={(content) => setForm({ ...form, abstrak: content })}
                placeholder="Tuliskan ringkasan / abstrak dari penelitian..."
              />
            </label>
            {error && <p className="auth-error">{error}</p>}
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
              <button type="button" onClick={handleClose} className="btn-secondary" disabled={saving}>Batal</button>
              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? 'Menyimpan...' : 'Simpan Artikel'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}

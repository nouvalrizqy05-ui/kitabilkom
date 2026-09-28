import { useEffect, useState, useRef } from 'react'
import { Pencil, Trash2, Plus, Search } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'
import { MATAKULIAH_DATA } from '../../lib/matakuliahData'
import { useAuth } from '../../context/AuthContext'
import Modal from '../../components/Modal'

const KATEGORI_OPTIONS = ['Materi', 'Latihan']
const PRODI_OPTIONS = ['S1 Teknik Informatika', 'S1 Sistem Informasi']
const emptyForm = { judul: '', mata_kuliah: '', kategori: 'Materi', semester: 1, file_url: '', prodi: 'S1 Teknik Informatika' }
const PAGE_SIZE = 10

export default function AdminBuku() {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [customMatkul, setCustomMatkul] = useState(false)
  const [filterKategori, setFilterKategori] = useState('Semua')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const initialFormRef = useRef(emptyForm)

  const load = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('buku_akademik').select('*').order('created_at', { ascending: true })
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
    setCustomMatkul(false)
    setModalOpen(true)
  }

  const openEdit = (item) => {
    const f = {
      judul: item.judul || '',
      mata_kuliah: item.mata_kuliah || '',
      kategori: item.kategori || 'Materi',
      semester: item.semester || 1,
      prodi: item.prodi || 'S1 Teknik Informatika',
      file_url: item.file_url || '',
    }
    setEditing(item)
    setForm(f)
    initialFormRef.current = f
    setError('')
    const availableMk = MATAKULIAH_DATA[item.prodi]?.[item.semester] || []
    setCustomMatkul(item.mata_kuliah && !availableMk.includes(item.mata_kuliah))
    setModalOpen(true)
  }

  const handleClose = () => {
    const isDirty = JSON.stringify(form) !== JSON.stringify(initialFormRef.current)
    if (isDirty && !confirm('Data belum disimpan. Yakin ingin keluar?')) return
    setModalOpen(false)
  }

  const handleDelete = async (item) => {
    if (!confirm(`Hapus materi "${item.judul}"?`)) return
    const { error } = await supabase.from('buku_akademik').delete().eq('id', item.id)
    if (error) { alert('Gagal menghapus: ' + error.message); return }
    load()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    const payload = {
      judul: form.judul,
      mata_kuliah: form.mata_kuliah,
      kategori: form.kategori,
      semester: Number(form.semester),
      prodi: form.prodi,
      file_url: form.file_url,
    }
    const query = editing
      ? supabase.from('buku_akademik').update(payload).eq('id', editing.id)
      : supabase.from('buku_akademik').insert({ ...payload, created_by: user.id })
    const { error: saveError } = await query
    setSaving(false)
    if (saveError) { setError('Gagal menyimpan: ' + saveError.message); return }
    setModalOpen(false)
    load()
  }

  const filtered = items.filter(item => {
    const matchKategori = filterKategori === 'Semua' || item.kategori === filterKategori
    const q = searchQuery.toLowerCase()
    const matchSearch = !q || item.judul?.toLowerCase().includes(q) || item.mata_kuliah?.toLowerCase().includes(q) || item.prodi?.toLowerCase().includes(q)
    return matchKategori && matchSearch
  })
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  return (
    <div>
      <div className="admin-panel-header">
        <h2>Buku Akademik ({filtered.length})</h2>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="admin-search-box">
            <Search size={15} className="admin-search-icon" />
            <input className="admin-search-input" placeholder="Cari judul, matkul, prodi..." value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1) }} />
          </div>
          <select className="admin-filter-select" value={filterKategori} onChange={(e) => { setFilterKategori(e.target.value); setCurrentPage(1) }}>
            <option value="Semua">Semua Kategori</option>
            <option value="Materi">Materi</option>
            <option value="Latihan">Latihan</option>
          </select>
          <button className="btn-primary-small" onClick={openCreate}><Plus size={16} /> Tambah Materi</button>
        </div>
      </div>

      {loading ? <p className="empty-state">Memuat...</p> : (
        <>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Judul</th><th>Mata Kuliah</th><th>Prodi</th><th>Kategori</th><th>Semester</th><th>Tautan</th><th></th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr><td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>Tidak ada data ditemukan.</td></tr>
              ) : paginated.map((item) => (
                <tr key={item.id}>
                  <td>{item.judul}</td>
                  <td>{item.mata_kuliah}</td>
                  <td>{item.prodi}</td>
                  <td>{item.kategori}</td>
                  <td>{item.semester}</td>
                  <td>{item.file_url ? '🔗 Tersedia' : '❌ Kosong'}</td>
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
        <Modal title={editing ? 'Edit Materi' : 'Tambah Materi'} onClose={handleClose}>
          <form onSubmit={handleSubmit} className="admin-form">
            <label>Judul Materi<input required value={form.judul} onChange={(e) => setForm({ ...form, judul: e.target.value })} /></label>
            <label>Program Studi
              <select value={form.prodi} onChange={(e) => { setForm({ ...form, prodi: e.target.value, mata_kuliah: '' }); setCustomMatkul(false) }}>
                {PRODI_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </label>
            <label>Semester
              <select value={form.semester} onChange={(e) => { setForm({ ...form, semester: Number(e.target.value), mata_kuliah: '' }); setCustomMatkul(false) }}>
                {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
              </select>
            </label>
            <label>Mata Kuliah
              <select required={!customMatkul} value={customMatkul ? 'lainnya' : form.mata_kuliah}
                onChange={(e) => {
                  if (e.target.value === 'lainnya') { setCustomMatkul(true); setForm({ ...form, mata_kuliah: '' }) }
                  else { setCustomMatkul(false); setForm({ ...form, mata_kuliah: e.target.value }) }
                }}>
                <option value="" disabled>Pilih Mata Kuliah...</option>
                {(MATAKULIAH_DATA[form.prodi]?.[form.semester] || []).map(mk => <option key={mk} value={mk}>{mk}</option>)}
                <option value="lainnya">+ Tambah Lainnya</option>
              </select>
            </label>
            {customMatkul && (
              <label>Nama Mata Kuliah Baru<input required placeholder="Ketik nama mata kuliah baru..." value={form.mata_kuliah} onChange={(e) => setForm({ ...form, mata_kuliah: e.target.value })} /></label>
            )}
            <label>Kategori
              <select value={form.kategori} onChange={(e) => setForm({ ...form, kategori: e.target.value })}>
                {KATEGORI_OPTIONS.map(k => <option key={k} value={k}>{k}</option>)}
              </select>
            </label>
            <label>Link Google Drive (URL)<input type="url" placeholder="https://drive.google.com/..." value={form.file_url || ''} onChange={(e) => setForm({ ...form, file_url: e.target.value })} required /></label>
            {error && <p className="alert-error">{error}</p>}
            <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }} disabled={saving}>
              {saving ? 'Menyimpan...' : 'Simpan Materi'}
            </button>
          </form>
        </Modal>
      )}
    </div>
  )
}

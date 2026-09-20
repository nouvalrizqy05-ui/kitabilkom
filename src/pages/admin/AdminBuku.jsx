import { useEffect, useState } from 'react'
import { Pencil, Trash2, Plus } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'
import { MATAKULIAH_DATA } from '../../lib/matakuliahData'
import { useAuth } from '../../context/AuthContext'
import Modal from '../../components/Modal'

const KATEGORI_OPTIONS = ['Materi', 'Latihan']
const PRODI_OPTIONS = ['S1 Teknik Informatika', 'S1 Sistem Informasi']
const emptyForm = { judul: '', mata_kuliah: '', kategori: 'Materi', semester: 1, file_url: '', prodi: 'S1 Teknik Informatika' }

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

  const load = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('buku_akademik').select('*').order('judul', { ascending: true })
    if (error) console.error(error)
    setItems(data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setError('')
    setCustomMatkul(false)
    setModalOpen(true)
  }

  const openEdit = (item) => {
    setEditing(item)
    setForm({
      judul: item.judul || '',
      mata_kuliah: item.mata_kuliah || '',
      kategori: item.kategori || 'Materi',
      semester: item.semester || 1,
      prodi: item.prodi || 'S1 Teknik Informatika',
      file_url: item.file_url || '',
    })
    setError('')

    const availableMk = MATAKULIAH_DATA[item.prodi]?.[item.semester] || []
    if (item.mata_kuliah && !availableMk.includes(item.mata_kuliah)) {
      setCustomMatkul(true)
    } else {
      setCustomMatkul(false)
    }

    setModalOpen(true)
  }

  const handleDelete = async (item) => {
    if (!confirm(`Hapus materi "${item.judul}"?`)) return
    const { error } = await supabase.from('buku_akademik').delete().eq('id', item.id)
    if (error) {
      alert('Gagal menghapus: ' + error.message)
      return
    }
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

    if (saveError) {
      setError('Gagal menyimpan: ' + saveError.message)
      return
    }

    setModalOpen(false)
    load()
  }

  return (
    <div>
      <div className="admin-panel-header">
        <h2>Buku Akademik ({items.length})</h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <select value={filterKategori} onChange={(e) => setFilterKategori(e.target.value)} style={{ padding: '0.4rem 0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', fontSize: '0.9rem' }}>
            <option value="Semua">Semua Kategori</option>
            <option value="Materi">Materi</option>
            <option value="Latihan">Latihan</option>
          </select>
          <button className="btn-primary-small" onClick={openCreate}>
            <Plus size={16} /> Tambah Materi
          </button>
        </div>
      </div>

      {loading ? (
        <p className="empty-state">Memuat...</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Judul</th>
              <th>Mata Kuliah</th>
              <th>Prodi</th>
              <th>Kategori</th>
              <th>Semester</th>
              <th>Tautan</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.filter(item => filterKategori === 'Semua' || item.kategori === filterKategori).map((item) => (
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
      )}

      {modalOpen && (
        <Modal title={editing ? 'Edit Materi' : 'Tambah Materi'} onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSubmit} className="admin-form">
            <label>
              Judul Materi
              <input required value={form.judul} onChange={(e) => setForm({ ...form, judul: e.target.value })} />
            </label>

            <label>
              Program Studi
              <select value={form.prodi} onChange={(e) => {
                setForm({ ...form, prodi: e.target.value, mata_kuliah: '' })
                setCustomMatkul(false)
              }}>
                {PRODI_OPTIONS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </label>

            <label>
              Semester
              <select 
                value={form.semester} 
                onChange={(e) => {
                  setForm({ ...form, semester: Number(e.target.value), mata_kuliah: '' })
                  setCustomMatkul(false)
                }}
              >
                {[1,2,3,4,5,6,7,8].map(s => (
                  <option key={s} value={s}>Semester {s}</option>
                ))}
              </select>
            </label>

            <label>
              Mata Kuliah
              <select 
                required={!customMatkul}
                value={customMatkul ? 'lainnya' : form.mata_kuliah} 
                onChange={(e) => {
                  if (e.target.value === 'lainnya') {
                    setCustomMatkul(true)
                    setForm({ ...form, mata_kuliah: '' })
                  } else {
                    setCustomMatkul(false)
                    setForm({ ...form, mata_kuliah: e.target.value })
                  }
                }}
              >
                <option value="" disabled>Pilih Mata Kuliah...</option>
                {(MATAKULIAH_DATA[form.prodi]?.[form.semester] || []).map(mk => (
                  <option key={mk} value={mk}>{mk}</option>
                ))}
                <option value="lainnya">+ Tambah Lainnya</option>
              </select>
            </label>

            {customMatkul && (
              <label>
                Nama Mata Kuliah Baru
                <input 
                  required 
                  placeholder="Ketik nama mata kuliah baru..."
                  value={form.mata_kuliah} 
                  onChange={(e) => setForm({ ...form, mata_kuliah: e.target.value })} 
                />
              </label>
            )}

            <label>
              Kategori
              <select value={form.kategori} onChange={(e) => setForm({ ...form, kategori: e.target.value })}>
                {KATEGORI_OPTIONS.map((k) => (
                  <option key={k} value={k}>{k}</option>
                ))}
              </select>
            </label>

            <label>
              Link Google Drive (URL)
              <input type="url" placeholder="https://drive.google.com/..." value={form.file_url || ''} onChange={(e) => setForm({ ...form, file_url: e.target.value })} required />
            </label>

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

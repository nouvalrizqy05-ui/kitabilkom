import { useEffect, useState } from 'react'
import { Pencil, Trash2, Plus } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'
import { MATAKULIAH_DATA } from '../../lib/matakuliahData'
import { useAuth } from '../../context/AuthContext'
import Modal from '../../components/Modal'

const KATEGORI_OPTIONS = ['PDF', 'Modul', 'E-Book']
const PRODI_OPTIONS = ['S1 Teknik Informatika', 'S1 Sistem Informasi']
const emptyForm = { judul: '', mata_kuliah: '', dosen: '', kategori: 'PDF', semester: 1, file: null, prodi: 'S1 Teknik Informatika' }

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

  const load = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('buku_akademik').select('*').order('created_at', { ascending: false })
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
      dosen: item.dosen || '',
      kategori: item.kategori || 'PDF',
      semester: item.semester || 1,
      prodi: item.prodi || 'S1 Teknik Informatika',
      file: null,
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
    if (item.file_url) {
      await supabase.storage.from('buku-files').remove([item.file_url])
    }
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

    let file_url = editing?.file_url ?? null

    if (form.file) {
      const ext = form.file.name.split('.').pop()
      const path = `materi/${crypto.randomUUID()}.${ext}`
      const { error: uploadError } = await supabase.storage.from('buku-files').upload(path, form.file)
      if (uploadError) {
        setError('Gagal upload file: ' + uploadError.message)
        setSaving(false)
        return
      }
      file_url = path
    }

    const payload = {
      judul: form.judul,
      mata_kuliah: form.mata_kuliah,
      dosen: form.dosen,
      kategori: form.kategori,
      semester: Number(form.semester),
      prodi: form.prodi,
      file_url,
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
        <button className="btn-primary-small" onClick={openCreate}>
          <Plus size={16} /> Tambah Materi
        </button>
      </div>

      {loading ? (
        <p className="empty-state">Memuat...</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Judul</th>
              <th>Mata Kuliah</th>
              <th>Dosen</th>
              <th>Prodi</th>
              <th>Kategori</th>
              <th>Semester</th>
              <th>File</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.judul}</td>
                <td>{item.mata_kuliah}</td>
                <td>{item.dosen}</td>
                <td>{item.prodi}</td>
                <td>{item.kategori}</td>
                <td>{item.semester}</td>
                <td>{item.file_url ? '✨ Terunggah' : '❌ Belum ada'}</td>
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
              Nama Dosen
              <input required value={form.dosen} onChange={(e) => setForm({ ...form, dosen: e.target.value })} />
            </label>

            <label>
              Kategori
              <select value={form.kategori} onChange={(e) => setForm({ ...form, kategori: e.target.value })}>
                {KATEGORI_OPTIONS.map((k) => (
                  <option key={k} value={k}>{k}</option>
                ))}
              </select>
            </label>

            <label>
              File {editing?.file_url ? '(kosongkan jika tidak ingin ganti file)' : ''}
              <input type="file" accept=".pdf,.doc,.docx,.ppt,.pptx" onChange={(e) => setForm({ ...form, file: e.target.files[0] })} />
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

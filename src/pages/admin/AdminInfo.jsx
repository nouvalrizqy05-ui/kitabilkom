import { useEffect, useState } from 'react'
import { Pencil, Trash2, Plus } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../context/AuthContext'
import Modal from '../../components/Modal'
import RichTextEditor from '../../components/RichTextEditor'

const KATEGORI_OPTIONS = ['Penting', 'Berita', 'Lomba', 'Beasiswa', 'Bootcamp']
const emptyForm = { judul: '', kategori: 'Penting', tanggal: '', konten: '' }

export default function AdminInfo() {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('info_akademik').select('*').neq('kategori', 'Artikel Publikasi').order('tanggal', { ascending: false })
    if (error) console.error(error)
    setItems(data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const openCreate = () => {
    setEditing(null)
    setForm({ ...emptyForm, tanggal: new Date().toISOString().slice(0, 10) })
    setError('')
    setModalOpen(true)
  }

  const openEdit = (item) => {
    setEditing(item)
    setForm({
      judul: item.judul || '',
      kategori: item.kategori || 'Penting',
      tanggal: item.tanggal || '',
      konten: item.konten || '',
    })
    setError('')
    setModalOpen(true)
  }

  const handleDelete = async (item) => {
    if (!confirm(`Hapus info "${item.judul}"?`)) return
    const { error } = await supabase.from('info_akademik').delete().eq('id', item.id)
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
      kategori: form.kategori,
      tanggal: form.tanggal,
      konten: form.konten,
    }

    const query = editing
      ? supabase.from('info_akademik').update(payload).eq('id', editing.id)
      : supabase.from('info_akademik').insert({ ...payload, created_by: user.id })

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
        <h2>Info Akademik ({items.length})</h2>
        <button className="btn-primary-small" onClick={openCreate}>
          <Plus size={16} /> Tambah Info
        </button>
      </div>

      {loading ? (
        <p className="empty-state">Memuat...</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Judul</th>
              <th>Kategori</th>
              <th>Tanggal</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.judul}</td>
                <td>{item.kategori}</td>
                <td>{item.tanggal}</td>
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
        <Modal title={editing ? 'Edit Info' : 'Tambah Info'} onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSubmit} className="admin-form">
            <label>
              Judul
              <input required value={form.judul} onChange={(e) => setForm({ ...form, judul: e.target.value })} />
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
              Tanggal
              <input
                type="date"
                required
                value={form.tanggal}
                onChange={(e) => setForm({ ...form, tanggal: e.target.value })}
              />
            </label>
            <label className="admin-field">
              <span>Isi Pengumuman</span>
              <RichTextEditor
                value={form.konten}
                onChange={(content) => setForm({ ...form, konten: content })}
                placeholder="Detail informasi..."
              />
            </label>
            {error && <p className="auth-error">{error}</p>}
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Menyimpan...' : 'Simpan'}
            </button>
          </form>
        </Modal>
      )}
    </div>
  )
}

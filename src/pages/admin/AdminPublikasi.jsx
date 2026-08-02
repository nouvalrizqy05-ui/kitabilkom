import { useEffect, useState } from 'react'
import { Pencil, Trash2, Plus, ExternalLink } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../context/AuthContext'
import Modal from '../../components/Modal'

const emptyForm = { judul: '', penulis: '', nama_jurnal: '', tahun: new Date().getFullYear(), abstrak: '', link_url: '' }

export default function AdminPublikasi() {
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
    const { data, error } = await supabase.from('artikel_publikasi').select('*').order('tahun', { ascending: false })
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
    setModalOpen(true)
  }

  const openEdit = (item) => {
    setEditing(item)
    setForm({
      judul: item.judul || '',
      penulis: item.penulis || '',
      nama_jurnal: item.nama_jurnal || '',
      tahun: item.tahun || new Date().getFullYear(),
      abstrak: item.abstrak || '',
      link_url: item.link_url || ''
    })
    setError('')
    setModalOpen(true)
  }

  const handleDelete = async (item) => {
    if (!confirm(`Hapus artikel "${item.judul}"?`)) return
    const { error } = await supabase.from('artikel_publikasi').delete().eq('id', item.id)
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
      penulis: form.penulis,
      nama_jurnal: form.nama_jurnal,
      tahun: Number(form.tahun),
      abstrak: form.abstrak,
      link_url: form.link_url,
    }

    const query = editing
      ? supabase.from('artikel_publikasi').update(payload).eq('id', editing.id)
      : supabase.from('artikel_publikasi').insert({ ...payload, created_by: user.id })

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
        <h2>Artikel Publikasi ({items.length})</h2>
        <button className="btn-primary-small" onClick={openCreate}>
          <Plus size={16} /> Tambah Artikel
        </button>
      </div>

      {loading ? (
        <p className="empty-state">Memuat...</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Judul Artikel</th>
              <th>Penulis</th>
              <th>Jurnal</th>
              <th>Tahun</th>
              <th>Tautan</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.judul}</td>
                <td>{item.penulis}</td>
                <td>{item.nama_jurnal}</td>
                <td>{item.tahun}</td>
                <td>
                  {item.link_url ? (
                    <a href={item.link_url} target="_blank" rel="noreferrer" style={{color: 'var(--blue-600)', display: 'flex', alignItems: 'center', gap: '4px'}}>
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
      )}

      {modalOpen && (
        <Modal title={editing ? 'Edit Artikel' : 'Tambah Artikel'} onClose={() => setModalOpen(false)}>
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
              Nama Jurnal / Konferensi
              <input required value={form.nama_jurnal} placeholder="Misal: Jurnal Ilmu Komputer" onChange={(e) => setForm({ ...form, nama_jurnal: e.target.value })} />
            </label>
            <label>
              Tahun Terbit
              <input
                type="number"
                required
                value={form.tahun}
                onChange={(e) => setForm({ ...form, tahun: e.target.value })}
              />
            </label>
            <label>
              Tautan Eksternal (URL / DOI)
              <input type="url" required value={form.link_url} placeholder="https://doi.org/... atau link jurnal" onChange={(e) => setForm({ ...form, link_url: e.target.value })} />
            </label>
            <label>
              Abstrak
              <textarea
                required
                rows={5}
                placeholder="Tuliskan ringkasan / abstrak dari penelitian..."
                value={form.abstrak}
                onChange={(e) => setForm({ ...form, abstrak: e.target.value })}
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

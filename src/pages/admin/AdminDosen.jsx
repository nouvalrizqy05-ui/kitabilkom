import { useEffect, useState } from 'react'
import { Pencil, Trash2, Plus } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../context/AuthContext'
import Modal from '../../components/Modal'

const emptyForm = { nama: '', bidang: '', nip: '', foto: null }

export default function AdminDosen() {
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
    const { data, error } = await supabase.from('dosen').select('*').order('nama')
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
    setForm({ nama: item.nama || '', bidang: item.bidang || '', nip: item.nip || '', foto: null })
    setError('')
    setModalOpen(true)
  }

  const handleDelete = async (item) => {
    if (!confirm(`Hapus data dosen "${item.nama}"?`)) return
    const { error } = await supabase.from('dosen').delete().eq('id', item.id)
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

    let foto_url = editing?.foto_url ?? null

    if (form.foto) {
      const ext = form.foto.name.split('.').pop()
      const path = `dosen/${crypto.randomUUID()}.${ext}`
      const { error: uploadError } = await supabase.storage.from('foto').upload(path, form.foto)
      if (uploadError) {
        setError('Gagal upload foto: ' + uploadError.message)
        setSaving(false)
        return
      }
      const { data: publicUrl } = supabase.storage.from('foto').getPublicUrl(path)
      foto_url = publicUrl.publicUrl
    }

    const payload = {
      nama: form.nama,
      bidang: form.bidang,
      nip: form.nip,
      foto_url,
    }

    const query = editing
      ? supabase.from('dosen').update(payload).eq('id', editing.id)
      : supabase.from('dosen').insert({ ...payload, created_by: user.id })

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
        <h2>Direktori Dosen ({items.length})</h2>
        <button className="btn-primary-small" onClick={openCreate}>
          <Plus size={16} /> Tambah Dosen
        </button>
      </div>

      {loading ? (
        <p className="empty-state">Memuat...</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Nama</th>
              <th>Bidang</th>
              <th>NIP</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.nama}</td>
                <td>{item.bidang}</td>
                <td>{item.nip}</td>
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
        <Modal title={editing ? 'Edit Dosen' : 'Tambah Dosen'} onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSubmit} className="admin-form">
            <label>
              Nama Lengkap (dengan gelar)
              <input required value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} />
            </label>
            <label>
              Bidang Keahlian
              <input required value={form.bidang} onChange={(e) => setForm({ ...form, bidang: e.target.value })} />
            </label>
            <label>
              NIP
              <input value={form.nip} onChange={(e) => setForm({ ...form, nip: e.target.value })} />
            </label>
            <label>
              Foto (opsional)
              <input type="file" accept="image/*" onChange={(e) => setForm({ ...form, foto: e.target.files[0] })} />
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

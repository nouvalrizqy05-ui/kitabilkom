import { useEffect, useState } from 'react'
import { Plus, Trash2, Calendar } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'
import Modal from '../../components/Modal'

export default function AdminAgenda() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  
  const [form, setForm] = useState({ tanggal: '', nama_kegiatan: '', keterangan: '' })

  const load = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('kalender_akademik').select('*').order('tanggal', { ascending: true })
    if (error) console.error(error)
    setItems(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    const { error } = await supabase.from('kalender_akademik').insert([form])
    setSaving(false)
    if (error) {
      alert('Gagal menyimpan: ' + error.message)
      return
    }
    setModalOpen(false)
    load()
  }

  const handleDelete = async (id, nama) => {
    if (!confirm(`Hapus agenda "${nama}"?`)) return
    await supabase.from('kalender_akademik').delete().eq('id', id)
    load()
  }

  return (
    <div>
      <div className="admin-panel-header">
        <h2>Agenda Kalender Akademik ({items.length})</h2>
        <button className="btn-primary-small" onClick={() => { setForm({ tanggal: '', nama_kegiatan: '', keterangan: '' }); setModalOpen(true) }}>
          <Plus size={16} /> Tambah Agenda
        </button>
      </div>

      {loading ? <p className="empty-state">Memuat...</p> : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Tanggal</th>
              <th>Nama Kegiatan</th>
              <th>Keterangan</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{new Date(item.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
                <td><strong>{item.nama_kegiatan}</strong></td>
                <td>{item.keterangan || '-'}</td>
                <td className="admin-table-actions">
                  <button onClick={() => handleDelete(item.id, item.nama_kegiatan)} className="danger"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {modalOpen && (
        <Modal title="Tambah Agenda Baru" onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSubmit} className="admin-form">
            <label>Tanggal Pelaksanaan<input type="date" required value={form.tanggal} onChange={(e) => setForm({...form, tanggal: e.target.value})} /></label>
            <label>Nama Kegiatan<input type="text" required placeholder="Misal: Ujian Tengah Semester" value={form.nama_kegiatan} onChange={(e) => setForm({...form, nama_kegiatan: e.target.value})} /></label>
            <label>Keterangan Tambahan (Opsional)<textarea rows="3" value={form.keterangan} onChange={(e) => setForm({...form, keterangan: e.target.value})}></textarea></label>
            <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Menyimpan...' : 'Simpan Agenda'}</button>
          </form>
        </Modal>
      )}
    </div>
  )
}

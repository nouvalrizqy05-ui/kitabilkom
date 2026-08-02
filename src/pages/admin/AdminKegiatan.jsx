import { useEffect, useState } from 'react'
import { Plus, Trash2, Image as ImageIcon } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'
import Modal from '../../components/Modal'

export default function AdminKegiatan() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  
  const [form, setForm] = useState({ judul: '', image_url: '', deskripsi: '' })

  const load = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('kegiatan_hima').select('*').order('created_at', { ascending: false })
    if (error) console.error(error)
    setItems(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    const { error } = await supabase.from('kegiatan_hima').insert([form])
    setSaving(false)
    if (error) {
      alert('Gagal menyimpan: ' + error.message)
      return
    }
    setModalOpen(false)
    load()
  }

  const handleDelete = async (id, judul) => {
    if (!confirm(`Hapus kegiatan "${judul}"?`)) return
    await supabase.from('kegiatan_hima').delete().eq('id', id)
    load()
  }

  return (
    <div>
      <div className="admin-panel-header">
        <h2>Dokumentasi Kegiatan HIMA ({items.length})</h2>
        <button className="btn-primary-small" onClick={() => { setForm({ judul: '', image_url: '', deskripsi: '' }); setModalOpen(true) }}>
          <Plus size={16} /> Tambah Kegiatan
        </button>
      </div>

      {loading ? <p className="empty-state">Memuat...</p> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
          {items.map((item) => (
            <div key={item.id} style={{ background: 'white', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--gray-200)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: '160px', background: 'var(--gray-100)', backgroundImage: `url(${item.image_url})`, backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {!item.image_url && <ImageIcon size={40} color="var(--gray-400)" />}
              </div>
              <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1rem', color: 'var(--navy-900)', marginBottom: '0.5rem' }}>{item.judul}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--gray-600)', flex: 1 }}>{item.deskripsi}</p>
                <button onClick={() => handleDelete(item.id, item.judul)} className="btn-secondary-small" style={{ marginTop: '1rem', color: 'var(--red-600)', borderColor: 'var(--red-200)', justifyContent: 'center' }}>
                  <Trash2 size={14} /> Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <Modal title="Tambah Kegiatan HIMA" onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSubmit} className="admin-form">
            <label>Judul Kegiatan<input type="text" required value={form.judul} onChange={(e) => setForm({...form, judul: e.target.value})} /></label>
            <label>URL Gambar<input type="url" required placeholder="https://..." value={form.image_url} onChange={(e) => setForm({...form, image_url: e.target.value})} /></label>
            <label>Deskripsi Singkat<textarea rows="3" required value={form.deskripsi} onChange={(e) => setForm({...form, deskripsi: e.target.value})}></textarea></label>
            <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Menyimpan...' : 'Simpan Kegiatan'}</button>
          </form>
        </Modal>
      )}
    </div>
  )
}

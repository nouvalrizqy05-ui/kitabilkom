import { useEffect, useState } from 'react'
import { Pencil, Trash2, Plus, Image as ImageIcon } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../context/AuthContext'
import Modal from '../../components/Modal'
import RichTextEditor from '../../components/RichTextEditor'

const KATEGORI_OPTIONS = ['Penting', 'Berita', 'Lomba', 'Beasiswa', 'Bootcamp']
const STATUS_OPTIONS = ['Buka', 'Tutup']

const emptyForm = { 
  judul: '', 
  kategori: 'Penting', 
  tanggal: '', 
  konten: '',
  status: 'Buka',
  batas_pendaftaran: '',
  link_pendaftaran: '',
  posterFile: null,
  poster_url: ''
}

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
    const { data, error } = await supabase
      .from('info_akademik')
      .select('*')
      .neq('kategori', 'Artikel Publikasi')
      .order('tanggal', { ascending: false })
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
      status: item.status || 'Buka',
      batas_pendaftaran: item.batas_pendaftaran || '',
      link_pendaftaran: item.link_pendaftaran || '',
      posterFile: null,
      poster_url: item.poster_url || ''
    })
    setError('')
    setModalOpen(true)
  }

  const handleDelete = async (item) => {
    if (!confirm(`Hapus info "${item.judul}"?`)) return
    
    // Attempt to delete poster file if exists
    if (item.poster_url && item.poster_url.includes('foto/')) {
      try {
        const path = item.poster_url.split('foto/')[1]
        if (path) {
          await supabase.storage.from('foto').remove([path])
        }
      } catch (err) {
        console.error('Failed to delete image', err)
      }
    }

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

    let finalPosterUrl = form.poster_url

    if (form.posterFile) {
      const ext = form.posterFile.name.split('.').pop()
      const path = `poster_info/${crypto.randomUUID()}.${ext}`
      const { error: uploadError } = await supabase.storage.from('foto').upload(path, form.posterFile)
      
      if (uploadError) {
        setError('Gagal upload poster: ' + uploadError.message)
        setSaving(false)
        return
      }

      const { data: pubData } = supabase.storage.from('foto').getPublicUrl(path)
      finalPosterUrl = pubData.publicUrl
    }

    const payload = {
      judul: form.judul,
      kategori: form.kategori,
      tanggal: form.tanggal || null,
      konten: form.konten,
      status: form.status,
      batas_pendaftaran: form.batas_pendaftaran || null,
      link_pendaftaran: form.link_pendaftaran,
      poster_url: finalPosterUrl
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
              <th>Poster</th>
              <th>Judul</th>
              <th>Kategori</th>
              <th>Status</th>
              <th>Tenggat</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>
                  {item.poster_url ? (
                    <img src={item.poster_url} alt="Poster" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '8px' }} />
                  ) : (
                    <div style={{ width: '40px', height: '40px', background: 'var(--gray-200)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gray-500)' }}>
                      <ImageIcon size={16} />
                    </div>
                  )}
                </td>
                <td style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.judul}</td>
                <td>{item.kategori}</td>
                <td>
                  <span className="status-pill" style={{ background: item.status === 'Buka' ? 'var(--teal-50)' : 'var(--rose-50)', color: item.status === 'Buka' ? 'var(--teal-600)' : 'var(--rose-600)' }}>
                    {item.status || 'Buka'}
                  </span>
                </td>
                <td>{item.batas_pendaftaran || '-'}</td>
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
          <form onSubmit={handleSubmit} className="admin-form" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            
            <label style={{ gridColumn: '1 / -1' }}>
              Judul Acara / Lomba
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
              Status Pendaftaran
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                {STATUS_OPTIONS.map((k) => (
                  <option key={k} value={k}>{k}</option>
                ))}
              </select>
            </label>

            <label>
              Tanggal Upload (Berita)
              <input type="date" required value={form.tanggal} onChange={(e) => setForm({ ...form, tanggal: e.target.value })} />
            </label>

            <label>
              Batas Pendaftaran / Tenggat (Opsional)
              <input type="date" value={form.batas_pendaftaran} onChange={(e) => setForm({ ...form, batas_pendaftaran: e.target.value })} />
            </label>

            <label style={{ gridColumn: '1 / -1' }}>
              Link Guidebook / Pendaftaran (Opsional)
              <input type="url" placeholder="https://..." value={form.link_pendaftaran} onChange={(e) => setForm({ ...form, link_pendaftaran: e.target.value })} />
            </label>

            <div className="admin-field" style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label>Upload Poster Acara</label>
              <input type="file" accept="image/*" onChange={(e) => {
                const file = e.target.files ? e.target.files[0] : null;
                setForm({ ...form, posterFile: file });
              }} />
              {Boolean(form.poster_url) && !form.posterFile ? (
                <span style={{ fontSize: '0.8rem', color: 'var(--teal-600)', marginTop: '0.25rem' }}>✓ Sudah ada poster terunggah.</span>
              ) : null}
            </div>

            <div className="admin-field" style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label>Detail Informasi</label>
              <RichTextEditor
                value={form.konten || ''}
                onChange={(content) => setForm({ ...form, konten: content })}
                placeholder="Tuliskan syarat & ketentuan, penjelasan lomba, dll..."
              />
            </div>
            
            {error && <p className="auth-error" style={{ gridColumn: '1 / -1' }}>{error}</p>}
            
            <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
              <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary" disabled={saving}>Batal</button>
              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? 'Menyimpan...' : 'Simpan Info'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}

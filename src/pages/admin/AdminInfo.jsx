import { useEffect, useState, useRef } from 'react'
import { Pencil, Trash2, Plus, Image as ImageIcon, Search } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../context/AuthContext'
import Modal from '../../components/Modal'
import RichTextEditor from '../../components/RichTextEditor'

const KATEGORI_OPTIONS = ['Lomba', 'Beasiswa', 'Bootcamp']
const LOMBA_SUBCATS = ['Web Dev', 'Game Dev', 'UI/UX Design', 'Businessplan', 'Competitive Programming', 'Data Science']

const emptyForm = { 
  judul: '', 
  kategori: 'Lomba', 
  sub_kategori: '',
  tanggal: '', 
  konten: '',
  batas_pendaftaran: '',
  link_pendaftaran: '',
  posterFile: null,
  poster_url: ''
}
const PAGE_SIZE = 10

export default function AdminInfo() {
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
    const { data, error } = await supabase
      .from('info_akademik')
      .select('*')
      .neq('kategori', 'Artikel Publikasi')
      .order('tanggal', { ascending: false })
      
    if (error) {
      console.error(error)
      setLoading(false)
      return
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const validItems = []
    
    for (const item of (data || [])) {
      if (item.batas_pendaftaran) {
        const deadline = new Date(item.batas_pendaftaran)
        deadline.setHours(0, 0, 0, 0)
        
        if (deadline < today) {
          if (item.poster_url && item.poster_url.includes('foto/')) {
            try {
              const path = item.poster_url.split('foto/')[1]
              if (path) await supabase.storage.from('foto').remove([path])
            } catch (err) {}
          }
          await supabase.from('info_akademik').delete().eq('id', item.id)
          continue 
        }
      }
      validItems.push(item)
    }

    setItems(validItems)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const openCreate = () => {
    setEditing(null)
    const f = { ...emptyForm, tanggal: new Date().toISOString().slice(0, 10) }
    setForm(f)
    initialFormRef.current = f
    setError('')
    setModalOpen(true)
  }

  const openEdit = (item) => {
    setEditing(item)
    const f = {
      judul: item.judul || '',
      kategori: item.kategori || 'Lomba',
      sub_kategori: item.sub_kategori || '',
      tanggal: item.tanggal || '',
      konten: item.konten || '',
      batas_pendaftaran: item.batas_pendaftaran || '',
      link_pendaftaran: item.link_pendaftaran || '',
      posterFile: null,
      poster_url: item.poster_url || ''
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
    if (!confirm(`Hapus info "${item.judul}"?`)) return
    if (item.poster_url && item.poster_url.includes('foto/')) {
      try {
        const path = item.poster_url.split('foto/')[1]
        if (path) await supabase.storage.from('foto').remove([path])
      } catch (err) { console.error('Failed to delete image', err) }
    }
    const { error } = await supabase.from('info_akademik').delete().eq('id', item.id)
    if (error) { alert('Gagal menghapus: ' + error.message); return }
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
      sub_kategori: form.kategori === 'Lomba' ? form.sub_kategori : null,
      tanggal: form.tanggal || null,
      konten: form.konten,
      batas_pendaftaran: form.batas_pendaftaran || null,
      link_pendaftaran: form.link_pendaftaran,
      poster_url: finalPosterUrl
    }

    const query = editing
      ? supabase.from('info_akademik').update(payload).eq('id', editing.id)
      : supabase.from('info_akademik').insert({ ...payload, created_by: user.id })

    const { error: saveError } = await query
    setSaving(false)

    if (saveError) { setError('Gagal menyimpan: ' + saveError.message); return }
    setModalOpen(false)
    load()
  }

  const filtered = items.filter(item => {
    const matchKategori = filterKategori === 'Semua' || item.kategori === filterKategori
    const q = searchQuery.toLowerCase()
    const matchSearch = !q || item.judul?.toLowerCase().includes(q) || item.kategori?.toLowerCase().includes(q) || item.sub_kategori?.toLowerCase().includes(q)
    return matchKategori && matchSearch
  })
  
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  return (
    <div>
      <div className="admin-panel-header">
        <h2>Info Akademik ({filtered.length})</h2>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="admin-search-box">
            <Search size={15} className="admin-search-icon" />
            <input className="admin-search-input" placeholder="Cari judul, kategori..." value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1) }} />
          </div>
          <select className="admin-filter-select" value={filterKategori} onChange={(e) => { setFilterKategori(e.target.value); setCurrentPage(1) }}>
            <option value="Semua">Semua Kategori</option>
            {KATEGORI_OPTIONS.map(k => <option key={k} value={k}>{k}</option>)}
          </select>
          <button className="btn-primary-small" onClick={openCreate}><Plus size={16} /> Tambah Info</button>
        </div>
      </div>

      {loading ? <p className="empty-state">Memuat...</p> : (
        <>
          <div className="admin-table-scroll">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Poster</th><th>Judul</th><th>Kategori</th><th>Bidang Lomba</th><th>Tenggat</th><th></th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>Tidak ada data ditemukan.</td></tr>
                ) : paginated.map((item) => (
                  <tr key={item.id}>
                    <td>
                      {item.poster_url ? (
                        <img src={item.poster_url} alt="Poster" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '8px' }} />
                      ) : (
                        <div style={{ width: '40px', height: '40px', background: 'var(--bg-base)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                          <ImageIcon size={16} />
                        </div>
                      )}
                    </td>
                    <td style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.judul}</td>
                    <td>{item.kategori}</td>
                    <td>{item.kategori === 'Lomba' ? (item.sub_kategori || '-') : '-'}</td>
                    <td>{item.batas_pendaftaran || '-'}</td>
                    <td className="admin-table-actions">
                      <button onClick={() => openEdit(item)} aria-label="Edit"><Pencil size={16} /></button>
                      <button onClick={() => handleDelete(item)} aria-label="Hapus" className="danger"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
        <Modal title={editing ? 'Edit Info' : 'Tambah Info'} onClose={handleClose}>
          <form onSubmit={handleSubmit} className="admin-form admin-info-form admin-form-grid">
            
            <label style={{ gridColumn: '1 / -1' }}>
              Judul Acara / Lomba
              <input required value={form.judul} onChange={(e) => setForm({ ...form, judul: e.target.value })} />
            </label>

            <label>
              Kategori Utama
              <select value={form.kategori} onChange={(e) => setForm({ ...form, kategori: e.target.value })}>
                {KATEGORI_OPTIONS.map((k) => <option key={k} value={k}>{k}</option>)}
              </select>
            </label>
            
            {form.kategori === 'Lomba' && (
              <label style={{ gridColumn: '1 / -1' }}>
                Bidang / Sub Kategori Lomba IT
                <input 
                  list="lomba-subcats"
                  placeholder="Ketik sendiri atau pilih..."
                  value={form.sub_kategori}
                  onChange={(e) => setForm({ ...form, sub_kategori: e.target.value })}
                />
                <datalist id="lomba-subcats">
                  {LOMBA_SUBCATS.map((sub, idx) => <option key={idx} value={sub} />)}
                </datalist>
                <small style={{ display: 'block', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  Bisa dipilih dari list, atau ketik langsung bidang lain (contoh: IoT, Robotics, dsb).
                </small>
              </label>
            )}

            <label>
              Tanggal Upload (Berita)
              <input type="date" required value={form.tanggal} onChange={(e) => setForm({ ...form, tanggal: e.target.value })} />
            </label>

            <label>
              Batas Pendaftaran / Tenggat
              <input type="date" value={form.batas_pendaftaran} onChange={(e) => setForm({ ...form, batas_pendaftaran: e.target.value })} />
            </label>

            <label style={{ gridColumn: '1 / -1' }}>
              Link Guidebook / Pendaftaran
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
              <button type="button" onClick={handleClose} className="btn-secondary" disabled={saving}>Batal</button>
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

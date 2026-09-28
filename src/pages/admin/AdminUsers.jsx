import { useEffect, useState } from 'react'
import { ShieldCheck, ShieldOff, Search, Trash2 } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../context/AuthContext'

const PAGE_SIZE = 10

export default function AdminUsers() {
  const { user } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const load = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('profiles').select('*')
    if (error) console.error(error)
    
    // Urutkan: admin dulu, lalu mahasiswa. Kalau sama, abjad nama.
    const sorted = (data ?? []).sort((a, b) => {
      if (a.role === 'admin' && b.role !== 'admin') return -1
      if (a.role !== 'admin' && b.role === 'admin') return 1
      return (a.nama || '').localeCompare(b.nama || '')
    })
    
    setUsers(sorted)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const toggleRole = async (targetUser) => {
    const nextRole = targetUser.role === 'admin' ? 'mahasiswa' : 'admin'
    if (targetUser.id === user.id && nextRole === 'mahasiswa') {
      if (!confirm('Kamu akan menurunkan akses admin akun kamu sendiri. Lanjutkan?')) return
    }
    setUpdatingId(targetUser.id)
    const { error } = await supabase.from('profiles').update({ role: nextRole }).eq('id', targetUser.id)
    setUpdatingId(null)
    if (error) { alert('Gagal mengubah role: ' + error.message); return }
    load()
  }

  const handleDelete = async (targetUser) => {
    if (targetUser.id === user.id) {
      alert('Anda tidak bisa menghapus akun Anda sendiri dari sini.')
      return
    }
    if (!confirm(`Yakin ingin MENGHAPUS akun pengguna ${targetUser.email}? Aksi ini tidak dapat dibatalkan.`)) return
    
    setUpdatingId(targetUser.id)
    // Menghapus data dari tabel profiles. (Auth user akan tergantung backend, tapi ini setidaknya hapus profilnya)
    const { error } = await supabase.from('profiles').delete().eq('id', targetUser.id)
    setUpdatingId(null)
    
    if (error) {
      alert('Gagal menghapus pengguna: ' + error.message)
      return
    }
    load()
  }

  const filtered = users.filter(u => {
    const q = searchQuery.toLowerCase()
    return !q || u.nama?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q) || u.role?.toLowerCase().includes(q)
  })
  
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  return (
    <div>
      <div className="admin-panel-header">
        <h2>Kelola Pengguna ({filtered.length})</h2>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <div className="admin-search-box">
            <Search size={15} className="admin-search-icon" />
            <input className="admin-search-input" placeholder="Cari nama, email, role..." value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1) }} />
          </div>
        </div>
      </div>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
        Promosikan mahasiswa jadi admin, atau turunkan admin jadi mahasiswa biasa. Hati-hati, admin bisa mengubah
        semua konten di situs ini.
      </p>

      {loading ? <p className="empty-state">Memuat...</p> : (
        <>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nama</th><th>Email</th><th>Role</th><th></th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr><td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>Tidak ada data ditemukan.</td></tr>
              ) : paginated.map((u) => (
                <tr key={u.id}>
                  <td>{u.nama}</td>
                  <td>{u.email}</td>
                  <td><span className={`status-pill status-${u.role}`}>{u.role}</span></td>
                  <td className="admin-table-actions" style={{ justifyContent: 'flex-end' }}>
                    <button onClick={() => toggleRole(u)} disabled={updatingId === u.id}>
                      {u.role === 'admin' ? <ShieldOff size={16} /> : <ShieldCheck size={16} />}
                      {' '}
                      {u.role === 'admin' ? 'Jadikan Mahasiswa' : 'Jadikan Admin'}
                    </button>
                    <button onClick={() => handleDelete(u)} disabled={updatingId === u.id} className="danger" aria-label="Hapus Akun">
                      <Trash2 size={16} /> Hapus
                    </button>
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
    </div>
  )
}

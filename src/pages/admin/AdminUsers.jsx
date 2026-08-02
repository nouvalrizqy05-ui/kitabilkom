import { useEffect, useState } from 'react'
import { ShieldCheck, ShieldOff } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../context/AuthContext'

export default function AdminUsers() {
  const { user } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState(null)

  const load = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('profiles').select('*').order('email')
    if (error) console.error(error)
    setUsers(data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const toggleRole = async (targetUser) => {
    const nextRole = targetUser.role === 'admin' ? 'mahasiswa' : 'admin'
    if (targetUser.id === user.id && nextRole === 'mahasiswa') {
      if (!confirm('Kamu akan menurunkan akses admin akun kamu sendiri. Lanjutkan?')) return
    }
    setUpdatingId(targetUser.id)
    const { error } = await supabase.from('profiles').update({ role: nextRole }).eq('id', targetUser.id)
    setUpdatingId(null)
    if (error) {
      alert('Gagal mengubah role: ' + error.message)
      return
    }
    load()
  }

  return (
    <div>
      <div className="admin-panel-header">
        <h2>Kelola Pengguna ({users.length})</h2>
      </div>
      <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)', marginBottom: '1rem' }}>
        Promosikan mahasiswa jadi admin, atau turunkan admin jadi mahasiswa biasa. Hati-hati, admin bisa mengubah
        semua konten di situs ini.
      </p>

      {loading ? (
        <p className="empty-state">Memuat...</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Nama</th>
              <th>Email</th>
              <th>Role</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.nama}</td>
                <td>{u.email}</td>
                <td><span className={`status-pill status-${u.role}`}>{u.role}</span></td>
                <td className="admin-table-actions">
                  <button onClick={() => toggleRole(u)} disabled={updatingId === u.id}>
                    {u.role === 'admin' ? <ShieldOff size={16} /> : <ShieldCheck size={16} />}
                    {' '}
                    {u.role === 'admin' ? 'Jadikan Mahasiswa' : 'Jadikan Admin'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabaseClient'
import { User, Mail, Lock, Shield, Save } from 'lucide-react'

export default function Profil() {
  const { user, profile, refreshProfile } = useAuth()
  
  const [nama, setNama] = useState(profile?.nama || '')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      // Update name in profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ nama })
        .eq('id', user.id)

      if (profileError) throw profileError

      // Update name in auth user_metadata as well for consistency
      await supabase.auth.updateUser({ data: { nama } })

      // Update password if provided
      if (password) {
        if (password !== confirmPassword) {
          throw new Error('Konfirmasi kata sandi tidak cocok.')
        }
        if (password.length < 6) {
          throw new Error('Kata sandi minimal 6 karakter.')
        }
        
        const { error: authError } = await supabase.auth.updateUser({ password })
        if (authError) throw authError
      }

      await refreshProfile()
      setMessage({ type: 'success', text: 'Profil berhasil diperbarui!' })
      setPassword('')
      setConfirmPassword('')
    } catch (err) {
      setMessage({ type: 'error', text: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="page-content-section" style={{ minHeight: 'calc(100vh - 80px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="container" style={{ maxWidth: '600px' }}>
        <div className="auth-box" style={{ width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ width: '80px', height: '80px', background: 'var(--purple-100)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: 'var(--purple-600)' }}>
              <User size={40} />
            </div>
            <h1 className="admin-title">Profil Saya</h1>
            <p className="admin-subtitle">Kelola informasi akun dan keamanan Anda.</p>
          </div>

          {message.text && (
            <div style={{ padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', background: message.type === 'error' ? '#fee2e2' : '#dcfce7', color: message.type === 'error' ? '#991b1b' : '#166534', fontSize: '0.9rem' }}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="auth-form">
            <label className="auth-field">
              <span><Mail size={16} /> Email Kampus (Tidak dapat diubah)</span>
              <input type="email" value={user?.email || ''} disabled style={{ background: 'var(--gray-50)', color: 'var(--gray-500)' }} />
            </label>

            <label className="auth-field">
              <span><Shield size={16} /> Peran</span>
              <input type="text" value={profile?.role === 'admin' ? 'Administrator' : 'Mahasiswa'} disabled style={{ background: 'var(--gray-50)', color: 'var(--gray-500)' }} />
            </label>

            <label className="auth-field">
              <span><User size={16} /> Nama Lengkap</span>
              <input
                type="text"
                required
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Masukkan nama lengkap"
              />
            </label>

            <div style={{ margin: '2rem 0 1rem', borderBottom: '1px solid var(--gray-200)' }}>
              <h3 style={{ fontSize: '1rem', color: 'var(--navy-900)', marginBottom: '0.5rem' }}>Ubah Kata Sandi (Opsional)</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--gray-500)', marginBottom: '1rem' }}>Kosongkan jika tidak ingin mengubah kata sandi saat ini.</p>
            </div>

            <label className="auth-field">
              <span><Lock size={16} /> Kata Sandi Baru</span>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>

            <label className="auth-field">
              <span><Lock size={16} /> Konfirmasi Kata Sandi Baru</span>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </label>

            <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '1rem' }}>
              {loading ? 'Menyimpan...' : <><Save size={18} /> Simpan Perubahan</>}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

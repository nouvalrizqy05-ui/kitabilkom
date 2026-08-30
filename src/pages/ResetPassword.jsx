import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, KeyRound } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'

export default function ResetPassword() {
  const navigate = useNavigate()

  const [userEmail, setUserEmail] = useState('')
  const [password, setPassword] = useState('')
  const [konfirmasi, setKonfirmasi] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [showKonfirmasi, setShowKonfirmasi] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [sessionReady, setSessionReady] = useState(false)
  const [sessionError, setSessionError] = useState(false)

  // Supabase mengirim token via URL hash (#access_token=...&type=recovery)
  // onAuthStateChange akan menangkap event PASSWORD_RECOVERY
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'PASSWORD_RECOVERY' && session) {
        // Session aktif, ambil email user
        setUserEmail(session.user?.email || '')
        setSessionReady(true)
      }
    })

    // Cek juga jika session sudah ada (refresh halaman)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUserEmail(session.user.email || '')
        setSessionReady(true)
      }
    })

    // Timeout: kalau 8 detik tidak ada session valid, tampilkan error
    const timeout = setTimeout(() => {
      setSessionReady(prev => {
        if (!prev) setSessionError(true)
        return prev
      })
    }, 8000)

    return () => {
      subscription.unsubscribe()
      clearTimeout(timeout)
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('Password minimal 6 karakter.')
      return
    }
    if (password !== konfirmasi) {
      setError('Konfirmasi password tidak cocok.')
      return
    }

    setSubmitting(true)
    const { error: updateError } = await supabase.auth.updateUser({ password })
    setSubmitting(false)

    if (updateError) {
      setError('Gagal mengubah password. Link mungkin sudah kedaluwarsa, minta link baru.')
      return
    }

    setSuccess(true)
    // Sign out agar user login ulang dengan password baru
    await supabase.auth.signOut()
    setTimeout(() => navigate('/login'), 3000)
  }

  // Loading session dari token
  if (!sessionReady && !sessionError) {
    return (
      <section className="auth-section">
        <div className="auth-box" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
          <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem' }}>
            Memverifikasi link reset password...
          </p>
        </div>
      </section>
    )
  }

  // Token tidak valid / kedaluwarsa
  if (sessionError) {
    return (
      <section className="auth-section">
        <div className="auth-box" style={{ textAlign: 'center' }}>
          <div style={{
            width: 64, height: 64,
            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1.25rem',
          }}>
            <AlertCircle size={32} color="white" />
          </div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--gray-800)', marginBottom: '0.75rem' }}>
            Link Tidak Valid
          </h1>
          <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            Link reset password ini sudah kedaluwarsa atau tidak valid.
            Minta link baru melalui halaman lupa password.
          </p>
          <Link to="/lupa-password" className="btn-primary" style={{ display: 'inline-flex', gap: '8px' }}>
            Minta Link Baru
          </Link>
        </div>
      </section>
    )
  }

  // Berhasil reset
  if (success) {
    return (
      <section className="auth-section">
        <div className="auth-box" style={{ textAlign: 'center' }}>
          <div style={{
            width: 64, height: 64,
            background: 'linear-gradient(135deg, #22c55e, #16a34a)',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1.25rem',
          }}>
            <CheckCircle size={32} color="white" />
          </div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--gray-800)', marginBottom: '0.75rem' }}>
            Password Berhasil Diubah!
          </h1>
          <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem', lineHeight: 1.6 }}>
            Password baru kamu sudah aktif. Kamu akan diarahkan ke halaman login dalam 3 detik...
          </p>
        </div>
      </section>
    )
  }

  // Form reset password
  return (
    <section className="auth-section">
      <div className="auth-box">
        {/* Icon header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
          <div style={{
            width: 40, height: 40,
            background: 'var(--gradient-primary)',
            borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <KeyRound size={20} color="white" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--gray-800)', margin: 0 }}>
              Buat Password Baru
            </h1>
            <p style={{ fontSize: '0.78rem', color: 'var(--gray-400)', margin: 0 }}>
              Masukkan password baru untuk akun kamu
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Email — otomatis terisi, tidak bisa diedit */}
          <label className="auth-field">
            <span style={{ opacity: 0.6 }}>Email Akun</span>
            <input
              type="email"
              value={userEmail}
              disabled
              readOnly
              style={{
                background: 'var(--gray-50)',
                color: 'var(--gray-400)',
                cursor: 'not-allowed',
                border: '1px solid var(--gray-200)',
              }}
            />
          </label>

          {/* Password baru */}
          <label className="auth-field">
            <span><Lock size={15} /> Password Baru</span>
            <div style={{ position: 'relative' }}>
              <input
                type={showPass ? 'text' : 'password'}
                required
                minLength={6}
                placeholder="Minimal 6 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingRight: '2.8rem' }}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                aria-label={showPass ? 'Sembunyikan password' : 'Tampilkan password'}
                style={{
                  position: 'absolute', right: '0.8rem', top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--gray-400)', display: 'flex',
                }}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </label>

          {/* Konfirmasi password */}
          <label className="auth-field">
            <span><Lock size={15} /> Konfirmasi Password</span>
            <div style={{ position: 'relative' }}>
              <input
                type={showKonfirmasi ? 'text' : 'password'}
                required
                minLength={6}
                placeholder="Ulangi password baru"
                value={konfirmasi}
                onChange={(e) => setKonfirmasi(e.target.value)}
                style={{
                  paddingRight: '2.8rem',
                  borderColor: konfirmasi && password && konfirmasi !== password
                    ? '#ef4444'
                    : konfirmasi && password && konfirmasi === password
                    ? '#22c55e'
                    : undefined,
                }}
              />
              <button
                type="button"
                onClick={() => setShowKonfirmasi(!showKonfirmasi)}
                aria-label={showKonfirmasi ? 'Sembunyikan konfirmasi' : 'Tampilkan konfirmasi'}
                style={{
                  position: 'absolute', right: '0.8rem', top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--gray-400)', display: 'flex',
                }}
              >
                {showKonfirmasi ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {/* Indikator match */}
            {konfirmasi && password && (
              <span style={{
                fontSize: '0.75rem',
                color: konfirmasi === password ? '#16a34a' : '#dc2626',
                marginTop: '4px', display: 'block',
              }}>
                {konfirmasi === password ? '✓ Password cocok' : '✗ Password tidak cocok'}
              </span>
            )}
          </label>

          {error && (
            <div style={{
              display: 'flex', alignItems: 'flex-start', gap: '8px',
              background: '#fef2f2', border: '1px solid #fca5a5',
              borderRadius: '8px', padding: '0.75rem 1rem',
              color: '#dc2626', fontSize: '0.85rem',
            }}>
              <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '1px' }} />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="btn-primary"
            disabled={submitting || (konfirmasi.length > 0 && password !== konfirmasi)}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            <KeyRound size={16} />
            {submitting ? 'Menyimpan...' : 'Simpan Password Baru'}
          </button>
        </form>
      </div>
    </section>
  )
}

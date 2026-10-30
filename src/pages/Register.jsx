import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserPlus, Mail, Lock, User, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { ALLOWED_EMAIL_DOMAIN } from '../lib/supabaseClient'
import BackButton from '../components/BackButton'

export default function Register() {
  const { signUp, signInWithGoogle } = useAuth()
  const navigate = useNavigate()

  const [nama, setNama] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [googleSubmitting, setGoogleSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('Kata sandi minimal 6 karakter.')
      return
    }

    if (!email.endsWith(ALLOWED_EMAIL_DOMAIN)) {
      setError(`Gagal: Anda harus menggunakan email institusi (${ALLOWED_EMAIL_DOMAIN}) untuk mendaftar!`)
      return
    }

    setSubmitting(true)
    const { error, data } = await signUp({ email, password, nama })
    setSubmitting(false)

    if (error) {
      setError(error.message)
      return
    }

    // Kalau project Supabase mengaktifkan "confirm email", session belum langsung ada.
    if (data?.session) {
      navigate('/')
    } else {
      setSuccess(true)
    }
  }

  const handleGoogleRegister = async () => {
    setError('')
    setGoogleSubmitting(true)
    const { error } = await signInWithGoogle()
    if (error) {
      setError(error.message)
      setGoogleSubmitting(false)
    }
  }

  if (success) {
    return (
      <section className="auth-section">
        <div className="auth-box">
          <BackButton light={true} />
          <h1>Cek Email Kamu</h1>
          <p className="auth-subtitle">
            Kami sudah kirim link konfirmasi ke <strong>{email}</strong>. Buka email kampus kamu dan klik link-nya
            untuk mengaktifkan akun, lalu login di sini.
          </p>
          <Link to="/login" className="btn-primary" style={{ display: 'inline-flex', marginTop: '1rem' }}>
            Ke halaman login
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="auth-section">
      <div className="auth-box">
        <BackButton light={true} />
        <h1>Daftar Akun</h1>
        <p className="auth-subtitle">
          Pendaftaran khusus untuk civitas Ilmu Komputer UNNES dengan email {ALLOWED_EMAIL_DOMAIN}.
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          <label className="auth-field">
            <span><User size={16} /> Nama Lengkap</span>
            <input
              type="text"
              required
              placeholder="Nama Anda"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
            />
          </label>

          <label className="auth-field">
            <span><Mail size={16} /> Email Kampus</span>
            <input
              type="email"
              required
              placeholder="Email Anda"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label className="auth-field">
            <span><Lock size={16} /> Kata Sandi</span>
            <div className="password-input-wrap">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                placeholder="Minimal 6 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                aria-label={showPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </label>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="btn-primary" disabled={submitting}>
            <UserPlus size={18} /> {submitting ? 'Memproses...' : 'Daftar'}
          </button>
        </form>

        <div className="auth-divider">
          <span>atau daftar melalui</span>
        </div>

        <button 
          type="button" 
          onClick={handleGoogleRegister} 
          className="btn-google"
          disabled={googleSubmitting}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          <span>{googleSubmitting ? 'Menghubungkan ke Google...' : 'Google'}</span>
        </button>

        <p className="auth-switch">
          Sudah punya akun? <Link to="/login">Masuk di sini</Link>
        </p>
      </div>
    </section>
  )
}

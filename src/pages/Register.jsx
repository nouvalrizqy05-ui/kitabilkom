import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserPlus, Mail, Lock, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { ALLOWED_EMAIL_DOMAIN } from '../lib/supabaseClient'
import BackButton from '../components/BackButton'

export default function Register() {
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const [nama, setNama] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)

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
            <input
              type="password"
              required
              minLength={6}
              placeholder="Minimal 6 karakter"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="btn-primary" disabled={submitting}>
            <UserPlus size={18} /> {submitting ? 'Memproses...' : 'Daftar'}
          </button>
        </form>

        <p className="auth-switch">
          Sudah punya akun? <Link to="/login">Masuk di sini</Link>
        </p>
      </div>
    </section>
  )
}

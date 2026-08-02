import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LogIn, Mail, Lock } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { ALLOWED_EMAIL_DOMAIN } from '../lib/supabaseClient'
import BackButton from '../components/BackButton'

export default function Login() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    const { error } = await signIn({ email, password })
    setSubmitting(false)
    if (error) {
      setError(error.message)
      return
    }
    navigate(from, { replace: true })
  }

  return (
    <section className="auth-section">
      <BackButton light={true} />
      <div className="auth-box">
        <h1>Masuk ke Kitab Ilkom</h1>
        <p className="auth-subtitle">
          Gunakan email kampus kamu ({ALLOWED_EMAIL_DOMAIN}) untuk mengakses buku akademik, voting, dan fitur
          lainnya.
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          <label className="auth-field">
            <span><Mail size={16} /> Email Kampus</span>
            <input
              type="email"
              required
              placeholder={`nim_kamu${ALLOWED_EMAIL_DOMAIN}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label className="auth-field">
            <span><Lock size={16} /> Kata Sandi</span>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="btn-primary" disabled={submitting}>
            <LogIn size={18} /> {submitting ? 'Memproses...' : 'Masuk'}
          </button>
        </form>

        <p className="auth-switch">
          Belum punya akun? <Link to="/register">Daftar di sini</Link>
        </p>
      </div>
    </section>
  )
}

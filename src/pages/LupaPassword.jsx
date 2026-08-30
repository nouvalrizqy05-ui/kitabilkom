import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft, CheckCircle, AlertCircle, Send } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'

export default function LupaPassword() {
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    // URL redirect setelah user klik link di email
    // Harus sama persis dengan yang didaftarkan di Supabase Dashboard → Auth → URL Configuration → Redirect URLs
    const redirectTo = 'https://www.kitabilkom.online/isi-passwordbaru'

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
      redirectTo,
    })

    setSubmitting(false)

    if (resetError) {
      setError('Gagal mengirim email reset. Pastikan email kamu terdaftar dan coba lagi.')
      return
    }

    setSent(true)
  }

  // State: berhasil kirim
  if (sent) {
    return (
      <section className="auth-section">
        <div className="auth-box">
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
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
              Email Terkirim!
            </h1>
            <p style={{ color: 'var(--gray-600)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              Link reset password sudah dikirim ke{' '}
              <strong style={{ color: 'var(--primary-700)' }}>{email}</strong>.
              <br />Cek kotak masuk atau folder <em>spam</em> kamu, lalu klik link-nya.
            </p>
            <p style={{ fontSize: '0.8rem', color: 'var(--gray-400)', marginBottom: '1.5rem' }}>
              Link berlaku selama <strong>1 jam</strong>.
            </p>
            <Link to="/login" className="btn-primary" style={{ display: 'inline-flex', gap: '8px', alignItems: 'center' }}>
              <ArrowLeft size={16} /> Kembali ke Login
            </Link>
          </div>
        </div>
      </section>
    )
  }

  // State: form
  return (
    <section className="auth-section">
      <div className="auth-box">
        <Link
          to="/login"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            fontSize: '0.82rem', color: 'var(--primary-600)', fontWeight: 600,
            marginBottom: '1.25rem', textDecoration: 'none',
          }}
        >
          <ArrowLeft size={15} /> Kembali ke Login
        </Link>

        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--gray-800)', marginBottom: '0.5rem' }}>
          Lupa Password?
        </h1>
        <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1.75rem' }}>
          Masukkan email kampus kamu. Kami akan kirimkan link untuk membuat password baru.
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          <label className="auth-field">
            <span><Mail size={15} /> Email Kampus</span>
            <input
              type="email"
              required
              placeholder="Email Anda"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
            />
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

          <button type="submit" className="btn-primary" disabled={submitting} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <Send size={16} />
            {submitting ? 'Mengirim...' : 'Kirim Link Reset'}
          </button>
        </form>
      </div>
    </section>
  )
}

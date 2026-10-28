import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

/**
 * Halaman callback untuk Google OAuth (PKCE flow).
 * Supabase redirect ke /auth/callback?code=xxx, lalu kita tukar code → session,
 * kemudian redirect ke home.
 */
export default function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.exchangeCodeForSession(window.location.href).then(() => {
      navigate('/', { replace: true })
    })
  }, [navigate])

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: '1rem',
      background: 'var(--bg-base)',
      color: 'var(--text-primary)',
      fontFamily: 'var(--font-body)',
    }}>
      <div style={{
        width: 40,
        height: 40,
        border: '3px solid var(--gold-400)',
        borderTopColor: 'transparent',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
        Memproses login Google…
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

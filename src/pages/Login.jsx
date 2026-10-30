import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LogIn, Mail, Lock, Fingerprint, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { ALLOWED_EMAIL_DOMAIN } from '../lib/supabaseClient'
import BackButton from '../components/BackButton'

// Hanya simpan email (bukan password) untuk fitur Ingat Saya
const saveEmail = (email) => localStorage.setItem('kitabilkom_saved_email', email)
const getSavedEmail = () => localStorage.getItem('kitabilkom_saved_email') || ''
const clearSavedEmail = () => localStorage.removeItem('kitabilkom_saved_email')

export default function Login() {
  const { signIn, signInWithGoogle } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [googleSubmitting, setGoogleSubmitting] = useState(false)
  const [biometricAvailable, setBiometricAvailable] = useState(false)

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

  useEffect(() => {
    // Load saved email only (no password stored for security)
    const savedEmail = getSavedEmail()
    if (savedEmail) {
      setEmail(savedEmail)
      setRememberMe(true)
    }

    // Check if biometric is enrolled
    if (isMobile && window.PublicKeyCredential) {
      const bioId = localStorage.getItem('kitabilkom_biometric_id')
      if (bioId) {
        setBiometricAvailable(true)
      }
    }
  }, [isMobile])

  // Helper for generating random buffer for WebAuthn challenge
  const randomChallenge = () => {
    const arr = new Uint8Array(32);
    window.crypto.getRandomValues(arr);
    return arr;
  }

  const registerBiometric = async () => {
    if (!window.PublicKeyCredential) return;
    try {
      const publicKey = {
        challenge: randomChallenge(),
        rp: { name: "Kitab Ilkom", id: window.location.hostname },
        user: {
          id: Uint8Array.from(email, c => c.charCodeAt(0)),
          name: email,
          displayName: email
        },
        pubKeyCredParams: [{ type: "public-key", alg: -7 }, { type: "public-key", alg: -257 }],
        authenticatorSelection: { authenticatorAttachment: "platform", userVerification: "required" },
        timeout: 60000,
        attestation: "none"
      };

      const credential = await navigator.credentials.create({ publicKey });
      if (credential) {
        // Save the rawId base64 encoded
        const credentialId = btoa(String.fromCharCode.apply(null, new Uint8Array(credential.rawId)));
        localStorage.setItem('kitabilkom_biometric_id', credentialId);
      }
    } catch (err) {
      console.warn("Biometric registration failed or cancelled:", err);
    }
  }

  const handleBiometricLogin = async () => {
    setError('')
    try {
      const bioIdBase64 = localStorage.getItem('kitabilkom_biometric_id')
      if (!bioIdBase64) return;
      
      const rawId = Uint8Array.from(atob(bioIdBase64), c => c.charCodeAt(0));
      
      const publicKey = {
        challenge: randomChallenge(),
        allowCredentials: [{
          id: rawId,
          type: 'public-key',
          transports: ['internal']
        }],
        userVerification: 'required',
        timeout: 60000
      };

      const assertion = await navigator.credentials.get({ publicKey });
      
      if (assertion) {
        // Biometric verified! Karena password tidak lagi disimpan di localStorage,
        // arahkan user untuk mengisi password secara manual (email sudah terisi otomatis).
        setSubmitting(false)
        setError('Verifikasi sidik jari berhasil! Silakan masukkan kata sandi Anda untuk melanjutkan.')
      }
    } catch (err) {
      console.warn("Biometric login failed:", err)
      // Usually NotAllowedError if they cancel the prompt
      if (err.name !== 'NotAllowedError') {
        setError('Gagal membaca sidik jari. Silakan coba lagi atau gunakan kata sandi.')
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    const { error } = await signIn({ email, password })
    
    if (error) {
      setError(error.message)
      setSubmitting(false)
      return
    }

    if (rememberMe) {
      saveEmail(email)
      // Attempt to register biometric if mobile, supported, and not yet registered
      if (isMobile && window.PublicKeyCredential && !localStorage.getItem('kitabilkom_biometric_id')) {
        await registerBiometric()
      }
    } else {
      clearSavedEmail()
      localStorage.removeItem('kitabilkom_biometric_id')
    }

    setSubmitting(false)
    navigate(from, { replace: true })
  }

  const handleGoogleLogin = async () => {
    setError('')
    setGoogleSubmitting(true)
    const { error } = await signInWithGoogle()
    if (error) {
      setError(error.message)
      setGoogleSubmitting(false)
    }
  }

  return (
    <section className="auth-section">
      <div className="auth-box">
        {/* Tombol Kembali di dalam card, pojok kiri atas */}
        <BackButton light={true} />
        <h1>Masuk ke Kitab Ilkom</h1>
        <p className="auth-subtitle">
          Gunakan email kampus kamu ({ALLOWED_EMAIL_DOMAIN}) untuk mengakses buku akademik, voting, dan fitur
          lainnya.
        </p>

        {biometricAvailable && (
          <div className="biometric-quick-login">
            <button type="button" onClick={handleBiometricLogin} className="btn-biometric">
              <Fingerprint size={28} />
              <span>Masuk Cepat dengan Sidik Jari</span>
            </button>
            <div className="biometric-divider">atau login manual</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
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
                placeholder="Kata sandi Anda"
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

          {/* Baris Ingat Saya + Lupa Password */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
            <label className="auth-checkbox" style={{ margin: 0 }}>
              <input 
                type="checkbox" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Ingat Saya</span>
            </label>
            <Link
              to="/lupa-password"
              style={{ fontSize: '0.82rem', color: 'var(--primary-600)', fontWeight: 600, textDecoration: 'none' }}
            >
              Lupa Password?
            </Link>
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="btn-primary" disabled={submitting}>
            <LogIn size={18} /> {submitting ? 'Memproses...' : 'Masuk'}
          </button>
        </form>

        <div className="auth-divider">
          <span>atau masuk melalui</span>
        </div>

        <button 
          type="button" 
          onClick={handleGoogleLogin} 
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
          Belum punya akun? <Link to="/register">Daftar di sini</Link>
        </p>
      </div>
    </section>
  )
}

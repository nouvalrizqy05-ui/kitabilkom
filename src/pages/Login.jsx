import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LogIn, Mail, Lock, Fingerprint } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { ALLOWED_EMAIL_DOMAIN } from '../lib/supabaseClient'
import BackButton from '../components/BackButton'

// Helper for simple base64 encode/decode (NOT secure encryption, just obfuscation)
const encodeData = (data) => btoa(JSON.stringify(data))
const decodeData = (str) => JSON.parse(atob(str))

export default function Login() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [biometricAvailable, setBiometricAvailable] = useState(false)

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

  useEffect(() => {
    // Load saved credentials
    const saved = localStorage.getItem('kitabilkom_saved_cred')
    if (saved) {
      try {
        const { email: savedEmail, password: savedPassword } = decodeData(saved)
        setEmail(savedEmail)
        setPassword(savedPassword)
        setRememberMe(true)
      } catch (e) {
        localStorage.removeItem('kitabilkom_saved_cred')
      }
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
        // Biometric verified! Login directly with saved credentials
        setSubmitting(true)
        const saved = localStorage.getItem('kitabilkom_saved_cred')
        if (saved) {
          const { email: savedEmail, password: savedPassword } = decodeData(saved)
          const { error: signInError } = await signIn({ email: savedEmail, password: savedPassword })
          if (signInError) {
            setError(signInError.message)
            setSubmitting(false)
            return
          }
          navigate(from, { replace: true })
        } else {
          setError('Kredensial tidak ditemukan. Silakan login manual.')
          setSubmitting(false)
        }
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
      localStorage.setItem('kitabilkom_saved_cred', encodeData({ email, password }))
      
      // Attempt to register biometric if mobile, supported, and not yet registered
      if (isMobile && window.PublicKeyCredential && !localStorage.getItem('kitabilkom_biometric_id')) {
        await registerBiometric()
      }
    } else {
      localStorage.removeItem('kitabilkom_saved_cred')
      localStorage.removeItem('kitabilkom_biometric_id')
    }

    setSubmitting(false)
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
          
          <label className="auth-checkbox">
            <input 
              type="checkbox" 
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <span>Ingat Saya (Simpan Kredensial)</span>
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

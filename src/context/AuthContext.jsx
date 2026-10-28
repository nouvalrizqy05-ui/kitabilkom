import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase, isAllowedCampusEmail, ALLOWED_EMAIL_DOMAIN } from '../lib/supabaseClient'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = useCallback(async (userId) => {
    if (!userId) {
      setProfile(null)
      return
    }
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, nama, role')
      .eq('id', userId)
      .single()

    if (error) {
      console.warn('Gagal mengambil profil, mencoba fallback profile:', error.message)
      const userMeta = session?.user?.user_metadata || {}
      const fallbackName = userMeta.full_name || userMeta.name || userMeta.nama || session?.user?.email?.split('@')[0] || 'Mahasiswa'
      setProfile({
        id: userId,
        email: session?.user?.email,
        nama: fallbackName,
        role: 'mahasiswa'
      })
    } else {
      setProfile(data)
    }
  }, [session])

  useEffect(() => {
    let isMounted = true

    // Ambil sesi yang sudah ada (kalau user refresh halaman)
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!isMounted) return
      setSession(session)
      if (session?.user) {
        await fetchProfile(session.user.id)
      }
      setLoading(false)
    })

    // Dengar perubahan auth state (login, logout, token refresh)
    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return
      setSession(session)
      if (session?.user) {
        // Untuk Google OAuth: pastikan profile ada, tapi jangan timpa nama & role yang sudah ada
        if (event === 'SIGNED_IN' && session.user.app_metadata?.provider === 'google') {
          const { data: existing } = await supabase
            .from('profiles')
            .select('id, nama, role')
            .eq('id', session.user.id)
            .maybeSingle()

          if (!existing) {
            // Cek apakah email sudah terdaftar dengan akun lain (email/password)
            // Jika ada → Supabase sudah merge jadi 1 user, jadi tidak perlu insert
            // Kalau belum ada sama sekali → buat profil baru dengan nama dari Google
            const googleName = session.user.user_metadata?.full_name
              || session.user.user_metadata?.name
              || session.user.email?.split('@')[0]
              || 'Mahasiswa'

            await supabase.from('profiles').insert({
              id: session.user.id,
              email: session.user.email,
              nama: googleName,
              role: 'mahasiswa',
            })
          }
          // Jika sudah ada → tidak lakukan apa-apa, nama & role tetap
        }

        await fetchProfile(session.user.id)
      } else {
        setProfile(null)
      }
    })


    return () => {
      isMounted = false
      listener.subscription.unsubscribe()
    }
  }, [fetchProfile])

  const signUp = async ({ email, password, nama }) => {
    if (!isAllowedCampusEmail(email)) {
      return { error: { message: `Pendaftaran hanya untuk email kampus (${ALLOWED_EMAIL_DOMAIN}).` } }
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { 
        data: { nama },
        emailRedirectTo: 'https://www.kitabilkom.online'
      },
    })
    return { data, error }
  }

  const signIn = async ({ email, password }) => {
    if (!isAllowedCampusEmail(email)) {
      return { error: { message: `Login hanya untuk email kampus (${ALLOWED_EMAIL_DOMAIN}).` } }
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    return { data, error }
  }

  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'https://www.kitabilkom.online',
        queryParams: {
          prompt: 'select_account',
          hd: 'students.unnes.ac.id'
        }
      }
    })
    return { data, error }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const value = {
    session,
    user: session?.user ?? null,
    profile,
    role: profile?.role ?? null,
    isAdmin: profile?.role === 'admin',
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    refreshProfile: () => fetchProfile(session?.user?.id),
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth harus dipakai di dalam <AuthProvider>')
  return ctx
}

import { createContext, useContext, useEffect, useState, useRef } from 'react'
import { supabase, isAllowedCampusEmail, ALLOWED_EMAIL_DOMAIN } from '../lib/supabaseClient'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const sessionRef = useRef(null)

  // fetchProfile tanpa dependency session — pakai parameter langsung
  const fetchProfile = async (userId, currentSession) => {
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
      console.warn('Gagal mengambil profil, fallback:', error.message)
      const meta = currentSession?.user?.user_metadata || {}
      setProfile({
        id: userId,
        email: currentSession?.user?.email,
        nama: meta.full_name || meta.name || meta.nama || currentSession?.user?.email?.split('@')[0] || 'Mahasiswa',
        role: 'mahasiswa'
      })
    } else {
      setProfile(data)
    }
  }

  useEffect(() => {
    let isMounted = true

    // 1. Ambil sesi awal
    supabase.auth.getSession().then(async ({ data: { session: s } }) => {
      if (!isMounted) return
      sessionRef.current = s
      setSession(s)
      if (s?.user) {
        await fetchProfile(s.user.id, s)
      }
      setLoading(false)
    })

    // 2. Dengar perubahan auth (hanya SIGNED_IN / SIGNED_OUT)
    const { data: listener } = supabase.auth.onAuthStateChange(async (event, s) => {
      if (!isMounted) return
      sessionRef.current = s
      setSession(s)

      if (s?.user) {
        // Google OAuth profile sync — hanya saat SIGNED_IN
        if (event === 'SIGNED_IN') {
          const isGoogle = s.user.identities?.some(i => i.provider === 'google')
          if (isGoogle) {
            const googleName = s.user.user_metadata?.full_name
              || s.user.user_metadata?.name
              || s.user.email?.split('@')[0]
              || 'Mahasiswa'

            const { data: existing } = await supabase
              .from('profiles')
              .select('id, role')
              .eq('id', s.user.id)
              .maybeSingle()

            if (existing) {
              await supabase.from('profiles').update({ nama: googleName }).eq('id', s.user.id)
            } else {
              await supabase.from('profiles').insert({
                id: s.user.id,
                email: s.user.email,
                nama: googleName,
                role: 'mahasiswa',
              })
            }
          }
        }

        await fetchProfile(s.user.id, s)
      } else {
        setProfile(null)
      }

      // Pastikan loading = false setelah event apapun
      setLoading(false)
    })

    return () => {
      isMounted = false
      listener.subscription.unsubscribe()
    }
  }, []) // ← TANPA dependency — effect hanya jalan sekali

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
        redirectTo: 'https://www.kitabilkom.online/auth/callback',
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
    refreshProfile: () => fetchProfile(sessionRef.current?.user?.id, sessionRef.current),
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth harus dipakai di dalam <AuthProvider>')
  return ctx
}

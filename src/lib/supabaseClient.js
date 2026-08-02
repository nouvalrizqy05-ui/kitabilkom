import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  // Sengaja throw di awal biar ketahuan dari console kalau .env belum diisi,
  // daripada error nyasar pas manggil query.
  console.error(
    'VITE_SUPABASE_URL atau VITE_SUPABASE_ANON_KEY belum di-set. Cek file .env kamu (lihat .env.example).'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Domain email kampus yang diizinkan daftar & login.
export const ALLOWED_EMAIL_DOMAIN = '@students.unnes.ac.id'

export function isAllowedCampusEmail(email) {
  if (!email) return false
  return email.trim().toLowerCase().endsWith(ALLOWED_EMAIL_DOMAIN)
}

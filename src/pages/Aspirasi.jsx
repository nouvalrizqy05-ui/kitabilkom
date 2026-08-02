import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'
import { Send, CheckCircle } from 'lucide-react'
import BackButton from '../components/BackButton'

export default function Aspirasi() {
  const { user, profile } = useAuth()
  
  const [judul, setJudul] = useState('')
  const [kategori, setKategori] = useState('Akademik')
  const [deskripsi, setDeskripsi] = useState('')
  
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!user) {
      setError('Anda harus login terlebih dahulu untuk menyampaikan aspirasi.')
      setLoading(false)
      return
    }

    try {
      const { error: dbError } = await supabase.from('aspirasi').insert([
        {
          user_email: user.email,
          nama: profile?.nama || 'Anonim',
          kategori,
          judul,
          deskripsi,
          status: 'pending'
        }
      ])

      if (dbError) throw dbError
      setSubmitted(true)
    } catch (err) {
      console.error(err)
      setError('Terjadi kesalahan saat mengirim aspirasi. Pastikan tabel aspirasi sudah dibuat di Supabase.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="page-content-section" style={{ minHeight: 'calc(100vh - 80px)', background: 'var(--gray-50)' }}>
      <BackButton />
      <div className="container" style={{ padding: '3rem 0' }}>
        <div className="auth-box" style={{ width: '100%', maxWidth: '700px', margin: '0 auto', background: 'white' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 className="admin-title">Sampaikan Aspirasi</h1>
            <p className="admin-subtitle">Suara Anda penting untuk kemajuan Ilmu Komputer UNNES.</p>
          </div>

          {submitted ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <div style={{ width: '64px', height: '64px', background: 'var(--green-100)', color: 'var(--green-600)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                <CheckCircle size={32} />
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--navy-900)', marginBottom: '1rem' }}>Aspirasi Berhasil Dikirim!</h2>
              <p style={{ color: 'var(--gray-600)', marginBottom: '2rem' }}>Terima kasih telah menyampaikan aspirasi Anda. Divisi Sinergi akan segera menindaklanjuti laporan ini.</p>
              <button onClick={() => { setSubmitted(false); setJudul(''); setDeskripsi(''); }} className="btn-primary" style={{ display: 'inline-flex', padding: '0.8rem 2rem' }}>
                Kirim Aspirasi Lainnya
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="auth-form">
              {error && <div style={{ padding: '1rem', background: '#fee2e2', color: '#991b1b', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}
              
              <label className="auth-field">
                <span>Kategori Aspirasi</span>
                <select value={kategori} onChange={(e) => setKategori(e.target.value)} required style={{ background: 'white', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-lg)', padding: '0.8rem 1rem', width: '100%', outline: 'none' }}>
                  <option value="Akademik">Akademik & Perkuliahan</option>
                  <option value="Fasilitas">Fasilitas & Sarpras</option>
                  <option value="Administrasi">Layanan Administrasi</option>
                  <option value="Kemahasiswaan">Kegiatan Kemahasiswaan</option>
                  <option value="Lain-lain">Lain-lain</option>
                </select>
              </label>

              <label className="auth-field">
                <span>Judul Keluhan / Saran</span>
                <input
                  type="text"
                  required
                  placeholder="Misal: AC Ruang D14 Rusak"
                  value={judul}
                  onChange={(e) => setJudul(e.target.value)}
                />
              </label>

              <label className="auth-field">
                <span>Deskripsi Detail</span>
                <textarea
                  required
                  rows="6"
                  placeholder="Ceritakan secara detail mengenai masalah yang Anda hadapi atau saran yang ingin Anda sampaikan..."
                  value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
                  style={{ width: '100%', padding: '1rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-200)', outline: 'none', resize: 'vertical', fontFamily: 'inherit' }}
                ></textarea>
              </label>

              <div style={{ padding: '1rem', background: 'var(--blue-50)', color: 'var(--blue-800)', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
                <strong>Catatan:</strong> Aspirasi Anda akan dikirimkan dengan identitas <strong>{profile?.nama || user?.email || 'Anonim'}</strong>. Jika Anda belum login, silakan login terlebih dahulu.
              </div>

              <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', padding: '1rem' }}>
                {loading ? 'Mengirim...' : <><Send size={18} /> Kirim Aspirasi Sekarang</>}
              </button>
            </form>
          )}

        </div>
      </div>
    </section>
  )
}

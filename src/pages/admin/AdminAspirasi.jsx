import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { CheckCircle, Clock, Trash2, MessageSquare } from 'lucide-react'

export default function AdminAspirasi() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('aspirasi').select('*').order('created_at', { ascending: false })
    if (error) console.error(error)
    setItems(data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const handleUpdateStatus = async (id, newStatus) => {
    const { error } = await supabase.from('aspirasi').update({ status: newStatus }).eq('id', id)
    if (error) alert('Gagal update status: ' + error.message)
    else load()
  }

  const handleDelete = async (id) => {
    if (!confirm('Yakin ingin menghapus aspirasi ini?')) return
    const { error } = await supabase.from('aspirasi').delete().eq('id', id)
    if (error) alert('Gagal menghapus: ' + error.message)
    else load()
  }

  return (
    <div>
      <div className="admin-panel-header">
        <h2>Kelola Aspirasi Mahasiswa ({items.length})</h2>
      </div>

      {loading ? (
        <p className="empty-state">Memuat...</p>
      ) : items.length === 0 ? (
        <div className="empty-state" style={{ padding: '3rem', textAlign: 'center' }}>
          <MessageSquare size={48} style={{ color: 'var(--gray-300)', margin: '0 auto 1rem' }} />
          <p>Belum ada aspirasi yang masuk.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {items.map((item) => (
            <div key={item.id} style={{ background: 'white', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{ display: 'inline-block', padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, background: 'var(--purple-100)', color: 'var(--purple-700)', marginBottom: '0.5rem' }}>
                    {item.kategori}
                  </span>
                  <h3 style={{ fontSize: '1.1rem', color: 'var(--navy-900)', marginBottom: '0.2rem' }}>{item.judul}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>
                    Dari: <strong>{item.nama}</strong> ({item.user_email}) &bull; {new Date(item.created_at).toLocaleDateString('id-ID')}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {item.status === 'pending' ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', fontWeight: 600, color: 'var(--orange-600)', background: 'var(--orange-100)', padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-md)' }}>
                      <Clock size={14} /> Menunggu
                    </span>
                  ) : (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', fontWeight: 600, color: 'var(--green-600)', background: 'var(--green-100)', padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-md)' }}>
                      <CheckCircle size={14} /> Selesai
                    </span>
                  )}
                </div>
              </div>

              <div style={{ background: 'var(--gray-50)', padding: '1rem', borderRadius: 'var(--radius-md)', fontSize: '0.9rem', color: 'var(--gray-700)', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                {item.deskripsi}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', borderTop: '1px solid var(--gray-100)', paddingTop: '1rem' }}>
                {item.status === 'pending' ? (
                  <button onClick={() => handleUpdateStatus(item.id, 'selesai')} className="btn-primary-small" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <CheckCircle size={14} /> Tandai Selesai
                  </button>
                ) : (
                  <button onClick={() => handleUpdateStatus(item.id, 'pending')} className="btn-secondary-small" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Clock size={14} /> Tandai Menunggu
                  </button>
                )}
                <button onClick={() => handleDelete(item.id)} className="btn-secondary-small" style={{ color: 'var(--red-600)', borderColor: 'var(--red-200)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Trash2 size={14} /> Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

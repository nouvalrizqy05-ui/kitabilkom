import { useEffect, useState, useRef } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { CheckCircle, Clock, Trash2, MessageSquare, Eye, X, Send, Paperclip, User } from 'lucide-react'

export default function AdminAspirasi() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  // Discussion state
  const [activeTicket, setActiveTicket] = useState(null)
  const [discussionInput, setDiscussionInput] = useState('')
  const discussionEndRef = useRef(null)

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

  useEffect(() => {
    if (discussionEndRef.current) {
      discussionEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [activeTicket?.discussion])

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

  const handleSendDiscussion = async (e) => {
    e.preventDefault()
    if (!discussionInput.trim() || !activeTicket) return

    const newMsg = {
      sender: 'admin',
      name: 'CS-17 Admisi',
      text: discussionInput,
      timestamp: new Date().toISOString()
    }

    const currentDisc = activeTicket.discussion || []
    const updatedDisc = [...currentDisc, newMsg]

    setActiveTicket({ ...activeTicket, discussion: updatedDisc })
    setDiscussionInput('')

    try {
      await supabase.from('aspirasi').update({ discussion: updatedDisc }).eq('id', activeTicket.id)
      load() // refresh list in background
    } catch (err) {
      console.error('Failed to send discussion', err)
    }
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
          <MessageSquare size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem' }} />
          <p>Belum ada aspirasi yang masuk.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {items.map((item) => (
            <div key={item.id} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{ display: 'inline-block', padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, background: 'var(--purple-100)', color: 'var(--purple-700)', marginBottom: '0.5rem' }}>
                    {item.kategori}
                  </span>
                  <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>{item.judul}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
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

              <div style={{ background: 'var(--bg-base)', padding: '1rem', borderRadius: 'var(--radius-md)', fontSize: '0.9rem', color: 'var(--text-primary)', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                {item.deskripsi}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                <button onClick={() => setActiveTicket(item)} className="btn-primary-small" style={{ background: 'var(--gold-600)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Eye size={14} /> Diskusi ({item.discussion?.length || 0})
                </button>
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

      {/* Discussion Modal */}
      {activeTicket && (
        <div className="helpdesk-modal-overlay">
          <div className="discussion-container" style={{ width: '600px', maxWidth: '95%', height: '80vh', position: 'relative' }}>
            <div className="discussion-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button onClick={() => setActiveTicket(null)} className="btn-icon"><X size={20}/></button>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Discussion (#{activeTicket.id.toString().substring(0,5).toUpperCase()})</h3>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{activeTicket.judul}</div>
                </div>
              </div>
            </div>
            <div className="discussion-body">
              
              <div className="discussion-message user">
                <div className="discussion-avatar"><User size={20} color="#999"/></div>
                <div className="discussion-content">
                  <div className="discussion-sender">
                    <span>{activeTicket.nama || 'Mahasiswa'}</span>
                    <span className="discussion-time">{new Date(activeTicket.created_at).toLocaleDateString('id-ID')}</span>
                  </div>
                  <div className="discussion-text user">
                    <strong>{activeTicket.judul}</strong><br/>
                    {activeTicket.deskripsi}
                  </div>
                </div>
              </div>

              {(activeTicket.discussion || []).map((msg, i) => (
                <div key={i} className={`discussion-message ${msg.sender === 'admin' ? 'agent' : 'user'}`}>
                  <div className="discussion-avatar">
                    {msg.sender === 'admin' ? <span style={{fontSize:'1.2rem'}}>🎧</span> : <User size={20} color="#999"/>}
                  </div>
                  <div className="discussion-content">
                    <div className="discussion-sender">
                      <span>{msg.name || (msg.sender === 'admin' ? 'CS-17 Admisi' : 'Mahasiswa')}</span>
                      <span className="discussion-time">{new Date(msg.timestamp).toLocaleString('id-ID')}</span>
                    </div>
                    <div className={`discussion-text ${msg.sender === 'admin' ? '' : 'user'}`} style={{ whiteSpace: 'pre-line' }}>
                      {msg.text}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={discussionEndRef} />
            </div>
            
            <form className="discussion-input-area" onSubmit={handleSendDiscussion}>
              <button type="button" className="btn-icon"><Paperclip size={20}/></button>
              <textarea 
                className="discussion-textarea" 
                placeholder="Ketik balasan Anda (sebagai Admin)..."
                value={discussionInput}
                onChange={(e) => setDiscussionInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendDiscussion(e);
                  }
                }}
                rows="1"
              ></textarea>
              <button type="submit" className="btn-icon" style={{ color: 'var(--gold-600)' }}><Send size={20}/></button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

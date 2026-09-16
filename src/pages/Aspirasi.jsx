import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'
import { Send, CheckCircle, Ticket, User, Home, Settings, Eye, Star, Plus, X, Paperclip } from 'lucide-react'

export default function Aspirasi() {
  const { user, profile } = useAuth()
  
  // flow: 'dashboard' | 'chat' | 'form'
  const [flow, setFlow] = useState('dashboard')
  
  // Dashboard state
  const [tickets, setTickets] = useState([])
  const [loadingTickets, setLoadingTickets] = useState(true)
  const [showAlert, setShowAlert] = useState(true)

  // Chat state
  const [messages, setMessages] = useState([])
  const [chatStep, setChatStep] = useState(0)
  const [chatInput, setChatInput] = useState('')
  const [userData, setUserData] = useState({ nama: '', role: '', nim: '' })
  const [generatedToken, setGeneratedToken] = useState('')
  const chatEndRef = useRef(null)

  // Token Modal state
  const [showTokenModal, setShowTokenModal] = useState(false)
  const [selectedToken, setSelectedToken] = useState('')

  // Form state
  const [judul, setJudul] = useState('')
  const [deskripsi, setDeskripsi] = useState('')
  const [loadingSubmit, setLoadingSubmit] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // Rating & Discussion state
  const [showRatingModal, setShowRatingModal] = useState(false)
  const [ratingTargetId, setRatingTargetId] = useState(null)
  const [activeTicket, setActiveTicket] = useState(null)
  const [discussionInput, setDiscussionInput] = useState('')
  const discussionEndRef = useRef(null)

  useEffect(() => {
    if (discussionEndRef.current) {
      discussionEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [activeTicket?.discussion])

  useEffect(() => {
    fetchTickets()
  }, [user])

  useEffect(() => {
    const channel = supabase
      .channel('realtime_aspirasi_user')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'aspirasi' }, (payload) => {
        setTickets(prev => prev.map(t => t.id === payload.new.id ? payload.new : t))
        setActiveTicket(prev => prev?.id === payload.new.id ? payload.new : prev)
      })
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [messages])

  const fetchTickets = async () => {
    if (!user) {
      setLoadingTickets(false)
      return
    }
    try {
      const { data, error } = await supabase
        .from('aspirasi')
        .select('*')
        .eq('user_email', user.email)
        .order('created_at', { ascending: false })
      
      if (!error && data) {
        setTickets(data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingTickets(false)
    }
  }

  const startChat = () => {
    setFlow('chat')
    setMessages([
      { sender: 'agent', text: 'Ok kak, mohon isikan nama lengkapnya yaa!' }
    ])
    setChatStep(1)
  }

  const handleChatSubmit = (e) => {
    if (e) e.preventDefault()
    if (!chatInput.trim() && chatStep !== 4) return

    const newMsgs = [...messages, { sender: 'user', text: chatInput }]
    setMessages(newMsgs)
    setChatInput('')

    setTimeout(() => {
      if (chatStep === 1) {
        setUserData({ ...userData, nama: newMsgs[newMsgs.length-1].text })
        setMessages(prev => [...prev, { sender: 'agent', text: 'Hai kak ' + newMsgs[newMsgs.length-1].text + ', pilih kategori pelanggan dulu ya', options: ['Mahasiswa', 'Dosen', 'Umum'] }])
        setChatStep(2)
      } else if (chatStep === 3) {
        const nim = newMsgs[newMsgs.length-1].text
        setUserData(prev => {
          const newData = { ...prev, nim }
          setMessages(msgPrev => [...msgPrev, { 
            sender: 'agent', 
            text: 'Identitas ditemukan dengan data:\n\nNama: ' + newData.nama + '\nRole: ' + newData.role + '\nIdentitas: ' + nim + '\nEmail: ' + (user?.email || 'Guest') + '\n\nApakah data sudah benar kak?',
            options: ['Ya, Data Sudah Benar']
          }])
          return newData
        })
        setChatStep(4)
      }
    }, 500)
  }

  const handleOptionClick = (option) => {
    const newMsgs = [...messages, { sender: 'user', text: option }]
    setMessages(newMsgs)

    setTimeout(() => {
      if (chatStep === 2) {
        setUserData({ ...userData, role: option })
        setMessages(prev => [...prev, { sender: 'agent', text: 'Boleh dibantu tuliskan NIM/Identitas-nya kak ' + userData.nama + '? Pastikan valid ya kak, karena digunakan untuk tracking nomor tiket' }])
        setChatStep(3)
      } else if (chatStep === 4) {
        const token = Math.random().toString(36).substring(2, 7).toUpperCase()
        setGeneratedToken(token)
        setMessages(prev => [...prev, { sender: 'agent', text: 'Terima kasih! Kode tiket Anda berhasil dibuat: **' + token + '**.\n\nSilakan kembali ke Dashboard dan masukkan token tersebut untuk melanjutkan pengisian form.' }])
        setChatStep(5)
      }
    }, 500)
  }

  const handleDashboardReturn = () => {
    setFlow('dashboard')
    if (generatedToken) {
      setShowTokenModal(true)
      setSelectedToken(generatedToken)
    }
  }

  const handleTokenSubmit = () => {
    setShowTokenModal(false)
    setFlow('form')
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    setLoadingSubmit(true)
    try {
      const { error } = await supabase.from('aspirasi').insert([
        {
          user_email: user?.email || 'guest@system.com',
          nama: userData.nama || profile?.nama || 'Anonim',
          kategori: userData.role || 'Mahasiswa',
          judul,
          deskripsi,
          status: 'pending'
        }
      ])
      if (error) throw error
      setSubmitted(true)
      fetchTickets() // refresh
    } catch (err) {
      console.error(err)
      alert('Gagal mengirim aspirasi')
    } finally {
      setLoadingSubmit(false)
    }
  }

  const resetAll = () => {
    setFlow('dashboard')
    setSubmitted(false)
    setJudul('')
    setDeskripsi('')
    setGeneratedToken('')
    setChatStep(0)
    setMessages([])
  }

  const handleRate = async (val) => {
    if (!ratingTargetId) return
    try {
      await supabase.from('aspirasi').update({ rating: val }).eq('id', ratingTargetId)
      setShowRatingModal(false)
      fetchTickets()
    } catch (e) {
      console.error(e)
    }
  }

  const calculateResponseTime = (ticket) => {
    if (!ticket.discussion || !Array.isArray(ticket.discussion)) return 'Belum ditanggapi'
    const adminReply = ticket.discussion.find(msg => msg.sender === 'admin')
    if (!adminReply) return 'Belum ditanggapi'
    
    const start = new Date(ticket.created_at)
    const end = new Date(adminReply.timestamp)
    const diffMs = end - start
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 1) return '< 1 menit setelahnya'
    if (diffMins < 60) return diffMins + ' menit setelahnya'
    const diffHours = Math.floor(diffMins / 60)
    return diffHours + ' jam setelahnya'
  }

  const renderStars = (rating) => {
    const val = rating || 0
    return [1,2,3,4,5].map(n => <Star key={n} size={12} fill={n <= val ? "#ffc107" : "transparent"} color={n <= val ? "#ffc107" : "#ccc"}/>)
  }

  const openDiscussion = (t) => {
    setActiveTicket(t)
    setFlow('discussion')
  }

  const handleSendDiscussion = async (e) => {
    e.preventDefault()
    if (!discussionInput.trim() || !activeTicket) return

    const newMsg = {
      sender: 'user',
      name: profile?.nama || user?.email?.split('@')[0] || 'Mahasiswa',
      text: discussionInput,
      timestamp: new Date().toISOString()
    }

    const currentDisc = activeTicket.discussion || []
    const updatedDisc = [...currentDisc, newMsg]

    setActiveTicket({ ...activeTicket, discussion: updatedDisc })
    setDiscussionInput('')

    try {
      await supabase.from('aspirasi').update({ discussion: updatedDisc }).eq('id', activeTicket.id)
      fetchTickets()
    } catch (err) {
      console.error('Failed to send discussion', err)
    }
  }

  return (
    <div className="helpdesk-layout">
      {/* MAIN CONTENT FULL WIDTH */}
      <div className="helpdesk-main" style={{ margin: '0 auto', maxWidth: '1200px' }}>
        {/* Top Navbar Header */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
          <Home size={20} color="#666" />
          <Settings size={20} color="#666" />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#666', fontSize: '0.9rem' }}>
            {userData.role || 'Mahasiswa'} () <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><User size={16} /></div> {userData.nama || profile?.nama || user?.email?.split('@')[0] || 'GUEST'}
          </div>
        </div>

        <div className="helpdesk-header">
          <h1>Tickets</h1>
        </div>

        {flow === 'dashboard' && (
          <>
            {showAlert && (
              <div className="helpdesk-alert">
                <h4>Penting!</h4>
                <p>Tiket akan otomatis ditutup jika tidak ada tanggapan dalam waktu 1 minggu setelah balasan terakhir dari Operator atau Layanan Pelanggan (CS).</p>
                <button onClick={() => setShowAlert(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: '#00838f' }}><X size={18}/></button>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
              <button className="btn-purple" onClick={startChat}>
                <Plus size={16} /> Tambah Tickets
              </button>
            </div>

            <div className="helpdesk-table-container">
              <div className="helpdesk-table-header-row">
                <h3 style={{ margin: 0, fontSize: '1rem', color: '#333' }}>Daftar Tickets<br/><span style={{ fontSize: '0.8rem', color: '#888', fontWeight: 'normal' }}>Manajemen data Tickets</span></h3>
              </div>
              <table className="helpdesk-table">
                <thead>
                  <tr>
                    <th>Nomor Ticket</th>
                    <th>Topic</th>
                    <th>Uraian</th>
                    <th>Taken By</th>
                    <th>Time Taken</th>
                    <th>Status</th>
                    <th>Rating</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingTickets ? (
                    <tr><td colSpan="8" style={{ textAlign: 'center' }}>Memuat tiket...</td></tr>
                  ) : tickets.length === 0 ? (
                    <tr><td colSpan="8" style={{ textAlign: 'center', padding: '3rem 1rem' }}>Belum ada tiket yang diajukan.</td></tr>
                  ) : (
                    tickets.map((t) => (
                      <tr key={t.id}>
                        <td className="ticket-id">#{t.id.toString().substring(0,5).toUpperCase()}</td>
                        <td>{t.judul}</td>
                        <td style={{ maxWidth: '300px' }}>{t.deskripsi}</td>
                        <td>CS<br/><span style={{fontSize:'0.7rem', color:'var(--text-secondary)'}}>{calculateResponseTime(t)}</span></td>
                        <td>&lt; 1 menit</td>
                        <td><span className="ticket-status">{t.status}</span></td>
                        <td style={{ display: 'flex', gap: '2px', alignItems: 'center', height: '100%', paddingTop: '1.2rem' }}>
                          {renderStars(t.rating)}
                        </td>
                        <td>
                          <button onClick={() => openDiscussion(t)} style={{ padding: '0.3rem', marginRight: '0.3rem', border: '1px solid #ddd', background: '#f5f5f5', borderRadius: '4px', cursor: 'pointer' }} title="Diskusi"><Eye size={14}/></button>
                          <button onClick={() => { setRatingTargetId(t.id); setShowRatingModal(true) }} style={{ padding: '0.3rem', border: '1px solid #ddd', background: '#f5f5f5', borderRadius: '4px', cursor: 'pointer' }} title="Beri Rating"><Star size={14}/></button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Token Modal */}
            {showTokenModal && (
              <div className="helpdesk-modal-overlay">
                <div className="helpdesk-modal">
                  <div className="helpdesk-modal-header">
                    Nomor Tiket <button onClick={() => setShowTokenModal(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><X size={18}/></button>
                  </div>
                  <div className="helpdesk-modal-body">
                    <label style={{ display: 'block', fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' }}>Token</label>
                    <select value={selectedToken} onChange={(e) => setSelectedToken(e.target.value)} style={{ width: '100%', padding: '0.6rem', border: '1px solid #ccc', borderRadius: '4px' }}>
                      {generatedToken && <option value={generatedToken}>{generatedToken}</option>}
                    </select>
                  </div>
                  <div className="helpdesk-modal-footer">
                    <button onClick={handleTokenSubmit} style={{ background: '#7e57c2', color: 'white', border: 'none', padding: '0.5rem 1.5rem', borderRadius: '4px', cursor: 'pointer' }}>OK</button>
                    <button onClick={() => setShowTokenModal(false)} style={{ background: '#757575', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>Close</button>
                  </div>
                </div>
              </div>
            )}

            {/* Rating Modal */}
            {showRatingModal && (
              <div className="helpdesk-modal-overlay">
                <div className="helpdesk-modal" style={{ width: '300px', textAlign: 'center' }}>
                  <div className="helpdesk-modal-header" style={{ background: '#ff9800' }}>
                    Beri Rating <button onClick={() => setShowRatingModal(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><X size={18}/></button>
                  </div>
                  <div className="helpdesk-modal-body">
                    <p style={{ marginBottom: '1rem', color: '#666' }}>Berapa bintang untuk layanan ini?</p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                      {[1,2,3,4,5].map(n => (
                        <button key={n} onClick={() => handleRate(n)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                          <Star size={24} fill="#ffc107" color="#ffc107" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {flow === 'chat' && (
          <div className="chat-container">
            <div className="chat-header">
              <button onClick={handleDashboardReturn} style={{ background: 'none', border: 'none', cursor: 'pointer', marginRight: '1rem', color: '#666' }}>Kembali</button>
              Pembuatan Tiket Bantuan
            </div>
            <div className="chat-messages">
              <div className="chat-bubble-wrapper right">
                <div className="chat-meta"><span>{userData.nama || 'Guest'}</span><span>Baru saja</span></div>
                <div className="chat-bubble right">Buat Tiket</div>
              </div>

              {messages.map((m, i) => (
                <div key={i} className={`chat-bubble-wrapper ${m.sender === 'user' ? 'right' : 'left'}`}>
                  <div className="chat-meta">
                    {m.sender === 'agent' ? <span>Agnes (Agent)</span> : <span>{userData.nama || 'Anda'}</span>}
                  </div>
                  <div className={`chat-bubble ${m.sender === 'user' ? 'right' : 'left'}`} style={{ whiteSpace: 'pre-line' }}>
                    {m.text}
                  </div>
                  {m.options && (
                    <div className="chat-options">
                      {m.options.map((opt, idx) => (
                        <button key={idx} className="chat-btn-option" onClick={() => handleOptionClick(opt)}>{opt}</button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            {chatStep === 5 ? (
               <div className="chat-input-area" style={{ justifyContent: 'center' }}>
                 <button className="btn-purple" onClick={handleDashboardReturn}>Selesai & Lanjut Isi Form</button>
               </div>
            ) : (
              <form className="chat-input-area" onSubmit={handleChatSubmit}>
                <input 
                  type="text" 
                  className="chat-input" 
                  placeholder={chatStep === 2 || chatStep === 4 ? "Pilih opsi di atas..." : "Ketik balasan Anda..."} 
                  value={chatInput} 
                  onChange={(e) => setChatInput(e.target.value)}
                  disabled={chatStep === 2 || chatStep === 4}
                />
                <button type="submit" style={{ background: 'none', border: 'none', color: '#1a73e8', cursor: 'pointer' }} disabled={chatStep === 2 || chatStep === 4}><Send size={24} /></button>
              </form>
            )}
          </div>
        )}

        {flow === 'discussion' && activeTicket && (
          <div className="discussion-container">
            <div className="discussion-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button onClick={() => setFlow('dashboard')} className="btn-icon"><X size={20}/></button>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Discussion (#{activeTicket.id.toString().substring(0,5).toUpperCase()})</h3>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{activeTicket.judul}</div>
                </div>
              </div>
            </div>
            <div className="discussion-body">
              
              {/* Initial Ticket Description as first message */}
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

              {/* Loop thru discussion JSON */}
              {(activeTicket.discussion || []).map((msg, i) => (
                <div key={i} className={`discussion-message ${msg.sender === 'admin' ? 'agent' : 'user'}`}>
                  <div className="discussion-avatar">
                    {msg.sender === 'admin' ? <span style={{fontSize:'1.2rem'}}>🎧</span> : <User size={20} color="#999"/>}
                  </div>
                  <div className="discussion-content">
                    <div className="discussion-sender">
                      <span>{msg.sender === 'admin' ? 'CS ADMIN' : msg.name || 'Mahasiswa'}</span>
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
                placeholder="Ketik balasan Anda..."
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
        )}

        {flow === 'form' && (
          <div className="auth-box" style={{ width: '100%', maxWidth: '700px', margin: '0 auto', background: 'var(--bg-surface)', padding: '2rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <h2 style={{ color: 'var(--text-primary)' }}>Formulir Detail Tiket #{selectedToken}</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Silakan lengkapi detail permasalahan Anda.</p>
            </div>

            {submitted ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <div style={{ width: '64px', height: '64px', background: '#e8f5e9', color: '#4caf50', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                  <CheckCircle size={32} />
                </div>
                <h3 style={{ color: '#333' }}>Tiket Berhasil Dikirim!</h3>
                <p style={{ color: '#666', marginBottom: '2rem' }}>Tim Helpdesk akan segera merespons tiket Anda.</p>
                <button onClick={resetAll} className="btn-purple">Kembali ke Dashboard</button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem', color: '#333', fontWeight: 600 }}>
                  Topik
                  <input
                    type="text"
                    required
                    style={{ padding: '0.8rem', border: '1px solid #ccc', borderRadius: '4px' }}
                    placeholder="Contoh: Permasalahan Kemahasiswaan / Error Sistem"
                    value={judul}
                    onChange={(e) => setJudul(e.target.value)}
                  />
                </label>

                <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem', color: '#333', fontWeight: 600 }}>
                  Uraian Masalah
                  <textarea
                    required
                    rows="6"
                    style={{ padding: '0.8rem', border: '1px solid #ccc', borderRadius: '4px', resize: 'vertical' }}
                    placeholder="Ceritakan secara detail mengenai masalah yang Anda hadapi..."
                    value={deskripsi}
                    onChange={(e) => setDeskripsi(e.target.value)}
                  ></textarea>
                </label>

                <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem', color: '#333', fontWeight: 600 }}>
                  Upload File (png/jpg/pdf)
                  <input
                    type="file"
                    accept=".png,.jpg,.jpeg,.pdf"
                    style={{ padding: '0.8rem', border: '1px solid #ccc', borderRadius: '4px', background: '#f9f9f9' }}
                  />
                </label>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button type="submit" className="btn-purple" disabled={loadingSubmit} style={{ flex: 1, justifyContent: 'center' }}>
                    {loadingSubmit ? 'Mengirim...' : 'Submit Tiket'}
                  </button>
                  <button type="button" onClick={() => setFlow('dashboard')} style={{ padding: '0.8rem 1.5rem', border: '1px solid #ccc', borderRadius: '4px', background: 'white', cursor: 'pointer' }}>Batal</button>
                </div>
              </form>
            )}
          </div>
        )}

      </div>
    </div>
  )
}

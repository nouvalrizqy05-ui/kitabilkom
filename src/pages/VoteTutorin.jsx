import { useCallback, useEffect, useState } from 'react'
import { CheckCircle2, Clock, UserCircle2 } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'
import BackButton from '../components/BackButton'

export default function VoteTutorin() {
  const { user } = useAuth()
  const [event, setEvent] = useState(null)
  const [candidates, setCandidates] = useState([])
  const [myVote, setMyVote] = useState(null) // candidate_id yang sudah dipilih user, kalau ada
  const [loading, setLoading] = useState(true)
  const [votingId, setVotingId] = useState(null)
  const [error, setError] = useState('')

  const loadData = useCallback(async () => {
    setLoading(true)
    setError('')

    const { data: activeEvent, error: eventError } = await supabase
      .from('vote_events')
      .select('id, judul, deadline, status')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (eventError) {
      setError(eventError.message)
      setLoading(false)
      return
    }

    if (!activeEvent) {
      setEvent(null)
      setCandidates([])
      setLoading(false)
      return
    }

    setEvent(activeEvent)

    const { data: candidateData } = await supabase
      .from('vote_candidates')
      .select('id, nama, angkatan, quote, foto_url')
      .eq('event_id', activeEvent.id)

    setCandidates(candidateData ?? [])

    if (user) {
      const { data: existingVote } = await supabase
        .from('votes')
        .select('candidate_id')
        .eq('event_id', activeEvent.id)
        .eq('user_id', user.id)
        .maybeSingle()
      setMyVote(existingVote?.candidate_id ?? null)
    }

    setLoading(false)
  }, [user])

  useEffect(() => {
    loadData()
  }, [loadData])

  const isDeadlinePassed = event?.deadline ? new Date(event.deadline) < new Date() : false
  const canVote = event && !myVote && !isDeadlinePassed

  const handleVote = async (candidateId) => {
    if (!canVote) return
    setVotingId(candidateId)
    setError('')
    const { error } = await supabase.from('votes').insert({
      event_id: event.id,
      candidate_id: candidateId,
      user_id: user.id,
    })
    setVotingId(null)
    if (error) {
      setError('Gagal mengirim vote: ' + error.message)
      return
    }
    setMyVote(candidateId)
  }

  return (
    <>
      <section className="page-header">
        <BackButton />
        <div className="container">
          <h1 className="page-title">Vote Tutorin Maba</h1>
          <p className="page-subtitle">Tentukan pilihanmu untuk asisten mahasiswa baru angkatan ini.</p>
        </div>
      </section>

      <section className="page-content">
        <div className="container">

        {loading ? (
          <p className="empty-state">Memuat data voting...</p>
        ) : !event ? (
          <p className="empty-state">Belum ada sesi voting yang sedang aktif saat ini.</p>
        ) : (
          <>
            <div className="vote-status-bar">
              <h2>{event.judul}</h2>
              {event.deadline && (
                <span className={`vote-deadline ${isDeadlinePassed ? 'closed' : ''}`}>
                  <Clock size={16} />
                  {isDeadlinePassed
                    ? 'Voting sudah ditutup'
                    : `Batas waktu: ${new Date(event.deadline).toLocaleString('id-ID')}`}
                </span>
              )}
            </div>

            {myVote && (
              <p className="vote-already-voted">
                <CheckCircle2 size={18} /> Kamu sudah memberikan suara pada sesi ini. Terima kasih!
              </p>
            )}
            {error && <p className="auth-error">{error}</p>}

            <div className="cards-grid">
              {candidates.map((c) => (
                <div className="card-3d card-center" key={c.id}>
                  <div className="candidate-avatar">
                    {c.foto_url ? <img src={c.foto_url} alt={c.nama} /> : <UserCircle2 size={64} />}
                  </div>
                  <h3 className="card-title">{c.nama}</h3>
                  <p className="card-meta">Angkatan {c.angkatan}</p>
                  {c.quote && <p className="candidate-quote">"{c.quote}"</p>}
                  <button
                    className={`btn-primary-small full-width ${myVote === c.id ? 'is-selected' : ''}`}
                    onClick={() => handleVote(c.id)}
                    disabled={!canVote || votingId === c.id}
                  >
                    {myVote === c.id
                      ? 'Pilihanmu ✓'
                      : votingId === c.id
                      ? 'Mengirim...'
                      : 'Vote Kandidat'}
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
        </div>
      </section>
    </>
  )
}

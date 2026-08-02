import { useEffect, useState } from 'react'
import { Pencil, Trash2, Plus, ChevronLeft } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../context/AuthContext'
import Modal from '../../components/Modal'

const STATUS_OPTIONS = ['draft', 'active', 'closed']
const emptyEventForm = { judul: '', deadline: '', status: 'draft' }
const emptyCandidateForm = { nama: '', angkatan: '', quote: '', foto: null }

export default function AdminVote() {
  const { user } = useAuth()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [eventModalOpen, setEventModalOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const [eventForm, setEventForm] = useState(emptyEventForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [selectedEvent, setSelectedEvent] = useState(null)
  const [candidates, setCandidates] = useState([])
  const [voteCounts, setVoteCounts] = useState({})
  const [candidateModalOpen, setCandidateModalOpen] = useState(false)
  const [editingCandidate, setEditingCandidate] = useState(null)
  const [candidateForm, setCandidateForm] = useState(emptyCandidateForm)

  const loadEvents = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('vote_events').select('*').order('created_at', { ascending: false })
    if (error) console.error(error)
    setEvents(data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    loadEvents()
  }, [])

  const loadCandidates = async (eventId) => {
    const { data: candidateData } = await supabase
      .from('vote_candidates')
      .select('*')
      .eq('event_id', eventId)
    setCandidates(candidateData ?? [])

    const { data: voteRows } = await supabase.from('votes').select('candidate_id').eq('event_id', eventId)
    const counts = {}
    for (const row of voteRows ?? []) {
      counts[row.candidate_id] = (counts[row.candidate_id] ?? 0) + 1
    }
    setVoteCounts(counts)
  }

  const openEventDetail = async (event) => {
    setSelectedEvent(event)
    await loadCandidates(event.id)
  }

  // ---- Event CRUD ----
  const openCreateEvent = () => {
    setEditingEvent(null)
    setEventForm(emptyEventForm)
    setError('')
    setEventModalOpen(true)
  }

  const openEditEvent = (event) => {
    setEditingEvent(event)
    setEventForm({
      judul: event.judul || '',
      deadline: event.deadline ? event.deadline.slice(0, 16) : '',
      status: event.status || 'draft',
    })
    setError('')
    setEventModalOpen(true)
  }

  const handleDeleteEvent = async (event) => {
    if (!confirm(`Hapus sesi voting "${event.judul}"? Semua kandidat dan suara ikut terhapus.`)) return
    const { error } = await supabase.from('vote_events').delete().eq('id', event.id)
    if (error) {
      alert('Gagal menghapus: ' + error.message)
      return
    }
    if (selectedEvent?.id === event.id) setSelectedEvent(null)
    loadEvents()
  }

  const handleSubmitEvent = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    const payload = {
      judul: eventForm.judul,
      deadline: eventForm.deadline ? new Date(eventForm.deadline).toISOString() : null,
      status: eventForm.status,
    }

    const query = editingEvent
      ? supabase.from('vote_events').update(payload).eq('id', editingEvent.id)
      : supabase.from('vote_events').insert({ ...payload, created_by: user.id })

    const { error: saveError } = await query
    setSaving(false)

    if (saveError) {
      setError('Gagal menyimpan: ' + saveError.message)
      return
    }

    setEventModalOpen(false)
    loadEvents()
  }

  // ---- Candidate CRUD ----
  const openCreateCandidate = () => {
    setEditingCandidate(null)
    setCandidateForm(emptyCandidateForm)
    setError('')
    setCandidateModalOpen(true)
  }

  const openEditCandidate = (candidate) => {
    setEditingCandidate(candidate)
    setCandidateForm({
      nama: candidate.nama || '',
      angkatan: candidate.angkatan || '',
      quote: candidate.quote || '',
      foto: null,
    })
    setError('')
    setCandidateModalOpen(true)
  }

  const handleDeleteCandidate = async (candidate) => {
    if (!confirm(`Hapus kandidat "${candidate.nama}"?`)) return
    const { error } = await supabase.from('vote_candidates').delete().eq('id', candidate.id)
    if (error) {
      alert('Gagal menghapus: ' + error.message)
      return
    }
    loadCandidates(selectedEvent.id)
  }

  const handleSubmitCandidate = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    let foto_url = editingCandidate?.foto_url ?? null

    if (candidateForm.foto) {
      const ext = candidateForm.foto.name.split('.').pop()
      const path = `kandidat/${crypto.randomUUID()}.${ext}`
      const { error: uploadError } = await supabase.storage.from('foto').upload(path, candidateForm.foto)
      if (uploadError) {
        setError('Gagal upload foto: ' + uploadError.message)
        setSaving(false)
        return
      }
      const { data: publicUrl } = supabase.storage.from('foto').getPublicUrl(path)
      foto_url = publicUrl.publicUrl
    }

    const payload = {
      nama: candidateForm.nama,
      angkatan: candidateForm.angkatan,
      quote: candidateForm.quote,
      foto_url,
    }

    const query = editingCandidate
      ? supabase.from('vote_candidates').update(payload).eq('id', editingCandidate.id)
      : supabase.from('vote_candidates').insert({ ...payload, event_id: selectedEvent.id })

    const { error: saveError } = await query
    setSaving(false)

    if (saveError) {
      setError('Gagal menyimpan: ' + saveError.message)
      return
    }

    setCandidateModalOpen(false)
    loadCandidates(selectedEvent.id)
  }

  if (selectedEvent) {
    return (
      <div>
        <button className="link-more" onClick={() => setSelectedEvent(null)} style={{ marginBottom: '1rem' }}>
          <ChevronLeft size={16} /> Kembali ke daftar sesi
        </button>

        <div className="admin-panel-header">
          <h2>Kandidat — {selectedEvent.judul}</h2>
          <button className="btn-primary-small" onClick={openCreateCandidate}>
            <Plus size={16} /> Tambah Kandidat
          </button>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Nama</th>
              <th>Angkatan</th>
              <th>Perolehan Suara</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((c) => (
              <tr key={c.id}>
                <td>{c.nama}</td>
                <td>{c.angkatan}</td>
                <td><strong>{voteCounts[c.id] ?? 0}</strong> suara</td>
                <td className="admin-table-actions">
                  <button onClick={() => openEditCandidate(c)} aria-label="Edit"><Pencil size={16} /></button>
                  <button onClick={() => handleDeleteCandidate(c)} aria-label="Hapus" className="danger"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {candidateModalOpen && (
          <Modal title={editingCandidate ? 'Edit Kandidat' : 'Tambah Kandidat'} onClose={() => setCandidateModalOpen(false)}>
            <form onSubmit={handleSubmitCandidate} className="admin-form">
              <label>
                Nama
                <input required value={candidateForm.nama} onChange={(e) => setCandidateForm({ ...candidateForm, nama: e.target.value })} />
              </label>
              <label>
                Angkatan
                <input required value={candidateForm.angkatan} onChange={(e) => setCandidateForm({ ...candidateForm, angkatan: e.target.value })} />
              </label>
              <label>
                Quote / Visi Singkat
                <textarea rows={3} value={candidateForm.quote} onChange={(e) => setCandidateForm({ ...candidateForm, quote: e.target.value })} />
              </label>
              <label>
                Foto (opsional)
                <input type="file" accept="image/*" onChange={(e) => setCandidateForm({ ...candidateForm, foto: e.target.files[0] })} />
              </label>
              {error && <p className="auth-error">{error}</p>}
              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? 'Menyimpan...' : 'Simpan'}
              </button>
            </form>
          </Modal>
        )}
      </div>
    )
  }

  return (
    <div>
      <div className="admin-panel-header">
        <h2>Sesi Vote Tutorin ({events.length})</h2>
        <button className="btn-primary-small" onClick={openCreateEvent}>
          <Plus size={16} /> Buat Sesi Baru
        </button>
      </div>

      {loading ? (
        <p className="empty-state">Memuat...</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Judul</th>
              <th>Status</th>
              <th>Deadline</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id}>
                <td>
                  <button className="link-more" onClick={() => openEventDetail(event)}>{event.judul}</button>
                </td>
                <td><span className={`status-pill status-${event.status}`}>{event.status}</span></td>
                <td>{event.deadline ? new Date(event.deadline).toLocaleString('id-ID') : '-'}</td>
                <td className="admin-table-actions">
                  <button onClick={() => openEditEvent(event)} aria-label="Edit"><Pencil size={16} /></button>
                  <button onClick={() => handleDeleteEvent(event)} aria-label="Hapus" className="danger"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {eventModalOpen && (
        <Modal title={editingEvent ? 'Edit Sesi Voting' : 'Buat Sesi Voting'} onClose={() => setEventModalOpen(false)}>
          <form onSubmit={handleSubmitEvent} className="admin-form">
            <label>
              Judul Sesi
              <input required value={eventForm.judul} onChange={(e) => setEventForm({ ...eventForm, judul: e.target.value })} />
            </label>
            <label>
              Deadline
              <input
                type="datetime-local"
                value={eventForm.deadline}
                onChange={(e) => setEventForm({ ...eventForm, deadline: e.target.value })}
              />
            </label>
            <label>
              Status
              <select value={eventForm.status} onChange={(e) => setEventForm({ ...eventForm, status: e.target.value })}>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </label>
            <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>
              Hanya satu sesi berstatus "active" yang tampil ke mahasiswa. Set ke "closed" untuk mengakhiri voting.
            </p>
            {error && <p className="auth-error">{error}</p>}
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Menyimpan...' : 'Simpan'}
            </button>
          </form>
        </Modal>
      )}
    </div>
  )
}

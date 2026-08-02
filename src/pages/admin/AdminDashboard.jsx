import { useState } from 'react'
import { BookOpen, Newspaper, Users, Vote, UserCog, LayoutDashboard, FileText } from 'lucide-react'
import AdminOverview from './AdminOverview'
import AdminBuku from './AdminBuku'
import AdminInfo from './AdminInfo'
import AdminDosen from './AdminDosen'
import AdminVote from './AdminVote'
import AdminUsers from './AdminUsers'
import AdminPublikasi from './AdminPublikasi'
import { useAuth } from '../../context/AuthContext'

const TABS = [
  { key: 'overview', label: 'Ringkasan', icon: LayoutDashboard, Component: AdminOverview },
  { key: 'buku', label: 'Buku Akademik', icon: BookOpen, Component: AdminBuku },
  { key: 'info', label: 'Info Akademik', icon: Newspaper, Component: AdminInfo },
  { key: 'publikasi', label: 'Artikel Publikasi', icon: FileText, Component: AdminPublikasi },
  { key: 'dosen', label: 'Dosen', icon: Users, Component: AdminDosen },
  { key: 'vote', label: 'Vote Tutorin', icon: Vote, Component: AdminVote },
  { key: 'users', label: 'Kelola Pengguna', icon: UserCog, Component: AdminUsers },
]

export default function AdminDashboard() {
  const [active, setActive] = useState('overview')
  const { user } = useAuth()
  const ActiveComponent = TABS.find((t) => t.key === active)?.Component

  return (
    <section className="page-content-section">
      <div className="container">
        <div className="admin-header-modern">
          <h1 className="admin-title">👋 Selamat Datang, Admin {user?.user_metadata?.nama?.split(' ')[0] || 'Utama'}</h1>
          <p className="admin-subtitle">Kelola seluruh konten platform Kitab Ilkom dari satu dasbor yang terpusat.</p>
        </div>

        <div className="admin-tabs">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              className={`admin-tab-btn ${active === key ? 'active' : ''}`}
              onClick={() => setActive(key)}
            >
              <Icon size={16} /> {label}
            </button>
          ))}
        </div>

        <div className="admin-panel">{ActiveComponent && <ActiveComponent />}</div>
      </div>
    </section>
  )
}

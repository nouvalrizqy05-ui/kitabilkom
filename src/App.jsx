import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import BukuAkademik from './pages/BukuAkademik'
import InfoAkademik from './pages/InfoAkademik'
import Publikasi from './pages/Publikasi'
import DosenIlkom from './pages/DosenIlkom'
import VoteTutorin from './pages/VoteTutorin'
import Bantuan from './pages/Bantuan'
import AdminDashboard from './pages/admin/AdminDashboard'
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute'
import ScrollToTop from './components/ScrollToTop'

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/info-akademik" element={<InfoAkademik />} />
          <Route path="/publikasi" element={<Publikasi />} />
          <Route path="/dosen" element={<DosenIlkom />} />
          <Route path="/bantuan" element={<Bantuan />} />

          <Route
            path="/buku-akademik"
            element={
              <ProtectedRoute>
                <BukuAkademik />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vote"
            element={
              <ProtectedRoute>
                <VoteTutorin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}

function NotFound() {
  return (
    <section className="page-content-section">
      <div className="container" style={{ textAlign: 'center', padding: '4rem 0' }}>
        <h1 className="page-title">404</h1>
        <p className="page-subtitle">Halaman yang kamu cari tidak ditemukan.</p>
      </div>
    </section>
  )
}

import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import LupaPassword from './pages/LupaPassword'
import ResetPassword from './pages/ResetPassword'
import BukuAkademik from './pages/BukuAkademik'
import InfoAkademik from './pages/InfoAkademik'
import Publikasi from './pages/Publikasi'
import PublikasiDetail from './pages/PublikasiDetail'
import DosenIlkom from './pages/DosenIlkom'
import Bantuan from './pages/Bantuan'
import Search from './pages/Search'
import Profil from './pages/Profil'
import Aspirasi from './pages/Aspirasi'
import AdminDashboard from './pages/admin/AdminDashboard'
import AuthCallback from './pages/AuthCallback'
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute'
import ScrollToTop from './components/ScrollToTop'

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Routes>
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/lupa-password" element={<LupaPassword />} />
          <Route path="/isi-passwordbaru" element={<ResetPassword />} />
          <Route path="/info-akademik" element={<ProtectedRoute><InfoAkademik /></ProtectedRoute>} />
          <Route path="/info-akademik/:kategori" element={<ProtectedRoute><InfoAkademik /></ProtectedRoute>} />
          <Route path="/publikasi" element={<ProtectedRoute><Publikasi /></ProtectedRoute>} />
          <Route path="/publikasi/:id" element={<ProtectedRoute><PublikasiDetail /></ProtectedRoute>} />
          <Route path="/dosen" element={<ProtectedRoute><DosenIlkom /></ProtectedRoute>} />
          <Route path="/bantuan" element={<ProtectedRoute><Bantuan /></ProtectedRoute>} />
          <Route path="/bantuan/aspirasi" element={<ProtectedRoute><Aspirasi /></ProtectedRoute>} />
          <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
          <Route path="/profil" element={<ProtectedRoute><Profil /></ProtectedRoute>} />
          <Route path="/buku-akademik" element={<ProtectedRoute><BukuAkademik /></ProtectedRoute>} />
          <Route path="/buku-akademik/:prodi" element={<ProtectedRoute><BukuAkademik /></ProtectedRoute>} />
          <Route path="/buku-akademik/:prodi/:matkul" element={<ProtectedRoute><BukuAkademik /></ProtectedRoute>} />
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
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



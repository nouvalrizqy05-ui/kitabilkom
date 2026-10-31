import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CookieConsent from './components/CookieConsent'
import ScrollToTop from './components/ScrollToTop'
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute'

// Lazy load semua halaman — hanya dimuat saat dibutuhkan
const Home          = lazy(() => import('./pages/Home'))
const Login         = lazy(() => import('./pages/Login'))
const Register      = lazy(() => import('./pages/Register'))
const LupaPassword  = lazy(() => import('./pages/LupaPassword'))
const ResetPassword = lazy(() => import('./pages/ResetPassword'))
const BukuAkademik  = lazy(() => import('./pages/BukuAkademik'))
const InfoAkademik  = lazy(() => import('./pages/InfoAkademik'))
const Publikasi     = lazy(() => import('./pages/Publikasi'))
const PublikasiDetail = lazy(() => import('./pages/PublikasiDetail'))
const DosenIlkom    = lazy(() => import('./pages/DosenIlkom'))
const Bantuan       = lazy(() => import('./pages/Bantuan'))
const Search        = lazy(() => import('./pages/Search'))
const Profil        = lazy(() => import('./pages/Profil'))
const Aspirasi      = lazy(() => import('./pages/Aspirasi'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const AuthCallback  = lazy(() => import('./pages/AuthCallback'))

// Loading fallback ringan
function PageLoader() {
  return (
    <div style={{
      minHeight: '60vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        width: 36,
        height: 36,
        border: '3px solid var(--gold-400)',
        borderTopColor: 'transparent',
        borderRadius: '50%',
        animation: 'spin 0.7s linear infinite',
      }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <CookieConsent />
      <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Suspense fallback={<PageLoader />}>
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
        </Suspense>
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

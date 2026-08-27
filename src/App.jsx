import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import MobileBottomNav from './components/MobileBottomNav'
import useIsMobile from './hooks/useIsMobile'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import BukuAkademik from './pages/BukuAkademik'
import InfoAkademik from './pages/InfoAkademik'
import Publikasi from './pages/Publikasi'
import DosenIlkom from './pages/DosenIlkom'
import VoteTutorin from './pages/VoteTutorin'
import Bantuan from './pages/Bantuan'
import Search from './pages/Search'
import Profil from './pages/Profil'
import Aspirasi from './pages/Aspirasi'
import AdminDashboard from './pages/admin/AdminDashboard'
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute'
import ScrollToTop from './components/ScrollToTop'
import PageTransition from './components/PageTransition'

export default function App() {
  const location = useLocation()
  const isMobile = useIsMobile()

  return (
    <>
      <ScrollToTop />
      {!isMobile && <Navbar />}
      <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><Home /></PageTransition>} />
            <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
            <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
            <Route path="/info-akademik" element={<PageTransition><InfoAkademik /></PageTransition>} />
            <Route path="/publikasi" element={<PageTransition><Publikasi /></PageTransition>} />
            <Route path="/dosen" element={<PageTransition><DosenIlkom /></PageTransition>} />
            <Route path="/bantuan" element={<PageTransition><Bantuan /></PageTransition>} />
            <Route path="/aspirasi" element={<PageTransition><Aspirasi /></PageTransition>} />
            <Route path="/search" element={<PageTransition><Search /></PageTransition>} />

            <Route
              path="/profil"
              element={
                <ProtectedRoute>
                  <PageTransition><Profil /></PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/buku-akademik"
              element={
                <ProtectedRoute>
                  <PageTransition><BukuAkademik /></PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/vote"
              element={
                <ProtectedRoute>
                  <PageTransition><VoteTutorin /></PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <PageTransition><AdminDashboard /></PageTransition>
                </AdminRoute>
              }
            />

            <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
          </Routes>
        </AnimatePresence>
      </main>
      {!isMobile && <Footer />}
      {isMobile && <MobileBottomNav />}
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

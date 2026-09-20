import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, ChevronDown, Search, BookOpen, Info, CheckSquare, Users, HelpCircle, ArrowRightLeft, Trophy, Camera, AlertTriangle, Lock } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import Calendar from '../components/Calendar';
import { motion } from 'framer-motion';

const PopAnim = ({ children, delay = 0, className = "", style = {} }) => (
  <motion.div
    className={className}
    style={style}
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 1.7, ease: [0.25, 1, 0.5, 1], delay }}
  >
    {children}
  </motion.div>
);

// mockArticles removed to sync with admin data

export default function Home() {
  const [stats, setStats] = useState({ mahasiswa: 0, dosen: 0, materi: 0, info: 0 });
  const [latestInfo, setLatestInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  // Search state
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const [searchCategory, setSearchCategory] = useState("Semua");
  const searchCategories = ["Semua", "Buku Akademik", "Info Akademik", "Dosen Ilkom"];
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/search?q=${encodeURIComponent(searchQuery)}&c=${encodeURIComponent(searchCategory)}`);
  };

  const SLIDE_COUNT = 3;
  const AUTOPLAY_DELAY = 7000;
  const timerRef = useRef(null);
  const currentSlideRef = useRef(currentSlide);

  // Sinkronkan ref setiap kali state berubah
  useEffect(() => { currentSlideRef.current = currentSlide; }, [currentSlide]);

  // goToSlide = satu-satunya fungsi yang ubah slide + reset timer
  const goToSlide = (index) => {
    setCurrentSlide(index);
    currentSlideRef.current = index;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      const next = (currentSlideRef.current + 1) % SLIDE_COUNT;
      setCurrentSlide(next);
      currentSlideRef.current = next;
    }, AUTOPLAY_DELAY);
  };

  const goNext = () => goToSlide((currentSlideRef.current + 1) % SLIDE_COUNT);
  const goPrev = () => goToSlide((currentSlideRef.current - 1 + SLIDE_COUNT) % SLIDE_COUNT);

  // Mulai auto-play pertama kali
  useEffect(() => {
    timerRef.current = setInterval(() => {
      const next = (currentSlideRef.current + 1) % SLIDE_COUNT;
      setCurrentSlide(next);
      currentSlideRef.current = next;
    }, AUTOPLAY_DELAY);
    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadHomeData() {
      const [mahasiswaRes, dosenRes, materiRes, infoRes, latestInfoRes] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'mahasiswa'),
        supabase.from('dosen').select('id', { count: 'exact', head: true }),
        supabase.from('buku_akademik').select('id', { count: 'exact', head: true }),
        supabase.from('info_akademik').select('id', { count: 'exact', head: true }),
        supabase
          .from('artikel_publikasi')
          .select('id, judul, penulis, nama_jurnal, tahun, link_url')
          .order('tahun', { ascending: false })
          .limit(3),
      ]);

      if (!isMounted) return;

      setStats({
        mahasiswa: mahasiswaRes.count ?? 0,
        dosen: dosenRes.count ?? 0,
        materi: materiRes.count ?? 0,
        info: infoRes.count ?? 0,
      });
      setLatestInfo(latestInfoRes?.data ?? []);
      setLoading(false);
    }

    loadHomeData();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      {/* ==================== HERO HMTI STYLE ==================== */}
      <section className="hero-custom stacked-section">
        <div className="hero-image-wrapper">
          <img 
            src="/assets/hero.png" 
            alt="Background" 
            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1000'; }}
          />
        </div>
        
        <div className="hero-custom-container">
          <PopAnim className="hero-content-custom">
            <div className="hero-brand-logo">
              <div className="hero-logos-wrapper">
                <img src="/assets/logo-ilkom.png" alt="Logo Ilkom" className="hero-brand-mark" />
                <img src="/assets/logo-astasae.png" alt="Logo Astasae" className="hero-brand-mark" />
              </div>
              <div className="hero-brand-name">
                <div className="hero-brand-kitab">Kitab</div>
                <div className="hero-title-main">ILKOM</div>
              </div>
            </div>
            
            <p className="hero-subtitle">
              Himpunan Mahasiswa Ilmu Komputer<br/>Universitas Negeri Semarang
            </p>
          </PopAnim>
        </div>
      </section>

      {/* ==================== ABOUT KITAB ILKOM ==================== */}
      <section className="about-custom-parallax">
        <div className="about-overlay"></div>
        
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '4rem' }}>
            
            <PopAnim style={{ flex: '1 1 500px' }} delay={0.1}>
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '3rem', color: 'var(--text-primary)', lineHeight: 1, marginBottom: '-5px' }}>About</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '4rem', fontWeight: 900, color: 'var(--gold-400)', textTransform: 'uppercase', lineHeight: 1 }}>Kitab Ilkom</div>
              </div>
              
              <p style={{ fontSize: '1.1rem', color: 'var(--text-primary)', lineHeight: 1.7, marginBottom: '1.5rem', textAlign: 'justify' }}>
                <strong>Kitab Ilkom</strong> merupakan sebuah portal akademik terpadu yang dirancang khusus untuk memenuhi kebutuhan mahasiswa Ilmu Komputer Universitas Negeri Semarang (UNNES). Kami hadir sebagai pusat informasi yang memudahkan kegiatan perkuliahan sehari-hari.
              </p>
              
              <p style={{ fontSize: '1.1rem', color: 'var(--text-primary)', lineHeight: 1.7, textAlign: 'justify' }}>
                Melalui platform ini, Anda dapat mengakses <strong>Database Buku Akademik</strong>, mendapatkan <strong>Info Akademik</strong> terkini terkait jadwal, lomba, hingga beasiswa, serta melihat profil lengkap di <strong>Database Dosen</strong>. Selain itu, Kitab Ilkom menyediakan fasilitas bagi mahasiswa untuk mengeksplorasi dan mengunggah karya ke dalam <strong>Database Artikel Publikasi</strong>, menciptakan lingkungan akademik yang kolaboratif dan inovatif.
              </p>
            </PopAnim>
            
            <PopAnim style={{ flex: '1 1 400px', display: 'flex', justifyContent: 'center' }} delay={0.3}>
              <div 
                className="yt-thumbnail-card"
                onClick={() => window.open('https://youtube.com', '_blank')}
                style={{ 
                  position: 'relative', 
                  width: '100%', 
                  maxWidth: '560px', 
                  aspectRatio: '16/9', 
                  borderRadius: '16px', 
                  overflow: 'hidden',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}>
                <img src="/assets/about.png" alt="Video Thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(100%) brightness(50%)' }} onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1000'; }} />
                
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.5) 100%)' }}></div>
                
                {/* Sabuk Bergembok */}
                <div style={{ position: 'absolute', top: '50%', left: 0, width: '100%', height: '60px', transform: 'translateY(-50%)', background: 'rgba(30,30,30,0.85)', backdropFilter: 'blur(8px)', borderTop: '2px solid rgba(255,255,255,0.1)', borderBottom: '2px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, boxShadow: '0 4px 15px rgba(0,0,0,0.5)' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Lock size={20} color="var(--gray-400)" />
                  </div>
                </div>
                
                <div style={{ position: 'absolute', bottom: '20px', left: '20px', right: '20px', color: 'var(--gray-400)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', userSelect: 'none' }}>
                  <div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-display)', marginBottom: '4px' }}>Mengenal Kitab Ilkom</div>
                    <div style={{ fontSize: '0.9rem', opacity: 0.9, fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>Segera Hadir</div>
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', opacity: 0.6 }}>
                    Tonton di <strong>YouTube</strong>
                  </div>
                </div>
              </div>
            </PopAnim>
            
          </div>
        </div>
      </section>

      {/* ==================== QUICK LINKS NAV ==================== */}
      <section className="quick-links-section stacked-section">
        <div className="container" style={{ padding: '5rem 20px' }}>

          <PopAnim delay={0.05}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '1.15rem', color: 'var(--gold-500)', marginBottom: '0.25rem' }}>Layanan Terpadu</div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-primary)', textTransform: 'uppercase', margin: 0 }}>Eksplorasi Kitab Ilkom</h2>
            </div>
          </PopAnim>

          <div className="quick-nav-grid">
            
            <PopAnim delay={0.1}>
              <Link to="/buku-akademik" className="quick-nav-card">
                <div className="quick-nav-icon">
                  <BookOpen size={42} strokeWidth={1.5} />
                </div>
                <span className="quick-nav-label">Buku Akademik</span>
              </Link>
            </PopAnim>

            <PopAnim delay={0.2}>
              <Link to="/info-akademik" className="quick-nav-card">
                <div className="quick-nav-icon">
                  <Info size={42} strokeWidth={1.5} />
                </div>
                <span className="quick-nav-label">Info Akademik</span>
              </Link>
            </PopAnim>

            <PopAnim delay={0.3}>
              <Link to="/dosen" className="quick-nav-card">
                <div className="quick-nav-icon">
                  <Users size={42} strokeWidth={1.5} />
                </div>
                <span className="quick-nav-label">Dosen Ilkom</span>
              </Link>
            </PopAnim>

            <PopAnim delay={0.4}>
              <a href="https://docs.google.com/forms/d/e/1FAIpQLSe0A7npBXDlGedxykt1YDu4ukIUleilSYPTuk1EP-x5d40RDw/viewform" target="_blank" rel="noopener noreferrer" className="quick-nav-card">
                <div className="quick-nav-icon">
                  <CheckSquare size={42} strokeWidth={1.5} />
                </div>
                <span className="quick-nav-label">Unggah Artikel</span>
              </a>
            </PopAnim>

          </div>

          {/* Info Banners */}
          <div style={{ marginTop: '3rem' }}>
            <div className="banners-grid">
              <PopAnim delay={0.5}>
                <Link to="/bantuan" className="info-banner banner-card-theme" style={{ textDecoration: 'none', height: '100%' }}>
                  <div className="banner-content">
                    <h3 className="banner-title">Ada kendala terkait Perkuliahan<br/>di Ilmu Komputer?</h3>
                    <p className="banner-desc">Klik di sini untuk menemukan informasi dan solusi!</p>
                  </div>
                  <div className="banner-icon">
                    <HelpCircle size={100} color="var(--gold-500)" strokeWidth={1.5} />
                  </div>
                </Link>
              </PopAnim>
              <PopAnim delay={0.6}>
                <a href="https://forms.gle/CHBeYri38fW6iJhw8" target="_blank" rel="noopener noreferrer" className="info-banner banner-card-theme" style={{ textDecoration: 'none', height: '100%' }}>
                  <div className="banner-content">
                    <h3 className="banner-title">Pendataan Minat, Bakat, dan Prestasi<br/>Mahasiswa Ilmu Komputer</h3>
                    <p className="banner-desc">Klik di sini untuk mengisi form pendataan minat, bakat, dan prestasi resmi dan dapatkan apresiasi!</p>
                  </div>
                  <div className="banner-icon">
                    <Trophy size={100} color="var(--gold-500)" strokeWidth={1.5} />
                  </div>
                </a>
              </PopAnim>
            </div>
          </div>

        </div>
      </section>

      <Calendar />

      

      {/* ==================== ARTIKEL MAHASISWA ==================== */}
      <section className="kegiatan-section" id="artikel-mahasiswa">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              <BookOpen size={24} stroke="var(--gold-500)" strokeWidth={2.5} style={{ marginRight: '10px' }} />
              Database Publikasi Mahasiswa
            </h2>
            <Link to="/publikasi" className="section-link">Lihat semua publikasi</Link>
          </div>
          <div className="kegiatan-grid">
            {latestInfo.length > 0 ? (
              latestInfo.map((article, index) => {
                return (
                  <PopAnim key={article.id} className="kegiatan-card" style={{ display: 'flex', flexDirection: 'column' }} delay={index * 0.1}>
                    <div className="kegiatan-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '1.5rem' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--purple-600)', fontWeight: 700, marginBottom: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Jurnal Akademik • {article.tahun}
                      </div>
                      <h4 className="kegiatan-title" style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.8rem', lineHeight: 1.4, color: 'var(--navy-900)' }}>
                        {article.judul}
                      </h4>
                      <p style={{ fontSize: '0.9rem', color: 'var(--gray-600)', marginBottom: '1.5rem', flex: 1, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Users size={16} strokeWidth={2} color="var(--gray-400)" /> 
                        {article.penulis || 'Mahasiswa Ilmu Komputer'}
                      </p>
                      <Link to="/publikasi" className="kegiatan-readmore" style={{ marginTop: 'auto', display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--gold-500)', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none' }}>
                        Baca Artikel <ArrowRight size={16} strokeWidth={2} />
                      </Link>
                    </div>
                  </PopAnim>
                );
              })
            ) : (
              <div style={{ background: 'var(--card-bg)', borderRadius: 'var(--radius-2xl)', padding: '4rem 2rem', textAlign: 'center', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gridColumn: '1 / -1' }}>
                <AlertTriangle size={56} strokeWidth={1.5} color="var(--gold-500)" style={{ marginBottom: '1.5rem', opacity: 0.8 }} />
                <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Belum ada artikel publikasi terbaru.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

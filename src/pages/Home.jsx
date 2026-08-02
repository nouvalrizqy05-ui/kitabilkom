import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, ChevronDown, Search, BookOpen, Info, CheckSquare, Users, HelpCircle, ArrowRightLeft, BarChart3, GraduationCap, Library, Star, Trophy, Camera } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import Calendar from '../components/Calendar';

// mockArticles removed to sync with admin data

export default function Home() {
  const [stats, setStats] = useState({ mahasiswa: 0, dosen: 0, materi: 0, info: 0 });
  const [latestInfo, setLatestInfo] = useState([]);
  const [kegiatan, setKegiatan] = useState([]);
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

  // Carousel logic
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === 2 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
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
          .from('info_akademik')
          .select('id, judul, kategori, tanggal, konten')
          .eq('kategori', 'Artikel Publikasi')
          .order('tanggal', { ascending: false })
          .limit(3),
        supabase
          .from('kegiatan_hima')
          .select('*')
          .order('created_at', { ascending: false })
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
      setKegiatan(kegiatanRes?.data ?? []);
      setLoading(false);
    }

    loadHomeData();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      {/* ==================== HERO CAROUSEL ==================== */}
      <section className="hero" id="beranda">
        <div className="hero-carousel" id="hero-carousel">
          {/* Slide 1 */}
          <div className={`hero-slide ${currentSlide === 0 ? 'active' : ''}`} data-slide="0">
            <div className="hero-content">
              <span className="hero-badge">🎓 Portal Akademik</span>
              <h1 className="hero-title">Selamat Datang,<br/><span className="highlight">Sobat Ilkom!</span></h1>
              <p className="hero-description">Akses semua informasi akademik Jurusan Ilmu Komputer UNNES dalam satu tempat. Cari mata kuliah, materi, soal, dan raih prestasimu!</p>
              <a href="#search-section" className="hero-cta">
                Jelajahi Sekarang
                <ArrowRight size={20} strokeWidth={2} />
              </a>
            </div>
            <div className="hero-image">
              <img src="/assets/hero-new.png" alt="Mahasiswa Ilmu Komputer" loading="eager" />
            </div>
          </div>
          {/* Slide 2 */}
          <div className={`hero-slide ${currentSlide === 1 ? 'active' : ''}`} data-slide="1">
            <div className="hero-content">
              <span className="hero-badge">📚 Info Terbaru</span>
              <h1 className="hero-title">Buku Akademik<br/><span className="highlight">Digital</span></h1>
              <p className="hero-description">Panduan akademik lengkap dari kurikulum, mata kuliah pilihan, hingga jadwal perkuliahan semester ini. Semua terintegrasi untukmu.</p>
              <Link to="/buku-akademik" className="hero-cta">
                Buka Buku Akademik
                <ArrowRight size={20} strokeWidth={2} />
              </Link>
            </div>
            <div className="hero-image">
              <img src="/assets/hero-laptop.png" alt="Buku Akademik Digital" loading="lazy" />
            </div>
          </div>
          {/* Slide 3 */}
          <div className={`hero-slide ${currentSlide === 2 ? 'active' : ''}`} data-slide="2">
            <div className="hero-content">
              <span className="hero-badge">🏆 Prestasi & Kompetisi</span>
              <h1 className="hero-title">Raih Prestasi<br/><span className="highlight">Bersama!</span></h1>
              <p className="hero-description">Temukan informasi lomba, beasiswa, bootcamp, dan kesempatan berkarir. Jangan lewatkan event-event terbaik untuk mahasiswa Ilkom!</p>
              <a href="#kalender" className="hero-cta">
                Lihat Kalender
                <ArrowRight size={20} strokeWidth={2} />
              </a>
            </div>
            <div className="hero-image">
              <img src="/assets/hero-success.png" alt="Raih Prestasi" loading="lazy" />
            </div>
          </div>
        </div>

        {/* Carousel Controls */}
        <button className="carousel-btn carousel-prev" onClick={() => setCurrentSlide(s => s === 0 ? 2 : s - 1)} aria-label="Previous slide">
          <ChevronLeft size={24} strokeWidth={2.5} />
        </button>
        <button className="carousel-btn carousel-next" onClick={() => setCurrentSlide(s => s === 2 ? 0 : s + 1)} aria-label="Next slide">
          <ChevronRight size={24} strokeWidth={2.5} />
        </button>

        {/* Dots */}
        <div className="carousel-dots">
          <button className={`dot ${currentSlide === 0 ? 'active' : ''}`} onClick={() => setCurrentSlide(0)} aria-label="Slide 1"></button>
          <button className={`dot ${currentSlide === 1 ? 'active' : ''}`} onClick={() => setCurrentSlide(1)} aria-label="Slide 2"></button>
          <button className={`dot ${currentSlide === 2 ? 'active' : ''}`} onClick={() => setCurrentSlide(2)} aria-label="Slide 3"></button>
        </div>

        {/* Decorative elements */}
        <div className="hero-decoration hero-decoration-1"></div>
        <div className="hero-decoration hero-decoration-2"></div>
        <div className="hero-decoration hero-decoration-3"></div>
      </section>

      {/* ==================== SEARCH BAR ==================== */}
      <section className="search-section" id="search-section">
        <div className="container">
          <form className="search-wrapper" onSubmit={handleSearchSubmit}>
            <div className="search-dropdown" style={{ position: 'relative' }}>
              <button 
                type="button"
                className="search-dropdown-btn"
                onClick={() => setIsSearchDropdownOpen(!isSearchDropdownOpen)}
              >
                <span>{searchCategory}</span>
                <ChevronDown size={14} strokeWidth={1.5} style={{ transform: isSearchDropdownOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
              </button>
              
              <div className={`search-dropdown-menu ${isSearchDropdownOpen ? 'open' : ''}`}>
                {searchCategories.map((cat) => (
                  <button 
                    key={cat}
                    type="button"
                    className={`search-dropdown-item ${searchCategory === cat ? 'active' : ''}`}
                    onClick={() => {
                      setSearchCategory(cat);
                      setIsSearchDropdownOpen(false);
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div className="search-divider"></div>
            <input 
              type="text" 
              className="search-input" 
              placeholder="Cari Mata Kuliah, Judul, Info, Dosen..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="search-btn" aria-label="Cari">
              <Search size={22} strokeWidth={2.5} />
            </button>
          </form>
        </div>
      </section>

      {/* ==================== QUICK LINKS ==================== */}
      <section className="quick-links" id="quick-links">
        <div className="container">
          <div className="quick-links-grid">
            <Link to="/buku-akademik" className="quick-link-card">
              <div className="quick-link-default">
                <div className="quick-link-icon">
                  <BookOpen size={48} stroke="var(--purple-600)" strokeWidth={1.5} />
                </div>
                <span className="quick-link-label">Buku Akademik</span>
              </div>
              <div className="quick-link-hover-content">
                <h3 className="hover-title">Buku Akademik</h3>
                <p className="hover-desc">Akses seluruh kurikulum dan panduan mata kuliah secara lengkap.</p>
                <div className="hover-btn">Lihat Detail</div>
              </div>
            </Link>
            <Link to="/info-akademik" className="quick-link-card">
              <div className="quick-link-default">
                <div className="quick-link-icon">
                  <Info size={48} stroke="var(--navy-600)" strokeWidth={1.5} />
                </div>
                <span className="quick-link-label">Info Akademik</span>
              </div>
              <div className="quick-link-hover-content">
                <h3 className="hover-title">Info Akademik</h3>
                <p className="hover-desc">Informasi terbaru seputar jadwal, kalender, dan pengumuman akademik.</p>
                <div className="hover-btn">Lihat Detail</div>
              </div>
            </Link>
            <Link to="/vote" className="quick-link-card">
              <div className="quick-link-default">
                <div className="quick-link-icon">
                  <CheckSquare size={48} stroke="var(--purple-500)" strokeWidth={1.5} />
                </div>
                <span className="quick-link-label">Vote Tutorin Maba</span>
              </div>
              <div className="quick-link-hover-content">
                <h3 className="hover-title">Vote Tutorin Maba</h3>
                <p className="hover-desc">Pilih dan berikan voting untuk tutor terbaik pilihan mahasiswa tahun ini.</p>
                <div className="hover-btn">Lihat Detail</div>
              </div>
            </Link>
            <Link to="/dosen" className="quick-link-card">
              <div className="quick-link-default">
                <div className="quick-link-icon">
                  <Users size={48} stroke="var(--gold-400)" strokeWidth={1.5} />
                </div>
                <span className="quick-link-label">Dosen Ilkom</span>
              </div>
              <div className="quick-link-hover-content">
                <h3 className="hover-title">Dosen Ilkom</h3>
                <p className="hover-desc">Daftar dan profil lengkap seluruh dosen pengajar Ilmu Komputer.</p>
                <div className="hover-btn">Lihat Detail</div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ==================== INFO BANNERS ==================== */}
      <section className="info-banners" id="info-banners">
        <div className="container">
          <div className="banners-grid">
            <Link to="/bantuan" className="info-banner banner-pink" style={{ textDecoration: 'none' }}>
              <div className="banner-content">
                <h3 className="banner-title">Ada kendala terkait<br/>perkuliahan Ilkom?</h3>
                <p className="banner-desc">Klik di sini untuk menemukan informasi dan solusi!</p>
              </div>
              <div className="banner-icon">
                <HelpCircle size={100} color="rgba(255,255,255,0.8)" strokeWidth={1.5} />
              </div>
            </Link>
            <a href="https://forms.gle/cvvpeFXCEd4QLBQn7" target="_blank" rel="noopener noreferrer" className="info-banner banner-purple" style={{ textDecoration: 'none' }}>
              <div className="banner-content">
                <h3 className="banner-title">Pendataan Prestasi<br/>Mahasiswa Ilmu Komputer</h3>
                <p className="banner-desc">Klik di sini untuk mengisi form pendataan prestasi resmi dan dapatkan apresiasi!</p>
              </div>
              <div className="banner-icon">
                <Trophy size={100} color="rgba(255,255,255,0.8)" strokeWidth={1.5} />
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* ==================== KALENDER PRESTASI ==================== */}
      <Calendar />

      {/* ==================== STATISTIK ILKOM ==================== */}
      <section className="stats-section" id="statistik">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              <BarChart3 size={28} stroke="var(--purple-600)" strokeWidth={2.5} />
              Statistik Ilkom UNNES
            </h2>
          </div>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-header">
                <div className="stat-icon stat-icon-blue">
                  <Users size={24} strokeWidth={2} />
                </div>
                <div className="stat-label">Mahasiswa Aktif</div>
              </div>
              <div className="stat-number">{loading ? '...' : stats.mahasiswa}</div>
            </div>
            <div className="stat-card">
              <div className="stat-header">
                <div className="stat-icon stat-icon-purple">
                  <GraduationCap size={24} strokeWidth={2} />
                </div>
                <div className="stat-label">Dosen Tetap</div>
              </div>
              <div className="stat-number">{loading ? '...' : stats.dosen}</div>
            </div>
            <div className="stat-card">
              <div className="stat-header">
                <div className="stat-icon stat-icon-teal">
                  <Library size={24} strokeWidth={2} />
                </div>
                <div className="stat-label">Mata Kuliah / Materi</div>
              </div>
              <div className="stat-number">{loading ? '...' : stats.materi}</div>
            </div>
            <div className="stat-card">
              <div className="stat-header">
                <div className="stat-icon stat-icon-gold">
                  <Star size={24} strokeWidth={2} />
                </div>
                <div className="stat-label">Info & Berita Aktif</div>
              </div>
              <div className="stat-number">{loading ? '...' : stats.info}</div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== ARTIKEL MAHASISWA ==================== */}
      <section className="kegiatan-section" id="artikel-mahasiswa">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              <BookOpen size={24} stroke="var(--purple-600)" strokeWidth={2.5} style={{ marginRight: '10px' }} />
              Database Publikasi Mahasiswa
            </h2>
            <Link to="/publikasi" className="section-link">Lihat semua publikasi</Link>
          </div>
          <div className="kegiatan-grid">
            {latestInfo.length > 0 ? (
              latestInfo.map(article => {
                const year = article.tanggal ? new Date(article.tanggal).getFullYear() : new Date().getFullYear();
                return (
                  <div key={article.id} className="kegiatan-card" style={{ display: 'flex', flexDirection: 'column' }}>
                    <div className="kegiatan-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '1.5rem' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--purple-600)', fontWeight: 700, marginBottom: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Jurnal Akademik • {year}
                      </div>
                      <h4 className="kegiatan-title" style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.8rem', lineHeight: 1.4, color: 'var(--navy-900)' }}>
                        {article.judul}
                      </h4>
                      <p style={{ fontSize: '0.9rem', color: 'var(--gray-600)', marginBottom: '1.5rem', flex: 1, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Users size={16} strokeWidth={2} color="var(--gray-400)" /> 
                        Mahasiswa Ilmu Komputer
                      </p>
                      <Link to="/publikasi" className="kegiatan-readmore" style={{ marginTop: 'auto', display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--primary-600)', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none' }}>
                        Baca Artikel <ArrowRight size={16} strokeWidth={2} />
                      </Link>
                    </div>
                  </div>
                );
              })
            ) : (
              <p>Belum ada artikel publikasi terbaru.</p>
            )}
          </div>
        </div>
      </section>

      {/* ==================== KEGIATAN HIMA ==================== */}
      <section className="kegiatan-section" id="kegiatan" style={{ background: 'white' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              <Camera size={24} stroke="var(--primary-600)" strokeWidth={2.5} style={{ marginRight: '10px' }} />
              Kegiatan HIMA Ilkom
            </h2>
          </div>
          <div className="kegiatan-grid">
            {kegiatan.length > 0 ? (
              kegiatan.map(item => (
                <div key={item.id} className="kegiatan-card" style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ height: '200px', backgroundImage: `url(${item.image_url})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundColor: 'var(--gray-100)' }}></div>
                  <div className="kegiatan-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '1.5rem' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--purple-600)', fontWeight: 700, marginBottom: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {new Date(item.created_at).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                    </div>
                    <h4 className="kegiatan-title" style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.8rem', lineHeight: 1.4, color: 'var(--navy-900)' }}>
                      {item.judul}
                    </h4>
                    <p style={{ fontSize: '0.9rem', color: 'var(--gray-600)' }}>
                      {item.deskripsi}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p>Belum ada kegiatan terbaru yang didokumentasikan.</p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

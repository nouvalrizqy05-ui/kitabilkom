import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ChevronRight, FileText, Download } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export default function HomeMobile() {
  const [stats, setStats] = useState({ mahasiswa: 0, dosen: 0, materi: 0, info: 0 });
  const [latestInfo, setLatestInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    async function fetchHomeData() {
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

    fetchHomeData();
    return () => { isMounted = false; };
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const q = fd.get('q') || '';
    const c = fd.get('c') || 'semua';
    navigate(`/search?q=${encodeURIComponent(q)}&c=${encodeURIComponent(c)}`);
  };

  return (
    <div style={{ paddingBottom: '70px', background: '#F4F5F7', minHeight: '100vh' }}>
      {/* ==================== HERO MOBILE ==================== */}
      <section style={{ background: 'var(--navy-600)', padding: '2rem 1.5rem', color: 'white' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem', fontFamily: 'var(--font-display)', lineHeight: '1.2' }}>
          Portal Akademik <br/>
          <span style={{ color: 'var(--gold-400)' }}>Ilmu Komputer</span>
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)', marginBottom: '1.5rem' }}>
          Akses informasi, jadwal, dan materi akademik dengan mudah dan cepat melalui genggaman Anda.
        </p>

        {/* SEARCH FORM INSIDE HERO */}
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'white', padding: '0.5rem', borderRadius: '1rem', border: '1px solid var(--navy-400)' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <select name="c" style={{ padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid var(--gray-200)', background: 'var(--gray-50)', outline: 'none', flexShrink: 0, fontSize: '0.8rem' }}>
              <option value="semua">Semua Kategori</option>
              <option value="buku">Buku</option>
              <option value="info">Info</option>
              <option value="dosen">Dosen</option>
            </select>
            <input 
              type="text" 
              name="q"
              placeholder="Cari mata kuliah..." 
              style={{ flex: 1, border: 'none', outline: 'none', padding: '0.5rem', fontSize: '0.9rem' }}
            />
          </div>
          <button type="submit" style={{ background: 'var(--navy-600)', color: 'white', border: 'none', padding: '0.8rem', borderRadius: '0.5rem', fontWeight: 600, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
            <Search size={18} /> Cari
          </button>
        </form>
      </section>

      {/* ==================== FEATURE GRID MOBILE ==================== */}
      <section style={{ padding: '1.5rem 1rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--navy-900)' }}>Layanan Utama</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <Link to="/buku-akademik" style={{ background: 'white', padding: '1rem', borderRadius: '1rem', border: '1px solid var(--gray-200)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '0.5rem' }}>
            <div style={{ background: 'var(--primary-50)', color: 'var(--primary-600)', padding: '0.8rem', borderRadius: '50%' }}>
              <FileText size={24} />
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--navy-900)' }}>Buku Akademik</span>
          </Link>
          <Link to="/info-akademik" style={{ background: 'white', padding: '1rem', borderRadius: '1rem', border: '1px solid var(--gray-200)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '0.5rem' }}>
            <div style={{ background: 'var(--primary-50)', color: 'var(--primary-600)', padding: '0.8rem', borderRadius: '50%' }}>
              <FileText size={24} />
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--navy-900)' }}>Info Akademik</span>
          </Link>
        </div>
      </section>

      {/* ==================== LATEST INFO MOBILE ==================== */}
      <section style={{ padding: '1.5rem 1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--navy-900)' }}>Artikel Terbaru</h2>
          <Link to="/publikasi" style={{ fontSize: '0.85rem', color: 'var(--primary-600)', fontWeight: 600, display: 'flex', alignItems: 'center' }}>
            Lihat Semua <ChevronRight size={16} />
          </Link>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {loading ? (
            <p style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--gray-500)' }}>Memuat artikel...</p>
          ) : latestInfo.length > 0 ? (
            latestInfo.map((article) => (
              <div key={article.id} style={{ background: 'white', padding: '1rem', borderRadius: '1rem', border: '1px solid var(--gray-200)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--purple-600)', fontWeight: 700 }}>
                  {new Date(article.tanggal).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                </span>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--navy-900)' }}>{article.judul}</h3>
                <Link to="/info-akademik" style={{ alignSelf: 'flex-start', fontSize: '0.8rem', color: 'var(--primary-600)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Baca <ChevronRight size={14} />
                </Link>
              </div>
            ))
          ) : (
            <p style={{ color: 'var(--gray-500)' }}>Belum ada artikel dipublikasikan.</p>
          )}
        </div>
      </section>

      {/* ==================== STATS MOBILE ==================== */}
      <section style={{ padding: '1.5rem 1rem' }}>
        <div style={{ background: 'var(--navy-900)', borderRadius: '1rem', padding: '1.5rem', color: 'white', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--gold-400)' }}>{stats.mahasiswa}</div>
            <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)' }}>Mahasiswa</div>
          </div>
          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--gold-400)' }}>{stats.materi}</div>
            <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)' }}>Materi</div>
          </div>
        </div>
      </section>
    </div>
  );
}

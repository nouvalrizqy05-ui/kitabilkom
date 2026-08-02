import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Users, BookOpen, Newspaper, GraduationCap, TrendingUp } from 'lucide-react';

export default function AdminOverview() {
  const [metrics, setMetrics] = useState({
    users: 0,
    info: 0,
    buku: 0,
    dosen: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadMetrics() {
      const [usersRes, infoRes, bukuRes, dosenRes] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('info_akademik').select('id', { count: 'exact', head: true }),
        supabase.from('buku_akademik').select('id', { count: 'exact', head: true }),
        supabase.from('dosen').select('id', { count: 'exact', head: true }),
      ]);

      if (isMounted) {
        setMetrics({
          users: usersRes.count || 0,
          info: infoRes.count || 0,
          buku: bukuRes.count || 0,
          dosen: dosenRes.count || 0,
        });
        setLoading(false);
      }
    }
    loadMetrics();
    return () => { isMounted = false; };
  }, []);

  if (loading) {
    return <p className="empty-state">Memuat ringkasan data...</p>;
  }

  const statCards = [
    { label: 'Total Pengguna', value: metrics.users, icon: Users, color: 'var(--blue-500)', bg: 'var(--blue-50)' },
    { label: 'Total Info & Artikel', value: metrics.info, icon: Newspaper, color: 'var(--purple-600)', bg: 'var(--purple-50)' },
    { label: 'Total Buku Akademik', value: metrics.buku, icon: BookOpen, color: 'var(--teal-500)', bg: 'var(--teal-50)' },
    { label: 'Total Dosen', value: metrics.dosen, icon: GraduationCap, color: 'var(--rose-500)', bg: 'var(--rose-50)' },
  ];

  return (
    <div className="admin-overview">
      <div className="admin-overview-header">
        <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: '0.5rem' }}>Ringkasan Sistem</h2>
        <p style={{ color: 'var(--gray-500)', fontSize: '0.95rem' }}>Pantau statistik utama dari platform Kitab Ilkom secara real-time.</p>
      </div>

      <div className="admin-stats-grid">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="admin-stat-card">
              <div className="admin-stat-icon-wrapper" style={{ backgroundColor: stat.bg, color: stat.color }}>
                <Icon size={24} strokeWidth={2.5} />
              </div>
              <div className="admin-stat-info">
                <p className="admin-stat-label">{stat.label}</p>
                <h3 className="admin-stat-value">{stat.value}</h3>
              </div>
              <div className="admin-stat-trend">
                <TrendingUp size={16} /> <span>Up to date</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

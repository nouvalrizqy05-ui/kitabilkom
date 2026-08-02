import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, ExternalLink, MessageCircle, MessageSquare, ChevronRight, FileText, HelpCircle, Send, BookOpen, ClipboardList, GraduationCap, Briefcase } from 'lucide-react'
import BackButton from '../components/BackButton'

/* ===== PLACEHOLDER LINKS ===== */
/* Ganti URL di bawah ini dengan link asli Anda */
const GFORM_ASPIRASI = '#'
const WHATSAPP_LINK = '#'
/* ============================== */

const FAQ_DATA = [
  {
    q: 'Bagaimana cara mengisi KRS?',
    a: 'Pengisian KRS dilakukan secara online melalui SIKADU (akademik.unnes.ac.id). Pastikan Anda sudah membayar UKT semester berjalan, lalu login ke SIKADU, lakukan pemesanan mata kuliah sesuai jadwal pendaftaran, dan simpan KRS Anda. Jika ada kendala, hubungi dosen wali/PA Anda.'
  },
  {
    q: 'Berapa batas maksimal SKS yang bisa diambil per semester?',
    a: 'Sesuai Panduan Akademik UNNES, batas SKS ditentukan oleh IPS Anda sebelumnya:\n• 3.00 < IPS ≤ 4.00 → Maks. 24 SKS\n• 2.50 < IPS ≤ 3.00 → Maks. 22 SKS\n• 2.00 < IPS ≤ 2.50 → Maks. 20 SKS\n• 1.50 < IPS ≤ 2.00 → Maks. 16 SKS\n• IPS ≤ 1.50 → Maks. 12 SKS'
  },
  {
    q: 'Apa saja pilihan Tugas Akhir di UNNES?',
    a: 'Berdasarkan kebijakan terbaru UNNES, mahasiswa Ilmu Komputer dapat memilih berbagai jenis tugas akhir selain Skripsi reguler, yaitu: Proyek, Prototipe, Publikasi Ilmiah (Artikel Jurnal), Penyetaraan Prestasi Kejuaraan, atau Book Chapter.'
  },
  {
    q: 'Bagaimana prosedur permohonan surat izin Kerja Praktik (PKL)?',
    a: 'Kerja Praktik (PKL) wajib didaftarkan di KRS. Setelah itu, surat permohonan izin observasi atau pelaksanaan magang dapat diajukan secara online melalui layanan administrasi akademik FMIPA UNNES (SIVELA) untuk diproses.'
  },
  {
    q: 'Di mana saya bisa mendapatkan template penulisan Skripsi?',
    a: 'Template dokumen Skripsi (tersedia dalam format DOCX maupun LaTeX) dan buku Panduan Tugas Akhir Sarjana UNNES dapat diunduh melalui portal resmi prodi atau halaman layanan administrasi FMIPA.'
  },
  {
    q: 'Bagaimana prosedur pengajuan cuti akademik?',
    a: 'Syarat utama: minimal telah menempuh 2 semester. Pengajuan cuti dilakukan via online di laman apps.unnes.ac.id (menu MYUNNES-STUDENTS). Anda tetap wajib bayar biaya cuti dan menyelesaikan administrasi sesuai Kalender Akademik UNNES.'
  },
  {
    q: 'Bagaimana jika saya terlambat mengisi KRS?',
    a: 'Jika melewati batas waktu di SIKADU, Anda harus melapor ke sub-bagian Akademik FMIPA dan dosen PA. Biasanya memerlukan surat permohonan keterlambatan atau dikenakan cuti paksa jika tidak segera diurus sebelum masa perkuliahan dimulai.'
  },
  {
    q: 'Di mana saya bisa mengakses nilai dan transkrip?',
    a: 'Semua rekam jejak nilai dapat dilihat di SIKADU pada menu "KHS" (Kartu Hasil Studi) dan "Transkrip". Untuk pencetakan transkrip berlegalisir, Anda bisa memintanya di loket layanan Akademik FMIPA UNNES.'
  }
]

const SOP_DATA = [
  {
    icon: ClipboardList,
    title: 'Alur Pengisian KRS (SIKADU)',
    color: 'var(--blue-600)',
    bg: 'var(--blue-50)',
    steps: [
      'Lakukan pembayaran UKT di bank mitra UNNES',
      'Login ke SIKADU (akademik.unnes.ac.id)',
      'Lakukan pemesanan mata kuliah sesuai jadwal',
      'Pilih rombel mata kuliah yang sesuai',
      'Simpan dan cetak KRS',
      'Konsultasi dan minta persetujuan Dosen PA'
    ]
  },
  {
    icon: Briefcase,
    title: 'Alur Kerja Praktik (PKL)',
    color: 'var(--purple-600)',
    bg: 'var(--purple-50)',
    steps: [
      'Cantumkan mata kuliah PKL di KRS',
      'Tentukan instansi/perusahaan tujuan PKL',
      'Ajukan surat izin pengantar via SIVELA FMIPA',
      'Laksanakan PKL dan buat logbook kegiatan',
      'Susun laporan di bawah bimbingan dosen',
      'Daftar ujian responsi PKL di prodi'
    ]
  },
  {
    icon: GraduationCap,
    title: 'Alur Tugas Akhir (Skripsi)',
    color: 'var(--green-600)',
    bg: 'var(--green-50)',
    steps: [
      'Pilih jalur TA (Skripsi/Proyek/Artikel/Prestasi)',
      'Ajukan usulan topik dan pembimbing ke prodi',
      'Dapatkan SK Pembimbing dari FMIPA',
      'Susun dan laksanakan bimbingan (gunakan template UNNES)',
      'Lakukan Pendaftaran Ujian / Seminar',
      'Revisi, validasi, dan upload repositori perpustakaan'
    ]
  },
  {
    icon: BookOpen,
    title: 'Prosedur Herregistrasi',
    color: 'var(--orange-600)',
    bg: 'var(--orange-50)',
    steps: [
      'Login ke apps.unnes.ac.id (MYUNNES-STUDENTS)',
      'Cek tagihan UKT di menu Registrasi > Pembayaran',
      'Bayar UKT via Virtual Account BNI/BTN/Mandiri/BRI',
      'Status akademik di SIKADU akan otomatis aktif',
      'Jika baru selesai cuti, pastikan lapor ke Fakultas',
      'Lanjutkan pengisian KRS secara mandiri di SIKADU'
    ]
  }
]

export default function Bantuan() {
  const [openFaq, setOpenFaq] = useState(null)

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  return (
    <>
      {/* ===== HEADER ===== */}
      <section className="page-header">
        <BackButton />
        <div className="container">
          <h1 className="page-title">Pusat Bantuan Mahasiswa</h1>
          <p className="page-subtitle">
            Temukan jawaban atas pertanyaanmu, pelajari prosedur akademik, atau sampaikan aspirasi langsung ke HIMA Ilkom.
          </p>
        </div>
      </section>

      <section className="page-content">
        <div className="container">

          {/* ===== QUICK ACTION CARDS ===== */}
          <div className="bantuan-quick-actions">
            <Link to="/aspirasi" className="bantuan-action-card bantuan-action-aspirasi">
              <div className="bantuan-action-icon">
                <MessageSquare size={24} />
              </div>
              <div className="bantuan-action-text">
                <h3>Sampaikan Aspirasi</h3>
                <p>Punya keluhan fasilitas, kritik, atau saran untuk Ilkom? Suarakan di sini!</p>
              </div>
              <ChevronRight className="bantuan-action-arrow" size={20} />
            </Link>

            <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="bantuan-action-card bantuan-action-wa">
              <div className="bantuan-action-icon">
                <MessageCircle size={32} />
              </div>
              <div className="bantuan-action-text">
                <h3>Hubungi Kami via WhatsApp</h3>
                <p>Butuh respons cepat? Chat langsung dengan pengurus HIMA Ilmu Komputer UNNES.</p>
              </div>
              <ExternalLink size={20} className="bantuan-action-arrow" />
            </a>
          </div>

          {/* ===== FAQ ===== */}
          <div className="bantuan-section">
            <div className="bantuan-section-header">
              <HelpCircle size={28} />
              <h2>Pertanyaan yang Sering Diajukan (FAQ)</h2>
            </div>
            <div className="bantuan-faq-list">
              {FAQ_DATA.map((item, i) => (
                <div className={`bantuan-faq-item ${openFaq === i ? 'open' : ''}`} key={i}>
                  <button className="bantuan-faq-question" onClick={() => toggleFaq(i)}>
                    <span>{item.q}</span>
                    <ChevronDown size={20} className="bantuan-faq-chevron" />
                  </button>
                  <div className="bantuan-faq-answer">
                    <p>{item.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ===== SOP AKADEMIK ===== */}
          <div className="bantuan-section">
            <div className="bantuan-section-header">
              <FileText size={28} />
              <h2>SOP & Prosedur Akademik</h2>
            </div>
            <p style={{ color: 'var(--gray-600)', marginBottom: '2rem', fontSize: '1rem' }}>
              Panduan langkah-langkah untuk prosedur akademik yang paling sering dibutuhkan mahasiswa.
            </p>
            <div className="bantuan-sop-grid">
              {SOP_DATA.map((sop, i) => {
                const Icon = sop.icon
                return (
                  <div className="bantuan-sop-card" key={i}>
                    <div className="bantuan-sop-card-header" style={{ background: sop.bg }}>
                      <Icon size={24} style={{ color: sop.color }} />
                      <h3 style={{ color: sop.color }}>{sop.title}</h3>
                    </div>
                    <ol className="bantuan-sop-steps">
                      {sop.steps.map((step, j) => (
                        <li key={j}>
                          <span className="bantuan-step-number" style={{ background: sop.bg, color: sop.color }}>{j + 1}</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )
              })}
            </div>
          </div>

        </div>
      </section>
    </>
  )
}

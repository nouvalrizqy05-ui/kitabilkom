import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, ExternalLink, MessageCircle, MessageSquare, ChevronRight, FileText, HelpCircle, Send, BookOpen, ClipboardList, GraduationCap, Briefcase } from 'lucide-react'
import BackButton from '../components/BackButton'


const FAQ_DATA = [
  {
    q: 'Bagaimana cara mengisi KRS?',
    a: 'Pengisian KRS dilakukan secara online melalui portal UNNES Application Gateway (apps.unnes.ac.id). Login menggunakan email UNNES, masuk ke menu SIKADU, lalu pada bagian Aktivitas Kuliah pilih mata kuliah yang ditawarkan sesuai batas SKS. Terakhir, simpan dan tunggu validasi dari Dosen Wali.'
  },
  {
    q: 'Berapa batas maksimal SKS yang bisa diambil per semester?',
    a: 'Berdasarkan Panduan Akademik UNNES terbaru, batas SKS ditentukan oleh IPS Anda sebelumnya:\n• IPS > 3.00 - 4.00 → Maks. 24 SKS\n• IPS 2.51 - 3.00 → Maks. 20 - 22 SKS\n• IPS 2.00 - 2.50 → Maks. 18 SKS\n• IPS 1.50 - 1.99 → Maks. 16 SKS\n• IPS < 1.50 → Maks. 12 SKS'
  },
  {
    q: 'Apa saja pilihan Tugas Akhir di UNNES?',
    a: 'Sesuai Permendikbudristek No. 53/2023, mahasiswa Ilkom UNNES memiliki 5 alternatif non-skripsi reguler:\n1. Prototipe: Pembuatan produk/aplikasi (Web/Mobile/IoT/AI) fungsional.\n2. Proyek: Implementasi teknologi/solusi IT di industri atau masyarakat.\n3. Publikasi Ilmiah: Bisa bebas sidang (nilai A otomatis) jika terbit di jurnal Sinta 1/2 atau Scopus.\n4. Prestasi Kejuaraan: Konversi juara kompetisi IT (misal PIMNAS, Gemastik).\n5. Book Chapter: Menulis bab buku ilmiah ber-ISBN.\n*Syarat dan format konversi wajib dikonsultasikan dengan Kaprodi.'
  },
  {
    q: 'Bagaimana prosedur permohonan surat izin Kerja Praktik (PKL)?',
    a: 'Pastikan syarat SKS terpenuhi dan PKL masuk di KRS. Setelah mendapat persetujuan instansi dari Kaprodi, ajukan pembuatan surat pengantar secara digital via layanan administrasi Fakultas (SIVELA). Ambil surat resmi dari TU dan kirimkan ke instansi mitra.'
  },
  {
    q: 'Di mana saya bisa mendapatkan template penulisan Skripsi?',
    a: 'Buku panduan resmi dapat diunduh di situs FMIPA UNNES. Untuk template penulisan, Anda bisa menggunakan format LaTeX siap pakai dari GitHub komunitas mahasiswa (misal: ajienator/template-skripsi-latex-ilkom), melihat web panduan komunitas, atau meminta format Word (.docx) terbaru dari Dosen Pembimbing maupun HIMA Ilkom.'
  },
  {
    q: 'Bagaimana prosedur pengajuan cuti akademik?',
    a: 'Pengajuan cuti dilakukan secara daring melalui portal MyUNNES atau Apps UNNES. Setelah berkonsultasi dengan Dosen Wali, isi formulir pengajuan di sistem. Setelah divalidasi oleh Kaprodi, lakukan pembayaran administrasi via Virtual Account untuk dapat mencetak Kartu Cuti. Pastikan pengajuan tidak melewati batas waktu di kalender akademik.'
  },
  {
    q: 'Bagaimana jika saya terlambat mengisi KRS?',
    a: 'Status akademik Anda terancam tidak aktif (nama tidak masuk absen & nilai tidak bisa diinput). Langkah penanganannya: 1) Segera hubungi Dosen Wali untuk konsultasi; 2) Temui Kaprodi Ilmu Komputer untuk meminta izin/kebijakan susulan; 3) Jika disetujui, urus pembukaan akses sistem ke bagian Akademik Fakultas.'
  },
  {
    q: 'Di mana saya bisa mengakses nilai dan transkrip?',
    a: 'Anda dapat mengaksesnya melalui portal Akademik UNNES (akademik.unnes.ac.id). Login dengan email student, masuk ke SIKADU. Untuk nilai per semester (KHS), cek di menu Aktivitas Kuliah > Riwayat Akademik. Untuk nilai keseluruhan (Transkrip), pilih menu Pencetakan > Riwayat Akademik.'
  }
]

const SOP_DATA = [
  {
    icon: ClipboardList,
    title: 'Alur Pengisian KRS (SIKADU)',
    color: 'var(--blue-600)',
    bg: 'var(--blue-50)',
    steps: [
      'Login ke apps.unnes.ac.id menggunakan email UNNES',
      'Buka tab Akademik lalu masuk ke aplikasi SIKADU',
      'Klik ikon kalender untuk memilih semester aktif',
      'Klik menu Aktivitas Kuliah atau Rencana Studi',
      'Pilih mata kuliah sesuai kurikulum dan batas SKS',
      'Simpan rencana studi dan tunggu validasi Dosen Wali'
    ]
  },
  {
    icon: Briefcase,
    title: 'Alur Kerja Praktik (PKL)',
    color: 'var(--blue-600)',
    bg: 'var(--blue-50)',
    steps: [
      'Penuhi SKS dan masukkan mata kuliah PKL ke KRS',
      'Konsultasi persetujuan instansi dengan Kaprodi',
      'Ajukan formulir surat izin via administrasi Fakultas',
      'Ambil surat resmi TU dan serahkan ke instansi mitra',
      'Serahkan surat balasan penerimaan ke Jurusan',
      'Laksanakan PKL, catat logbook, dan susun laporan'
    ]
  },
  {
    icon: GraduationCap,
    title: 'Alur Tugas Akhir (Skripsi)',
    color: 'var(--blue-600)',
    bg: 'var(--blue-50)',
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
    color: 'var(--blue-600)',
    bg: 'var(--blue-50)',
    steps: [
      'Login ke apps.unnes.ac.id (MYUNNES-STUDENTS)',
      'Cek tagihan UKT di menu Registrasi > Pembayaran',
      'Bayar UKT via Virtual Account BNI/BTN/Mandiri/BRI',
      'Status akademik di SIKADU akan otomatis aktif',
      'Jika baru selesai cuti, pastikan lapor ke Fakultas',
      'Lanjutkan pengisian KRS secara mandiri di SIKADU'
    ]
  },
  {
    icon: FileText,
    title: 'Pengajuan Cuti Akademik',
    color: 'var(--blue-600)',
    bg: 'var(--blue-50)',
    steps: [
      'Konsultasi rencana cuti dengan Dosen Wali',
      'Login ke portal MyUNNES atau Apps UNNES',
      'Isi formulir pengajuan cuti beserta alasannya',
      'Tunggu validasi persetujuan dari Kaprodi',
      'Bayar administrasi cuti via Virtual Account',
      'Cetak Kartu Cuti setelah status tersinkronisasi'
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
      <section className="page-header-buku">
        <BackButton to="/" />
        <div className="banner-buku-pattern top">
          <div className="banner-buku-logos-top">
            <img src="/assets/Group 100881 (2).png" alt="Logos" />
          </div>
        </div>
        <div className="banner-buku-body">
          <div className="banner-buku-left-ornament">
             <div className="banner-buku-kitab-ilkom">
                <span>KITAB</span>
                <span>ILKOM</span>
             </div>
             <div className="banner-buku-vline"></div>
          </div>
          <div className="banner-buku-center-text">
            <span className="banner-buku-subtitle">PUSAT BANTUAN</span>
            <h1 className="banner-buku-title">BANTUAN MAHASISWA</h1>
          </div>
          <div className="banner-buku-speech-bubble">Ada yang bisa<br/>kami bantu?</div>
          <img src="/assets/lebah akasin.png" alt="Lebah Akasin" className="banner-buku-mascot-right" />
        </div>
        <div className="banner-buku-pattern bottom"></div>
      </section>

      <section className="page-content">
        <div className="container">

          {/* ===== FAQ ===== */}
          <div className="bantuan-section">
            <div className="bantuan-section-header">
              <HelpCircle size={28} />
              <h2>Pertanyaan yang Sering Diajukan (FAQ)</h2>
            </div>
            <div className="bantuan-faq-list">
              {FAQ_DATA.map((item, i) => (
                <div className={`bantuan-faq-item ${openFaq === i ? 'open' : ''}`} key={i}>
                  <button 
                    className="bantuan-faq-question" 
                    onClick={() => toggleFaq(i)}
                    aria-expanded={openFaq === i}
                    aria-controls={`faq-answer-${i}`}
                  >
                    <span>{item.q}</span>
                    <ChevronDown size={20} className="bantuan-faq-chevron" />
                  </button>
                  <div className="bantuan-faq-answer" id={`faq-answer-${i}`}>
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

          {/* ===== LAYANAN ASPIRASI ===== */}
          <div className="bantuan-section" style={{ marginTop: '4rem', textAlign: 'center' }}>
            <div className="bantuan-section-header" style={{ justifyContent: 'center' }}>
              <MessageSquare size={28} />
              <h2>Layanan Aspirasi Mahasiswa</h2>
            </div>
            <p style={{ color: 'var(--gray-600)', marginBottom: '2rem', fontSize: '1rem' }}>
              Punya keluhan fasilitas, pertanyaan khusus, kritik, atau saran untuk Ilmu Komputer? Suarakan di sini!
            </p>
            <div className="bantuan-quick-actions" style={{ display: 'flex', justifyContent: 'center' }}>
              <Link to="/aspirasi" className="bantuan-action-card bantuan-action-aspirasi" style={{ maxWidth: '600px', width: '100%', textAlign: 'left' }}>
                <div className="bantuan-action-icon">
                  <Send size={24} />
                </div>
                <div className="bantuan-action-text">
                  <h3>Sampaikan Aspirasi</h3>
                  <p>Klik di sini untuk mengisi formulir aspirasi HIMA secara rahasia dan aman.</p>
                </div>
                <ChevronRight className="bantuan-action-arrow" size={20} />
              </Link>
            </div>
          </div>

        </div>
      </section>
    </>
  )
}

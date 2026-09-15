# 📘 Kitab Ilkom

Portal akademik interaktif untuk mahasiswa Jurusan Ilmu Komputer UNNES. Aplikasi ini merupakan sistem manajemen pembelajaran dan direktori informasi terpusat yang dibangun dengan ekosistem modern (React + Supabase), dirancang khusus untuk memfasilitasi kebutuhan akademik mahasiswa Ilmu Komputer secara aman, elegan, dan responsif.

## ✨ Fitur Utama

- **Sistem Autentikasi Eksklusif:** Login dan pendaftaran diamankan secara ketat (di sisi klien maupun _database_) hanya untuk email berdomain `@students.unnes.ac.id`.
- **Dukungan Mode Gelap (Dark Mode):** Desain antarmuka responsif dengan kemampuan Mode Terang/Gelap otomatis yang dinamis dan _glassmorphism_.
- **Direktori Buku Akademik:** Gudang materi perkuliahan terstruktur berdasarkan Program Studi dan Semester. File dilindungi melalui URL berbatas waktu (_signed URL_) dari Supabase Storage.
- **Papan Informasi & Kalender:** Akses cepat ke pengumuman terbaru, jadwal bootcamp, kompetisi, dan info beasiswa.
- **Direktori Dosen:** Basis data profil dosen Ilmu Komputer yang mudah dicari.
- **Sistem Voting Terbatas:** Modul "Vote Tutorin" yang adil, di mana setiap mahasiswa hanya dapat memberikan 1 suara yang permanen dan tidak dapat dimanipulasi (berkat kebijakan Supabase RLS).
- **Dasbor Admin Komprehensif:** Panel khusus admin untuk mengelola pengguna (CRUD), mengunggah materi baru, memublikasikan pengumuman, memantau perolehan suara secara *real-time*, dan meninjau aspirasi mahasiswa.

## 🛠️ Tech Stack

- **Frontend:** React 19, Vite, React Router DOM
- **Backend & Database:** Supabase (PostgreSQL), Supabase Auth, Supabase Storage
- **Styling:** Vanilla CSS (CSS Variables) dengan dukungan Mode Gelap penuh
- **Ikon:** Lucide React

## 🚀 Panduan Setup & Instalasi Lokal

### 1. Konfigurasi Supabase
1. Buat proyek baru di [Supabase](https://supabase.com/).
2. Buka **SQL Editor** pada dasbor Supabase Anda, salin-tempel seluruh isi _file_ `supabase_schema.sql` (jika tersedia), lalu jalankan (_Run_). Ini akan secara otomatis membuat struktur tabel, menerapkan kebijakan _Row Level Security_ (RLS), memicu validasi domain email, dan membuat _storage bucket_.
3. Buka **Project Settings > API**, lalu salin URL Proyek Anda dan kunci Publik Anonim (_anon public key_).

### 2. Konfigurasi Environment Lokal
Buat sebuah _file_ `.env` di _root directory_ aplikasi Anda (bisa merujuk pada `.env.example`) dan isi dengan kredensial Supabase Anda:

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=masukkan-kunci-anon-anda-di-sini
```

### 3. Instalasi dan Menjalankan Proyek
Buka terminal Anda dan jalankan perintah berikut:

```bash
# Instal seluruh dependensi
npm install

# Jalankan server pengembangan lokal (Dev Server)
npm run dev
```

### 4. Aktivasi Akun Admin Pertama (Penting)
Demi keamanan tingkat tinggi, tidak ada fitur promosi _self-service_ (otomatis) untuk menjadi admin. Admin pertama harus diatur secara manual melalui _database_:

1. Jalankan aplikasi lokal Anda dan daftar (Registrasi) akun melalui halaman **/register** menggunakan email mahasiswa (`@students.unnes.ac.id`).
2. Cek kotak masuk email Anda untuk melakukan konfirmasi tautan pendaftaran.
3. Buka Dasbor Supabase Anda > **Table Editor** > pilih tabel **`profiles`**.
4. Cari baris yang berisi data akun Anda, lalu ubah nilai pada kolom `role` dari `mahasiswa` menjadi `admin`.
5. Login kembali di aplikasi Kitab Ilkom. Selamat! Panel kontrol **Admin** akan muncul di bilah navigasi Anda.
6. Untuk menambahkan admin baru selanjutnya, Anda dapat melakukannya langsung dari antarmuka aplikasi melalui menu **Admin > Kelola Pengguna** tanpa perlu membuka Dasbor Supabase lagi.

## 🔒 Matriks Hak Akses (Role-based Access)

| Modul/Fitur | Akses Publik (Tamu) | Akses Mahasiswa (Login) | Akses Admin |
|-------------|:---:|:---:|:---:|
| **Beranda & Dasbor** | ✅ | ✅ | ✅ |
| **Info Akademik** | ✅ | ✅ | ✅ |
| **Profil Dosen** | ✅ | ✅ | ✅ |
| **Buku Akademik** | ❌ (Dialihkan ke Login) | ✅ (Akses Unduhan Aman) | ✅ (Manajemen Penuh) |
| **Vote Tutorin** | ❌ (Dialihkan ke Login) | ✅ (Hanya bisa Vote) | ✅ (Lihat Hasil & Manajemen) |
| **Form Aspirasi** | ❌ (Dialihkan ke Login) | ✅ (Kirim Aspirasi) | ✅ (Baca & Tanggapi) |
| **Panel Admin** | ❌ | ❌ | ✅ |

## 📦 Panduan Build & Deployment (Produksi)

Untuk mempersiapkan aplikasi sebelum didistribusikan secara *online*, jalankan:

```bash
npm run build
```
Hasil _build_ yang telah dioptimalkan akan berada di dalam folder `dist/`. Anda dapat langsung men-_deploy_ folder ini ke berbagai platform _hosting_ modern seperti **Vercel**, **Netlify**, atau platform _static hosting_ lainnya.

> **Catatan Penting Deployment:** Pastikan Anda juga memasukkan (men-_setting_) kedua *environment variables* (`VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY`) pada pengaturan _Environment Variables_ di dasbor _hosting_ Anda (misal: di Dasbor Vercel).

---
*Didesain dan dikembangkan untuk mahasiswa HIMA Ilmu Komputer UNNES.* 💻✨

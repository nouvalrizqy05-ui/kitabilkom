# Kitab Ilkom (React + Supabase)

Portal akademik Jurusan Ilmu Komputer UNNES. Versi ini adalah migrasi dari
HTML/CSS/JS statis ke React (web), dengan backend Supabase (auth + database +
storage) dan sistem login khusus domain kampus `@students.unnes.ac.id`.

## Stack

- React 19 + Vite
- React Router (routing halaman)
- Supabase (Postgres, Auth, Storage)
- lucide-react (ikon)

## Setup

### 1. Buat project Supabase

1. Buat project baru di https://supabase.com
2. Buka **SQL Editor**, paste seluruh isi `supabase_schema.sql`, lalu Run.
   Ini akan membuat semua tabel, Row Level Security, trigger pembatasan
   domain email, dan storage bucket.
3. Buka **Project Settings > API**, salin `Project URL` dan `anon public key`.

### 2. Konfigurasi environment

Copy `.env.example` jadi `.env`, lalu isi dengan nilai dari langkah di atas:

```
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=isi-anon-key-kamu
```

### 3. Jalankan aplikasi

```bash
npm install
npm run dev
```

### 4. Buat akun admin pertama (wajib, hanya sekali)

Karena tidak ada admin pertama secara default (demi keamanan — sengaja tidak
ada cara self-service untuk jadi admin):

1. Buka aplikasi, daftar akun lewat halaman **/register** pakai email
   `@students.unnes.ac.id` kamu sendiri.
2. Cek email untuk konfirmasi (kalau "Confirm email" aktif di Supabase Auth
   settings — default aktif).
3. Di Supabase Dashboard > **Table Editor > profiles**, cari baris akun kamu,
   ubah kolom `role` dari `mahasiswa` ke `admin` secara manual.
4. Login ulang di aplikasi. Menu **Admin** akan muncul di navbar.
5. Selanjutnya, admin lain bisa dipromosikan lewat panel **Admin > Kelola
   Pengguna** — tidak perlu masuk ke Supabase dashboard lagi.

## Struktur fitur

| Fitur | Akses | Keterangan |
|---|---|---|
| Beranda | Publik | Statistik real dari database, info terbaru |
| Info Akademik | Publik | Pengumuman, lomba, beasiswa, bootcamp |
| Dosen Ilkom | Publik | Direktori dosen, bisa dicari |
| Buku Akademik | Login | Materi kuliah, unduh via signed URL (privat) |
| Vote Tutorin | Login | 1 akun = 1 suara per sesi voting |
| Admin | Role admin | CRUD semua konten + kelola role pengguna |

## Catatan implementasi & batasan yang perlu tahu

- **Data dummy sudah dihapus total.** Semua konten (buku, info, dosen,
  kandidat vote) sekarang berasal dari database — kosong sampai admin
  mengisi lewat panel Admin. Tidak ada lagi nama dosen/NIP palsu.
- **Hasil vote hanya terlihat oleh admin** (di panel Admin > Vote Tutorin),
  supaya tidak ada "war vote" antar kandidat. Mahasiswa hanya melihat status
  sudah/belum vote.
- **Vote tidak bisa diubah atau dihapus** setelah dikirim (termasuk oleh
  admin lewat API) — ini keputusan desain yang disengaja lewat RLS policy,
  supaya hasil voting tidak bisa dimanipulasi setelah masuk.
- **File materi kuliah disimpan privat** (bucket `buku-files`), diakses lewat
  signed URL yang berlaku 60 detik — jadi link unduhan tidak bisa dibagikan
  bebas ke orang yang belum login.
- **Kalender grid bulanan** di desain lama (kotak tanggal penuh) disederhanakan
  jadi daftar "Info Akademik Terbaru" untuk versi awal ini. Kalau kalender grid
  visual tetap diinginkan, itu bisa ditambahkan sebagai iterasi berikutnya.
- **Ikon media sosial di footer pakai ikon generik**, bukan logo asli
  Instagram/Twitter/dll — versi `lucide-react` yang dipasang sudah tidak lagi
  menyertakan logo brand karena alasan trademark. Link-nya sendiri masih
  placeholder (`#`), isi manual dengan URL akun sosial media HIMA yang asli.
- **Restriksi domain email** dicek di 2 lapis: di form (client-side, untuk UX
  cepat) dan di database trigger (server-side, tidak bisa dilewati walau
  client-side-nya di-bypass).

## Build untuk produksi

```bash
npm run build
```

Hasilnya ada di folder `dist/` — bisa di-deploy ke Netlify, Vercel, atau
static hosting lain (jangan lupa set environment variable `VITE_SUPABASE_URL`
dan `VITE_SUPABASE_ANON_KEY` di dashboard hosting-nya juga).

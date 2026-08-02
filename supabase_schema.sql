-- =====================================================================
-- KITAB ILKOM — Supabase Schema
-- Jalankan file ini di Supabase Dashboard > SQL Editor (sekali jalan,
-- dari atas ke bawah, di project Supabase yang baru/kosong).
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. TABEL PROFILES (role: admin | mahasiswa)
-- ---------------------------------------------------------------------
create type user_role as enum ('admin', 'mahasiswa');

create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  nama text,
  role user_role not null default 'mahasiswa',
  created_at timestamptz default now()
);

-- ---------------------------------------------------------------------
-- 2. TRIGGER: batasi signup hanya untuk email @students.unnes.ac.id
--    dan otomatis buat baris profiles saat user baru mendaftar.
-- ---------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger as $$
begin
  if new.email !~* '@students\.unnes\.ac\.id$' then
    raise exception 'Pendaftaran hanya untuk email kampus (@students.unnes.ac.id).';
  end if;

  insert into public.profiles (id, email, nama, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'nama', split_part(new.email, '@', 1)),
    'mahasiswa'
  );
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------------------------------------------------------------------
-- 3. TABEL KONTEN INTI
-- ---------------------------------------------------------------------
create table public.buku_akademik (
  id uuid primary key default gen_random_uuid(),
  judul text not null,
  dosen text,
  kategori text not null check (kategori in ('PDF', 'Modul', 'E-Book')),
  semester int,
  file_url text, -- path di storage bucket "buku-files", bukan URL publik
  created_by uuid references public.profiles(id),
  created_at timestamptz default now()
);

create table public.info_akademik (
  id uuid primary key default gen_random_uuid(),
  judul text not null,
  kategori text, -- Penting, Berita, Lomba, Beasiswa, Bootcamp
  tanggal date default current_date,
  konten text,
  created_by uuid references public.profiles(id),
  created_at timestamptz default now()
);

create table public.dosen (
  id uuid primary key default gen_random_uuid(),
  nama text not null,
  bidang text,
  nip text,
  foto_url text,
  created_by uuid references public.profiles(id),
  created_at timestamptz default now()
);

create table public.vote_events (
  id uuid primary key default gen_random_uuid(),
  judul text not null,
  deadline timestamptz,
  status text not null default 'draft' check (status in ('draft', 'active', 'closed')),
  created_by uuid references public.profiles(id),
  created_at timestamptz default now()
);

create table public.vote_candidates (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references public.vote_events(id) on delete cascade,
  nama text not null,
  angkatan text,
  quote text,
  foto_url text,
  created_at timestamptz default now()
);

create table public.votes (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references public.vote_events(id) on delete cascade,
  candidate_id uuid references public.vote_candidates(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  created_at timestamptz default now(),
  unique (event_id, user_id) -- kunci utama anti-vote-ganda: 1 user, 1 suara per sesi
);

-- ---------------------------------------------------------------------
-- 4. HELPER FUNCTION: cek apakah user yang sedang login adalah admin
-- ---------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer stable set search_path = public;

-- ---------------------------------------------------------------------
-- 5. ROW LEVEL SECURITY
-- ---------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.buku_akademik enable row level security;
alter table public.info_akademik enable row level security;
alter table public.dosen enable row level security;
alter table public.vote_events enable row level security;
alter table public.vote_candidates enable row level security;
alter table public.votes enable row level security;

-- profiles: user boleh lihat data sendiri, admin boleh lihat semua.
-- Update role HANYA boleh oleh admin (mencegah user menaikkan role sendiri).
create policy "profiles_select" on public.profiles
  for select using (auth.uid() = id or public.is_admin());

create policy "profiles_admin_update" on public.profiles
  for update using (public.is_admin());

-- buku_akademik: baca butuh login, tulis (insert/update/delete) khusus admin.
create policy "buku_select_authenticated" on public.buku_akademik
  for select using (auth.role() = 'authenticated');
create policy "buku_admin_insert" on public.buku_akademik
  for insert with check (public.is_admin());
create policy "buku_admin_update" on public.buku_akademik
  for update using (public.is_admin());
create policy "buku_admin_delete" on public.buku_akademik
  for delete using (public.is_admin());

-- info_akademik: baca publik (biar Info Akademik bisa dilihat tanpa login),
-- tulis khusus admin.
create policy "info_select_public" on public.info_akademik
  for select using (true);
create policy "info_admin_insert" on public.info_akademik
  for insert with check (public.is_admin());
create policy "info_admin_update" on public.info_akademik
  for update using (public.is_admin());
create policy "info_admin_delete" on public.info_akademik
  for delete using (public.is_admin());

-- dosen: baca publik, tulis khusus admin.
create policy "dosen_select_public" on public.dosen
  for select using (true);
create policy "dosen_admin_insert" on public.dosen
  for insert with check (public.is_admin());
create policy "dosen_admin_update" on public.dosen
  for update using (public.is_admin());
create policy "dosen_admin_delete" on public.dosen
  for delete using (public.is_admin());

-- vote_events & vote_candidates: baca butuh login, tulis khusus admin.
create policy "vote_events_select_authenticated" on public.vote_events
  for select using (auth.role() = 'authenticated');
create policy "vote_events_admin_insert" on public.vote_events
  for insert with check (public.is_admin());
create policy "vote_events_admin_update" on public.vote_events
  for update using (public.is_admin());
create policy "vote_events_admin_delete" on public.vote_events
  for delete using (public.is_admin());

create policy "vote_candidates_select_authenticated" on public.vote_candidates
  for select using (auth.role() = 'authenticated');
create policy "vote_candidates_admin_insert" on public.vote_candidates
  for insert with check (public.is_admin());
create policy "vote_candidates_admin_update" on public.vote_candidates
  for update using (public.is_admin());
create policy "vote_candidates_admin_delete" on public.vote_candidates
  for delete using (public.is_admin());

-- votes: user hanya boleh lihat suara sendiri (admin lihat semua untuk hitung
-- hasil), insert hanya untuk diri sendiri, TIDAK ADA policy update/delete
-- (artinya vote tidak bisa diubah/dihapus sama sekali lewat API, termasuk oleh
-- admin — by design, supaya hasil voting tidak bisa dimanipulasi).
create policy "votes_select_own_or_admin" on public.votes
  for select using (auth.uid() = user_id or public.is_admin());
create policy "votes_insert_own" on public.votes
  for insert with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------
-- 6. STORAGE BUCKETS
--    - buku-files: privat, cuma bisa diakses lewat signed URL (harus login)
--    - foto: publik (buat foto dosen & kandidat vote, biar gampang ditampilkan)
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public) values ('buku-files', 'buku-files', false);
insert into storage.buckets (id, name, public) values ('foto', 'foto', true);

create policy "buku_files_select_authenticated" on storage.objects
  for select using (bucket_id = 'buku-files' and auth.role() = 'authenticated');
create policy "buku_files_admin_insert" on storage.objects
  for insert with check (bucket_id = 'buku-files' and public.is_admin());
create policy "buku_files_admin_delete" on storage.objects
  for delete using (bucket_id = 'buku-files' and public.is_admin());

create policy "foto_select_public" on storage.objects
  for select using (bucket_id = 'foto');
create policy "foto_admin_insert" on storage.objects
  for insert with check (bucket_id = 'foto' and public.is_admin());
create policy "foto_admin_delete" on storage.objects
  for delete using (bucket_id = 'foto' and public.is_admin());

-- =====================================================================
-- SELESAI. Langkah selanjutnya (lihat README.md bagian "Setup Supabase"):
-- 1. Daftar 1 akun lewat halaman /register di aplikasi (jadi 'mahasiswa').
-- 2. Di Table Editor > profiles, ubah manual kolom role akun itu jadi 'admin'.
-- 3. Login ulang — akun itu sekarang punya akses ke /admin.
-- =====================================================================

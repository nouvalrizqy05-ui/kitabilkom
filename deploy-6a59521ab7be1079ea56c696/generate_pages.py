import os

with open('d:\\A\\New folder\\index.html', 'r', encoding='utf-8') as f:
    html = f.read()

header_end = html.find('<!-- ==================== HERO CAROUSEL ==================== -->')
footer_start = html.find('<!-- ==================== FOOTER ==================== -->')

header = html[:header_end]
# Fix navigation links in header to go back to index.html
header = header.replace('href="#beranda"', 'href="index.html"')
header = header.replace('href="#buku-akademik"', 'href="index.html#buku-akademik"')

footer = html[footer_start:]

def create_page(filename, title, subtitle, content):
    page_html = f"""{header}
    <!-- ==================== PAGE HEADER ==================== -->
    <section class="page-header">
        <div class="container">
            <h1 class="page-title">{title}</h1>
            <p class="page-subtitle">{subtitle}</p>
        </div>
    </section>

    <!-- ==================== PAGE CONTENT ==================== -->
    <section class="page-content">
        <div class="container">
{content}
        </div>
    </section>
{footer}
"""
    with open(f"d:\\A\\New folder\\{filename}", 'w', encoding='utf-8') as out:
        out.write(page_html)

# 1. Buku Akademik
buku_content = """
            <div class="page-tabs">
                <button class="tab-btn active">Semester 1</button>
                <button class="tab-btn">Semester 2</button>
                <button class="tab-btn">Semester 3</button>
                <button class="tab-btn">Semua</button>
            </div>
            <div class="cards-grid">
                <!-- Card 1 -->
                <div class="card-3d">
                    <span class="card-badge">PDF</span>
                    <div class="card-image-wrap">
                        <img src="assets/hero-laptop.png" alt="Buku" style="height: 120px; filter: drop-shadow(0 10px 20px rgba(0,0,0,0.5)); mix-blend-mode: normal;">
                    </div>
                    <h3 class="card-title">Algoritma & Pemrograman</h3>
                    <p class="card-meta">Dosen: Prof. Dr. Budi Santoso</p>
                    <button class="btn-primary-small">Unduh Buku</button>
                </div>
                <!-- Card 2 -->
                <div class="card-3d">
                    <span class="card-badge">Modul</span>
                    <div class="card-image-wrap" style="background: var(--purple-800);">
                        <img src="assets/hero-new.png" alt="Modul" style="height: 120px; filter: drop-shadow(0 10px 20px rgba(0,0,0,0.5));">
                    </div>
                    <h3 class="card-title">Sistem Operasi</h3>
                    <p class="card-meta">Dosen: Ir. Siti Aminah, M.Kom.</p>
                    <button class="btn-primary-small">Unduh Modul</button>
                </div>
                <!-- Card 3 -->
                <div class="card-3d">
                    <span class="card-badge">E-Book</span>
                    <div class="card-image-wrap" style="background: var(--gold-800);">
                        <img src="assets/hero-laptop.png" alt="EBook" style="height: 120px; filter: drop-shadow(0 10px 20px rgba(0,0,0,0.5));">
                    </div>
                    <h3 class="card-title">Kalkulus Dasar</h3>
                    <p class="card-meta">Dosen: Dr. Andi Wijaya</p>
                    <button class="btn-primary-small">Unduh Buku</button>
                </div>
            </div>
"""

# 2. Info Akademik
info_content = """
            <div class="cards-grid">
                <div class="card-3d">
                    <span class="card-badge" style="background: var(--gold-500);">Penting</span>
                    <div class="card-image-wrap" style="background: var(--primary-600);">
                        <h2 style="color:white; font-family: var(--font-display); letter-spacing: 2px;">PENGUMUMAN</h2>
                    </div>
                    <h3 class="card-title">Jadwal KRS Semester Gasal</h3>
                    <p class="card-meta">12 Agustus 2026 • Akademik</p>
                    <button class="btn-primary-small" style="background: transparent; color: var(--primary-600); border: 2px solid var(--primary-600);">Baca Selengkapnya</button>
                </div>
                <div class="card-3d">
                    <div class="card-image-wrap" style="background: var(--purple-600);">
                        <h2 style="color:white; font-family: var(--font-display); letter-spacing: 2px;">BERITA</h2>
                    </div>
                    <h3 class="card-title">Seminar Nasional AI & Data Science</h3>
                    <p class="card-meta">5 Agustus 2026 • Event</p>
                    <button class="btn-primary-small" style="background: transparent; color: var(--primary-600); border: 2px solid var(--primary-600);">Baca Selengkapnya</button>
                </div>
            </div>
"""

# 3. Vote Tutorin Maba
vote_content = """
            <div style="text-align:center; margin-bottom: 3rem;">
                <h2 style="font-family: var(--font-display); color: var(--navy-900);">Sisa Waktu: <span style="color: var(--primary-600);">2 Hari 14 Jam</span></h2>
                <p style="color: var(--gray-600);">Silakan pilih calon tutor terbaik pilihanmu untuk angkatan 2026!</p>
            </div>
            <div class="cards-grid">
                <div class="card-3d" style="text-align: center;">
                    <img src="assets/hero-new.png" alt="Kandidat" style="width: 120px; height: 120px; border-radius: 50%; object-fit: cover; margin: 0 auto 1.5rem; background: var(--navy-800); border: 4px solid white; box-shadow: 0 10px 20px rgba(0,0,0,0.1);">
                    <h3 class="card-title">Ahmad Fauzan</h3>
                    <p class="card-meta">Angkatan 2024</p>
                    <p style="font-size: 0.9rem; color: var(--gray-600); margin-bottom: 1.5rem;">"Membangun dasar logika programming yang solid untuk maba."</p>
                    <button class="btn-primary-small" style="width: 100%;">Vote Kandidat</button>
                </div>
                <div class="card-3d" style="text-align: center;">
                    <img src="assets/hero-laptop.png" alt="Kandidat" style="width: 120px; height: 120px; border-radius: 50%; object-fit: cover; margin: 0 auto 1.5rem; background: var(--purple-800); border: 4px solid white; box-shadow: 0 10px 20px rgba(0,0,0,0.1);">
                    <h3 class="card-title">Dina Mariana</h3>
                    <p class="card-meta">Angkatan 2024</p>
                    <p style="font-size: 0.9rem; color: var(--gray-600); margin-bottom: 1.5rem;">"Belajar asik, coding menarik, tanpa beban pikiran."</p>
                    <button class="btn-primary-small" style="width: 100%;">Vote Kandidat</button>
                </div>
            </div>
"""

# 4. Dosen Ilkom
dosen_content = """
            <div style="max-width: 600px; margin: 0 auto 3rem;">
                <input type="text" class="search-input" placeholder="Cari nama dosen atau bidang keahlian..." style="width: 100%; border-radius: var(--radius-full); background: white; border: 1px solid var(--gray-300);">
            </div>
            <div class="cards-grid">
                <div class="card-3d" style="flex-direction: row; align-items: center; gap: 1.5rem;">
                    <div style="width: 80px; height: 80px; border-radius: 50%; background: var(--gray-300) url('assets/hero-new.png') center/cover; flex-shrink: 0; box-shadow: inset 0 2px 5px rgba(0,0,0,0.2);"></div>
                    <div>
                        <h3 class="card-title" style="margin-bottom: 0.2rem; font-size: 1.1rem;">Prof. Dr. Ir. Wahyu Hidayat, M.Kom.</h3>
                        <p class="card-meta" style="margin-bottom: 0.5rem; color: var(--primary-600); font-weight: 600;">Artificial Intelligence</p>
                        <p style="font-size: 0.8rem; color: var(--gray-500);">NIP: 198001012005011001</p>
                    </div>
                </div>
                <div class="card-3d" style="flex-direction: row; align-items: center; gap: 1.5rem;">
                    <div style="width: 80px; height: 80px; border-radius: 50%; background: var(--purple-300) url('assets/hero-laptop.png') center/cover; flex-shrink: 0; box-shadow: inset 0 2px 5px rgba(0,0,0,0.2);"></div>
                    <div>
                        <h3 class="card-title" style="margin-bottom: 0.2rem; font-size: 1.1rem;">Dr. Rina Puspita, S.Kom., M.Cs.</h3>
                        <p class="card-meta" style="margin-bottom: 0.5rem; color: var(--primary-600); font-weight: 600;">Data Science & Analytics</p>
                        <p style="font-size: 0.8rem; color: var(--gray-500);">NIP: 198502022010122002</p>
                    </div>
                </div>
                <div class="card-3d" style="flex-direction: row; align-items: center; gap: 1.5rem;">
                    <div style="width: 80px; height: 80px; border-radius: 50%; background: var(--gold-300) url('assets/hero-new.png') center/cover; flex-shrink: 0; box-shadow: inset 0 2px 5px rgba(0,0,0,0.2);"></div>
                    <div>
                        <h3 class="card-title" style="margin-bottom: 0.2rem; font-size: 1.1rem;">Ahmad Yulianto, S.Kom., M.T.</h3>
                        <p class="card-meta" style="margin-bottom: 0.5rem; color: var(--primary-600); font-weight: 600;">Software Engineering</p>
                        <p style="font-size: 0.8rem; color: var(--gray-500);">NIP: 199003032015041003</p>
                    </div>
                </div>
            </div>
"""

create_page("bukuakademik.html", "Buku Akademik Digital", "Temukan dan unduh materi kuliah, e-book, dan modul untuk semester Anda.", buku_content)
create_page("infoakademik.html", "Info Akademik", "Pengumuman, berita, dan informasi terbaru seputar Jurusan Ilmu Komputer.", info_content)
create_page("votetutorin.html", "Vote Tutorin Maba", "Tentukan pilihanmu untuk asisten mahasiswa baru angkatan ini.", vote_content)
create_page("dosenilkom.html", "Direktori Dosen", "Kenali lebih dekat profil dan bidang keahlian dosen-dosen Ilmu Komputer UNNES.", dosen_content)

print("Created 4 pages successfully.")

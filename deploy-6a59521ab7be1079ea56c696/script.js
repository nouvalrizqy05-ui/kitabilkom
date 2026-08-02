/* ===================================================
   KITAB ILKOM - Portal Akademik Ilmu Komputer UNNES
   Interactive JavaScript
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // ==================== NAVBAR SCROLL EFFECT ====================
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('back-to-top');

    const handleScroll = () => {
        const scrollY = window.scrollY;

        // Navbar shadow on scroll
        if (scrollY > 20) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Back to top visibility
        if (scrollY > 400) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Back to top click
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ==================== MOBILE NAV TOGGLE ====================
    const navToggle = document.getElementById('navbar-toggle');
    const navMenu = document.getElementById('navbar-nav');

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('open');
    });

    // Close mobile nav when clicking a link
    navMenu.querySelectorAll('.nav-link:not(.dropdown-toggle), .dropdown-item').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('open');
        });
    });

    // Close mobile nav when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('open');
        }
    });

    // ==================== NAV DROPDOWN (AKADEMIK) ====================
    const navDropdown = document.getElementById('nav-dropdown-akademik');

    if (navDropdown) {
        const toggleBtn = navDropdown.querySelector('.dropdown-toggle');

        // Mobile: click toggle
        toggleBtn.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                navDropdown.classList.toggle('open');
            }
        });
    }

    // ==================== HERO CAROUSEL ====================
    const carousel = document.getElementById('hero-carousel');
    const slides = carousel.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    let currentSlide = 0;
    let autoSlideInterval;
    const SLIDE_INTERVAL = 6000;

    const goToSlide = (index) => {
        // Remove active from current
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');

        // Update index (wrap around)
        currentSlide = (index + slides.length) % slides.length;

        // Set new active
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    };

    const nextSlide = () => goToSlide(currentSlide + 1);
    const prevSlide = () => goToSlide(currentSlide - 1);

    const startAutoSlide = () => {
        autoSlideInterval = setInterval(nextSlide, SLIDE_INTERVAL);
    };

    const stopAutoSlide = () => {
        clearInterval(autoSlideInterval);
    };

    // Button controls
    nextBtn.addEventListener('click', () => {
        stopAutoSlide();
        nextSlide();
        startAutoSlide();
    });

    prevBtn.addEventListener('click', () => {
        stopAutoSlide();
        prevSlide();
        startAutoSlide();
    });

    // Dot controls
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            stopAutoSlide();
            goToSlide(index);
            startAutoSlide();
        });
    });

    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoSlide();
    }, { passive: true });

    carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) nextSlide();
            else prevSlide();
        }
        startAutoSlide();
    }, { passive: true });

    // Start auto-slide
    startAutoSlide();

    // Pause on hover
    carousel.addEventListener('mouseenter', stopAutoSlide);
    carousel.addEventListener('mouseleave', startAutoSlide);

    // ==================== SEARCH DROPDOWN ====================
    const searchDropdownBtn = document.getElementById('search-dropdown-btn');
    const searchDropdownMenu = document.getElementById('search-dropdown-menu');
    const searchCategoryText = document.getElementById('search-category-text');
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');

    // Toggle dropdown
    searchDropdownBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        searchDropdownMenu.classList.toggle('open');
    });

    // Select category
    searchDropdownMenu.querySelectorAll('.search-dropdown-item').forEach(item => {
        item.addEventListener('click', () => {
            // Update active state
            searchDropdownMenu.querySelector('.active').classList.remove('active');
            item.classList.add('active');

            // Update button text
            searchCategoryText.textContent = item.dataset.category;

            // Close dropdown
            searchDropdownMenu.classList.remove('open');

            // Update placeholder
            const placeholders = {
                'Semua': 'Cari Mata Kuliah, Materi, Soal, Dll ...',
                'Mata Kuliah': 'Cari nama mata kuliah ...',
                'Materi': 'Cari materi perkuliahan ...',
                'Soal': 'Cari soal ujian atau latihan ...',
                'Dosen': 'Cari nama dosen ...'
            };
            searchInput.placeholder = placeholders[item.dataset.category] || placeholders['Semua'];

            // Focus input
            searchInput.focus();
        });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!searchDropdownBtn.contains(e.target) && !searchDropdownMenu.contains(e.target)) {
            searchDropdownMenu.classList.remove('open');
        }
    });

    // Search action
    const performSearch = () => {
        const query = searchInput.value.trim();
        const category = searchCategoryText.textContent;
        if (query) {
            // Simulate search with animation
            searchBtn.style.transform = 'scale(0.9)';
            setTimeout(() => {
                searchBtn.style.transform = 'scale(1)';
                // In a real app, this would navigate or show results
                alert(`Mencari "${query}" di kategori: ${category}\n\n(Fitur pencarian akan dihubungkan ke database)`);
            }, 150);
        } else {
            searchInput.focus();
            searchInput.classList.add('shake');
            setTimeout(() => searchInput.classList.remove('shake'), 500);
        }
    };

    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') performSearch();
    });

    // ==================== SCROLL ANIMATIONS ====================
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.1
    };

    const animateOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // If it's a stat card, trigger counter
                const counter = entry.target.querySelector('.stat-number, .vote-stat-number');
                if (counter && !counter.dataset.animated) {
                    animateCounter(counter);
                    counter.dataset.animated = 'true';
                }
            }
        });
    }, observerOptions);

    // Add animation classes to sections
    const animatableElements = document.querySelectorAll(
        '.quick-link-card, .info-banner, .event-card, .stat-card, .dosen-card, .vote-wrapper, .section-header'
    );

    animatableElements.forEach((el, index) => {
        el.classList.add('animate-on-scroll');
        el.style.transitionDelay = `${(index % 6) * 80}ms`;
        animateOnScroll.observe(el);
    });

    // ==================== COUNTER ANIMATION ====================
    const animateCounter = (element) => {
        const target = parseInt(element.dataset.target);
        const duration = 2000;
        const startTime = performance.now();

        const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutQuart(progress);
            const currentValue = Math.round(easedProgress * target);

            element.textContent = currentValue.toLocaleString('id-ID');

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        };

        requestAnimationFrame(updateCounter);
    };

    // ==================== QUICK LINK CARD EFFECTS ====================
    const quickLinkCards = document.querySelectorAll('.quick-link-card');

    quickLinkCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // Add subtle tilt effect
            this.style.transform = 'translateY(-6px) perspective(1000px) rotateY(2deg)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });

    // ==================== CALENDAR MATRIX INTERACTIVITY ====================
    const calDays = document.querySelectorAll('.cal-day:not(.empty)');
    const eventCardsContainer = document.querySelectorAll('.event-card');
    const eventsTitle = document.getElementById('events-title');

    calDays.forEach(day => {
        day.addEventListener('click', function() {
            if (this.classList.contains('active')) {
                // Deselect current
                this.classList.remove('active');
                if (eventsTitle) eventsTitle.textContent = 'Semua Acara - Agustus 2026';
                eventCardsContainer.forEach(card => card.style.display = 'flex');
                return;
            }

            // Remove active from all
            calDays.forEach(d => d.classList.remove('active'));
            this.classList.add('active');
            
            const dateNum = this.textContent.trim();
            
            if (this.classList.contains('has-event')) {
                const eventId = this.getAttribute('data-event');
                if (eventsTitle) eventsTitle.textContent = `Acara pada ${dateNum} Agustus 2026`;
                
                eventCardsContainer.forEach(card => {
                    if (card.id === eventId) {
                        card.style.display = 'flex';
                    } else {
                        card.style.display = 'none';
                    }
                });
            } else {
                if (eventsTitle) eventsTitle.textContent = `Acara pada ${dateNum} Agustus 2026`;
                eventCardsContainer.forEach(card => card.style.display = 'none');
            }
        });
    });

    eventCardsContainer.forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', function() {
            const title = this.querySelector('.event-title').textContent;
            console.log(`Opening event: ${title}`);
        });
    });

    // ==================== DOSEN CARDS ====================
    const dosenCards = document.querySelectorAll('.dosen-card');

    dosenCards.forEach(card => {
        card.addEventListener('click', function() {
            const name = this.querySelector('.dosen-name').textContent;
            console.log(`Opening dosen profile: ${name}`);
        });

        card.style.cursor = 'pointer';
    });

    // ==================== SMOOTH SCROLL FOR ANCHOR LINKS ====================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                const navHeight = navbar.offsetHeight;
                const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - navHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ==================== ACTIVE NAV LINK ON SCROLL ====================
    const sections = document.querySelectorAll('section[id], footer[id]');
    const navLinks = document.querySelectorAll('.nav-link:not(.dropdown-toggle)');

    const updateActiveNav = () => {
        const scrollY = window.scrollY + navbar.offsetHeight + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', updateActiveNav, { passive: true });

    // ==================== PARALLAX EFFECT ON HERO ====================
    const heroDecorations = document.querySelectorAll('.hero-decoration');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        if (scrollY < 600) {
            heroDecorations.forEach((dec, i) => {
                const speed = (i + 1) * 0.15;
                dec.style.transform = `translateY(${scrollY * speed}px)`;
            });
        }
    }, { passive: true });

    // ==================== KEYBOARD NAVIGATION ====================
    document.addEventListener('keydown', (e) => {
        // Carousel keyboard nav
        if (e.key === 'ArrowLeft') {
            stopAutoSlide();
            prevSlide();
            startAutoSlide();
        } else if (e.key === 'ArrowRight') {
            stopAutoSlide();
            nextSlide();
            startAutoSlide();
        }
    });

    // ==================== FOOTER 3D MOUSE PARALLAX ====================
    const footer3d = document.querySelector('.footer-3d');
    const grid3d = document.querySelector('.grid-3d');

    if (footer3d && grid3d) {
        footer3d.addEventListener('mousemove', (e) => {
            const rect = footer3d.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;

            grid3d.style.transform = `perspective(600px) rotateX(${55 + y * 5}deg) rotateZ(${x * 3}deg)`;
        });

        footer3d.addEventListener('mouseleave', () => {
            grid3d.style.transform = 'perspective(600px) rotateX(55deg) rotateZ(0deg)';
        });
    }

    // ==================== INITIAL LOAD ANIMATION ====================
    // Trigger first slide animation
    requestAnimationFrame(() => {
        document.body.style.opacity = '1';
    });

    console.log('✨ Kitab Ilkom - Portal Akademik loaded successfully!');
    console.log('🎓 Himpunan Mahasiswa Ilmu Komputer UNNES');
});

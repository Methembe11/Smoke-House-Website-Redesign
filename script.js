/* === STICKY NAVIGATION === */
const navbar = document.getElementById('navbar');
let lastScroll = 0;

function updateNav() {
    const currentScroll = window.scrollY;

    if (currentScroll > 80) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
}

window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

/* === MOBILE MENU === */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', navLinks.classList.contains('active'));
});

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
    });
});

document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target) && navLinks.classList.contains('active')) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
    }
});

/* === ACTIVE NAV LINK === */
const currentPath = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath) {
        link.classList.add('active');
    }
});

/* === GALLERY LIGHTBOX === */
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');

document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
        const img = item.querySelector('img');
        if (img) openLightbox(img.src);
    });
});

function openLightbox(src) {
    lightboxImg.src = src;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

const lightboxClose = document.querySelector('.lightbox-close');
if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
}

if (lightbox) {
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeLightbox();
    }
});

function closeLightbox() {
    if (lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
}

/* === BOOKING MODAL === */
const bookingModal = document.getElementById('bookingModal');

if (bookingModal) {
    const openBookingBtns = document.querySelectorAll('[href="#reservation"].btn-primary, .reservation-buttons .btn-secondary, .booking-trigger');
    const bookingModalClose = document.getElementById('bookingModalClose');
    const bookingForm = document.getElementById('bookingForm');
    const bookingSuccess = document.getElementById('bookingSuccess');

    openBookingBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            bookingModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    document.querySelector('.booking-modal-overlay').addEventListener('click', closeBookingModal);
    if (bookingModalClose) {
        bookingModalClose.addEventListener('click', closeBookingModal);
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && bookingModal.classList.contains('active')) {
            closeBookingModal();
        }
    });

    function closeBookingModal() {
        bookingModal.classList.remove('active');
        document.body.style.overflow = '';
        if (bookingSuccess) bookingSuccess.classList.remove('active');
        if (bookingForm) bookingForm.reset();
        document.querySelectorAll('.form-error').forEach(el => el.classList.remove('visible'));
        document.querySelectorAll('.form-group input.error, .form-group select.error').forEach(el => el.classList.remove('error'));
    }

    bookingModal.addEventListener('click', (e) => {
        if (e.target === bookingModal) {
            closeBookingModal();
        }
    });

    /* === BOOKING FORM VALIDATION === */
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            let isValid = true;
            const fields = [
                { id: 'bookingName', error: 'Please enter your full name' },
                { id: 'bookingEmail', error: 'Please enter a valid email', validate: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) },
                { id: 'bookingPhone', error: 'Please enter your phone number' },
                { id: 'bookingDate', error: 'Please select a date' },
                { id: 'bookingTime', error: 'Please select a time' },
                { id: 'bookingGuests', error: 'Please select number of guests' }
            ];

            fields.forEach(field => {
                const input = document.getElementById(field.id);
                if (!input) return;
                const errorSpan = input.closest('.form-group').querySelector('.form-error');
                const value = input.value.trim();

                if (!value || (field.validate && !field.validate(value))) {
                    errorSpan.textContent = field.error;
                    errorSpan.classList.add('visible');
                    input.classList.add('error');
                    isValid = false;
                } else {
                    errorSpan.classList.remove('visible');
                    input.classList.remove('error');
                }
            });

            if (isValid) {
                const formData = new FormData(bookingForm);
                const data = {};
                formData.forEach((value, key) => { data[key] = value; });

                fetch('/api/reservations', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                }).catch(() => {});

                bookingForm.reset();
                bookingSuccess.classList.add('active');
                document.querySelector('.booking-submit').style.display = 'none';

                setTimeout(() => {
                    closeBookingModal();
                    bookingSuccess.classList.remove('active');
                    document.querySelector('.booking-submit').style.display = '';
                }, 3000);
            }
        });

        bookingForm.querySelectorAll('input, select').forEach(input => {
            input.addEventListener('input', () => {
                const errorSpan = input.closest('.form-group').querySelector('.form-error');
                if (input.classList.contains('error')) {
                    input.classList.remove('error');
                    errorSpan.classList.remove('visible');
                }
            });
        });
    }
}

/* === NEWSLETTER FORM === */
const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
    const newsletterSuccess = document.getElementById('newsletterSuccess');

    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = newsletterForm.querySelector('input');
        const email = input.value.trim();

        if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            fetch('/api/subscribers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            }).catch(() => {});

            input.value = '';
            newsletterSuccess.classList.add('active');
            setTimeout(() => {
                newsletterSuccess.classList.remove('active');
            }, 3000);
        }
    });
}

/* === SCROLL REVEAL === */
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => revealObserver.observe(el));

/* === SMOOTH SCROLL FOR ANCHOR LINKS === */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            const offset = 80;
            const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

/* === HERO CAROUSEL — Hennessy-style full-screen slides === */
(function () {
    const carousel = document.querySelector('.hero-carousel');
    if (!carousel) return;

    const slides = carousel.querySelectorAll('.hero-slide');
    const dots = carousel.querySelectorAll('.hero-dot');
    const prevBtn = carousel.querySelector('.hero-arrow-prev');
    const nextBtn = carousel.querySelector('.hero-arrow-next');
    const CLIP_DURATION = 5000;
    let currentIndex = 0;
    let autoTimer = null;
    let isPaused = false;

    function activateSlide(index) {
        if (index === currentIndex && slides[index].classList.contains('active')) return;

        /* Pause previous video */
        const prevVideo = slides[currentIndex].querySelector('video');
        if (prevVideo) {
            prevVideo.pause();
            prevVideo.currentTime = 0;
        }

        /* Deactivate all */
        slides.forEach(s => s.classList.remove('active'));
        dots.forEach(d => d.classList.remove('active'));

        /* Activate new */
        currentIndex = index;
        slides[currentIndex].classList.add('active');
        dots[currentIndex].classList.add('active');

        /* Play new video */
        const nextVideo = slides[currentIndex].querySelector('video');
        if (nextVideo) {
            if (nextVideo.getAttribute('preload') === 'none') {
                nextVideo.setAttribute('preload', 'auto');
            }
            nextVideo.currentTime = 0;
            const playPromise = nextVideo.play();
            if (playPromise) playPromise.catch(() => {});
        }

        resetAutoTimer();
    }

    function nextSlide() {
        const next = (currentIndex + 1) % slides.length;
        activateSlide(next);
    }

    function prevSlide() {
        const prev = (currentIndex - 1 + slides.length) % slides.length;
        activateSlide(prev);
    }

    function resetAutoTimer() {
        clearTimeout(autoTimer);
        if (!isPaused) {
            autoTimer = setTimeout(nextSlide, CLIP_DURATION);
        }
    }

    /* Dot click navigation */
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const idx = parseInt(dot.dataset.slide, 10);
            activateSlide(idx);
        });
    });

    /* Arrow click navigation */
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);

    /* Play first video immediately */
    const firstVideo = slides[0].querySelector('video');
    if (firstVideo) {
        const playPromise = firstVideo.play();
        if (playPromise) playPromise.catch(() => {});
    }

    /* Pause when tab hidden */
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            isPaused = true;
            clearTimeout(autoTimer);
            slides.forEach(s => { const v = s.querySelector('video'); if (v) v.pause(); });
        } else {
            isPaused = false;
            const activeVideo = slides[currentIndex].querySelector('video');
            if (activeVideo) {
                const playPromise = activeVideo.play();
                if (playPromise) playPromise.catch(() => {});
            }
            resetAutoTimer();
        }
    });

    /* Pause when hero out of viewport */
    if ('IntersectionObserver' in window) {
        const heroObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    isPaused = false;
                    const activeVideo = slides[currentIndex].querySelector('video');
                    if (activeVideo && activeVideo.paused) {
                        const playPromise = activeVideo.play();
                        if (playPromise) playPromise.catch(() => {});
                    }
                    resetAutoTimer();
                } else {
                    isPaused = true;
                    clearTimeout(autoTimer);
                    slides.forEach(s => { const v = s.querySelector('video'); if (v) v.pause(); });
                }
            });
        }, { threshold: 0.15 });
        heroObserver.observe(carousel);
    }

    /* Respect reduced motion */
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    function handleReducedMotion(mq) {
        if (mq.matches) {
            clearTimeout(autoTimer);
            slides.forEach(s => { const v = s.querySelector('video'); if (v) v.pause(); });
        } else {
            const activeVideo = slides[currentIndex].querySelector('video');
            if (activeVideo) {
                const playPromise = activeVideo.play();
                if (playPromise) playPromise.catch(() => {});
            }
            resetAutoTimer();
        }
    }
    prefersReducedMotion.addEventListener('change', handleReducedMotion);
    handleReducedMotion(prefersReducedMotion);

    /* Start auto-advance */
    resetAutoTimer();
})();

/* === MENU FILTER PILLS === */
(function () {
    const filterBar = document.querySelector('.filter-bar');
    if (!filterBar) return;

    const pills = filterBar.querySelectorAll('.filter-pill');
    const grid = document.querySelector('.menu-filter-grid');
    if (!grid) return;

    const cards = grid.querySelectorAll('.menu-card');
    let currentFilter = 'all';
    let isAnimating = false;

    function filterCards(filter) {
        if (isAnimating || filter === currentFilter) return;
        isAnimating = true;
        currentFilter = filter;

        /* Update active pill */
        pills.forEach(pill => pill.classList.remove('active'));
        filterBar.querySelector(`[data-filter="${filter}"]`).classList.add('active');

        /* Phase 1: Hide non-matching cards */
        cards.forEach((card, i) => {
            const categories = card.dataset.categories || '';
            const shouldShow = filter === 'all' || categories.includes(filter);

            if (!shouldShow && !card.classList.contains('hidden')) {
                card.style.transitionDelay = `${i * 30}ms`;
                card.classList.add('hidden');
            }
        });

        /* Phase 2: Show matching cards after hidden ones finish */
        const delay = cards.length * 30 + 100;
        setTimeout(() => {
            let visibleIndex = 0;

            cards.forEach((card) => {
                const categories = card.dataset.categories || '';
                const shouldShow = filter === 'all' || categories.includes(filter);

                if (shouldShow) {
                    card.classList.remove('hidden');
                    card.classList.add('showing');
                    card.style.animationDelay = `${visibleIndex * 60}ms`;
                    visibleIndex++;
                } else {
                    card.classList.remove('showing');
                }
            });

            /* Clean up animation classes */
            setTimeout(() => {
                cards.forEach(card => {
                    card.classList.remove('showing');
                    card.style.animationDelay = '';
                    card.style.transitionDelay = '';
                });
                isAnimating = false;
            }, visibleIndex * 60 + 500);
        }, delay);
    }

    pills.forEach(pill => {
        pill.addEventListener('click', () => {
            const filter = pill.dataset.filter;
            filterCards(filter);
        });
    });
})();

document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile Menu Toggle ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links li a');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = hamburger.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Close menu when clicking a link
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    const icon = hamburger.querySelector('i');
                    if (icon) {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }
                }
            });
        });
    }

    // --- Navbar Scroll Effect & Active Link ---
    const navbar = document.querySelector('.navbar');
    const sections = document.querySelectorAll('section, header');

    window.addEventListener('scroll', () => {
        // Navbar background
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        // Active link highlighting
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href').substring(1) === current) {
                item.classList.add('active');
            }
        });
    });

    // --- Typewriter Effect ---
    const typeWriterElement = document.getElementById('typewriter');
    if (typeWriterElement) {
        const words = ['Full Stack Developer', '.NET Expert', 'Laravel Developer', 'Mobile App Creator'];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 100;

        function typeWriter() {
            const currentWord = words[wordIndex];

            if (isDeleting) {
                typeWriterElement.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 50;
            } else {
                typeWriterElement.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 100;
            }

            if (!isDeleting && charIndex === currentWord.length) {
                isDeleting = true;
                typingSpeed = 1500; // Pause at end of word
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typingSpeed = 500; // Pause before new word
            }

            setTimeout(typeWriter, typingSpeed);
        }

        setTimeout(typeWriter, 1000);
    }

    // --- Scroll Reveal Animation ---
    const reveals = document.querySelectorAll('.reveal');

    function checkReveal() {
        const windowHeight = window.innerHeight;
        const elementVisible = 150;

        reveals.forEach(reveal => {
            const elementTop = reveal.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                reveal.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', checkReveal);
    checkReveal(); // Check on load

    // --- Animated Counters (About Section) ---
    function animateCounter(el) {
        const target = parseInt(el.getAttribute('data-target'), 10);
        const duration = 1500;
        const step = Math.ceil(target / (duration / 16));
        let current = 0;
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            el.textContent = current;
        }, 16);
    }

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.querySelectorAll('.stat-number').forEach(animateCounter);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.4 });

    const aboutContent = document.querySelector('.about-content');
    if (aboutContent) counterObserver.observe(aboutContent);

    // --- Back to Top Button ---
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // --- Set Current Year in Footer ---
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // --- Force-Download CV (works on all browsers & mobile) ---
    const cvBtn = document.getElementById('download-cv-btn');
    if (cvBtn) {
        cvBtn.addEventListener('click', function (e) {
            e.preventDefault();

            const fileUrl = this.getAttribute('href');
            const fileName = this.getAttribute('download') || 'CV.pdf';

            // Visual feedback: show spinner
            const originalHTML = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Downloading...';
            this.style.pointerEvents = 'none';

            fetch(fileUrl)
                .then(response => {
                    if (!response.ok) throw new Error('File not found');
                    return response.blob();
                })
                .then(blob => {
                    const blobUrl = URL.createObjectURL(blob);
                    const tempLink = document.createElement('a');
                    tempLink.href = blobUrl;
                    tempLink.download = fileName;
                    document.body.appendChild(tempLink);
                    tempLink.click();
                    document.body.removeChild(tempLink);
                    // Release memory after short delay
                    setTimeout(() => URL.revokeObjectURL(blobUrl), 500);
                })
                .catch(() => {
                    // Fallback: open file directly if fetch fails
                    window.open(fileUrl, '_blank');
                })
                .finally(() => {
                    // Restore button
                    this.innerHTML = originalHTML;
                    this.style.pointerEvents = '';
                });
        });
    }


    // --- Contact Form Submission (AJAX — no redirect) ---
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const btn = contactForm.querySelector('button[type="submit"]');
            const originalHTML = btn.innerHTML;

            // Show sending state
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            btn.disabled = true;

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: new FormData(contactForm),
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    // Reset & show success banner
                    contactForm.reset();
                    if (formMessage) {
                        formMessage.classList.add('show');
                        setTimeout(() => formMessage.classList.remove('show'), 6000);
                    }
                } else {
                    throw new Error('Server error');
                }
            } catch {
                alert('Oops! Something went wrong. Please try again.');
            } finally {
                btn.innerHTML = originalHTML;
                btn.disabled = false;
            }
        });
    }   // ← closes if (contactForm)

    // --- Certificate Slider ---
    const certTrack = document.getElementById('certTrack');
    const certPrev = document.getElementById('certPrev');
    const certNext = document.getElementById('certNext');
    const certDotsContainer = document.getElementById('certDots');

    if (certTrack && certPrev && certNext && certDotsContainer) {
        const slides = Array.from(certTrack.querySelectorAll('.cert-slide'));
        let current = 0;
        let autoPlay;

        // Build dots
        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.className = 'cert-dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('aria-label', `Go to certificate ${i + 1}`);
            dot.addEventListener('click', () => goTo(i));
            certDotsContainer.appendChild(dot);
        });

        const dots = Array.from(certDotsContainer.querySelectorAll('.cert-dot'));

        function goTo(index) {
            current = (index + slides.length) % slides.length;
            certTrack.style.transform = `translateX(-${current * 100}%)`;
            dots.forEach((d, i) => d.classList.toggle('active', i === current));
            certPrev.disabled = false;
            certNext.disabled = false;
        }

        certPrev.addEventListener('click', () => { goTo(current - 1); resetAutoPlay(); });
        certNext.addEventListener('click', () => { goTo(current + 1); resetAutoPlay(); });

        // Auto-play every 4 s
        function startAutoPlay() {
            autoPlay = setInterval(() => goTo(current + 1), 4000);
        }
        function resetAutoPlay() {
            clearInterval(autoPlay);
            startAutoPlay();
        }

        // Pause on hover
        certTrack.closest('.cert-slider-wrapper').addEventListener('mouseenter', () => clearInterval(autoPlay));
        certTrack.closest('.cert-slider-wrapper').addEventListener('mouseleave', startAutoPlay);

        // Touch / swipe support
        let touchStartX = 0;
        certTrack.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
        certTrack.addEventListener('touchend', e => {
            const diff = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) { goTo(diff > 0 ? current + 1 : current - 1); resetAutoPlay(); }
        }, { passive: true });

        goTo(0);
        startAutoPlay();
    }
});

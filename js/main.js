/**
 * Studio Luzi Santana - Main JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // === 1. Preloader ===
    const preloader = document.getElementById('preloader');
    
    // Remove preloader smoothly after page loads
    window.addEventListener('load', () => {
        setTimeout(() => {
            if (preloader) {
                preloader.classList.add('hidden');
            }
            document.body.classList.add('loaded');
        }, 1800); // Wait for the fill animation to finish
    });

    // Fallback if load event doesn't fire for some reason
    setTimeout(() => {
        if (preloader && !preloader.classList.contains('hidden')) {
            preloader.classList.add('hidden');
            document.body.classList.add('loaded');
        }
    }, 4000);

    // === 2. Mobile Menu Toggle ===
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('nav');
    const navLinks = document.querySelectorAll('.nav-link');

    const toggleMenu = () => {
        hamburger.classList.toggle('active');
        nav.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    };

    if (hamburger) {
        hamburger.addEventListener('click', toggleMenu);
    }

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (nav && nav.classList.contains('active') && !nav.contains(e.target) && !hamburger.contains(e.target)) {
            toggleMenu();
        }
    });

    // === 3. Header Scroll Effect ===
    const header = document.getElementById('header');
    const whatsappFloat = document.getElementById('whatsapp-float');
    let lastScrollTop = 0;

    const handleScroll = () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add background when scrolled down
        if (scrollTop > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Show/hide floating WhatsApp button
        if (whatsappFloat) {
            if (scrollTop > 400) {
                whatsappFloat.classList.add('visible');
            } else {
                whatsappFloat.classList.remove('visible');
            }
        }

        // Hide header when scrolling down, show when scrolling up (after a certain threshold)
        if (scrollTop > 300) {
            if (scrollTop > lastScrollTop) {
                // Scrolling down
                header.classList.add('header-hidden');
            } else {
                // Scrolling up
                header.classList.remove('header-hidden');
            }
        } else {
            header.classList.remove('header-hidden');
        }

        lastScrollTop = scrollTop;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // === 4. Scroll Reveal Animations ===
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const delay = el.getAttribute('data-delay');
                
                if (delay) {
                    setTimeout(() => {
                        el.classList.add('active');
                    }, parseInt(delay));
                } else {
                    el.classList.add('active');
                }
                
                observer.unobserve(el);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => revealObserver.observe(el));

    // === 5. Counters Animation ===
    const counters = document.querySelectorAll('.counter');
    
    const animateCounter = (el) => {
        const target = +el.getAttribute('data-target');
        const duration = 2000;
        const start = 0;
        let startTime = null;

        const easeOutQuad = (t) => t * (2 - t);

        const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / duration, 1);
            
            el.innerText = Math.floor(easeOutQuad(percentage) * (target - start) + start);

            if (progress < duration) {
                window.requestAnimationFrame(step);
            } else {
                el.innerText = target;
            }
        };

        window.requestAnimationFrame(step);
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));

    // === 6. Testimonials Slider ===
    const slides = document.querySelectorAll('.testimonial-slide');
    const dotsContainer = document.getElementById('testimonial-dots');
    let currentSlide = 0;
    let slideInterval;
    const slideDuration = 6000;

    if (slides.length > 0 && dotsContainer) {
        // Create dots
        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            dot.setAttribute('aria-label', `Ir para o depoimento ${index + 1}`);
            if (index === 0) dot.classList.add('active');
            
            dot.addEventListener('click', () => {
                goToSlide(index);
                resetInterval();
            });
            
            dotsContainer.appendChild(dot);
        });

        const dots = document.querySelectorAll('.testimonial-dots .dot');

        const goToSlide = (index) => {
            slides[currentSlide].classList.remove('active');
            dots[currentSlide].classList.remove('active');
            
            currentSlide = index;
            
            slides[currentSlide].classList.add('active');
            dots[currentSlide].classList.add('active');
        };

        const nextSlide = () => {
            let index = currentSlide + 1;
            if (index >= slides.length) index = 0;
            goToSlide(index);
        };

        const startInterval = () => {
            slideInterval = setInterval(nextSlide, slideDuration);
        };

        const resetInterval = () => {
            clearInterval(slideInterval);
            startInterval();
        };

        startInterval();

        // Pause on hover
        const slider = document.getElementById('testimonials-slider');
        if (slider) {
            slider.addEventListener('mouseenter', () => clearInterval(slideInterval));
            slider.addEventListener('mouseleave', startInterval);
            
            // Touch Swipe Support
            let touchStartX = 0;
            let touchEndX = 0;
            
            slider.addEventListener('touchstart', e => {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });
            
            slider.addEventListener('touchend', e => {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
            }, { passive: true });

            const handleSwipe = () => {
                if (touchEndX < touchStartX - 50) {
                    nextSlide();
                    resetInterval();
                } else if (touchEndX > touchStartX + 50) {
                    let index = currentSlide - 1;
                    if (index < 0) index = slides.length - 1;
                    goToSlide(index);
                    resetInterval();
                }
            };
        }
    }

    // === 7. Lightbox for Portfolio ===
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    
    // Assuming portfolio items will have images inside .portfolio-image
    // For now we just mock the functionality so it doesn't break if no images exist
    
    let currentLightboxIndex = 0;
    let portfolioImages = [];

    // Helper to initialize portfolio images when they are dynamically added
    const initLightboxImages = () => {
        portfolioImages = Array.from(document.querySelectorAll('.portfolio-image img')).map(img => img.src);
    };

    if (lightbox && lightboxImg && lightboxClose) {
        
        portfolioItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                initLightboxImages();
                if (portfolioImages.length > 0 && portfolioImages[index]) {
                    currentLightboxIndex = index;
                    lightboxImg.src = portfolioImages[currentLightboxIndex];
                    lightbox.classList.add('active');
                    document.body.classList.add('menu-open'); // Prevent scrolling
                }
            });
        });

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            document.body.classList.remove('menu-open');
            setTimeout(() => { lightboxImg.src = ''; }, 400); // Clear source after fade out
        };

        const showPrevImage = () => {
            if (portfolioImages.length === 0) return;
            currentLightboxIndex = (currentLightboxIndex - 1 + portfolioImages.length) % portfolioImages.length;
            lightboxImg.src = portfolioImages[currentLightboxIndex];
        };

        const showNextImage = () => {
            if (portfolioImages.length === 0) return;
            currentLightboxIndex = (currentLightboxIndex + 1) % portfolioImages.length;
            lightboxImg.src = portfolioImages[currentLightboxIndex];
        };

        lightboxClose.addEventListener('click', closeLightbox);
        
        if (lightboxPrev) lightboxPrev.addEventListener('click', (e) => {
            e.stopPropagation();
            showPrevImage();
        });
        
        if (lightboxNext) lightboxNext.addEventListener('click', (e) => {
            e.stopPropagation();
            showNextImage();
        });

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('active')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') showPrevImage();
                if (e.key === 'ArrowRight') showNextImage();
            }
        });
    }

    // === 8. Active Nav Link on Scroll ===
    const sections = document.querySelectorAll('section[id]');
    
    const highlightNav = () => {
        const scrollY = window.pageYOffset;
        
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 150;
            const sectionId = current.getAttribute('id');
            const navLink = document.querySelector(`.nav-list a[href*=${sectionId}]`);
            
            if (!navLink || navLink.classList.contains('nav-link-cta')) return;

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLink.classList.add('active');
            } else {
                navLink.classList.remove('active');
            }
        });
    };

    window.addEventListener('scroll', highlightNav, { passive: true });
    
    // === 9. Smooth Scroll for Anchor Links ===
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                const headerOffset = header ? header.offsetHeight : 0;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });
});

/**
 * ============================================
 * POWERAFIX - MAIN JAVASCRIPT
 * Pure HTML/CSS/JS Version
 * ============================================
 */

(function() {
    'use strict';

    // ============================================
    // DOM READY
    // ============================================
    document.addEventListener('DOMContentLoaded', function() {
        initHeader();
        initMobileMenu();
        initBeforeAfterSlider();
        initSmoothScroll();
        initContactForm();
        initLazyLoading();
    });

    // ============================================
    // HEADER SCROLL EFFECT
    // ============================================
    function initHeader() {
        const header = document.getElementById('header');
        if (!header) return;

        let lastScrollY = window.scrollY;
        let ticking = false;

        function updateHeader() {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            ticking = false;
        }

        window.addEventListener('scroll', function() {
            lastScrollY = window.scrollY;
            if (!ticking) {
                window.requestAnimationFrame(updateHeader);
                ticking = true;
            }
        }, { passive: true });
    }

    // ============================================
    // MOBILE MENU
    // ============================================
    function initMobileMenu() {
        const menuToggle = document.getElementById('menuToggle');
        const menuClose = document.getElementById('menuClose');
        const mobileMenu = document.getElementById('mobileMenu');
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

        if (!menuToggle || !mobileMenu) return;

        // Open menu
        menuToggle.addEventListener('click', function() {
            mobileMenu.classList.add('open');
            menuToggle.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden';
        });

        // Close menu
        function closeMenu() {
            mobileMenu.classList.remove('open');
            menuToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }

        if (menuClose) {
            menuClose.addEventListener('click', closeMenu);
        }

        // Close on nav link click
        mobileNavLinks.forEach(function(link) {
            link.addEventListener('click', closeMenu);
        });

        // Close on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
                closeMenu();
            }
        });

        // Close on backdrop click
        mobileMenu.addEventListener('click', function(e) {
            if (e.target === mobileMenu) {
                closeMenu();
            }
        });
    }

    // ============================================
    // BEFORE/AFTER SLIDER
    // ============================================
    function initBeforeAfterSlider() {
        const sliders = document.querySelectorAll('[data-before-after]');

        sliders.forEach(function(slider) {
            const beforeLayer = slider.querySelector('.before-after-before');
            const sliderHandle = slider.querySelector('.before-after-slider');
            
            if (!beforeLayer || !sliderHandle) return;

            let isDragging = false;

            function updateSliderPosition(clientX) {
                const rect = slider.getBoundingClientRect();
                let percentage = ((clientX - rect.left) / rect.width) * 100;
                
                // Clamp between 0 and 100
                percentage = Math.max(0, Math.min(100, percentage));
                
                // Update clip-path and slider position
                beforeLayer.style.clipPath = 'inset(0 ' + (100 - percentage) + '% 0 0)';
                sliderHandle.style.left = percentage + '%';
            }

            // Mouse events
            sliderHandle.addEventListener('mousedown', function(e) {
                isDragging = true;
                e.preventDefault();
            });

            document.addEventListener('mousemove', function(e) {
                if (!isDragging) return;
                updateSliderPosition(e.clientX);
            });

            document.addEventListener('mouseup', function() {
                isDragging = false;
            });

            // Touch events
            sliderHandle.addEventListener('touchstart', function(e) {
                isDragging = true;
            }, { passive: true });

            document.addEventListener('touchmove', function(e) {
                if (!isDragging) return;
                updateSliderPosition(e.touches[0].clientX);
            }, { passive: true });

            document.addEventListener('touchend', function() {
                isDragging = false;
            });

            // Click to jump
            slider.addEventListener('click', function(e) {
                if (e.target === sliderHandle || sliderHandle.contains(e.target)) return;
                updateSliderPosition(e.clientX);
            });
        });
    }

    // ============================================
    // SMOOTH SCROLL
    // ============================================
    function initSmoothScroll() {
        const links = document.querySelectorAll('a[href^="#"]');

        links.forEach(function(link) {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#') return;

                const target = document.querySelector(href);
                if (!target) return;

                e.preventDefault();

                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Update URL without jumping
                history.pushState(null, '', href);
            });
        });
    }

    // ============================================
    // CONTACT FORM
    // ============================================
    function initContactForm() {
        const form = document.getElementById('contactForm');
        if (!form) return;

        form.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            // Basic validation
            if (!data.name || !data.email) {
                showFormMessage('Vänligen fyll i alla obligatoriska fält.', 'error');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                showFormMessage('Vänligen ange en giltig e-postadress.', 'error');
                return;
            }

            // Simulate form submission
            const submitBtn = form.querySelector('.form-submit');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="animate-spin"><circle cx="12" cy="12" r="10" stroke-dasharray="60" stroke-dashoffset="20"/></svg> Skickar...';

            // Simulate API call
            setTimeout(function() {
                // Show success message
                form.innerHTML = 
                    '<div class="form-success">' +
                        '<div class="form-success-icon">' +
                            '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>' +
                        '</div>' +
                        '<h3 class="form-success-title">Meddelande skickat!</h3>' +
                        '<p>Vi kontaktar dig snart.</p>' +
                    '</div>';
            }, 1500);
        });

        function showFormMessage(message, type) {
            // Remove existing messages
            const existingMessage = form.querySelector('.form-message');
            if (existingMessage) {
                existingMessage.remove();
            }

            // Create message element
            const messageEl = document.createElement('div');
            messageEl.className = 'form-message form-message--' + type;
            messageEl.textContent = message;
            messageEl.style.cssText = 'padding: 1rem; margin-bottom: 1rem; border-radius: 0.5rem; background: ' + (type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)') + '; color: ' + (type === 'error' ? '#ef4444' : '#22c55e') + ';';

            form.insertBefore(messageEl, form.firstChild);

            // Remove after 5 seconds
            setTimeout(function() {
                messageEl.remove();
            }, 5000);
        }
    }

    // ============================================
    // LAZY LOADING
    // ============================================
    function initLazyLoading() {
        // Check if IntersectionObserver is supported
        if (!('IntersectionObserver' in window)) {
            // Fallback: load all images immediately
            const lazyImages = document.querySelectorAll('img[loading="lazy"]');
            lazyImages.forEach(function(img) {
                img.src = img.dataset.src || img.src;
            });
            return;
        }

        const imageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    // If image has data-src, use it
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    
                    // Stop observing this image
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });

        // Observe all lazy images
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        lazyImages.forEach(function(img) {
            imageObserver.observe(img);
        });
    }

    // ============================================
    // UTILITY FUNCTIONS
    // ============================================
    
    // Debounce function
    function debounce(func, wait) {
        let timeout;
        return function executedFunction() {
            const context = this;
            const args = arguments;
            const later = function() {
                timeout = null;
                func.apply(context, args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Throttle function
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(function() {
                    inThrottle = false;
                }, limit);
            }
        };
    }

    // ============================================
    // ANIMATION ON SCROLL (Optional enhancement)
    // ============================================
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('[data-animate]');
        
        if (!animatedElements.length) return;

        const animationObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    animationObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach(function(el) {
            animationObserver.observe(el);
        });
    }

    // Initialize scroll animations if elements exist
    if (document.querySelectorAll('[data-animate]').length > 0) {
        initScrollAnimations();
    }

})();

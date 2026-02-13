// ============================================
// LEADAR.DIGITAL - MAIN JAVASCRIPT
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // MOBILE MENU TOGGLE
    // ============================================
    
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu');
    const body = document.body;
    
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
            body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!navMenu.contains(event.target) && !mobileMenuToggle.contains(event.target)) {
                navMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
                body.style.overflow = '';
            }
        });
        
        // Close menu on window resize to desktop
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                navMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
                body.style.overflow = '';
            }
        });
    }
    
    // ============================================
    // MOBILE DROPDOWN TOGGLE
    // ============================================
    
    const navDropdowns = document.querySelectorAll('.nav-dropdown > .nav-link');
    
    navDropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                const parent = this.parentElement;
                parent.classList.toggle('active');
            }
        });
    });
    
    // ============================================
    // SMOOTH SCROLLING
    // ============================================
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            
            // Don't prevent default for empty hash or just "#"
            if (!href || href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                
                // Close mobile menu if open
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    mobileMenuToggle.classList.remove('active');
                    body.style.overflow = '';
                }
                
                // Smooth scroll to target
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ============================================
    // FAQ ACCORDION
    // ============================================
    
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        if (question) {
            question.addEventListener('click', function() {
                // Close all other items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Toggle current item
                item.classList.toggle('active');
            });
        }
    });
    
    // ============================================
    // NAVBAR SCROLL EFFECT
    // ============================================
    
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        // Add shadow on scroll
        if (currentScroll > 10) {
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.boxShadow = 'none';
        }
        
        lastScroll = currentScroll;
    });
    
    // ============================================
    // FORM HANDLING
    // ============================================
    
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            // Simple validation
            if (!data.name || !data.email || !data.company || !data.industry) {
                alert('Please fill in all required fields.');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                alert('Please enter a valid email address.');
                return;
            }
            
            // Show loading state
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            
            // Simulate form submission (replace with actual backend integration)
            setTimeout(function() {
                // Success message
                alert('Thank you for your message! We\'ll respond within 24 hours.');
                
                // Reset form
                contactForm.reset();
                
                // Reset button
                submitButton.textContent = originalButtonText;
                submitButton.disabled = false;
                
                // Log data (for development - remove in production)
                console.log('Form submitted:', data);
                
                // In production, you would send this data to your backend:
                /*
                fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                })
                .then(response => response.json())
                .then(data => {
                    alert('Thank you! We\'ll respond within 24 hours.');
                    contactForm.reset();
                })
                .catch(error => {
                    alert('Sorry, there was an error. Please try again or email us directly.');
                    console.error('Error:', error);
                })
                .finally(() => {
                    submitButton.textContent = originalButtonText;
                    submitButton.disabled = false;
                });
                */
            }, 1500);
        });
    }
    
    // ============================================
    // FADE IN ON SCROLL (Optional Enhancement)
    // ============================================
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for fade-in animation
    const fadeElements = document.querySelectorAll('.problem-card, .process-step, .industry-card, .pricing-card, .timeline-item');
    fadeElements.forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });
    
    // ============================================
    // UTILITY FUNCTIONS
    // ============================================
    
    // Debounce function for performance
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Scroll to top button (optional)
    const scrollToTopButton = document.createElement('button');
    scrollToTopButton.innerHTML = '↑';
    scrollToTopButton.className = 'scroll-to-top';
    scrollToTopButton.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background-color: var(--primary-color, #1A73E8);
        color: white;
        border: none;
        font-size: 24px;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 999;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `;
    
    document.body.appendChild(scrollToTopButton);
    
    // Show/hide scroll to top button
    window.addEventListener('scroll', debounce(function() {
        if (window.pageYOffset > 300) {
            scrollToTopButton.style.opacity = '1';
            scrollToTopButton.style.visibility = 'visible';
        } else {
            scrollToTopButton.style.opacity = '0';
            scrollToTopButton.style.visibility = 'hidden';
        }
    }, 100));
    
    scrollToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Add hover effect to scroll to top button
    scrollToTopButton.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px)';
        this.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.2)';
    });
    
    scrollToTopButton.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    });
    
    // ============================================
    // CONSOLE MESSAGE
    // ============================================
    
    console.log('%c🚀 Leadar.Digital Website', 'font-size: 20px; font-weight: bold; color: #1A73E8;');
    console.log('%cInterested in how we built this? Let\'s chat: hello@leadar.digital', 'font-size: 14px; color: #5F6368;');
});

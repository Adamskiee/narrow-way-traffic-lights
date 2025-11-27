document.addEventListener('DOMContentLoaded', function() {
    
    const observerOptions = {
        root: null,
        rootMargin: '-100px 0px -100px 0px',
        threshold: 0.1
    };
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                
                const animatableElements = entry.target.querySelectorAll(
                    '.step-content-card, .about__card, .contact__profile, .hero-content > *, .hero-visual > *'
                );
                
                animatableElements.forEach((element, index) => {
                    setTimeout(() => {
                        element.classList.add('animate-in');
                    }, index * 100); 
                });
                
                if (entry.target.classList.contains('hero-section')) {
                    animateHeroSection(entry.target);
                } else if (entry.target.classList.contains('tutorial-section')) {
                    animateTutorialSection(entry.target);
                } else if (entry.target.classList.contains('about-section-enhanced')) {
                    animateAboutSection(entry.target);
                } else if (entry.target.classList.contains('contact-section-enhanced')) {
                    animateContactSection(entry.target);
                }
                
                sectionObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all animated sections
    const sections = document.querySelectorAll('.section-animated');
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
    
    // Hero section animation
    function animateHeroSection(section) {
        const heroElements = [
            '.hero-badge',
            '.hero-title', 
            '.hero-description',
            '.hero-features',
            '.hero-actions',
            '.hero-stats'
        ];
        
        heroElements.forEach((selector, index) => {
            const element = section.querySelector(selector);
            if (element) {
                setTimeout(() => {
                    element.style.animation = 'slideInLeft 0.8s ease-out forwards';
                }, index * 150);
            }
        });
        
        // Animate hero visual elements
        const visualElements = section.querySelectorAll('.traffic-light-container, .floating-card');
        visualElements.forEach((element, index) => {
            setTimeout(() => {
                element.style.animation = 'slideInRight 0.8s ease-out forwards';
            }, (index + 2) * 150);
        });
    }
    
    // Tutorial section animation
    function animateTutorialSection(section) {
        const tutorialSteps = section.querySelectorAll('.tutorial-step');
        
        tutorialSteps.forEach((step, index) => {
            setTimeout(() => {
                step.style.animation = 'slideInUp 0.8s ease-out forwards';
                
                // Animate step content
                const stepContent = step.querySelector('.step-content-card');
                if (stepContent) {
                    setTimeout(() => {
                        stepContent.style.animation = 'fadeIn 0.6s ease-out forwards';
                    }, 200);
                }
            }, index * 200);
        });
        
        // Animate tutorial navigation
        const navigation = section.querySelector('.tutorial-navigation');
        if (navigation) {
            setTimeout(() => {
                navigation.style.animation = 'slideInUp 0.8s ease-out forwards';
            }, tutorialSteps.length * 200 + 300);
        }
    }
    
    // About section animation
    function animateAboutSection(section) {
        const aboutContent = section.querySelector('.about__content');
        const teamCards = section.querySelectorAll('.about__card');
        
        if (aboutContent) {
            aboutContent.style.animation = 'slideInLeft 0.8s ease-out forwards';
        }
        
        teamCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.animation = 'slideInUp 0.6s ease-out forwards';
                card.style.animationDelay = `${index * 100}ms`;
            }, 400);
        });
    }
    
    // Contact section animation
    function animateContactSection(section) {
        const contactIntro = section.querySelector('.contact-intro-section');
        const teamContacts = section.querySelector('.team-contacts-section');
        const contactForm = section.querySelector('.contact-form-container');
        
        if (contactIntro) {
            contactIntro.style.animation = 'slideInLeft 0.8s ease-out forwards';
        }
        
        if (teamContacts) {
            setTimeout(() => {
                teamContacts.style.animation = 'slideInUp 0.8s ease-out forwards';
                
                // Animate individual profiles
                const profiles = teamContacts.querySelectorAll('.contact__profile');
                profiles.forEach((profile, index) => {
                    setTimeout(() => {
                        profile.style.animation = 'fadeIn 0.6s ease-out forwards';
                    }, index * 100);
                });
            }, 200);
        }
        
        if (contactForm) {
            setTimeout(() => {
                contactForm.style.animation = 'slideInRight 0.8s ease-out forwards';
            }, 400);
        }
    }
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            const tutorialSection = document.querySelector('#tutorial');
            if (tutorialSection) {
                tutorialSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
        
        // Hide scroll indicator when scrolling
        let scrollTimeout;
        window.addEventListener('scroll', function() {
            const scrollY = window.scrollY;
            
            if (scrollY > 100) {
                scrollIndicator.style.opacity = '0';
                scrollIndicator.style.transform = 'translateY(20px)';
            } else {
                scrollIndicator.style.opacity = '1';
                scrollIndicator.style.transform = 'translateY(0)';
            }
        });
    }
    
    const sectionTransitions = document.querySelectorAll('.section-transition');
    
    window.addEventListener('scroll', function() {
        const scrollY = window.scrollY;
        
        sectionTransitions.forEach((transition, index) => {
            const rect = transition.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isVisible) {
                const speed = 0.5;
                const yPos = -(scrollY * speed);
                transition.style.transform = `translateY(${yPos}px)`;
            }
        });
    });
    
    // Add loading animation for the first section
    setTimeout(() => {
        const heroSection = document.querySelector('.hero-section');
        if (heroSection && !heroSection.classList.contains('in-view')) {
            heroSection.classList.add('in-view');
            animateHeroSection(heroSection);
        }
    }, 500);
});
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            // Check if we're on the home page (index.php)
            const isHomePage = window.location.pathname.includes('index.php') || 
                              window.location.pathname.endsWith('/') ||
                              window.location.pathname.includes('narrow-way-traffic-lights') && !window.location.pathname.includes('.php');
            
            if (targetSection && isHomePage) {
                // We're on home page, scroll to section
                scrollToSection(targetSection, targetId);
            } else {
                // We're on another page, redirect to home with hash
                const baseUrl = getBaseUrl();
                window.location.href = `${baseUrl}index.php${targetId}`;
            }
        });
    });
    
    // Check if page loaded with hash (coming from another page)
    window.addEventListener('load', function() {
        const hash = window.location.hash;
        if (hash) {
            setTimeout(() => {
                const targetSection = document.querySelector(hash);
                if (targetSection) {
                    scrollToSection(targetSection, hash);
                }
            }, 100); // Small delay to ensure page is fully loaded
        }
    });
    
    // Update active navigation link based on scroll position
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY + 100; // Offset for navbar
        
        const sections = ['#hero', '#tutorial', '#about', '#contact'];
        
        sections.forEach(sectionId => {
            const section = document.querySelector(sectionId);
            if (section) {
                const sectionTop = section.offsetTop;
                const sectionBottom = sectionTop + section.offsetHeight;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                    updateActiveNavLink(sectionId);
                }
            }
        });
    });
    
    function scrollToSection(targetSection, targetId) {
        // Calculate offset for fixed navbar
        const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 70;
        const targetPosition = targetSection.offsetTop - navbarHeight;
        
        // Smooth scroll to target
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
        
        // Update active nav link
        updateActiveNavLink(targetId);
        
        // Update URL hash without triggering scroll
        history.replaceState(null, null, targetId);
    }
    
    function updateActiveNavLink(targetId) {
        // Remove active class from all nav links
        const allNavLinks = document.querySelectorAll('.nav-link');
        allNavLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class to current nav link
        const activeLink = document.querySelector(`a[href="${targetId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }
    
    function getBaseUrl() {
        // Get the base URL dynamically
        const path = window.location.pathname;
        const segments = path.split('/');
        
        // Find the project directory (narrow-way-traffic-lights)
        const projectIndex = segments.findIndex(segment => segment === 'narrow-way-traffic-lights');
        
        if (projectIndex !== -1) {
            const baseSegments = segments.slice(0, projectIndex + 1);
            return window.location.origin + baseSegments.join('/') + '/';
        }
        
        // Fallback
        return window.location.origin + '/narrow-way-traffic-lights/';
    }
});
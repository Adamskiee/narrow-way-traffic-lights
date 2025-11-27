document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.querySelector('.navbar-glassmorphism');
    
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add scrolled class for backdrop blur effect
        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        if (window.innerWidth >= 992) {
            if (scrollTop > 100) {
                navbar.classList.add('navbar-compact');
            } else {
                navbar.classList.remove('navbar-compact');
            }
        }
        
        lastScrollTop = scrollTop;
    });
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth < 992) {
                const collapse = document.getElementById('navbarContent');
                const bsCollapse = new bootstrap.Collapse(collapse, {
                    hide: true
                });
            }
        });
    });
});
// Tutorial Section Enhancements
document.addEventListener('DOMContentLoaded', function() {
    const stepIndicators = document.querySelectorAll('.step-indicator');
    const tutorialSteps = document.querySelectorAll('.tutorial-step');
    
    // Step indicator functionality
    stepIndicators.forEach(indicator => {
        indicator.addEventListener('click', function() {
            const targetStep = this.dataset.target;
            
            // Update active indicator
            stepIndicators.forEach(ind => ind.classList.remove('active'));
            this.classList.add('active');
            
            // Scroll to target step
            const targetElement = document.querySelector(`[data-step="${targetStep}"]`);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    });
    
    // Intersection Observer for step animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, observerOptions);
    
    tutorialSteps.forEach(step => {
        observer.observe(step);
    });
});
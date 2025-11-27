document.addEventListener('DOMContentLoaded', function() {
    const stepIndicators = document.querySelectorAll('.step-indicator');
    const tutorialSteps = document.querySelectorAll('.tutorial-step');
    
    stepIndicators.forEach(indicator => {
        indicator.addEventListener('click', function() {
            const targetStep = this.dataset.target;
            
            stepIndicators.forEach(ind => ind.classList.remove('active'));
            this.classList.add('active');
            
            const targetElement = document.querySelector(`[data-step="${targetStep}"]`);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    });
});
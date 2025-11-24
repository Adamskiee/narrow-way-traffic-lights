document.addEventListener('DOMContentLoaded', function () {
    
    // Initialize popovers with custom options (SINGLE initialization)
    const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
    
    popoverTriggerList.forEach(popoverTriggerEl => {
        new bootstrap.Popover(popoverTriggerEl, {
            trigger: 'click', // Changed to click for profile pics
            delay: { show: 100, hide: 100 },
            animation: true,
            html: true,
            sanitize: false,
            customClass: 'social-popover'
        });
    });
    
    // Close popovers when clicking elsewhere
    document.addEventListener('click', function (e) {
        if (!e.target.closest('[data-bs-toggle="popover"]')) {
            const popovers = document.querySelectorAll('[data-bs-toggle="popover"]');
            popovers.forEach(popover => {
                const instance = bootstrap.Popover.getInstance(popover);
                if (instance) instance.hide();
            });
        }
    });
    
    // Enhanced contact form functionality
    const contactForm = document.querySelector('.contact-form');
    const inputs = document.querySelectorAll('.contact__input');
    const submitBtn = document.querySelector('.btn-contact-submit');
    
    // Add focus and blur effects for inputs
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.closest('.input-wrapper').classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.closest('.input-wrapper').classList.remove('focused');
            
            // Add validation visual feedback
            if (this.value.trim() !== '') {
                this.classList.add('has-content');
            } else {
                this.classList.remove('has-content');
            }
        });
        
        // Real-time validation
        input.addEventListener('input', function() {
            validateField(this);
        });
    });
    
    // Form validation function
    function validateField(field) {
        const value = field.value.trim();
        const fieldType = field.type;
        let isValid = true;
        
        switch(fieldType) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                isValid = emailRegex.test(value);
                break;
            case 'tel':
                const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
                isValid = value === '' || phoneRegex.test(value.replace(/\D/g, ''));
                break;
            default:
                isValid = value.length >= 2;
        }
        
        field.classList.toggle('is-valid', isValid && value !== '');
        field.classList.toggle('is-invalid', !isValid && value !== '');
        
        return isValid;
    }
    
    // Form submission with animation
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate all fields
            let isFormValid = true;
            const requiredFields = contactForm.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!validateField(field) || field.value.trim() === '') {
                    isFormValid = false;
                }
            });
            
            if (isFormValid) {
                // Animate submit button
                submitBtn.classList.add('loading');
                submitBtn.disabled = true;
                
                const originalText = submitBtn.querySelector('.btn-text').textContent;
                submitBtn.querySelector('.btn-text').textContent = 'Sending...';
                submitBtn.querySelector('.btn-icon').className = 'fas fa-spinner fa-spin';
                
                // Simulate form submission (replace with actual form submission logic)
                setTimeout(() => {
                    // Success animation
                    submitBtn.querySelector('.btn-text').textContent = 'Message Sent!';
                    submitBtn.querySelector('.btn-icon').className = 'fas fa-check';
                    submitBtn.style.background = 'linear-gradient(135deg, var(--bs-green) 0%, #27ae60 100%)';
                    
                    // Reset form after delay
                    setTimeout(() => {
                        contactForm.reset();
                        submitBtn.classList.remove('loading');
                        submitBtn.disabled = false;
                        submitBtn.querySelector('.btn-text').textContent = originalText;
                        submitBtn.querySelector('.btn-icon').className = 'fas fa-paper-plane';
                        submitBtn.style.background = '';
                        
                        // Remove validation classes
                        inputs.forEach(input => {
                            input.classList.remove('is-valid', 'is-invalid', 'has-content');
                            input.closest('.input-wrapper').classList.remove('focused');
                        });
                    }, 2000);
                }, 1500);
            } else {
                // Shake animation for invalid form
                contactForm.classList.add('shake');
                setTimeout(() => {
                    contactForm.classList.remove('shake');
                }, 600);
            }
        });
    }
    
    // Profile hover effects
    const profiles = document.querySelectorAll('.contact__profile');
    profiles.forEach(profile => {
        profile.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
            
            // Add glow effect to profile image
            const glowElement = this.querySelector('.profile-glow');
            if (glowElement) {
                glowElement.style.opacity = '0.4';
                glowElement.style.transform = 'translate(-50%, -50%) scale(1.1)';
            }
        });
        
        profile.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            
            // Remove glow effect
            const glowElement = this.querySelector('.profile-glow');
            if (glowElement) {
                glowElement.style.opacity = '0';
                glowElement.style.transform = 'translate(-50%, -50%) scale(1)';
            }
        });
    });
});
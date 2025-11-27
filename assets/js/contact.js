document.addEventListener('DOMContentLoaded', function () {
    // For profile images
    const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
    
    popoverTriggerList.forEach(popoverTriggerEl => {
        new bootstrap.Popover(popoverTriggerEl, {
            trigger: 'click', 
            delay: { show: 100, hide: 100 },
            animation: true,
            html: true,
            sanitize: false,
            customClass: 'social-popover'
        });
    });
    
    document.addEventListener('click', function (e) {
        if (!e.target.closest('[data-bs-toggle="popover"]')) {
            const popovers = document.querySelectorAll('[data-bs-toggle="popover"]');
            popovers.forEach(popover => {
                const instance = bootstrap.Popover.getInstance(popover);
                if (instance) instance.hide();
            });
        }
    });
    
    const contactForm = document.getElementById('contact-form');
    const inputs = document.querySelectorAll('.contact__input');
    const submitBtn = document.querySelector('.btn-contact-submit');
    
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.closest('.input-wrapper').classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.closest('.input-wrapper').classList.remove('focused');
            
            if (this.value.trim() !== '') {
                this.classList.add('has-content');
            } else {
                this.classList.remove('has-content');
            }
        });
        
        input.addEventListener('input', function() {
            validateField(this);
        });
    });
    
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
                const phoneRegex = /^(09|\+639)\d{9}$/;
                isValid = value === '' || phoneRegex.test(value.replace(/\D/g, ''));
                break;
            default:
                isValid = value.length >= 2;
        }
        
        field.classList.toggle('is-valid', isValid && value !== '');
        field.classList.toggle('is-invalid', !isValid && value !== '');
        
        return isValid;
    }
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            let isFormValid = true;
            const requiredFields = contactForm.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!validateField(field) || field.value.trim() === '') {
                    isFormValid = false;
                }
            });
            
            if (isFormValid) {
                submitBtn.classList.add('loading');
                submitBtn.disabled = true;
                
                const originalText = submitBtn.querySelector('.btn-text').textContent;
                submitBtn.querySelector('.btn-text').textContent = 'Sending...';
                submitBtn.querySelector('.btn-icon').className = 'fas fa-spinner fa-spin';

                const isSend = await sendMessage(e.target);
                if(isSend) {
                    setTimeout(() => {
                        submitBtn.querySelector('.btn-text').textContent = 'Message Sent!';
                        submitBtn.querySelector('.btn-icon').className = 'fas fa-check';
                        submitBtn.style.background = 'linear-gradient(135deg, var(--bs-green) 0%, #27ae60 100%)';
                        
                        setTimeout(() => {
                            contactForm.reset();
                            submitBtn.classList.remove('loading');
                            submitBtn.disabled = false;
                            submitBtn.querySelector('.btn-text').textContent = originalText;
                            submitBtn.querySelector('.btn-icon').className = 'fas fa-paper-plane';
                            submitBtn.style.background = '';
                            
                            inputs.forEach(input => {
                                input.classList.remove('is-valid', 'is-invalid', 'has-content');
                                input.closest('.input-wrapper').classList.remove('focused');
                            });
                        }, 2000);
                    }, 1500);
                }
            } else {
                contactForm.classList.add('shake');
                setTimeout(() => {
                    contactForm.classList.remove('shake');
                }, 600);
            }
        });
    }
 
    async function sendMessage() {
        const formData = new FormData(contactForm);
        const payload = Object.fromEntries(formData.entries());
    
        try {
          const response = await fetch(contactForm.action, {
            method: contactForm.method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
    
          const data = await response.json();
          if (data.success) return true;
          else return false;
        } catch (err) {
            console.error(err)
          return false;
        }
    }
});

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
});
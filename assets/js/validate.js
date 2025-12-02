/**
 * Validation rules for each field
 */
const VALIDATION_RULES = {
    'first-name': {
        required: true,
        minLength: 2,
        maxLength: 50,
        pattern: /^[a-zA-Z\s'-\.]+$/,
        message: 'First name must be 2-50 characters and contain only letters, spaces, hyphens, apostrophes, and dots'
    },
    'last-name': {
        required: false,
        minLength: 2,
        maxLength: 50,
        pattern: /^[a-zA-Z\s'-\.]+$/,
        message: 'Last name must be 2-50 characters and contain only letters, spaces, hyphens, apostrophes, and dots'
    },
    'email': {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        maxLength: 100,
        message: 'Please enter a valid email address'
    },
    'phone': {
        required: false,
        pattern: /^(09|\+639)\d{9}$/,
        message: 'Please enter a valid Philippine phone number (e.g., 09123456789)'
    },
    'username': {
        required: true,
        minLength: 3,
        maxLength: 30,
        pattern: /^[a-zA-Z0-9_]{3,20}$/,
        message: 'Username must be 3-30 characters and contain only letters, numbers, underscores, and hyphens'
    },
    'password': {
        required: true,
        minLength: 8,
        maxLength: 100,
        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+=\[\]{};':"\\|,.<>\/?~`-])[A-Za-z\d!@#$%^&*()_+=\[\]{};':"\\|,.<>\/?~`-]{8,}$/,
        message: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character'
    },
    'new-password': {
        required: true,
        minLength: 8,
        maxLength: 100,
        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+=\[\]{};':"\\|,.<>\/?~`-])[A-Za-z\d!@#$%^&*()_+=\[\]{};':"\\|,.<>\/?~`-]{8,}$/,
        message: 'New password must be at least 8 characters with uppercase, lowercase, number, and special character'
    },
    'ip_address_cam_2': {
        required: true,
        minLength: 7,
        maxLength: 11,
        pattern: /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
        message: 'Please enter valid IP address. It must be 0.0.0.0 to 255.255.255.255'
    },
    'ip_address_cam_1': {
        required: true,
        minLength: 7,
        maxLength: 11,
        pattern: /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
        message: 'Please enter valid IP address. It must be 0.0.0.0 to 255.255.255.255'
    },
    'code': {
        required: true,
        minLength: 6,
        maxLength: 6,
        pattern: /^\d{6}$/,
        message: 'Please enter a valid 6 digit code.'
    }
};

/**
 * Validate a single field
 */
export function validateField(field, showError = true) {
    const fieldName = field.getAttribute('name');
    const rules = VALIDATION_RULES[fieldName];
    const value = field.value.trim();
    
    if (!rules) return { isValid: true, message: '' };
    
    // Check if required field is empty
    if (rules.required && !value) {
        const message = `${getFieldLabel(field)} is required`;
        if (showError) showFieldError(field, message);
        return { isValid: false, message };
    }
    
    // If field is empty and not required, it's valid
    if (!value && !rules.required) {
        if (showError) showFieldSuccess(field);
        return { isValid: true, message: '' };
    }
    
    // Check minimum length
    if (rules.minLength && value.length < rules.minLength) {
        const message = `${getFieldLabel(field)} must be at least ${rules.minLength} characters`;
        if (showError) showFieldError(field, message);
        return { isValid: false, message };
    }
    
    // Check maximum length
    if (rules.maxLength && value.length > rules.maxLength) {
        const message = `${getFieldLabel(field)} must not exceed ${rules.maxLength} characters`;
        if (showError) showFieldError(field, message);
        return { isValid: false, message };
    }
    
    // Check pattern
    if (rules.pattern && !rules.pattern.test(value)) {
        if (showError) showFieldError(field, rules.message);
        return { isValid: false, message: rules.message };
    }
    
    // Additional custom validations
    if (fieldName === 'username') {
        const usernameValidation = validateUsername(value);
        if (!usernameValidation.isValid) {
            if (showError) showFieldError(field, usernameValidation.message);
            return usernameValidation;
        }
    }
    
    if (fieldName === 'email') {
        const emailValidation = validateEmail(value);
        if (!emailValidation.isValid) {
            if (showError) showFieldError(field, emailValidation.message);
            return emailValidation;
        }
    }
    
    if (showError) showFieldSuccess(field);
    return { isValid: true, message: '' };
}

/**
 * Get field label for error messages
 */
function getFieldLabel(field) {
    const label = document.querySelector(`label[for="${field.id}"]`);
    if (label) {
        return label.textContent.replace('*', '').trim();
    }
    return field.getAttribute('name').replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
}

/**
 * Validate username for reserved words
 */
function validateUsername(value) {
    const reservedNames = ['administrator', 'root', 'system', 'guest', 'user', 'test', 'demo'];
    
    if (reservedNames.includes(value.toLowerCase())) {
        return {
            isValid: false,
            message: 'This username is reserved and cannot be used'
        };
    }
    
    return { isValid: true, message: '' };
}

/**
 * Advanced email validation
 */
function validateEmail(value) {
    if (value.includes('..') || value.startsWith('.') || value.endsWith('.')) {
        return {
            isValid: false,
            message: 'Email address contains invalid dot placement'
        };
    }
    
    if (value.includes(' ')) {
        return {
            isValid: false,
            message: 'Email address cannot contain spaces'
        };
    }
    
    // Check for valid domain extensions
    const validDomains = /\.(com|org|net|edu|gov|mil|int|co|info|biz|name|pro|aero|asia|cat|coop|jobs|mobi|museum|tel|travel|xxx|ph)$/i;
    if (!validDomains.test(value)) {
        return {
            isValid: false,
            message: 'Please use a valid email domain'
        };
    }
    
    return { isValid: true, message: '' };
}

/**
 * Show field error
 */
export function showFieldError(field, message) {
    clearFieldError(field);
    
    field.classList.add('is-invalid');
    field.classList.remove('is-valid');
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'invalid-feedback';
    errorDiv.textContent = message;
    errorDiv.id = `${field.name}-error`;
    
    field.parentNode.appendChild(errorDiv);
}

/**
 * Show field success
 */
export function showFieldSuccess(field) {
    clearFieldError(field);
    
    field.classList.add('is-valid');
    field.classList.remove('is-invalid');
}

/**
 * Clear field error
 */
export function clearFieldError(field) {
    field.classList.remove('is-invalid', 'is-valid');
    
    const errorElement = document.getElementById(`${field.name}-error`);
    if (errorElement) {
        errorElement.remove();
    }
}

/**
 * Validate entire form
 */
export function validateForm(form) {
    const errors = [];
    const fields = form.querySelectorAll('input[name], select[name], textarea[name]');
    
    fields.forEach(field => {
        const validation = validateField(field, true);
        if (!validation.isValid) {
            errors.push({
                field: field.name,
                message: validation.message
            });
        }
    });
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

/**
 * Setup real-time validation
 */
export function setupRealtimeValidation(form) {
    const fields = form.querySelectorAll('input[name], select[name], textarea[name]');
    fields.forEach(field => {
        const fieldName = field.getAttribute('name');
        const rules = VALIDATION_RULES[fieldName];
        
        if (rules) {
            // Validate on blur
            field.addEventListener('blur', () => {
                validateField(field, true);
            });
            
            // Clear errors on input
            field.addEventListener('input', () => {
                if (field.classList.contains('is-invalid')) {
                    clearFieldError(field);
                }
            });
            
            // Special handling for different field types
            if (fieldName === 'phone') {
                field.addEventListener('input', (e) => {
                    // Format phone number as user types
                    let value = e.target.value.replace(/\D/g, '');
                    if (value.startsWith('63')) {
                        value = '+' + value;
                    } else if (value.startsWith('9') && value.length === 10) {
                        value = '0' + value;
                    }
                    e.target.value = value;
                });
            }
            
            if (fieldName === 'username') {
                field.addEventListener('input', (e) => {
                    // Convert to lowercase and remove invalid characters
                    e.target.value = e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '');
                });
            }
        }
    });
}

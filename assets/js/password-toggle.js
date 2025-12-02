/**
 * Generic password toggle utility
 * Automatically finds and sets up password toggle functionality
 */
export function initPasswordToggles() {
    document.addEventListener('click', function(e) {
        if (e.target.matches('.password-toggle, .password-toggle *')) {
            const toggleBtn = e.target.closest('.password-toggle');
            const inputGroup = toggleBtn.closest('.input-group');
            const passwordInput = inputGroup.querySelector('input[type="password"], input[type="text"]');
            const icon = toggleBtn.querySelector('i');
            
            if (passwordInput && icon) {
                if (passwordInput.type === 'password') {
                    passwordInput.type = 'text';
                    icon.classList.remove('fa-eye');
                    icon.classList.add('fa-eye-slash');
                    toggleBtn.setAttribute('title', 'Hide password');
                } else {
                    passwordInput.type = 'password';
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
                    toggleBtn.setAttribute('title', 'Show password');
                }
            }
        }
    });
}

/**
 * Create password input with toggle button
 */
export function createPasswordInputWithToggle(options = {}) {
    const {
        name = 'password',
        id = 'password',
        placeholder = 'Password',
        required = false,
        showGenerate = false
    } = options;
    
    return `
        <div class="input-group">
            <input
                type="password"
                class="form-control"
                name="${name}"
                id="${id}"
                placeholder="${placeholder}"
                ${required ? 'required' : ''}
            />
            <button type="button" class="btn btn-outline-secondary password-toggle" title="Show password">
                <i class="fas fa-eye"></i>
            </button>
            ${showGenerate ? '<button type="button" class="btn btn-secondary generate-password">Generate</button>' : ''}
        </div>
    `;
}
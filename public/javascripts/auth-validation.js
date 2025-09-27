
// Authentication form validation
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.validated-form');
    if (!form) return;
    
    const inputs = form.querySelectorAll('.form-control');
    const submitBtn = form.querySelector('.auth-submit-btn');

    inputs.forEach(input => {
        // Hide validation messages initially
        const validFeedback = input.nextElementSibling;
        const invalidFeedback = validFeedback ? validFeedback.nextElementSibling : null;
        
        if (validFeedback && validFeedback.classList.contains('valid-feedback')) {
            validFeedback.style.display = 'none';
        }
        if (invalidFeedback && invalidFeedback.classList.contains('invalid-feedback')) {
            invalidFeedback.style.display = 'none';
        }

        // Real-time validation on input
        input.addEventListener('input', function() {
            validateField(this);
        });

        // Validation on blur
        input.addEventListener('blur', function() {
            validateField(this);
        });
    });

    function validateField(input) {
        const validFeedback = input.nextElementSibling;
        const invalidFeedback = validFeedback ? validFeedback.nextElementSibling : null;
        
        if (input.value.length > 0) {
            if (input.checkValidity()) {
                input.classList.remove('is-invalid');
                input.classList.add('is-valid');
                
                if (validFeedback && validFeedback.classList.contains('valid-feedback')) {
                    validFeedback.style.display = 'flex';
                }
                if (invalidFeedback && invalidFeedback.classList.contains('invalid-feedback')) {
                    invalidFeedback.style.display = 'none';
                }
            } else {
                input.classList.remove('is-valid');
                input.classList.add('is-invalid');
                
                if (validFeedback && validFeedback.classList.contains('valid-feedback')) {
                    validFeedback.style.display = 'none';
                }
                if (invalidFeedback && invalidFeedback.classList.contains('invalid-feedback')) {
                    invalidFeedback.style.display = 'block';
                }
            }
        } else {
            // Reset state when empty
            input.classList.remove('is-valid', 'is-invalid');
            if (validFeedback && validFeedback.classList.contains('valid-feedback')) {
                validFeedback.style.display = 'none';
            }
            if (invalidFeedback && invalidFeedback.classList.contains('invalid-feedback')) {
                invalidFeedback.style.display = 'none';
            }
        }
    }

    // Enhanced form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        inputs.forEach(input => {
            validateField(input);
            if (!input.checkValidity()) {
                isValid = false;
            }
        });

        if (isValid) {
            // Add loading state
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
            
            // Submit form after brief delay for UX
            setTimeout(() => {
                this.submit();
            }, 500);
        } else {
            // Focus first invalid field
            const firstInvalid = form.querySelector('.is-invalid');
            if (firstInvalid) {
                firstInvalid.focus();
            }
        }
    });
});
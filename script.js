document.addEventListener('DOMContentLoaded', () => {
    // Alumni filtering functionality
    const yearFilter = document.getElementById('yearFilter');
    const fieldFilter = document.getElementById('fieldFilter');
    const alumniCards = document.querySelectorAll('.alumni-card');

    function filterAlumni() {
        const selectedYear = yearFilter.value;
        const selectedField = fieldFilter.value;

        alumniCards.forEach(card => {
            const year = card.getAttribute('data-year');
            const field = card.getAttribute('data-field');
            
            const yearMatch = selectedYear === 'all' || year === selectedYear;
            const fieldMatch = selectedField === 'all' || field === selectedField;

            if (yearMatch && fieldMatch) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    if (yearFilter && fieldFilter) {
        yearFilter.addEventListener('change', filterAlumni);
        fieldFilter.addEventListener('change', filterAlumni);
    }

    // Mobile menu toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            navMenu.classList.remove('active');

            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Active menu item on scroll
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-menu a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });

    // Authentication functionality
    const authTabs = document.querySelectorAll('.auth-tab');
    const authForms = document.querySelectorAll('.auth-form');
    const passwordToggles = document.querySelectorAll('.password-toggle');

    // Tab switching
    authTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetForm = tab.getAttribute('data-tab');

            // Update active tab
            authTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Show corresponding form
            authForms.forEach(form => {
                form.classList.remove('active');
                if (form.id === `${targetForm}-form`) {
                    form.classList.add('active');
                }
            });
        });
    });

    // Password visibility toggle
    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const input = toggle.previousElementSibling;
            const type = input.getAttribute('type');

            input.setAttribute('type', type === 'password' ? 'text' : 'password');
            toggle.classList.toggle('fa-eye');
            toggle.classList.toggle('fa-eye-slash');
        });
    });

    // Form validation
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email');
        const password = document.getElementById('login-password');
        let isValid = true;

        // Simple email validation
        if (!email.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            showError(email, 'Please enter a valid email address');
            isValid = false;
        } else {
            removeError(email);
        }

        // Password validation
        if (password.value.length < 6) {
            showError(password, 'Password must be at least 6 characters');
            isValid = false;
        } else {
            removeError(password);
        }

        if (isValid) {
            // Here you would typically send the data to your server
            console.log('Login form submitted');
        }
    });

    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('register-name');
        const email = document.getElementById('register-email');
        const password = document.getElementById('register-password');
        const confirmPassword = document.getElementById('register-confirm-password');
        let isValid = true;

        // Name validation
        if (name.value.length < 2) {
            showError(name, 'Name must be at least 2 characters');
            isValid = false;
        } else {
            removeError(name);
        }

        // Email validation
        if (!email.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            showError(email, 'Please enter a valid email address');
            isValid = false;
        } else {
            removeError(email);
        }

        // Password validation
        if (password.value.length < 6) {
            showError(password, 'Password must be at least 6 characters');
            isValid = false;
        } else {
            removeError(password);
        }

        // Confirm password validation
        if (password.value !== confirmPassword.value) {
            showError(confirmPassword, 'Passwords do not match');
            isValid = false;
        } else {
            removeError(confirmPassword);
        }

        if (isValid) {
            // Here you would typically send the data to your server
            console.log('Register form submitted');
        }
    });

    // Error handling functions
    function showError(input, message) {
        const formGroup = input.parentElement;
        const errorDiv = formGroup.querySelector('.error-message') || document.createElement('div');
        
        if (!formGroup.querySelector('.error-message')) {
            errorDiv.className = 'error-message';
            formGroup.appendChild(errorDiv);
        }
        
        errorDiv.textContent = message;
        formGroup.classList.add('error');
    }

    function removeError(input) {
        const formGroup = input.parentElement;
        const errorDiv = formGroup.querySelector('.error-message');
        
        if (errorDiv) {
            formGroup.removeChild(errorDiv);
        }
        formGroup.classList.remove('error');
    }
});
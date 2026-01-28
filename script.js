// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function () {
    // Initialize all functionality
    initNavigation();
    initScrollAnimations();
    initBackToTop();
    initContactForm();
    updateCurrentYear();
    console.log('Portfolio loaded successfully!');
});

// Navigation Functions
function initNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function () {
            navMenu.classList.toggle('active');

            // Toggle hamburger icon
            const icon = navToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                const icon = navToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });

    // Active navigation link on scroll
    window.addEventListener('scroll', updateActiveNavLink);
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    let current = '';
    const scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
}

// Smooth Scroll Function
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const elementPosition = element.offsetTop - headerHeight;

        window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
        });
    }
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');

                // Add stagger animation delay
                const staggerElements = entry.target.querySelectorAll('[class*="stagger-"]');
                staggerElements.forEach((el, index) => {
                    const delay = getStaggerDelay(el.className);
                    setTimeout(() => {
                        el.classList.add('animate');
                    }, delay * 100);
                });
            }
        });
    }, observerOptions);

    // Observe all fade-in-up elements
    const animatedElements = document.querySelectorAll('.fade-in-up');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

function getStaggerDelay(className) {
    const match = className.match(/stagger-(\d+)/);
    return match ? parseInt(match[1]) : 0;
}

// Back to Top Button
function initBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');

    if (backToTopBtn) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });

        backToTopBtn.addEventListener('click', function () {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Contact Form Functions
function initContactForm() {
    const form = document.getElementById('contact-form');

    if (form) {
        // Real-time validation
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function () {
                validateField(this);
            });

            input.addEventListener('input', function () {
                if (this.classList.contains('error')) {
                    validateField(this);
                }
            });
        });

        // Form submission
        form.addEventListener('submit', handleFormSubmit);
    }
}

function validateField(field) {
    const fieldGroup = field.closest('.form-group');
    const errorElement = fieldGroup.querySelector('.error-message');
    let isValid = true;
    let errorMessage = '';

    // Remove previous error state
    fieldGroup.classList.remove('error');
    errorElement.classList.remove('show');

    // Required field validation
    if (field.hasAttribute('required') && !field.value.trim()) {
        isValid = false;
        errorMessage = 'Este campo é obrigatório.';
    }

    // Email validation
    if (field.type === 'email' && field.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value.trim())) {
            isValid = false;
            errorMessage = 'Por favor, insira um e-mail válido.';
        }
    }

    // Name validation
    if (field.name === 'name' && field.value.trim()) {
        if (field.value.trim().length < 2) {
            isValid = false;
            errorMessage = 'O nome deve ter pelo menos 2 caracteres.';
        }
    }

    // Message validation
    if (field.name === 'message' && field.value.trim()) {
        if (field.value.trim().length < 10) {
            isValid = false;
            errorMessage = 'A mensagem deve ter pelo menos 10 caracteres.';
        }
    }

    // Checkbox validation
    if (field.type === 'checkbox' && field.hasAttribute('required') && !field.checked) {
        isValid = false;
        errorMessage = 'Deve aceitar a política de privacidade.';
    }

    // Display error if invalid
    if (!isValid) {
        fieldGroup.classList.add('error');
        errorElement.textContent = errorMessage;
        errorElement.classList.add('show');
    }

    return isValid;
}

function validateForm(form) {
    const fields = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;

    fields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });

    return isValid;
}

function handleFormSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const formSuccess = document.getElementById('form-success');

    // Validate form
    if (!validateForm(form)) {
        // Focus on first error field
        const firstError = form.querySelector('.form-group.error input, .form-group.error select, .form-group.error textarea');
        if (firstError) {
            firstError.focus();
        }
        return;
    }

    // Show loading state
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    submitBtn.disabled = true;

    // Simulate form submission (replace with actual submission logic)
    setTimeout(() => {
        // Hide form and show success message
        form.style.display = 'none';
        formSuccess.style.display = 'block';

        // Log form data (in real implementation, send to server)
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        console.log('Form submitted with data:', data);

        // Reset form after 5 seconds
        setTimeout(() => {
            form.reset();
            form.style.display = 'block';
            formSuccess.style.display = 'none';
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;

            // Remove any error states
            const errorGroups = form.querySelectorAll('.form-group.error');
            errorGroups.forEach(group => {
                group.classList.remove('error');
                const errorMsg = group.querySelector('.error-message');
                if (errorMsg) {
                    errorMsg.classList.remove('show');
                }
            });
        }, 5000);

    }, 2000); // Simulate 2 second delay
}

// Utility Functions
function updateCurrentYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// Modal Functions (for privacy policy and terms)
function showModal(type) {
    const title = type === 'privacy' ? 'Política de Privacidade' : 'Termos de Uso';
    const content = type === 'privacy' ? getPrivacyPolicyContent() : getTermsContent();

    // Create modal HTML
    const modalHTML = `
        <div class="modal-overlay" onclick="closeModal()">
            <div class="modal-content" onclick="event.stopPropagation()">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="modal-close" onclick="closeModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
            </div>
        </div>
    `;

    // Add modal to page
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.body.classList.add('modal-open');
}

function closeModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        modal.remove();
        document.body.classList.remove('modal-open');
    }
}

function getPrivacyPolicyContent() {
    return `
        <h4>Recolha e Uso de Dados</h4>
        <p>Este website recolhe apenas os dados fornecidos voluntariamente através do formulário de contacto, incluindo nome, e-mail, assunto e mensagem.</p>
        
        <h4>Finalidade</h4>
        <p>Os dados pessoais são utilizados exclusivamente para responder às suas solicitações e estabelecer contacto profissional.</p>
        
        <h4>Partilha de Dados</h4>
        <p>Os seus dados pessoais não são partilhados com terceiros sem o seu consentimento explícito.</p>
        
        <h4>Segurança</h4>
        <p>Implementamos medidas de segurança adequadas para proteger os seus dados pessoais contra acesso não autorizado.</p>
        
        <h4>Direitos</h4>
        <p>Tem o direito de aceder, rectificar ou eliminar os seus dados pessoais. Para exercer estes direitos, contacte-nos através do e-mail fornecido.</p>
    `;
}

function getTermsContent() {
    return `
        <h4>Uso do Website</h4>
        <p>Este website destina-se a fornecer informações sobre os serviços profissionais do Zassala Mário Bunga.</p>
        
        <h4>Propriedade Intelectual</h4>
        <p>Todo o conteúdo deste website, incluindo textos, imagens e design, é propriedade do Zassala Mário Bunga.</p>
        
        <h4>Limitação de Responsabilidade</h4>
        <p>As informações fornecidas neste website são apenas para fins informativos e não constituem aconselhamento profissional específico.</p>
        
        <h4>Contacto Profissional</h4>
        <p>O contacto através deste website destina-se exclusivamente a fins profissionais relacionados com educação, investigação e consultoria.</p>
        
        <h4>Modificações</h4>
        <p>Estes termos podem ser actualizados periodicamente. Recomendamos a consulta regular desta página.</p>
    `;
}

// Keyboard Navigation
document.addEventListener('keydown', function (e) {
    // Close modal with Escape key
    if (e.key === 'Escape') {
        closeModal();
    }

    // Navigate sections with arrow keys (when not in form fields)
    if (!document.activeElement.matches('input, textarea, select')) {
        const sections = ['hero', 'sobre', 'experiencia', 'educacao', 'contacto'];
        const currentIndex = sections.findIndex(section => {
            const element = document.getElementById(section);
            const rect = element.getBoundingClientRect();
            return rect.top <= 100 && rect.bottom > 100;
        });

        if (e.key === 'ArrowDown' && currentIndex < sections.length - 1) {
            scrollToSection(sections[currentIndex + 1]);
        } else if (e.key === 'ArrowUp' && currentIndex > 0) {
            scrollToSection(sections[currentIndex - 1]);
        }
    }
});

// Performance Optimization
// Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimized scroll handler
const optimizedScrollHandler = debounce(function () {
    updateActiveNavLink();
}, 10);

window.addEventListener('scroll', optimizedScrollHandler);

// Preload critical resources
function preloadResources() {
    const criticalImages = [
        'imagem1.jpg'
    ];

    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
}

// Initialize preloading
preloadResources();

// Add CSS for modal
const modalStyles = `
<style>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    padding: var(--spacing-4);
}

.modal-content {
    background: var(--white);
    border-radius: var(--radius-xl);
    max-width: 600px;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: var(--shadow-xl);
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing-6);
    border-bottom: 1px solid var(--gray-200);
}

.modal-header h3 {
    margin: 0;
    color: var(--gray-900);
}

.modal-close {
    background: none;
    border: none;
    font-size: var(--font-size-xl);
    color: var(--gray-500);
    cursor: pointer;
    padding: var(--spacing-2);
    border-radius: var(--radius-md);
    transition: var(--transition-normal);
}

.modal-close:hover {
    background: var(--gray-100);
    color: var(--gray-700);
}

.modal-body {
    padding: var(--spacing-6);
}

.modal-body h4 {
    color: var(--gray-900);
    margin-bottom: var(--spacing-3);
    margin-top: var(--spacing-6);
}

.modal-body h4:first-child {
    margin-top: 0;
}

.modal-body p {
    color: var(--gray-700);
    line-height: 1.6;
    margin-bottom: var(--spacing-4);
}

body.modal-open {
    overflow: hidden;
}

@media (max-width: 768px) {
    .modal-content {
        margin: var(--spacing-4);
        max-height: calc(100vh - 2 * var(--spacing-4));
    }
    
    .modal-header,
    .modal-body {
        padding: var(--spacing-4);
    }
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', modalStyles);
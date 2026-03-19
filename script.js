// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function () {
    initNavigation();
    initScrollAnimations();
    initBackToTop();
    initContactForm();
    initHeaderScroll();
    initParallaxEffects();
    updateCurrentYear();
    console.log('✨ Portfolio loaded successfully!');
});

// Header Scroll Effect
function initHeaderScroll() {
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// Navigation Functions
function initNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function () {
            navMenu.classList.toggle('active');

            // Toggle hamburger icon with animation
            const icon = navToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
                icon.style.transform = 'rotate(180deg)';
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                icon.style.transform = 'rotate(0deg)';
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
                icon.style.transform = 'rotate(0deg)';
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
    const scrollPosition = window.scrollY + 150;

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

// Scroll Animations with Intersection Observer
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                
                // Animate skill cards with stagger
                const skillCards = entry.target.querySelectorAll('.skill-card');
                skillCards.forEach((card, index) => {
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * 100);
                });

                // Animate timeline items
                const timelineItems = entry.target.querySelectorAll('.timeline-item');
                timelineItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateX(0)';
                    }, index * 150);
                });

                // Animate project cards
                const projectCards = entry.target.querySelectorAll('.project-card');
                projectCards.forEach((card, index) => {
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * 100);
                });
            }
        });
    }, observerOptions);

    // Observe sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        observer.observe(section);
    });

    // Initial styles for animated elements
    document.querySelectorAll('.skill-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
    });

    document.querySelectorAll('.timeline-item').forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-30px)';
        item.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
    });

    document.querySelectorAll('.project-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
    });
}

// Parallax Effects
function initParallaxEffects() {
    const hero = document.querySelector('.hero');
    
    window.addEventListener('scroll', function() {
        const scrolled = window.scrollY;
        const heroContent = document.querySelector('.hero-content');
        
        if (heroContent && scrolled < window.innerHeight) {
            heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
            heroContent.style.opacity = 1 - (scrolled / window.innerHeight);
        }
    });
}

// Back to Top Button
function initBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');

    if (backToTopBtn) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 400) {
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

            // Add focus effects
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
            });

            input.addEventListener('blur', function() {
                this.parentElement.classList.remove('focused');
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
    submitBtn.style.opacity = '0.7';

    // Simulate form submission
    setTimeout(() => {
        // Hide form and show success message with animation
        form.style.opacity = '0';
        form.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            form.style.display = 'none';
            formSuccess.style.display = 'block';
            formSuccess.style.opacity = '0';
            formSuccess.style.transform = 'scale(0.95)';
            
            setTimeout(() => {
                formSuccess.style.opacity = '1';
                formSuccess.style.transform = 'scale(1)';
                formSuccess.style.transition = 'all 0.3s ease';
            }, 50);
        }, 300);

        // Log form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        console.log('📧 Form submitted:', data);

        // Reset form after 5 seconds
        setTimeout(() => {
            form.reset();
            form.style.display = 'flex';
            form.style.opacity = '1';
            form.style.transform = 'scale(1)';
            formSuccess.style.display = 'none';
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';

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

    }, 2000);
}

// Utility Functions
function updateCurrentYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// Modal Functions
function showModal(type) {
    const title = type === 'privacy' ? 'Política de Privacidade' : 'Termos de Uso';
    const content = type === 'privacy' ? getPrivacyPolicyContent() : getTermsContent();

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

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.body.classList.add('modal-open');
    
    // Animate modal in
    const modalOverlay = document.querySelector('.modal-overlay');
    const modalContent = document.querySelector('.modal-content');
    
    setTimeout(() => {
        modalOverlay.style.opacity = '1';
        modalContent.style.transform = 'scale(1)';
    }, 10);
}

function closeModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        modal.style.opacity = '0';
        const modalContent = modal.querySelector('.modal-content');
        modalContent.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            modal.remove();
            document.body.classList.remove('modal-open');
        }, 300);
    }
}

function getPrivacyPolicyContent() {
    return `
        <h4>Recolha e Uso de Dados</h4>
        <p>Este website recolhe apenas os dados fornecidos voluntariamente através do formulário de contacto.</p>
        
        <h4>Finalidade</h4>
        <p>Os dados pessoais são utilizados exclusivamente para responder às suas solicitações.</p>
        
        <h4>Segurança</h4>
        <p>Implementamos medidas de segurança adequadas para proteger os seus dados pessoais.</p>
        
        <h4>Direitos</h4>
        <p>Tem o direito de aceder, rectificar ou eliminar os seus dados pessoais a qualquer momento.</p>
    `;
}

function getTermsContent() {
    return `
        <h4>Uso do Website</h4>
        <p>Este website destina-se a fornecer informações sobre os serviços profissionais de Zassala Mário Bunga.</p>
        
        <h4>Propriedade Intelectual</h4>
        <p>Todo o conteúdo deste website é propriedade de Zassala Mário Bunga.</p>
        
        <h4>Contacto Profissional</h4>
        <p>O contacto através deste website destina-se exclusivamente a fins profissionais.</p>
        
        <h4>Modificações</h4>
        <p>Estes termos podem ser actualizados periodicamente.</p>
    `;
}

// Keyboard Navigation
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// Performance Optimization - Debounce
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
    const criticalImages = ['imagem1.jpg'];

    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
}

preloadResources();

// Cursor effect for desktop (optional luxury touch)
function initCursorEffect() {
    if (window.matchMedia('(pointer: fine)').matches) {
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        cursor.innerHTML = '<div class="cursor-dot"></div><div class="cursor-ring"></div>';
        document.body.appendChild(cursor);
        
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });
        
        document.querySelectorAll('a, button, .card, .skill-card, .project-card').forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
        });
    }
}

// Initialize cursor effect after page load
// initCursorEffect(); // Uncomment to enable custom cursor

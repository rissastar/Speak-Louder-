// Healing Space JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initializeApp();
});

function initializeApp() {
    setupQuoteRotator();
    setupModals();
    setupPanicButton();
    setupAuth();
    setupBottomNav();
    addAccessibilityFeatures();
    addSmoothScrolling();
}

// Quote Rotator
function setupQuoteRotator() {
    const quotes = [
        "Healing is not about moving on or forgetting the past; it's about making peace with it.",
        "Your story isn't over. This is just a chapter, not the whole book.",
        "In the depth of winter, I finally learned that within me there lay an invincible summer. - Albert Camus",
        "You are braver than you believe, stronger than you seem, and more loved than you know.",
        "Healing happens when we create space for our pain and respond with compassion.",
        "Every small step forward is worth celebrating. Progress, not perfection.",
        "Your current situation is not your final destination. Keep going.",
        "It's okay to not be okay. It's not okay to stay that way without seeking help."
    ];

    const quoteElement = document.getElementById('quote-text');
    const dots = document.querySelectorAll('.dot');
    let currentQuote = 0;

    function displayQuote(index) {
        quoteElement.classList.remove('active');
        
        setTimeout(() => {
            quoteElement.textContent = `"${quotes[index]}"`;
            quoteElement.classList.add('active');
            
            // Update dots
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
        }, 250);
    }

    function nextQuote() {
        currentQuote = (currentQuote + 1) % quotes.length;
        displayQuote(currentQuote);
    }

    // Initialize first quote
    displayQuote(0);

    // Auto-rotate quotes every 6 seconds
    setInterval(nextQuote, 6000);

    // Manual quote navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentQuote = index;
            displayQuote(currentQuote);
        });
    });
}

// Modal Management
function setupModals() {
    const modals = {
        panic: document.getElementById('panic-modal'),
        auth: document.getElementById('auth-modal')
    };

    const closeButtons = document.querySelectorAll('.close-modal');

    // Close modal handlers
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            closeModal(modal);
        });
    });

    // Close modal when clicking outside
    Object.values(modals).forEach(modal => {
        if (modal) {
            modal.addEventListener('click', function(e) {
                if (e.target === this) {
                    closeModal(this);
                }
            });
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.modal[style*="flex"]');
            if (openModal) {
                closeModal(openModal);
            }
        }
    });
}

function openModal(modal) {
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Focus first focusable element
        const focusableElement = modal.querySelector('input, button, [tabindex]:not([tabindex="-1"])');
        if (focusableElement) {
            setTimeout(() => focusableElement.focus(), 100);
        }
    }
}

function closeModal(modal) {
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Panic Button Functionality
function setupPanicButton() {
    const panicBtn = document.getElementById('panic-btn');
    const panicModal = document.getElementById('panic-modal');

    if (panicBtn && panicModal) {
        panicBtn.addEventListener('click', function() {
            openModal(panicModal);
            // Log emergency button usage (in real app, this would go to analytics)
            console.log('Emergency help button activated');
        });
    }
}

// Authentication System
function setupAuth() {
    const authModal = document.getElementById('auth-modal');
    const authForm = document.getElementById('auth-form');
    const authTitle = document.getElementById('auth-title');
    const authSubmitBtn = document.getElementById('auth-submit-btn');
    const authSwitch = document.getElementById('auth-switch');
    const switchToRegister = document.getElementById('switch-to-register');
    const authError = document.getElementById('auth-error');
    const emailInput = document.getElementById('auth-email');
    const passwordInput = document.getElementById('auth-password');

    let isLoginMode = true;

    // Switch between login and register modes
    if (switchToRegister) {
        switchToRegister.addEventListener('click', function(e) {
            e.preventDefault();
            toggleAuthMode();
        });
    }

    function toggleAuthMode() {
        isLoginMode = !isLoginMode;
        
        if (isLoginMode) {
            authTitle.textContent = 'Welcome Back';
            authSubmitBtn.textContent = 'Login';
            authSwitch.innerHTML = 'Don\'t have an account? <a href="#" id="switch-to-register">Register here</a>';
        } else {
            authTitle.textContent = 'Join Our Community';
            authSubmitBtn.textContent = 'Register';
            authSwitch.innerHTML = 'Already have an account? <a href="#" id="switch-to-login">Login here</a>';
        }

        // Re-bind the switch handler
        const switchLink = authSwitch.querySelector('a');
        if (switchLink) {
            switchLink.addEventListener('click', function(e) {
                e.preventDefault();
                toggleAuthMode();
            });
        }

        clearAuthError();
    }

    // Form submission
    if (authForm) {
        authForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleAuth();
        });
    }

    function handleAuth() {
        const email = emailInput.value.trim();
        const password = passwordInput.value;

        // Basic validation
        if (!email || !password) {
            showAuthError('Please fill in all fields.');
            return;
        }

        if (!isValidEmail(email)) {
            showAuthError('Please enter a valid email address.');
            return;
        }

        if (password.length < 6) {
            showAuthError('Password must be at least 6 characters long.');
            return;
        }

        // Simulate authentication (replace with real auth logic)
        simulateAuth(email, password, isLoginMode);
    }

    function simulateAuth(email, password, isLogin) {
        authSubmitBtn.textContent = isLogin ? 'Logging in...' : 'Creating account...';
        authSubmitBtn.disabled = true;

        // Simulate API call
        setTimeout(() => {
            // For demo purposes, always succeed
            const userData = {
                email: email,
                name: email.split('@')[0],
                isLoggedIn: true
            };

            // Store user data (in real app, use secure storage)
            sessionStorage.setItem('healingSpaceUser', JSON.stringify(userData));
            
            // Show success and close modal
            showAuthSuccess(isLogin ? 'Welcome back!' : 'Account created successfully!');
            closeModal(authModal);
            
            // Update UI for logged-in state
            updateUIForLoggedInUser(userData);

            // Reset form
            authForm.reset();
            authSubmitBtn.textContent = isLogin ? 'Login' : 'Register';
            authSubmitBtn.disabled = false;
            
        }, 1500);
    }

    function showAuthError(message) {
        authError.textContent = message;
        authError.style.display = 'block';
    }

    function clearAuthError() {
        authError.textContent = '';
        authError.style.display = 'none';
    }

    function showAuthSuccess(message) {
        // Create temporary success message
        const successMsg = document.createElement('div');
        successMsg.textContent = message;
        successMsg.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(76, 175, 80, 0.9);
            color: white;
            padding: 1rem 2rem;
            border-radius: 10px;
            z-index: 3000;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(successMsg);
        
        setTimeout(() => {
            successMsg.remove();
        }, 3000);
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Check for existing user session
    checkUserSession();
}

function checkUserSession() {
    const userData = sessionStorage.getItem('healingSpaceUser');
    if (userData) {
        const user = JSON.parse(userData);
        updateUIForLoggedInUser(user);
    }
}

function updateUIForLoggedInUser(userData) {
    // Update CTA button
    const ctaBtn = document.getElementById('cta-btn');
    if (ctaBtn) {
        ctaBtn.innerHTML = `<span class="btn-icon">👋</span><span>Welcome, ${userData.name}!</span>`;
        ctaBtn.onclick = () => window.location.href = 'profile.html';
    }

    // Show bottom navigation
    setupBottomNavForUser();
}

function setupBottomNavForUser() {
    const bottomNav = document.getElementById('bottom-nav');
    if (bottomNav) {
        bottomNav.innerHTML = `
            <a href="feed.html">🧡 Feed</a>
            <a href="profile.html">🙋 Profile</a>
            <a href="memorial-wall.html">🕯️ Memorial</a>
            <a href="settings.html">⚙️ Settings</a>
            <a href="#" onclick="logout()">🚪 Logout</a>
        `;
        bottomNav.style.display = 'block';
    }
}

function logout() {
    sessionStorage.removeItem('healingSpaceUser');
    location.reload();
}

// Bottom Navigation
function setupBottomNav() {
    // Bottom nav is set up dynamically based on login state
    // This function can be expanded for additional nav functionality
}

// Accessibility Features
function addAccessibilityFeatures() {
    // Add skip to content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: #000;
        color: #fff;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 1000;
        transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', function() {
        this.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);

    // Add main content ID
    const mainElement = document.querySelector('main');
    if (mainElement) {
        mainElement.id = 'main-content';
    }

    // Announce important actions to screen readers
    addAriaLiveRegion();
}

function addAriaLiveRegion() {
    const liveRegion = document.createElement('div');
    liveRegion.id = 'aria-live-region';
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.style.cssText = `
        position: absolute;
        left: -10000px;
        width: 1px;
        height: 1px;
        overflow: hidden;
    `;
    document.body.appendChild(liveRegion);
}

function announceToScreenReader(message) {
    const liveRegion = document.getElementById('aria-live-region');
    if (liveRegion) {
        liveRegion.textContent = message;
    }
}

// Smooth Scrolling
function addSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Utility functions
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

// Performance optimization: Lazy load grid items
function observeGridItems() {
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.grid-item').forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(item);
        });
    }
}

// Call after DOM is loaded
setTimeout(observeGridItems, 100);

// Error handling for missing elements
function safeQuerySelector(selector) {
    const element = document.querySelector(selector);
    if (!element) {
        console.warn(`Element not found: ${selector}`);
    }
    return element;
}

// Global error handler
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
    // In production, you might want to send this to an error tracking service
});

// Service worker registration (for future PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Uncomment when you have a service worker file
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered'))
        //     .catch(error => console.log('SW registration failed'));
    });
}

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeApp,
        setupQuoteRotator,
        setupModals,
        isValidEmail: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    };
}
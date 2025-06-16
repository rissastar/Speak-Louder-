// Supabase Configuration
const SUPABASE_URL = 'https://zgjfbbfnldxlvzstnfzy.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpnamZiYmZubGR4bHZ6c3RuZnp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2NDczNzIsImV4cCI6MjA2NTIyMzM3Mn0.-Lt8UIAqI5ySoyyTGzRs3JVBhdcZc8zKxiLH6qbu3dU';

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Global variables
let currentUser = null;
let currentQuoteIndex = 0;
let quoteInterval = null;

// Healing quotes for rotation
const healingQuotes = [
  "Healing is not about moving on or 'getting over it.' It's about learning to make peace with our pain and finding meaning in our struggle.",
  "You are allowed to be both a masterpiece and a work in progress simultaneously.",
  "The wound is the place where the Light enters you. - Rumi"
];

// DOM Elements
const elements = {
  panicBtn: document.getElementById('panic-btn'),
  panicModal: document.getElementById('panic-modal'),
  closeModal: document.getElementById('close-modal'),
  authModal: document.getElementById('auth-modal'),
  closeAuthModal: document.getElementById('close-auth-modal'),
  authForm: document.getElementById('auth-form'),
  authTitle: document.getElementById('auth-title'),
  authSubmitBtn: document.getElementById('auth-submit-btn'),
  authSwitch: document.getElementById('auth-switch'),
  switchToRegister: document.getElementById('switch-to-register'),
  authError: document.getElementById('auth-error'),
  quoteText: document.getElementById('quote-text'),
  quoteDots: document.querySelectorAll('.dot'),
  bottomNav: document.getElementById('bottom-nav'),
  ctaBtn: document.getElementById('cta-btn')
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
});

async function initializeApp() {
  try {
    // Check if user is already logged in
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      currentUser = session.user;
      updateUIForLoggedInUser();
    }

    // Set up event listeners
    setupEventListeners();
    
    // Start quote rotation
    startQuoteRotation();
    
    // Initialize auth state listener
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        currentUser = session.user;
        updateUIForLoggedInUser();
        closeAuthModal();
      } else if (event === 'SIGNED_OUT') {
        currentUser = null;
        updateUIForLoggedOutUser();
      }
    });

  } catch (error) {
    console.error('Error initializing app:', error);
  }
}

function setupEventListeners() {
  // Panic button
  if (elements.panicBtn) {
    elements.panicBtn.addEventListener('click', openPanicModal);
  }

  // Modal close buttons
  if (elements.closeModal) {
    elements.closeModal.addEventListener('click', closePanicModal);
  }
  
  if (elements.closeAuthModal) {
    elements.closeAuthModal.addEventListener('click', closeAuthModal);
  }

  // Close modals when clicking outside
  if (elements.panicModal) {
    elements.panicModal.addEventListener('click', function(e) {
      if (e.target === elements.panicModal) {
        closePanicModal();
      }
    });
  }

  if (elements.authModal) {
    elements.authModal.addEventListener('click', function(e) {
      if (e.target === elements.authModal) {
        closeAuthModal();
      }
    });
  }

  // Auth form
  if (elements.authForm) {
    elements.authForm.addEventListener('submit', handleAuthSubmit);
  }

  // Switch between login and register
  if (elements.switchToRegister) {
    elements.switchToRegister.addEventListener('click', function(e) {
      e.preventDefault();
      toggleAuthMode();
    });
  }

  // Quote dots
  elements.quoteDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      showQuote(index);
    });
  });

  // Keyboard navigation
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closePanicModal();
      closeAuthModal();
    }
  });
}

// Quote rotation functions
function startQuoteRotation() {
  showQuote(0);
  quoteInterval = setInterval(() => {
    currentQuoteIndex = (currentQuoteIndex + 1) % healingQuotes.length;
    showQuote(currentQuoteIndex);
  }, 5000);
}

function showQuote(index) {
  if (!elements.quoteText) return;
  
  currentQuoteIndex = index;
  
  // Fade out current quote
  elements.quoteText.classList.remove('active');
  
  setTimeout(() => {
    elements.quoteText.textContent = healingQuotes[index];
    elements.quoteText.classList.add('active');
    
    // Update dots
    elements.quoteDots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
  }, 300);
}

// Modal functions
function openPanicModal() {
  if (elements.panicModal) {
    elements.panicModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Focus management for accessibility
    const firstFocusable = elements.panicModal.querySelector('button, a, input');
    if (firstFocusable) {
      firstFocusable.focus();
    }
  }
}

function closePanicModal() {
  if (elements.panicModal) {
    elements.panicModal.style.display = 'none';
    document.body.style.overflow = '';
    elements.panicBtn?.focus();
  }
}

function openAuthModal() {
  if (elements.authModal) {
    elements.authModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    const firstInput = elements.authModal.querySelector('input');
    if (firstInput) {
      firstInput.focus();
    }
  }
}

function closeAuthModal() {
  if (elements.authModal) {
    elements.authModal.style.display = 'none';
    document.body.style.overflow = '';
    clearAuthError();
  }
}

// Authentication functions
let isLoginMode = true;

function toggleAuthMode() {
  isLoginMode = !isLoginMode;
  
  if (isLoginMode) {
    elements.authTitle.textContent = 'Welcome Back';
    elements.authSubmitBtn.textContent = 'Login';
    elements.authSwitch.innerHTML = 'Don\'t have an account? <a href="#" id="switch-to-register">Register here</a>';
  } else {
    elements.authTitle.textContent = 'Join Our Community';
    elements.authSubmitBtn.textContent = 'Register';
    elements.authSwitch.innerHTML = 'Already have an account? <a href="#" id="switch-to-register">Login here</a>';
  }
  
  // Re-attach event listener
  const newSwitchLink = document.getElementById('switch-to-register');
  if (newSwitchLink) {
    newSwitchLink.addEventListener('click', function(e) {
      e.preventDefault();
      toggleAuthMode();
    });
  }
  
  clearAuthError();
}

async function handleAuthSubmit(e) {
  e.preventDefault();
  
  const email = document.getElementById('auth-email').value;
  const password = document.getElementById('auth-password').value;
  
  if (!email || !password) {
    showAuthError('Please fill in all fields');
    return;
  }

  // Show loading state
  const originalText = elements.authSubmitBtn.textContent;
  elements.authSubmitBtn.innerHTML = '<span class="loading"></span> Processing...';
  elements.authSubmitBtn.disabled = true;
  
  try {
    let result;
    
    if (isLoginMode) {
      result = await supabase.auth.signInWithPassword({
        email: email,
        password: password
      });
    } else {
      result = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            created_at: new Date().toISOString()
          }
        }
      });
    }
    
    if (result.error) {
      throw result.error;
    }
    
    if (!isLoginMode && !result.data.session) {
      showAuthSuccess('Registration successful! Please check your email to verify your account.');
    } else if (result.data.session) {
      showAuthSuccess(isLoginMode ? 'Login successful!' : 'Registration successful!');
      setTimeout(() => {
        window.location.href = 'profile.html';
      }, 1500);
    }
    
  } catch (error) {
    console.error('Auth error:', error);
    showAuthError(getAuthErrorMessage(error));
  } finally {
    // Reset button state
    elements.authSubmitBtn.textContent = originalText;
    elements.authSubmitBtn.disabled = false;
  }
}

function getAuthErrorMessage(error) {
  switch (error.message) {
    case 'Invalid login credentials':
      return 'Invalid email or password. Please try again.';
    case 'User already registered':
      return 'An account with this email already exists. Try logging in instead.';
    case 'Password should be at least 6 characters':
      return 'Password must be at least 6 characters long.';
    case 'Unable to validate email address: invalid format':
      return 'Please enter a valid email address.';
    default:
      return error.message || 'An error occurred. Please try again.';
  }
}

function showAuthError(message) {
  if (elements.authError) {
    elements.authError.textContent = message;
    elements.authError.classList.add('show');
  }
}

function showAuthSuccess(message) {
  // Create or update success message element
  let successEl = document.querySelector('.success-message');
  if (!successEl) {
    successEl = document.createElement('p');
    successEl.className = 'success-message';
    elements.authForm.appendChild(successEl);
  }
  
  successEl.textContent = message;
  successEl.classList.add('show');
}

function clearAuthError() {
  if (elements.authError) {
    elements.authError.classList.remove('show');
    elements.authError.textContent = '';
  }
  
  const successEl = document.querySelector('.success-message');
  if (successEl) {
    successEl.classList.remove('show');
  }
}

// UI update functions
function updateUIForLoggedInUser() {
  // Update CTA button
  if (elements.ctaBtn) {
    elements.ctaBtn.innerHTML = '<span class="btn-icon">👋</span><span>Welcome Back</span>';
    elements.ctaBtn.onclick = () => window.location.href = 'profile.html';
  }
  
  // Show bottom navigation
  if (elements.bottomNav) {
    elements.bottomNav.style.display = 'block';
    elements.bottomNav.innerHTML = `
      <div class="nav-links">
        <a href="profile.html" class="nav-link">
          <span>🙋</span>
          <span>Profile</span>
        </a>
        <a href="feed.html" class="nav-link">
          <span>🧡</span>
          <span>Feed</span>
        </a>
        <a href="memorial-wall.html" class="nav-link">
          <span>🕯️</span>
          <span>Memorial</span>
        </a>
        <a href="grounding-techniques.html" class="nav-link">
          <span>🌍</span>
          <span>Tools</span>
        </a>
        <button class="nav-link" onclick="handleLogout()">
          <span>🚪</span>
          <span>Logout</span>
        </button>
      </div>
    `;
  }
  
  // Update grid items for logged-in state
  updateGridItemsForLoggedInUser();
}

function updateUIForLoggedOutUser() {
  // Reset CTA button
  if (elements.ctaBtn) {
    elements.ctaBtn.innerHTML = '<span class="btn-icon">🌟</span><span>Join the Healing</span>';
    elements.ctaBtn.onclick = () => openAuthModal();
  }
  
  // Hide bottom navigation
  if (elements.bottomNav) {
    elements.bottomNav.style.display = 'none';
  }
  
  // Reset grid items
  resetGridItems();
}

function updateGridItemsForLoggedInUser() {
  // This function can be expanded to show/hide certain features based on auth state
  const authItems = document.querySelectorAll('.auth-item');
  authItems.forEach(item => {
    item.style.opacity = '0.6';
    item.style.pointerEvents = 'none';
  });
}

function resetGridItems() {
  const authItems = document.querySelectorAll('.auth-item');
  authItems.forEach(item => {
    item.style.opacity = '1';
    item.style.pointerEvents = 'auto';
  });
}

// Logout function
async function handleLogout() {
  try {
    await supabase.auth.signOut();
    window.location.href = 'index.html';
  } catch (error) {
    console.error('Logout error:', error);
  }
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

// Accessibility improvements
function trapFocus(element) {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  
  element.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    }
  });
}

// Apply focus trapping to modals
if (elements.panicModal) {
  trapFocus(elements.panicModal);
}
if (elements.authModal) {
  trapFocus(elements.authModal);
}

// Error handling
window.addEventListener('error', function(e) {
  console.error('Global error:', e.error);
});

window.addEventListener('unhandledrejection', function(e) {
  console.error('Unhandled promise rejection:', e.reason);
});

// Performance optimization - lazy load images if any
document.addEventListener('DOMContentLoaded', function() {
  const images = document.querySelectorAll('img[data-src]');
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove('lazy');
        imageObserver.unobserve(img);
      }
    });
  });
  
  images.forEach(img => imageObserver.observe(img));
});

// Service worker registration for PWA capabilities (optional)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js')
      .then(function(registration) {
        console.log('SW registered: ', registration);
      })
      .catch(function(registrationError) {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// Export functions for use in other files
window.healingSpace = {
  supabase,
  currentUser,
  handleLogout,
  openAuthModal,
  closeAuthModal,
  showAuthError,
  clearAuthError
};
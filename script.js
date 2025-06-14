// Initialize Supabase client with your credentials
const supabaseUrl = 'https://zgjfbbfnldxlvzstnfzy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjZ2ZlZGoxdHRicWk2bnhuYm1iIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODc1MTI1NjQsImV4cCI6MTk5MzA2ODU2NH0.lQH0S6WDPMZXLsLoPGCyb1DJXNXAH1td1pLVQFTGXgE';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);
  
// Quotes for rotator
const quotes = [
  "Healing is not linear, but every step counts.",
  "You are worthy of love and kindness.",
  "It's okay to ask for help.",
  "Speak your truth. Your story matters.",
  "This is a safe place for your soul.",
  "Every small victory is progress.",
  "Be gentle with yourself.",
  "Healing begins with honesty."
];

// DOM Elements
const quoteText = document.getElementById('quote-text');
const panicBtn = document.getElementById('panic-btn');
const panicModal = document.getElementById('panic-modal');
const closePanicModalBtn = document.getElementById('close-modal');
const authModal = document.getElementById('auth-modal');
const closeAuthModalBtn = document.getElementById('close-auth-modal');
const authForm = document.getElementById('auth-form');
const authTitle = document.getElementById('auth-title');
const authSubmitBtn = document.getElementById('auth-submit-btn');
const authSwitch = document.getElementById('auth-switch');
const authError = document.getElementById('auth-error');

let quoteIndex = 0;
let isLogin = true; // toggle login/register

// Rotate quotes every 6 seconds
function rotateQuotes() {
  quoteText.textContent = quotes[quoteIndex];
  quoteIndex = (quoteIndex + 1) % quotes.length;
}
rotateQuotes();
setInterval(rotateQuotes, 6000);

// Open panic modal
panicBtn.addEventListener('click', () => {
  panicModal.style.display = 'flex';
});
// Close panic modal
closePanicModalBtn.addEventListener('click', () => {
  panicModal.style.display = 'none';
});
// Close panic modal clicking outside content
panicModal.addEventListener('click', e => {
  if (e.target === panicModal) panicModal.style.display = 'none';
});

// Close auth modal
closeAuthModalBtn.addEventListener('click', () => {
  authModal.style.display = 'none';
});
authModal.addEventListener('click', e => {
  if (e.target === authModal) authModal.style.display = 'none';
});

// Toggle login/register form
authSwitch.querySelector('a').addEventListener('click', e => {
  e.preventDefault();
  isLogin = !isLogin;
  if (isLogin) {
    authTitle.textContent = 'Login';
    authSubmitBtn.textContent = 'Login';
    authSwitch.innerHTML = `Don’t have an account? <a href="#" id="switch-to-register">Register</a>`;
  } else {
    authTitle.textContent = 'Register';
    authSubmitBtn.textContent = 'Register';
    authSwitch.innerHTML = `Already have an account? <a href="#" id="switch-to-register">Login</a>`;
  }
  authError.textContent = '';
  // Re-attach event listener for new link
  authSwitch.querySelector('a').addEventListener('click', e => {
    e.preventDefault();
    authSwitch.querySelector('a').click();
  });
});

// Auth form submit handler (login/register)
authForm.addEventListener('submit', async e => {
  e.preventDefault();
  authError.textContent = '';

  const email = document.getElementById('auth-email').value.trim();
  const password = document.getElementById('auth-password').value.trim();

  if (!email || !password) {
    authError.textContent = 'Please enter email and password.';
    return;
  }

  try {
    if (isLogin) {
      // Login user
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      alert('Login successful! Welcome back.');
      authModal.style.display = 'none';
      // You can redirect or update UI here
    } else {
      // Register user
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      alert('Registration successful! Please check your email for confirmation.');
      authModal.style.display = 'none';
    }
  } catch (error) {
    authError.textContent = error.message;
  }
});

// Bottom nav links & active highlight
const pages = [
  { href: 'index.html', label: 'Home' },
  { href: 'feed.html', label: 'Feed' },
  { href: 'profile.html', label: 'Profile' },
  { href: 'settings.html', label: 'Settings' },
  { href: 'about.html', label: 'About' }
];

const bottomNav = document.getElementById('bottom-nav');
pages.forEach(page => {
  const a = document.createElement('a');
  a.href = page.href;
  a.textContent = page.label;
  if (window.location.pathname.endsWith(page.href)) {
    a.classList.add('active');
  }
  bottomNav.appendChild(a);
});
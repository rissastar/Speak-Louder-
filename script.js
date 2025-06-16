// Quotes array with authors
const quotes = [
  { text: "Healing takes time, and asking for help is a courageous step.", author: "Mariska Hargitay" },
  { text: "Your present circumstances don’t determine where you can go; they merely determine where you start.", author: "Nido Qubein" },
  { text: "Stars can’t shine without darkness.", author: "D.H. Sidebottom" },
  { text: "The wound is the place where the light enters you.", author: "Rumi" },
  { text: "You have been assigned this mountain to show others it can be moved.", author: "Unknown" },
  { text: "Self-care is how you take your power back.", author: "Lalah Delia" },
  { text: "You, yourself, as much as anybody in the entire universe, deserve your love and affection.", author: "Buddha" },
  { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
  { text: "Small steps every day.", author: "Unknown" },
  { text: "Healing is not linear.", author: "Unknown" },
  { text: "Sometimes the bravest thing you can do is to keep going.", author: "Unknown" },
  { text: "You are stronger than you think.", author: "A.A. Milne" },
  { text: "Peace comes from within. Do not seek it without.", author: "Buddha" },
  { text: "You’re allowed to be both a masterpiece and a work in progress.", author: "Sophia Bush" },
  { text: "Growth begins when we start to accept our own weakness.", author: "Jean Vanier" },
  { text: "The only way out is through.", author: "Robert Frost" },
  { text: "You don’t have to control your thoughts. You just have to stop letting them control you.", author: "Dan Millman" },
  { text: "Recovery is something that you have to work on every single day.", author: "Demi Lovato" },
  { text: "Let your hope, not your hurt, shape your future.", author: "Robert H. Schuller" },
  { text: "One day at a time.", author: "Unknown" }
];

// DOM Elements
const quoteText = document.getElementById('quote-text');
const quoteAuthor = document.getElementById('quote-author');
const quoteDotsContainer = document.getElementById('quote-dots');
const ctaBtn = document.getElementById('cta-btn');
const authModal = document.getElementById('auth-modal');
const panicModal = document.getElementById('panic-modal');
const authCloseBtn = authModal.querySelector('.close-btn');
const panicCloseBtn = panicModal.querySelector('.close-btn');
const loginBtn = document.getElementById('login-btn');
const registerBtn = document.getElementById('register-btn');

let currentQuoteIndex = 0;
let quoteInterval = null;

// Initialize quote dots
function createQuoteDots() {
  quotes.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.setAttribute('aria-label', `Quote ${index + 1}`);
    dot.addEventListener('click', () => {
      showQuote(index);
      resetQuoteInterval();
    });
    quoteDotsContainer.appendChild(dot);
  });
}

// Show quote at index
function showQuote(index) {
  currentQuoteIndex = index;
  const { text, author } = quotes[index];
  quoteText.textContent = `"${text}"`;
  quoteAuthor.textContent = `— ${author}`;

  // Update active dot
  const dots = quoteDotsContainer.querySelectorAll('button');
  dots.forEach((dot, idx) => {
    dot.classList.toggle('active', idx === index);
  });
}

// Rotate quotes automatically every 10 seconds
function startQuoteInterval() {
  quoteInterval = setInterval(() => {
    let nextIndex = (currentQuoteIndex + 1) % quotes.length;
    showQuote(nextIndex);
  }, 10000);
}

// Reset interval on manual change
function resetQuoteInterval() {
  clearInterval(quoteInterval);
  startQuoteInterval();
}

// Show modal helper
function openModal(modal) {
  modal.style.display = 'flex';
  modal.setAttribute('aria-hidden', 'false');
  // Focus the first focusable element inside modal (login button)
  const focusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  if (focusable) focusable.focus();
}

// Close modal helper
function closeModal(modal) {
  modal.style.display = 'none';
  modal.setAttribute('aria-hidden', 'true');
  ctaBtn.focus();
}

// Event Listeners
ctaBtn.addEventListener('click', () => openModal(authModal));

authCloseBtn.addEventListener('click', () => closeModal(authModal));
panicCloseBtn.addEventListener('click', () => closeModal(panicModal));

// Keyboard accessibility for Escape key to close modals
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (authModal.style.display === 'flex') closeModal(authModal);
    if (panicModal.style.display === 'flex') closeModal(panicModal);
  }
});

// Login and Register button clicks (can be hooked to actual modules/pages)
loginBtn.addEventListener('click', () => {
  alert('Redirecting to Login module...');
  closeModal(authModal);
});

registerBtn.addEventListener('click', () => {
  alert('Redirecting to Register module...');
  closeModal(authModal);
});

// Initialize everything
createQuoteDots();
showQuote(0);
startQuoteInterval();

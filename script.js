// --- Supabase Initialization ---
const supabase = window.supabase.createClient(
  'https://zgjfbbfnldxlvzstnfzy.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpnamZiYmZubGR4bHZ6c3RuZnp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2NDczNzIsImV4cCI6MjA2NTIyMzM3Mn0.-Lt8UIAqI5ySoyyTGzRs3JVBhdcZc8zKxiLH6qbu3dU'
);

let loggedIn = false;
let userEmail = null;

// --- Auth State Management ---
async function checkSession() {
  const { data: { session } } = await supabase.auth.getSession();
  loggedIn = !!session;
  userEmail = session?.user?.email || null;
  updateCtaBtn();
  renderNav();
}
checkSession();

supabase.auth.onAuthStateChange((event, session) => {
  loggedIn = !!session;
  userEmail = session?.user?.email || null;
  updateCtaBtn();
  renderNav();
  closeAuthModal();
});

// --- Auth Modal Logic ---
const authModal = document.getElementById('auth-modal');
const closeAuthModalBtn = document.getElementById('close-auth-modal');
const authForm = document.getElementById('auth-form');
const authTitle = document.getElementById('auth-title');
const authSubmitBtn = document.getElementById('auth-submit-btn');
const authSwitch = document.getElementById('auth-switch');
const authError = document.getElementById('auth-error');
const switchToRegister = document.getElementById('switch-to-register');

let isLogin = true;

function openAuthModal(login = true) {
  isLogin = login;
  authTitle.textContent = login ? 'Login' : 'Register';
  authSubmitBtn.textContent = login ? 'Login' : 'Register';
  authSwitch.innerHTML = login
    ? `Don't have an account? <a href="#" id="switch-to-register">Register</a>`
    : `Already have an account? <a href="#" id="switch-to-login">Login</a>`;
  authError.textContent = '';
  authModal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  // Re-bind switch links
  setTimeout(() => {
    const reg = document.getElementById('switch-to-register');
    const log = document.getElementById('switch-to-login');
    if (reg) reg.onclick = (e) => { e.preventDefault(); openAuthModal(false); };
    if (log) log.onclick = (e) => { e.preventDefault(); openAuthModal(true); };
  }, 10);
}
function closeAuthModal() {
  authModal.style.display = 'none';
  document.body.style.overflow = '';
}
closeAuthModalBtn.onclick = closeAuthModal;
authModal.onclick = (e) => { if (e.target === authModal) closeAuthModal(); };

// Handle form submit
authForm.onsubmit = async (e) => {
  e.preventDefault();
  authError.textContent = '';
  const email = document.getElementById('auth-email').value.trim();
  const password = document.getElementById('auth-password').value;
  if (isLogin) {
    // Login
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) authError.textContent = error.message;
    // Success triggers onAuthStateChange
  } else {
    // Register
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) authError.textContent = error.message;
    else authError.textContent = "Check your email for a confirmation link!";
  }
};

// --- Hero Button Logic ---
const ctaBtn = document.getElementById('cta-btn');
function updateCtaBtn() {
  if (loggedIn) {
    ctaBtn.textContent = '🌿 Visit Feed';
    ctaBtn.onclick = () => window.location.href = 'feed.html';
  } else {
    ctaBtn.textContent = '💖 Join the Community';
    ctaBtn.onclick = () => openAuthModal(false);
  }
}

// --- Quote Rotator ---
const quotes = [
  "“This too shall pass.”",
  "“You are enough, exactly as you are.”",
  "“Healing is not linear.”",
  "“One day at a time.”",
  "“You are not alone.”",
  "“Your story matters.”",
  "“Every breath is a new beginning.”"
];
let quoteIdx = 0;
const quoteText = document.getElementById('quote-text');
function showQuote(idx) {
  quoteText.style.opacity = 0;
  setTimeout(() => {
    quoteText.textContent = quotes[idx];
    quoteText.style.opacity = 1;
  }, 600);
}
showQuote(quoteIdx);
setInterval(() => {
  quoteIdx = (quoteIdx + 1) % quotes.length;
  showQuote(quoteIdx);
}, 9000);

// --- Topic Grid Data ---
const topics = [
  { icon: "🧠", title: "Mental Health", link: "mental-health.html", desc: "Mind & mood support" },
  { icon: "🍃", title: "Addiction", link: "addiction.html", desc: "Recovery resources" },
  { icon: "🛡️", title: "Abuse", link: "abuse.html", desc: "Safety & healing" },
  { icon: "🕊️", title: "Grief", link: "grief.html", desc: "Navigating loss" },
  { icon: "🌸", title: "Terminal Illness", link: "terminal-illness.html", desc: "End-of-life care" },
  { icon: "🐾", title: "Pitbull Love", link: "pitbull-love.html", desc: "Dog compassion" },
  { icon: "🌱", title: "Grounding Techniques", link: "grounding.html", desc: "Calm your mind" },
  { icon: "💬", title: "Affirmations", link: "affirmations.html", desc: "Positive self-talk" },
  { icon: "📝", title: "Worksheets", link: "worksheets.html", desc: "Guided exercises" },
  { icon: "💡", title: "Quotes", link: "quotes.html", desc: "Words of wisdom" }
];
const grid = document.querySelector('.topic-grid');
topics.forEach(t => {
  const tile = document.createElement('div');
  tile.className = 'topic-tile';
  tile.onclick = () => window.location.href = t.link;
  tile.innerHTML = `
    <div class="topic-icon">${t.icon}</div>
    <div class="topic-title">${t.title}</div>
    <div class="topic-desc">${t.desc}</div>
  `;
  grid.appendChild(tile);
});

// --- Bottom Navigation Bar ---
const navItems = [
  { icon: "🏠", label: "Home", link: "index.html", always: true },
  { icon: "🧠", label: "Mental Health", link: "mental-health.html", always: true },
  { icon: "🍃", label: "Addiction", link: "addiction.html", always: true },
  { icon: "🛡️", label: "Abuse", link: "abuse.html", always: true },
  { icon: "🕊️", label: "Grief", link: "grief.html", always: true },
  { icon: "🐾", label: "Pitbull Love", link: "pitbull-love.html", always: true },
  { icon: "🌸", label: "Terminal Illness", link: "terminal-illness.html", always: true },
  { icon: "🌱", label: "Grounding", link: "grounding.html", always: true },
  { icon: "💬", label: "Affirmations", link: "affirmations.html", always: true },
  { icon: "📝", label: "Worksheets", link: "worksheets.html", always: true },
  { icon: "💡", label: "Quotes", link: "quotes.html", always: true },
  { icon: "🕯️", label: "Memorial", link: "memorial-wall.html", special: true, always: true },
  { icon: "🚨", label: "Panic", link: "#", special: true, always: true, id: "panic-nav" },
  { icon: "👤", label: "Profile", link: "profile.html", loggedIn: true },
  { icon: "📰", label: "Visit Feed", link: "feed.html", loggedIn: true },
  { icon: "🔑", label: "Login/Register", link: "#", loggedOut: true }
];
const nav = document.getElementById('bottom-nav');
function renderNav() {
  nav.innerHTML = '';
  navItems.forEach(item => {
    if (item.always ||
        (item.loggedIn && loggedIn) ||
        (item.loggedOut && !loggedIn)) {
      const btn = document.createElement('button');
      btn.className = 'nav-item' + (item.special ? ' special-btn' : '');
      btn.innerHTML = `<span class="nav-icon">${item.icon}</span>${item.label}`;
      if (item.id === "panic-nav") {
        btn.onclick = () => openModal();
      } else if (item.label === "Login/Register") {
        btn.onclick = () => openAuthModal(true);
      } else {
        btn.onclick = () => window.location.href = item.link;
      }
      nav.appendChild(btn);
    }
  });
}

// --- Panic Button Modal ---
const panicBtn = document.getElementById('panic-btn');
const modal = document.getElementById('panic-modal');
const closeModalBtn = document.getElementById('close-modal');
function openModal() {
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  modal.style.display = 'none';
  document.body.style.overflow = '';
}
panicBtn.onclick = openModal;
closeModalBtn.onclick = closeModal;
modal.onclick = (e) => { if (e.target === modal) closeModal(); };

// --- Logout (optional, add to profile page or nav if you wish) ---
// Example: 
// async function logout() { await supabase.auth.signOut(); }


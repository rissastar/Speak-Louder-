// Initialize Supabase
const SUPABASE_URL = 'https://zgjfbbfnldxlvzstnfzy.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpnamZiYmZubGR4bHZ6c3RuZnp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2NDczNzIsImV4cCI6MjA2NTIyMzM3Mn0.-Lt8UIAqI5ySoyyTGzRs3JVBhdcZc8zKxiLH6qbu3dU';
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Quote rotator
const quotes = [
  "Healing is not linear.",
  "You are stronger than you think.",
  "This too shall pass.",
  "One day at a time.",
  "Your story isn’t over."
];
let qIndex = 0;
const quoteText = document.getElementById('quote-text');

function rotateQuotes() {
  qIndex = (qIndex + 1) % quotes.length;
  quoteText.innerText = `"${quotes[qIndex]}"`;
}
setInterval(rotateQuotes, 8000);

// CTA scroll
document.getElementById('cta-btn').addEventListener('click', () => {
  document.querySelector('.topic-grid').scrollIntoView({ behavior: 'smooth' });
});

// Topic grid dummy data
const topics = [
  { title: 'Mindfulness', id: 'mindfulness' },
  { title: 'Guided Meditation', id: 'meditation' },
  { title: 'Journaling', id: 'journaling' },
  { title: 'Community Stories', id: 'stories' }
];
const grid = document.getElementById('topic-grid');
topics.forEach(t => {
  const div = document.createElement('div');
  div.className = 'topic-card';
  div.innerHTML = `<h3>${t.title}</h3>`;
  div.addEventListener('click', () => {
    window.location.href = `${t.id}.html`;
  });
  grid.append(div);
});

// Modal utilities
function toggleModal(modalId, show) {
  document.getElementById(modalId).style.display = show ? 'block' : 'none';
}
document.getElementById('panic-btn').onclick = () => toggleModal('panic-modal', true);
document.getElementById('close-modal').onclick = () => toggleModal('panic-modal', false);
window.onclick = e => {
  if (e.target.classList.contains('modal')) {
    toggleModal('panic-modal', false);
    toggleModal('auth-modal', false);
  }
};
document.getElementById('nav-auth-btn').onclick = () => toggleModal('auth-modal', true);
document.getElementById('close-auth-modal').onclick = () => toggleModal('auth-modal', false);

// Auth form & logic
let isRegisterMode = false;
const authForm = document.getElementById('auth-form');
const authTitle = document.getElementById('auth-title');
const authSubmitBtn = document.getElementById('auth-submit-btn');
const authSwitch = document.getElementById('switch-to-register');
const authEmail = document.getElementById('auth-email');
const authPassword = document.getElementById('auth-password');
const authError = document.getElementById('auth-error');

authSwitch.addEventListener('click', e => {
  e.preventDefault();
  isRegisterMode = !isRegisterMode;
  authTitle.innerText = isRegisterMode ? 'Register' : 'Login';
  authSubmitBtn.innerText = isRegisterMode ? 'Register' : 'Login';
  authSwitch.innerText = isRegisterMode ? 'Login instead' : "Don't have an account? Register";
});

authForm.addEventListener('submit', async e => {
  e.preventDefault();
  authError.innerText = '';
  const email = authEmail.value;
  const pass = authPassword.value;
  try {
    const { data, error } = isRegisterMode
      ? await supabase.auth.signUp({ email, password: pass })
      : await supabase.auth.signInWithPassword({ email, password: pass });
    if (error) throw error;
    toggleModal('auth-modal', false);
    document.getElementById('nav-auth-btn').innerText = '🔓 Logout';
    authForm.reset();
  } catch (err) {
    authError.innerText = err.message;
  }
});

// Logout
document.getElementById('nav-auth-btn').addEventListener('click', async () => {
  const { data: session } = await supabase.auth.getSession();
  if (session.session) {
    await supabase.auth.signOut();
    document.getElementById('nav-auth-btn').innerText = '🔐 Login';
  }
});
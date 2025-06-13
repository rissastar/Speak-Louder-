// Load Supabase client library via CDN before this script:
// <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/supabase.min.js"></script>

const SUPABASE_URL = 'https://zgjfbbfnldxlvzstnfzy.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpnamZiYmZubGR4bHZ6c3RuZnp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2NDczNzIsImV4cCI6MjA2NTIyMzM3Mn0.-Lt8UIAqI5ySoyyTGzRs3JVBhdcZc8zKxiLH6qbu3dU';

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// === QUOTE ROTATOR ===
const quotes = [
  { text: "You are stronger than you think.", author: "Unknown" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "Every day is a second chance.", author: "Unknown" },
  { text: "Your story isn't over yet.", author: "Unknown" },
  { text: "Healing is not linear, and that's okay.", author: "Anonymous" },
];

let currentQuote = 0;
function showQuote() {
  const quote = quotes[currentQuote];
  document.getElementById('quote-text').textContent = `"${quote.text}"`;
  document.getElementById('quote-author').textContent = `– ${quote.author}`;
  currentQuote = (currentQuote + 1) % quotes.length;
}
setInterval(showQuote, 8000);
showQuote(); // initial load

// === CHECK LOGIN STATE & SHOW/HIDE NAV LINKS ===
async function checkUser() {
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error) {
    console.error('Supabase auth error:', error.message);
  }

  const loggedInEls = document.querySelectorAll('.logged-in-only');
  const authLinks = document.getElementById('auth-links');

  if (user) {
    loggedInEls.forEach(el => el.style.display = 'inline-block');
    if (authLinks) authLinks.style.display = 'none';
  } else {
    loggedInEls.forEach(el => el.style.display = 'none');
    if (authLinks) authLinks.style.display = 'inline-block';
  }
}

checkUser();

// === PANIC BUTTON MODAL ===
const panicModal = document.getElementById('panicModal');
const panicBtn = document.getElementById('panicBtn');
const closeBtn = document.querySelector('.close-btn');

panicBtn.onclick = () => panicModal.style.display = 'block';
function closeModal() {
  panicModal.style.display = 'none';
}
window.onclick = (e) => {
  if (e.target === panicModal) closeModal();
}
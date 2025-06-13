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

// DARK MODE TOGGLE
const darkToggle = document.createElement('div');
darkToggle.className = 'dark-mode-toggle';
darkToggle.textContent = '🌓 Toggle Theme';
document.body.appendChild(darkToggle);

darkToggle.onclick = () => {
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
};

if (localStorage.getItem('darkMode') === 'true') {
  document.body.classList.add('dark-mode');
}

const candleForm = document.getElementById('candleForm');
const memorials = document.getElementById('memorials');

candleForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const message = document.getElementById('message').value;
  const file = document.getElementById('photo').files[0];

  const user = supabase.auth.getUser();

  let imageUrl = '';
  if (file) {
    const fileName = `candles/${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage.from('candles').upload(fileName, file);
    if (!error) {
      const { data: urlData } = supabase.storage.from('candles').getPublicUrl(fileName);
      imageUrl = urlData.publicUrl;
    }
  }

  const candleData = { name, message, image: imageUrl, timestamp: new Date().toISOString() };

  // Save to Supabase if logged in
  const { data: sessionData } = await supabase.auth.getSession();
  if (sessionData.session) {
    await supabase.from('memorials').insert([candleData]);
  }

  // Display locally either way
  displayCandle(candleData);

  candleForm.reset();
});

function displayCandle({ name, message, image }) {
  const card = document.createElement('div');
  card.className = 'candle-card';
  card.innerHTML = `
    ${image ? `<img src="${image}" alt="${name}'s photo" />` : ''}
    <h3>🕯️ ${name}</h3>
    <p>${message}</p>
  `;
  memorials.prepend(card);
}
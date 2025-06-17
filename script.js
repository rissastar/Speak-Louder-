// Supabase Config
const SUPABASE_URL = 'https://zgjfbbfnldxlvzstnfzy.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // truncated for brevity
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Quote Rotator
const quotes = [
  { text: "Healing is not linear.", author: "Unknown" },
  { text: "You are enough, just as you are.", author: "Meghan Markle" },
  { text: "Stars can't shine without darkness.", author: "D.H. Sidebottom" },
  { text: "Trauma is a fact of life. Healing is a possibility.", author: "Peter A. Levine" },
  // ... add up to 20
];

let currentQuote = 0;
function showQuote(index) {
  const q = quotes[index];
  document.getElementById('quote-text').textContent = `"${q.text}"`;
  document.getElementById('quote-author').textContent = `– ${q.author}`;
}
setInterval(() => {
  currentQuote = (currentQuote + 1) % quotes.length;
  showQuote(currentQuote);
}, 6000);
showQuote(currentQuote);

// Modal Controls
const authModal = document.getElementById('auth-modal');
document.getElementById('cta-btn').onclick = () => authModal.style.display = 'flex';
document.querySelectorAll('.close-btn').forEach(btn => {
  btn.onclick = () => {
    btn.closest('.modal').style.display = 'none';
  };
});

// Panic Button
document.getElementById('panic-btn').onclick = () => {
  document.getElementById('panic-modal').style.display = 'flex';
};

// Auth Buttons
document.getElementById('login-btn').onclick = async () => {
  const email = prompt("Enter your email:");
  const password = prompt("Enter your password:");
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) alert("Login failed: " + error.message);
  else alert("Login successful!");
};

document.getElementById('register-btn').onclick = async () => {
  const email = prompt("Enter your email:");
  const password = prompt("Enter a password (6+ characters):");
  const { error } = await supabase.auth.signUp({ email, password });
  if (error) alert("Registration failed: " + error.message);
  else alert("Registration email sent! Please confirm your address.");
};
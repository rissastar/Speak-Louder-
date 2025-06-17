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

// script.js

// Aurora + Cloud canvas animation
const canvas = document.getElementById('auroraCanvas');
const ctx = canvas.getContext('2d');

let w, h;
function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// Create cloud particles
let clouds = [];
for (let i = 0; i < 50; i++) {
  clouds.push({
    x: Math.random() * w,
    y: Math.random() * h,
    radius: 50 + Math.random() * 100,
    speed: 0.2 + Math.random() * 0.5,
    opacity: 0.1 + Math.random() * 0.3
  });
}

// Aurora gradient waves
function drawAurora(time) {
  let gradient = ctx.createLinearGradient(0, 0, w, h);
  gradient.addColorStop(0, `hsl(${(time / 100) % 360}, 100%, 70%)`);
  gradient.addColorStop(1, `hsl(${(time / 100 + 60) % 360}, 100%, 50%)`);

  ctx.globalAlpha = 0.05;
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, w, h);
  ctx.globalAlpha = 1;
}

// Cloud puffs
function drawClouds() {
  clouds.forEach(c => {
    ctx.beginPath();
    ctx.arc(c.x, c.y, c.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${c.opacity})`;
    ctx.fill();
    c.x += c.speed;
    if (c.x - c.radius > w) {
      c.x = -c.radius;
      c.y = Math.random() * h;
    }
  });
}

// Animation loop
function animate(time) {
  ctx.clearRect(0, 0, w, h);
  drawAurora(time);
  drawClouds();
  requestAnimationFrame(animate);
}
animate(0);
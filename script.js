import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://zgjfbbfnldxlvzstnfzy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpnamZiYmZubGR4bHZ6c3RuZnp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2NDczNzIsImV4cCI6MjA2NTIyMzM3Mn0.-Lt8UIAqI5ySoyyTGzRs3JVBhdcZc8zKxiLH6qbu3dU';
const supabase = createClient(supabaseUrl, supabaseKey);

// Modal controls
function openModal(modal) { modal.classList.add('show'); modal.setAttribute('aria-hidden','false'); }
function closeModal(modal) { modal.classList.remove('show'); modal.setAttribute('aria-hidden','true'); }

document.querySelectorAll('.close-btn').forEach(btn => {
  btn.onclick = (e) => closeModal(e.target.closest('.modal'));
});

document.getElementById('cta-btn').onclick = () => openModal(document.getElementById('auth-modal'));
document.getElementById('panic-btn').onclick = () => openModal(document.getElementById('panic-modal'));

// Auth buttons
document.getElementById('login-btn').onclick = async () => {
  const email = prompt('Enter your email:');
  const password = prompt('Enter your password:');
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) alert(error.message); else { alert('Logged in!'); closeModal(document.getElementById('auth-modal')); }
};

document.getElementById('register-btn').onclick = async () => {
  const email = prompt('Enter your email:');
  const password = prompt('Choose a password:');
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) alert(error.message);
  else { alert('Check your email for confirmation!'); closeModal(document.getElementById('auth-modal')); }
};

// Quote rotator
const quotes = [
  { text: 'Healing takes time, but you’re worth every minute.', author: '— Rissa Star' },
  { text: 'You’re not broken, just healing.', author: '— Anonymous' },
  { text: 'One step forward is still forward.', author: '— Unknown' },
];
let qi = 0;
const qt = document.getElementById('quote-text');
const qa = document.getElementById('quote-author');
const dots = document.getElementById('quote-dots');

function showQuote(i) {
  qt.innerText = quotes[i].text;
  qa.innerText = quotes[i].author;
  Array.from(dots.children).forEach((d,j) => d.classList.toggle('active', j === i));
}
quotes.forEach((_,i) => {
  const s = document.createElement('span');
  s.onclick = () => { qi = i; showQuote(qi); };
  dots.appendChild(s);
});
showQuote(0);
setInterval(() => { qi = (qi+1)%quotes.length; showQuote(qi); }, 8000);

// Canvas background
const canvas = document.getElementById('galaxyCanvas');
const ctx = canvas.getContext('2d');
let w, h, stars = [];
function resize() { w = canvas.width = innerWidth; h = canvas.height = innerHeight; stars = Array(200).fill().map(() => ({ x: Math.random()*w, y: Math.random()*h, r: Math.random()*1.2, dx: Math.random()*0.5-0.25, dy: -Math.random()*0.5, hue: Math.random()*360 })); }
window.onresize = resize;
resize();

function animate() {
  ctx.fillStyle = '#050506';
  ctx.fillRect(0,0,w,h);
  stars.forEach(s => {
    s.x += s.dx; s.y += s.dy;
    if (s.x<0||s.x>w||s.y<0){ s.x=Math.random()*w; s.y=h; }
    ctx.beginPath();
    const grad = ctx.createRadialGradient(s.x,s.y,0,s.x,s.y,s.r*4);
    grad.addColorStop(0, `hsla(${s.hue},80%,80%,1)`);
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.arc(s.x,s.y,s.r*4,0,Math.PI*2);
    ctx.fill();
  });
  requestAnimationFrame(animate);
}
animate();
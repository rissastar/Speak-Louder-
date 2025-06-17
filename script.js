import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabase = createClient(
  'https://zgjfbbfnldxlvzstnfzy.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpnamZiYmZubGR4bHZ6c3RuZnp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2NDczNzIsImV4cCI6MjA2NTIyMzM3Mn0.-Lt8UIAqI5ySoyyTGzRs3JVBhdcZc8zKxiLH6qbu3dU'
);

const authModal = document.getElementById('auth-modal');
const modal = authModal.querySelector('.modal-content');

modal.innerHTML = `
  <button class="close-btn">&times;</button>
  <h2 id="auth-title">Login</h2>
  <form id="auth-form" class="auth-forms">
    <input type="email" id="email" placeholder="Email" required />
    <input type="password" id="password" placeholder="Password" required />
    <div id="password-strength" class="success-msg"></div>
    <button type="submit" class="submit-btn">Login</button>
    <a class="forgot" id="forgot-link">Forgot password?</a>
    <div id="auth-error" class="error-msg"></div>
  </form>
  <div id="reset-section" class="reset-form">
    <input type="email" id="reset-email" placeholder="Your email" required />
    <button id="reset-btn" class="submit-btn">Reset Password</button>
    <div id="reset-msg" class="success-msg"></div>
  </div>
  <div class="oauth-buttons">
    <button class="oauth-btn google"><img src="google.svg" alt="" /> Continue with Google</button>
    <button class="oauth-btn facebook"><img src="facebook.svg" alt="" /> Continue with Facebook</button>
    <button class="oauth-btn phone"><img src="phone.svg" alt="" /> Sign in with Phone</button>
  </div>
  <div id="phone-section" class="phone-section">
    <input type="text" id="phone-input" placeholder="Phone (e.g. +15551234567)" required />
    <button id="phone-send-btn" class="submit-btn">Send OTP</button>
    <input type="text" id="otp-input" placeholder="Enter OTP" required />
    <button id="otp-verify-btn" class="submit-btn">Verify OTP</button>
    <button id="resend-otp-btn" class="submit-btn">Resend OTP</button>
    <div id="phone-msg" class="error-msg"></div>
  </div>
  <p class="auth-toggle">New? <span id="toggle-register">Register here</span></p>
`;

const openModal = () => authModal.classList.add('show');
const closeModal = () => authModal.classList.remove('show');

modal.querySelector('.close-btn').onclick = closeModal;
document.getElementById('cta-btn').onclick = openModal;

let mode = 'login';
document.getElementById('toggle-register').onclick = () => {
  mode = mode === 'login' ? 'register' : 'login';
  document.getElementById('auth-title').innerText = mode === 'login' ? 'Login' : 'Register';
  document.querySelector('.submit-btn').innerText = mode === 'login' ? 'Login' : 'Register';
  document.getElementById('forgot-link').style.display = mode === 'login' ? 'block' : 'none';
  document.getElementById('auth-error').innerText = '';
};

// Password strength meter
const pwdInput = document.getElementById('password');
const strengthEl = document.getElementById('password-strength');
pwdInput.oninput = () => {
  const v = pwdInput.value;
  let indicator = '';
  if (v.length > 8 && /[A-Z]/.test(v) && /\d/.test(v)) indicator = 'Strong';
  else if (v.length > 6 && /\d/.test(v)) indicator = 'Medium';
  else indicator = 'Weak';
  strengthEl.innerText = v ? `Strength: ${indicator}` : '';
};

document.getElementById('forgot-link').onclick = () => {
  document.getElementById('auth-form').style.display = 'none';
  document.getElementById('reset-section').style.display = 'flex';
};

document.getElementById('auth-form').onsubmit = async e => {
  e.preventDefault();
  const email = e.target.email.value;
  const password = e.target.password.value;
  const err = document.getElementById('auth-error');

  let res;
  if (mode === 'login') {
    res = await supabase.auth.signInWithPassword({ email, password });
  } else {
    res = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/confirm.html` }
    });
  }

  if (res.error) err.innerText = res.error.message;
  else {
    err.innerText = '';
    if (mode === 'login') window.location.href = 'feed.html';
    else alert('Check your email to confirm your account.');
  }
};

document.getElementById('reset-btn').onclick = async () => {
  const email = document.getElementById('reset-email').value;
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  document.getElementById('reset-msg').innerText = error ? error.message : 'Check your email.';
};

// OAuth
document.querySelector('.oauth-btn.google').onclick = () => supabase.auth.signInWithOAuth({ provider: 'google' });
document.querySelector('.oauth-btn.facebook').onclick = () => supabase.auth.signInWithOAuth({ provider: 'facebook' });

// Phone Auth
document.querySelector('.oauth-btn.phone').onclick = () => {
  document.querySelector('.oauth-buttons').style.display = 'none';
  document.getElementById('auth-form').style.display = 'none';
  document.getElementById('phone-section').style.display = 'flex';
};

document.getElementById('phone-send-btn').onclick = async () => {
  const phone = document.getElementById('phone-input').value;
  const { error } = await supabase.auth.signInWithOtp({ phone });
  document.getElementById('phone-msg').innerText = error ? error.message : 'OTP sent!';
};

document.getElementById('resend-otp-btn').onclick = async () => {
  const phone = document.getElementById('phone-input').value;
  const { error } = await supabase.auth.signInWithOtp({ phone });
  document.getElementById('phone-msg').innerText = error ? error.message : 'OTP resent!';
};

document.getElementById('otp-verify-btn').onclick = async () => {
  const phone = document.getElementById('phone-input').value;
  const otp = document.getElementById('otp-input').value;
  const res = await supabase.auth.verifyOtp({ phone, token: otp, type: 'sms' });
  document.getElementById('phone-msg').innerText = res.error ? res.error.message : 'Phone verified!';
  if (!res.error) window.location.href = 'feed.html';
};

// Ensure user profile exists
async function ensureUserProfile(user) {
  const { data, error } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .single();

  if (error && error.code === 'PGRST116') {
    await supabase.from('profiles').insert({
      id: user.id,
      email: user.email,
      email_verified: !!user.email_confirmed_at
    });
  }
}

// Auth change handler
supabase.auth.onAuthStateChange(async (event, session) => {
  if (session?.user) {
    await ensureUserProfile(session.user);
    window.location.href = 'feed.html';
  }
});

// Star background
const canvas = document.getElementById('galaxyCanvas');
const ctx = canvas.getContext('2d');
let w, h, stars = [];

function resize() {
  w = canvas.width = innerWidth;
  h = canvas.height = innerHeight;
  stars = Array(200).fill().map(() => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.random() * 1.2,
    dx: (Math.random() - 0.5) * 0.5,
    dy: -Math.random() * 0.5,
    hue: Math.random() * 360
  }));
}
window.onresize = resize;
resize();

function animate() {
  ctx.fillStyle = '#050506';
  ctx.fillRect(0, 0, w, h);
  stars.forEach(s => {
    s.x += s.dx;
    s.y += s.dy;
    if (s.x < 0 || s.x > w || s.y < 0) {
      s.x = Math.random() * w;
      s.y = h;
    }
    const grad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 4);
    grad.addColorStop(0, `hsla(${s.hue},80%,80%,1)`);
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r * 4, 0, Math.PI * 2);
    ctx.fill();
  });
  requestAnimationFrame(animate);
}
animate();
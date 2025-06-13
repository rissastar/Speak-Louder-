// script.js – Handles auth-based navigation and logout

document.addEventListener('DOMContentLoaded', async () => {
  const nav = document.getElementById('nav-auth');

  const supabase = window.supabase || supabaseInit();

  const user = (await supabase.auth.getUser()).data.user;

  if (user) {
    nav.innerHTML = `
      <a href="feed.html">Feed</a>
      <a href="profile.html">Profile</a>
      <a href="settings.html">Settings</a>
      <a href="#" id="logout-btn">Logout</a>
    `;

    const logoutBtn = document.getElementById('logout-btn');
    logoutBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      await supabase.auth.signOut();
      window.location.href = 'index.html';
    });
  } else {
    nav.innerHTML = `
      <a href="login.html">Login</a>
      <a href="register.html">Register</a>
    `;
  }
});

// Init Supabase client if not defined globally
function supabaseInit() {
  return supabase.createClient(
    'https://zgjfbbfnldxlvzstnfzy.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpnamZiYmZubGR4bHZ6c3RuZnp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2NDczNzIsImV4cCI6MjA2NTIyMzM3Mn0.-Lt8UIAqI5ySoyyTGzRs3JVBhdcZc8zKxiLH6qbu3dU'
  );
}
// script.js

// Supabase initialization (update keys if needed)
const SUPABASE_URL = 'https://zgjfbbfnldxlvzstnfzy.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpnamZiYmZubGR4bHZ6c3RuZnp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2NDczNzIsImV4cCI6MjA2NTIyMzM3Mn0.-Lt8UIAqI5ySoyyTGzRs3JVBhdcZc8zKxiLH6qbu3dU';

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// DOM elements
const navAuth = document.getElementById('nav-auth');

async function checkUser() {
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    // User is logged in, show profile, feed, settings, logout links
    navAuth.innerHTML = `
      <a href="profile.html">Profile</a>
      <a href="feed.html">Feed</a>
      <a href="settings.html">Settings</a>
      <a href="#" id="logout-link">Logout</a>
    `;

    document.getElementById('logout-link').addEventListener('click', async (e) => {
      e.preventDefault();
      await supabase.auth.signOut();
      location.reload();
    });

  } else {
    // User not logged in, show login and register
    navAuth.innerHTML = `
      <a href="login.html">Login</a>
      <a href="register.html">Register</a>
    `;
  }
}

checkUser();


// Optional: Add click handlers for topic links (if you want to do any tracking or logging)
const topicLinks = document.querySelectorAll('.topic-link');
topicLinks.forEach(link => {
  link.addEventListener('click', () => {
    // Example: console log clicked topic
    console.log(`Navigating to topic: ${link.textContent.trim()}`);
  });
});
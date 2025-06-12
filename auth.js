// === Supabase Auth ===
const supabaseUrl = "https://zgjfbbfnldxlvzstnfzy.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Update nav on auth state
supabase.auth.getSession().then(({ data: { session } }) => {
  updateAuthNav(session);
});

supabase.auth.onAuthStateChange((_event, session) => {
  updateAuthNav(session);
});

function updateAuthNav(session) {
  const nav = document.getElementById("authNav");
  if (session) {
    nav.innerHTML = `
      <a href="feed.html">Feed</a>
      <a href="profile.html">Profile</a>
      <a href="settings.html">Settings</a>
      <a href="#" onclick="logout()">Logout</a>
    `;
  } else {
    nav.innerHTML = `
      <a href="login.html">Login</a>
      <a href="register.html">Register</a>
    `;
  }
}

function logout() {
  supabase.auth.signOut();
}
// Supabase client setup
const SUPABASE_URL = "https://zgjfbbfnldxlvzstnfzy.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpnamZiYmZubGR4bHZ6c3RuZnp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2NDczNzIsImV4cCI6MjA2NTIyMzM3Mn0.-Lt8UIAqI5ySoyyTGzRs3JVBhdcZc8zKxiLH6qbu3dU";

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Redirect if already logged in
async function checkSession() {
  const { data: { session } } = await supabase.auth.getSession();
  if (session && window.location.pathname.includes("login") || window.location.pathname.includes("register")) {
    window.location.href = "profile.html";
  }
}
checkSession();

// Handle Login
if (window.location.pathname.includes("login")) {
  document.getElementById("login-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      alert(error.message);
    } else {
      window.location.href = "profile.html";
    }
  });
}

// Handle Register
if (window.location.pathname.includes("register")) {
  document.getElementById("register-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      alert(error.message);
    } else {
      alert("Check your email to confirm registration!");
      window.location.href = "profile.html";
    }
  });
}

// Handle Logout (logout.html)
if (window.location.pathname.includes("logout")) {
  supabase.auth.signOut().then(() => {
    document.body.innerHTML = `
      <main style="text-align:center; padding:2rem;">
        <h1>💜 Come back soon</h1>
        <p>You’ve been logged out.</p>
        <p>Redirecting to homepage...</p>
      </main>`;
    setTimeout(() => {
      window.location.href = "index.html";
    }, 3000);
  });
}
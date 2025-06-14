// Supabase client
const supabase = supabase.createClient(
  'https://zgjfbbfnldxlvzstnfzy.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' // Use full anon key
);

// Quote Rotator
const quotes = [
  "Healing takes time, and asking for help is a courageous step.",
  "You are not a burden; you are a human being in need of care.",
  "It’s okay to rest. Your worth is not measured by productivity.",
  "You are not alone in your feelings.",
  "You are doing the best you can, and that is enough."
];
document.getElementById('quote-text').innerText =
  quotes[Math.floor(Math.random() * quotes.length)];

// Modal toggle
document.getElementById("panic-btn").addEventListener("click", () => {
  document.getElementById("panic-modal").style.display = "flex";
});
document.getElementById("close-modal").addEventListener("click", () => {
  document.getElementById("panic-modal").style.display = "none";
});
document.getElementById("close-auth-modal").addEventListener("click", () => {
  document.getElementById("auth-modal").style.display = "none";
});
document.getElementById("switch-to-register").addEventListener("click", (e) => {
  e.preventDefault();
  const title = document.getElementById("auth-title");
  const btn = document.getElementById("auth-submit-btn");

  if (title.innerText === "Register") {
    title.innerText = "Login";
    btn.innerText = "Login";
  } else {
    title.innerText = "Register";
    btn.innerText = "Register";
  }
});

// Auth submit handler
document.getElementById("auth-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("auth-email").value;
  const password = document.getElementById("auth-password").value;
  const mode = document.getElementById("auth-submit-btn").innerText;
  const errorText = document.getElementById("auth-error");

  errorText.textContent = "";

  try {
    if (mode === "Register") {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      alert("Check your email to confirm your registration.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      alert("Login successful!");
    }
    document.getElementById("auth-modal").style.display = "none";
    showUser();
  } catch (err) {
    errorText.textContent = err.message;
  }
});

// Show current user
async function showUser() {
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    document.getElementById("bottom-nav").innerHTML = `
      <span>👋 Hello, ${user.email}</span>
      <button onclick="logout()">Logout</button>
    `;
  }
}

// Logout
async function logout() {
  await supabase.auth.signOut();
  location.reload();
}

// Keep user logged in
showUser();
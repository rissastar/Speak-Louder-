// Rotate quotes
const quotes = [
  "Healing takes time, and asking for help is a courageous step.",
  "You are not a burden; you are a human being in need of care.",
  "It’s okay to rest. Your worth is not measured by productivity.",
  "You are not alone in your feelings.",
  "You are doing the best you can, and that is enough."
];

document.getElementById('quote-text').innerText =
  quotes[Math.floor(Math.random() * quotes.length)];

// Panic modal toggle
document.getElementById("panic-btn").addEventListener("click", () => {
  document.getElementById("panic-modal").style.display = "flex";
});
document.getElementById("close-modal").addEventListener("click", () => {
  document.getElementById("panic-modal").style.display = "none";
});

// Auth modal toggle
document.getElementById("close-auth-modal").addEventListener("click", () => {
  document.getElementById("auth-modal").style.display = "none";
});
document.getElementById("switch-to-register").addEventListener("click", (e) => {
  e.preventDefault();
  document.getElementById("auth-title").innerText = "Register";
  document.getElementById("auth-submit-btn").innerText = "Register";
});

// Auth handler (placeholder logic for now)
document.getElementById("auth-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("auth-email").value;
  const password = document.getElementById("auth-password").value;

  // Placeholder login logic
  if (email && password) {
    alert(`Logged in as ${email}`);
    document.getElementById("auth-modal").style.display = "none";
  } else {
    document.getElementById("auth-error").innerText = "Invalid email or password.";
  }
});
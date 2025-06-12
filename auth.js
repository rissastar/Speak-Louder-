// auth.js - Supabase Client Initialization and Auth Helper Functions

const supabaseUrl = 'https://zgjfbbfnldxlvzstnfzy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpnamZiYmZubGR4bHZ6c3RuZnp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2NDczNzIsImV4cCI6MjA2NTIyMzM3Mn0.-Lt8UIAqI5ySoyyTGzRs3JVBhdcZc8zKxiLH6qbu3dU';

const supabase = supabase.createClient(supabaseUrl, supabaseKey);

/**
 * Check if user is logged in; if not, redirect to login page.
 * Use on protected pages like profile.html, feed.html, settings.html.
 */
async function requireAuth() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    window.location.href = 'login.html';
  }
}

/**
 * Get current user info or null if not logged in.
 */
async function getCurrentUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/**
 * Listen to auth state changes and handle automatic redirects.
 * Optional - useful if you want live auth state monitoring.
 */
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT') {
    window.location.href = 'logout.html';
  }
});
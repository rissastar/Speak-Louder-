// Initialize Supabase client
const supabaseUrl = 'https://zgjfbbfnldxlvzstnfzy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpnamZiYmZubGR4bHZ6c3RuZnp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2NDczNzIsImV4cCI6MjA2NTIyMzM3Mn0.-Lt8UIAqI5ySoyyTGzRs3JVBhdcZc8zKxiLH6qbu3dU';

const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Login function
async function login(email, password) {
  return await supabase.auth.signInWithPassword({ email, password });
}

// Register function
async function register(email, password) {
  return await supabase.auth.signUp({ email, password });
}
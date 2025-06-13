// Supabase initialization
const SUPABASE_URL = 'https://zgjfbbfnldxlvzstnfzy.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpnamZiYmZubGR4bHZ6c3RuZnp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2NDczNzIsImV4cCI6MjA2NTIyMzM3Mn0.-Lt8UIAqI5ySoyyTGzRs3JVBhdcZc8zKxiLH6qbu3dU';
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Auth State Listener
supabase.auth.onAuthStateChange((_event, session) => {
    if (session?.user) {
        showProfileSection();
        loadProfile(session.user.id);
    } else {
        showAuthSection();
    }
});

// Sign In / Sign Up
document.getElementById('signInForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
});
document.getElementById('signUpBtn').addEventListener('click', async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) alert(error.message);
    else alert("Check your email for confirmation!");
});
document.getElementById('signOutBtn').addEventListener('click', async () => {
    await supabase.auth.signOut();
});

// Show/Hide sections
function showProfileSection() {
    document.getElementById('authSection').style.display = 'none';
    document.getElementById('profileSection').style.display = '';
}
function showAuthSection() {
    document.getElementById('authSection').style.display = '';
    document.getElementById('profileSection').style.display = 'none';
}

// Profile loading
async function loadProfile(userId) {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
    if (data) {
        document.getElementById('profileInfo').innerHTML = `
            <h3>Welcome, ${data.display_name || 'New Member'}!</h3>
            <p>${data.bio || ''}</p>
            <img src="${data.avatar_url ? supabase.storage.from('avatars').getPublicUrl(data.avatar_url).data.publicUrl : ''}" style="width:60px;border-radius:50%;">
        `;
    } else {
        document.getElementById('profileInfo').innerHTML = `<p>Welcome! Complete your profile soon 💜</p>`;
    }
}

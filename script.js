const SUPABASE_URL = 'https://zgjfbbfnldxlvzstnfzy.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpnamZiYmZubGR4bHZ6c3RuZnp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2NDczNzIsImV4cCI6MjA2NTIyMzM3Mn0.-Lt8UIAqI5ySoyyTGzRs3JVBhdcZc8zKxiLH6qbu3dU';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
// Auth Functions
async function handleAuth() {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (user) {
        document.getElementById('authSection').style.display = 'none';
        document.getElementById('profileSection').style.display = 'block';
        loadUserProfile(user.id);
        loadCommunityFeed();
        setupRealtime();
    } else {
        showLogin();
    }
}

async function signUp(email, password) {
    showLoading();
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                display_name: 'New Member',
                bio: 'Just beginning my healing journey 🌱'
            }
        }
    });
    
    if (error) alert(error.message);
    else handleAuth();
}

async function signIn(email, password) {
    showLoading();
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });
    
    if (error) alert(error.message);
    else handleAuth();
}

// Real-time Community Feed
function setupRealtime() {
    return supabase
        .channel('community-feed')
        .on('postgres_changes', {
            event: 'INSERT',
            schema: 'public',
            table: 'posts'
        }, handleNewPost)
        .subscribe();
}

async function loadCommunityFeed() {
    const { data, error } = await supabase
        .from('posts')
        .select(`
            id,
            content,
            created_at,
            user:profiles (display_name, avatar_url)
        `)
        .order('created_at', { ascending: false });
    
    if (!error) renderPosts(data);
}

function handleNewPost(payload) {
    const postElement = createPostElement(payload.new);
    document.getElementById('postsContainer').prepend(postElement);
}

// Profile Management
async function loadUserProfile(userId) {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
    
    if (!error) renderProfile(data);
}

async function updateProfile(updates) {
    const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', supabase.auth.getUser().id);
    
    if (!error) showSuccess('Profile updated!');
}

// Healing Tools Integration
async function saveWorksheet(response) {
    const { error } = await supabase
        .from('worksheets')
        .insert({
            user_id: supabase.auth.getUser().id,
            responses: response
        });
    
    if (!error) showSuccess('Progress saved 💾');
}

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    handleAuth();
    initNavigation();
    initPostForm();
});

// UI Functions
function showLoading() {
    document.body.classList.add('loading');
}

function hideLoading() {
    document.body.classList.remove('loading');
}

function initPostForm() {
    document.getElementById('postForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const content = new FormData(e.target).get('content');
        
        const { error } = await supabase
            .from('posts')
            .insert({
                user_id: supabase.auth.getUser().id,
                content
            });
        
        if (!error) e.target.reset();
    });
}

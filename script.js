/* script.js (Updated Authentication functions and auth check) */

// Supabase Client Setup (Make sure you have this at the top of your script.js)
const SUPABASE_URL = 'https://zgjfbbfnldxlvzstnfzy.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpnamZiYmZubGR4bHZ6c3RuZnp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2NDczNzIsImV4cCI6MjA2NTIyMzM3Mn0.-Lt8UIAqI5ySoyyTGzRs3JVBhdcZc8zKxiLH6qbu3dU';

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ----------------------------------------------------------------------------
// Updated Authentication Functions
// ----------------------------------------------------------------------------

async function register() {
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
            redirectTo: `${window.location.origin}/profile.html`  // Redirect after email confirmation
        }
    });

    if (error) {
        alert(error.message);
    } else {
        alert('Registration successful! Check your email to verify.');
        // No longer redirecting immediately.  Let the redirectFromSupabase handle it
    }
}

async function login() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    });

    if (error) {
        alert(error.message);
    } else {
        console.log('Login successful!', data); // Log the data for debugging

        // Wait for the session to be updated.  This is *crucial* for the redirect to work reliably.
        await new Promise(resolve => setTimeout(resolve, 500)); // Add a short delay.

        window.location.href = 'profile.html';
    }
}

async function logout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
        alert(error.message);
    } else {
        alert('Logout successful!');
        window.location.href = 'login.html'; // Redirect to login page
    }
}

// ----------------------------------------------------------------------------
//  Function to Load Profile Data (called after authentication)
// ----------------------------------------------------------------------------
async function loadProfile() {
    const profileSection = document.getElementById('profile-section');
    const profileDataContainer = document.getElementById('profile-data');

    // Check if the user is logged in
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
        // Fetch user profile data from Supabase (if you have a profiles table)
        const { data: profileData, error: profileError } = await supabase
            .from('profiles') // Replace 'profiles' with your actual table name
            .select('*')
            .eq('id', user.id)
            .single();  // Assuming one profile per user

        if (profileError) {
            console.error('Error fetching profile data:', profileError);
            profileDataContainer.innerHTML = `<p>Error loading profile.</p>`;
        } else {
            // Display user information
            profileDataContainer.innerHTML = `
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Username:</strong> ${profileData?.username || 'No Username'}</p>
                <!-- Add more profile details here -->
            `;

            // Update the auth links in the header to show logout
            document.getElementById('auth-links').innerHTML = `<button onclick="logout()">Logout</button>`;
        }
    } else {
        // Not logged in, redirect to login page
        window.location.href = 'login.html';
    }
}

// ----------------------------------------------------------------------------
// Initial Setup:  Run when profile.html loads
// ----------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    // Get the current URL
    const url = window.location.href;

    // Check if it contains the success URL fragment
    if (url.includes('type=recovery')) {
        // Remove everything before the #
        const newUrl = url.substring(url.indexOf('#') + 1);
        window.location.replace(newUrl);
    }

    loadProfile();  // Load the profile data when the page loads
});


// Function to load content dynamically
async function loadContent(page) {
    const mainContent = document.getElementById('main-content');
    switch (page) {
        case 'login':
            mainContent.innerHTML = `
                <h2>Login</h2>
                <input type="email" id="login-email" placeholder="Email">
                <input type="password" id="login-password" placeholder="Password">
                <button onclick="login()">Login</button>
            `;
            break;
        case 'register':
            mainContent.innerHTML = `
                <h2>Register</h2>
                <input type="email" id="register-email" placeholder="Email">
                <input type="password" id="register-password" placeholder="Password">
                <button onclick="register()">Register</button>
            `;
            break;
        case 'profile':
            // Fetch user data from Supabase and populate the profile
            const user = supabase.auth.user();
            if (user) {
                const { data, error } = await supabase
                    .from('profiles') // Assuming you have a 'profiles' table
                    .select('*')
                    .eq('id', user.id)
                    .single();

                if (error) {
                    console.error("Error fetching profile:", error);
                    mainContent.innerHTML = `<p>Error loading profile.</p>`;
                } else {
                    mainContent.innerHTML = `
                        <h2>Welcome, ${data.username || 'User'}!</h2>
                        <p>Email: ${user.email}</p>
                        <!-- Display other profile information -->
                        <button onclick="logout()">Logout</button>
                    `;
                }
            } else {
                window.location.href = 'login.html'; // Redirect to login if not authenticated
            }
            break;
        // Add more cases for other pages (e.g., feed, settings, topic pages)
        default:
            mainContent.innerHTML = `<h2>Welcome!</h2><p>This is the main page.</p>`;
            break;
    }
}

// Authentication functions
async function register() {
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
    });

    if (error) {
        alert(error.message);
    } else {
        alert('Registration successful! Check your email to verify.');
        // Optionally, redirect to login page
        window.location.href = 'login.html';
    }
}

async function login() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    });

    if (error) {
        alert(error.message);
    } else {
        alert('Login successful!');
        // Redirect to the main feed or profile page
        window.location.href = 'profile.html';
    }
}

async function logout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
        alert(error.message);
    } else {
        alert('Logout successful!');
        // Redirect to the login page
        window.location.href = 'login.html';
    }
}

// Initial setup: Check if the user is logged in
async function checkAuth() {
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
        // User is logged in
        document.getElementById('auth-links').innerHTML = `<button onclick="logout()">Logout</button>`;
        loadContent('profile');
    } else {
        // User is not logged in
        loadContent('welcome'); // Or any default page for logged-out users
    }
}

// Event listener for DOMContentLoaded to run initial setup
document.addEventListener('DOMContentLoaded', checkAuth);

/* In your script.js */

// Open Safe Space
function openSafeSpace() {
  document.getElementById('safe-space-overlay').style.display = 'block';
}

// Close Safe Space
function closeSafeSpace() {
  document.getElementById('safe-space-overlay').style.display = 'none';
}

// Attach event listener to the panic button
document.getElementById('panic-button').addEventListener('click', openSafeSpace);

// Optional: Close the safe space if the user clicks outside of the content area
window.onclick = function(event) {
  const modal = document.getElementById('safe-space-overlay');
  if (event.target == modal) {
    closeSafeSpace();
  }
}

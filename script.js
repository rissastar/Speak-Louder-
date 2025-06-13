/* script.js */

// Supabase Client Setup
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

// ----------------------------------------------------------------------------
// Option 2:  Simple Console Logging (Easy, but limited)
// ----------------------------------------------------------------------------
function trackEventConsole(eventName, properties = {}) {
    console.log(`[Analytics Event] ${eventName}`, properties);
}

// ----------------------------------------------------------------------------
// Open Safe Space (Modified to Track)
// ----------------------------------------------------------------------------
function openSafeSpace() {
  document.getElementById('safe-space-overlay').style.display = 'block';

  // Choose which tracking to use (or both)
  // trackEvent('panic_button_clicked');  // Supabase
  trackEventConsole('panic_button_clicked'); // Console Logging
}

// ----------------------------------------------------------------------------
// Close Safe Space (Modified to Track)
// ----------------------------------------------------------------------------
function closeSafeSpace() {
  document.getElementById('safe-space-overlay').style.display = 'none';

  // Choose which tracking to use (or both)
  // trackEvent('safe_space_closed');  // Supabase
  trackEventConsole('safe_space_closed'); // Console Logging
}

// ----------------------------------------------------------------------------
// Track Usage of Resources within the Safe Space (Example)
// ----------------------------------------------------------------------------
function trackResourceUsed(resourceName) {
  // Choose which tracking to use (or both)
  // trackEvent('safe_space_resource_used', { resource: resourceName }); // Supabase
  trackEventConsole('safe_space_resource_used', { resource: resourceName }); // Console Logging
}

// Example Usage:  Let's say you have clickable links to resources
document.addEventListener('DOMContentLoaded', function() {
  const crisisLineLink = document.querySelector('#safe-space-overlay a[href*="741741"]'); // Crisis Text Line example
  if (crisisLineLink) {
    crisisLineLink.addEventListener('click', function(event) {
      trackResourceUsed('Crisis Text Line');
    });
  }

  const suicideLineLink = document.querySelector('#safe-space-overlay a[href*="988"]'); // Suicide Prevention Lifeline example
  if (suicideLineLink) {
    suicideLineLink.addEventListener('click', function(event) {
      trackResourceUsed('Suicide Prevention Lifeline');
    });
  }
});

// ----------------------------------------------------------------------------
// Attach Event Listener to the Panic Button (as before)
// ----------------------------------------------------------------------------
document.getElementById('panic-button').addEventListener('click', openSafeSpace);

// ----------------------------------------------------------------------------
// Optional: Close the safe space if the user clicks outside of the content area (as before)
// ----------------------------------------------------------------------------
window.onclick = function(event) {
  const modal = document.getElementById('safe-space-overlay');
  if (event.target == modal) {
    closeSafeSpace();
  }
}

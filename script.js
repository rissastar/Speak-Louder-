// === Dropdown Navigation ===
document.getElementById("dropdownToggle").addEventListener("click", () => {
  const dropdown = document.getElementById("topicDropdown");
  dropdown.classList.toggle("hidden");

  // Update aria-expanded for accessibility
  const expanded = dropdown.classList.contains("hidden") ? "false" : "true";
  document.getElementById("dropdownToggle").setAttribute("aria-expanded", expanded);
});

// Supabase client init
const SUPABASE_URL = "https://zgjfbbfnldxlvzstnfzy.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpnamZiYmZubGR4bHZ6c3RuZnp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2NDczNzIsImV4cCI6MjA2NTIyMzM3Mn0.-Lt8UIAqI5ySoyyTGzRs3JVBhdcZc8zKxiLH6qbu3dU";

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Utility: get current logged in user
async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) {
    console.error("Error getting current user:", error);
    return null;
  }
  return user;
}

// On page load: fetch and render all shared content
async function loadSharedContent() {
  const user = await getCurrentUser();

  // Helper to check if viewer can see content based on privacy
  function canViewContent(content) {
    if (content.privacy === "public") return true;
    if (!user) return false;
    if (content.user_id === user.id) return true; // Owner sees private content
    if (content.privacy === "supporters") {
      // TODO: Check if viewer is supporter of content owner (friends)
      return false;
    }
    return false;
  }

  // Render functions
  function renderList(containerId, items, renderItem) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";
    if (!items) return;
    items.forEach(item => {
      if (canViewContent(item)) {
        container.appendChild(renderItem(item));
      }
    });
  }

  // Stories
  let { data: stories, error } = await supabase
    .from("stories")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) console.error("Error fetching stories:", error);

  renderList("shared-content", stories, story => {
    const div = document.createElement("div");
    div.classList.add("story-item");
    div.textContent = story.content;
    return div;
  });

  // Worksheets
  let { data: worksheets, error: wError } = await supabase
    .from("worksheets")
    .select("*")
    .order("created_at", { ascending: false });
  if (wError) console.error("Error fetching worksheets:", wError);

  renderList("worksheet-list", worksheets, ws => {
    const div = document.createElement("div");
    div.classList.add("worksheet-item");
    div.innerHTML = `<strong>${escapeHtml(ws.title)}</strong><p>${escapeHtml(ws.content)}</p>`;
    return div;
  });

  // Quotes
  let { data: quotes, error: qError } = await supabase
    .from("quotes")
    .select("*")
    .order("created_at", { ascending: false });
  if (qError) console.error("Error fetching quotes:", qError);

  renderList("quote-list", quotes, q => {
    const div = document.createElement("div");
    div.classList.add("quote-item");
    div.textContent = q.content;
    return div;
  });

  // Affirmations
  let { data: affirmations, error: aError } = await supabase
    .from("affirmations")
    .select("*")
    .order("created_at", { ascending: false });
  if (aError) console.error("Error fetching affirmations:", aError);

  renderList("affirmation-list", affirmations, a => {
    const div = document.createElement("div");
    div.classList.add("affirmation-item");
    div.textContent = a.content;
    return div;
  });

  // Grounding Techniques
  let { data: grounding, error: gError } = await supabase
    .from("grounding_techniques")
    .select("*")
    .order("created_at", { ascending: false });
  if (gError) console.error("Error fetching grounding techniques:", gError);

  renderList("grounding-list", grounding, g => {
    const div = document.createElement("div");
    div.classList.add("grounding-item");
    div.textContent = g.content;
    return div;
  });
}

// Helper to escape HTML to prevent injection (for title/content display)
function escapeHtml(text) {
  if (!text) return "";
  return text.replace(/[&<>"']/g, function (m) {
    return {
      '&': "&amp;",
      '<': "&lt;",
      '>': "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[m];
  });
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  loadSharedContent();
});
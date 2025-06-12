// === Dropdown Navigation ===
document.getElementById("dropdownToggle").addEventListener("click", () => {
  const dropdown = document.getElementById("topicDropdown");
  dropdown.classList.toggle("hidden");
});
// Supabase client init
const SUPABASE_URL = "https://zgjfbbfnldxlvzstnfzy.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpnamZiYmZubGR4bHZ6c3RuZnp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2NDczNzIsImV4cCI6MjA2NTIyMzM3Mn0.-Lt8UIAqI5ySoyyTGzRs3JVBhdcZc8zKxiLH6qbu3dU";

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Utility: get current logged in user
async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// On page load: fetch and render all shared content
async function loadSharedContent() {
  const user = await getCurrentUser();

  // For each content type, fetch from Supabase and render filtered by privacy:
  // Public content visible to all
  // Friends-only visible only if viewer is supporter
  // Private visible only if viewer is owner

  // Helper to check if viewer can see content based on privacy
  function canViewContent(content) {
    if (content.privacy === "public") return true;
    if (!user) return false;
    if (content.user_id === user.id) return true; // Owner sees private content
    if (content.privacy === "supporters") {
      // TODO: Check if viewer is supporter of content owner (friends)
      // For now, let's assume false (implement friends logic separately)
      return false;
    }
    return false;
  }

  // Render functions
  function renderList(containerId, items, renderItem) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";
    items.forEach(item => {
      if (canViewContent(item)) {
        container.appendChild(renderItem(item));
      }
    });
  }

  // Story
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
    div.innerHTML = `<strong>${ws.title}</strong><p>${ws.content}</p>`;
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

// Handle form submissions for each content type
function setupFormHandlers() {
  const userPromise = getCurrentUser();

  // Helper for insert
  async function insertContent(table, data) {
    const { error } = await supabase.from(table).insert([data]);
    if (error) {
      alert("Error submitting content: " + error.message);
      console.error(error);
    } else {
      alert("Submitted successfully!");
      loadSharedContent();
    }
  }

  // Story form
  document.getElementById("story-form").addEventListener("submit", async e => {
    e.preventDefault();
    const user = await userPromise;
    if (!user) {
      alert("Please log in to submit.");
      return;
    }

    const content = e.target["story-content"].value.trim();
    const privacy = e.target["story-privacy"].value;

    if (!content) {
      alert("Please enter your story.");
      return;
    }

    insertContent("stories", {
      user_id: user.id,
      content,
      privacy,
      created_at: new Date().toISOString()
    });

    e.target.reset();
  });

  // Worksheet form
  document.getElementById("worksheet-form").addEventListener("submit", async e => {
    e.preventDefault();
    const user = await userPromise;
    if (!user) {
      alert("Please log in to submit.");
      return;
    }
    const title = e.target["worksheet-title"].value.trim();
    const content = e.target["worksheet-content"].value.trim();
    const privacy = e.target["worksheet-privacy"].value;

    if (!title || !content) {
      alert("Please fill out all worksheet fields.");
      return;
    }

    insertContent("worksheets", {
      user_id: user.id,
      title,
      content,
      privacy,
      created_at: new Date().toISOString()
    });

    e.target.reset();
  });

  // Quote form
  document.getElementById("quote-form").addEventListener("submit", async e => {
    e.preventDefault();
    const user = await userPromise;
    if (!user) {
      alert("Please log in to submit.");
      return;
    }
    const content = e.target["quote-content"].value.trim();
    const privacy = e.target["quote-privacy"].value;

    if (!content) {
      alert("Please enter a quote.");
      return;
    }

    insertContent("quotes", {
      user_id: user.id,
      content,
      privacy,
      created_at: new Date().toISOString()
    });

    e.target.reset();
  });

  // Affirmation form
  document.getElementById("affirmation-form").addEventListener("submit", async e => {
    e.preventDefault();
    const user = await userPromise;
    if (!user) {
      alert("Please log in to submit.");
      return;
    }
    const content = e.target["affirmation-content"].value.trim();
    const privacy = e.target["affirmation-privacy"].value;

    if (!content) {
      alert("Please enter an affirmation.");
      return;
    }

    insertContent("affirmations", {
      user_id: user.id,
      content,
      privacy,
      created_at: new Date().toISOString()
    });

    e.target.reset();
  });

  // Grounding form
  document.getElementById("grounding-form").addEventListener("submit", async e => {
    e.preventDefault();
    const user = await userPromise;
    if (!user) {
      alert("Please log in to submit.");
      return;
    }
    const content = e.target["grounding-content"].value.trim();
    const privacy = e.target["grounding-privacy"].value;

    if (!content) {
      alert("Please enter a grounding technique.");
      return;
    }

    insertContent("grounding_techniques", {
      user_id: user.id,
      content,
      privacy,
      created_at: new Date().toISOString()
    });

    e.target.reset();
  });
}

// Initialize page functionality
document.addEventListener("DOMContentLoaded", () => {
  setupFormHandlers();
  loadSharedContent();
});
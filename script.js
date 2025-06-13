// 🔐 Supabase Initialization
const supabaseUrl = "https://zgjfbbfnldxlvzstnfzy.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpnamZiYmZubGR4bHZ6c3RuZnp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2NDczNzIsImV4cCI6MjA2NTIyMzM3Mn0.-Lt8UIAqI5ySoyyTGzRs3JVBhdcZc8zKxiLH6qbu3dU";
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// 📂 Toggle Topic Dropdown
document.getElementById("dropdownToggle").addEventListener("click", () => {
  const dropdown = document.getElementById("topicDropdown");
  dropdown.classList.toggle("hidden");

  const expanded = dropdown.classList.contains("hidden") ? "false" : "true";
  document.getElementById("dropdownToggle").setAttribute("aria-expanded", expanded);
});

// 📤 Utility: Render Items to List
function renderList(containerId, items, keyName = "content") {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = "";

  if (!items || items.length === 0) {
    container.innerHTML = "<p>No content yet.</p>";
    return;
  }

  items.forEach(item => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.textContent = item[keyName] || "No content.";
    container.appendChild(div);
  });
}

// 📥 Load Shared Content by Table
async function loadContent(table, containerId, key = "content") {
  const { data, error } = await supabase.from(table).select("*").order("created_at", { ascending: false }).limit(10);
  if (error) {
    console.error(`Error loading ${table}:`, error.message);
    return;
  }
  renderList(containerId, data, key);
}

// 🚀 Load All Public Sections
function loadAllContent() {
  loadContent("shared_stories", "shared-content", "content");
  loadContent("worksheets", "worksheet-list", "content");
  loadContent("quotes", "quote-list", "quote");
  loadContent("affirmations", "affirmation-list", "affirmation");
  loadContent("grounding", "grounding-list", "technique");
}

// 💡 Auto-load on Page Ready
document.addEventListener("DOMContentLoaded", () => {
  loadAllContent();
});
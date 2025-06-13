// script.js

const supabase = createClient();

// Toggle dropdown menu
document.addEventListener('DOMContentLoaded', () => {
  const dropdownToggle = document.getElementById('dropdownToggle');
  const topicDropdown = document.getElementById('topicDropdown');

  if (dropdownToggle && topicDropdown) {
    dropdownToggle.addEventListener('click', () => {
      const isHidden = topicDropdown.classList.contains('hidden');
      topicDropdown.classList.toggle('hidden');
      dropdownToggle.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
    });
  }

  loadHomepageContent();
});

function createClient() {
  return supabase.createClient(
    'https://zgjfbbfnldxlvzstnfzy.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpnamZiYmZubGR4bHZ6c3RuZnp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2NDczNzIsImV4cCI6MjA2NTIyMzM3Mn0.-Lt8UIAqI5ySoyyTGzRs3JVBhdcZc8zKxiLH6qbu3dU'
  );
}

async function loadHomepageContent() {
  await loadPosts();
  await loadSection('worksheets', '#worksheet-list');
  await loadSection('quotes', '#quote-list');
  await loadSection('affirmations', '#affirmation-list');
  await loadSection('grounding_techniques', '#grounding-list');
}

async function loadPosts() {
  const { data, error } = await supabase
    .from('posts')
    .select('content, is_anonymous, topic')
    .eq('is_anonymous', true)
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) {
    console.error('Error loading posts:', error);
    return;
  }

  const container = document.getElementById('shared-content');
  if (container) {
    container.innerHTML = data.map(post => `
      <div class="card">
        <strong>${post.topic}</strong><br />
        ${post.content}
      </div>
    `).join('');
  }
}

async function loadSection(tableName, selector) {
  const { data, error } = await supabase
    .from(tableName)
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) {
    console.error(`Error loading ${tableName}:`, error);
    return;
  }

  const container = document.querySelector(selector);
  if (container) {
    container.innerHTML = data.map(item => `
      <div class="card">${item.content || item.text || item.body || item.description}</div>
    `).join('');
  }
}
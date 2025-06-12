import { supabase } from './supabaseClient.js';

// DOM Elements
const postForm = document.getElementById('postForm');
const postText = document.getElementById('postText');
const postTopic = document.getElementById('postTopic');
const postImage = document.getElementById('postImage');
const feedContainer = document.getElementById('feedContainer');
const authNav = document.getElementById('authNav');

async function checkAuth() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    authNav.innerHTML = `
      <a href="login.html">Login</a> |
      <a href="register.html">Register</a>
    `;
    postForm.style.display = 'none';
  } else {
    authNav.innerHTML = `
      <a href="profile.html">Profile</a> |
      <a href="settings.html">Settings</a> |
      <button id="logoutBtn">Logout</button>
    `;
    postForm.style.display = 'block';
    document.getElementById('logoutBtn').addEventListener('click', async () => {
      await supabase.auth.signOut();
      window.location.href = 'login.html';
    });
  }
}

async function loadPosts() {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    feedContainer.innerHTML = `<p>Error loading posts: ${error.message}</p>`;
    return;
  }

  if (!data || data.length === 0) {
    feedContainer.innerHTML = '<p>No posts yet. Be the first to share your healing story!</p>';
    return;
  }

  feedContainer.innerHTML = '';
  data.forEach(post => {
    const postEl = document.createElement('article');
    postEl.className = 'post';

    postEl.innerHTML = `
      <header>
        <strong>${post.username || 'Anonymous'}</strong> in <em>${post.topic}</em> - <time datetime="${post.created_at}">${new Date(post.created_at).toLocaleString()}</time>
      </header>
      <p>${post.content}</p>
      ${post.image_url ? `<img src="${post.image_url}" alt="Post image" loading="lazy" />` : ''}
      <footer>
        <button class="like-btn" data-id="${post.id}">Like (${post.likes || 0})</button>
        <button class="hug-btn" data-id="${post.id}">Hug (${post.hugs || 0})</button>
        <button class="comment-btn" data-id="${post.id}">Comment</button>
      </footer>
    `;
    feedContainer.appendChild(postEl);
  });
}

postForm.addEventListener('submit', async e => {
  e.preventDefault();

  const user = (await supabase.auth.getUser()).data.user;
  if (!user) {
    alert('You must be logged in to post.');
    return;
  }

  const content = postText.value.trim();
  const topic = postTopic.value;
  if (!content || !topic) {
    alert('Please enter post content and select a topic.');
    return;
  }

  let image_url = null;
  if (postImage.files.length > 0) {
    const file = postImage.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage
      .from('post-images')
      .upload(fileName, file);

    if (uploadError) {
      alert('Error uploading image: ' + uploadError.message);
      return;
    }

    image_url = supabase.storage.from('post-images').getPublicUrl(fileName).data.publicUrl;
  }

  const { error } = await supabase
    .from('posts')
    .insert({
      user_id: user.id,
      username: user.user_metadata?.full_name || user.email,
      topic,
      content,
      image_url,
      likes: 0,
      hugs: 0,
      created_at: new Date().toISOString()
    });

  if (error) {
    alert('Error creating post: ' + error.message);
    return;
  }

  postText.value = '';
  postTopic.value = '';
  postImage.value = '';
  loadPosts();
});

window.addEventListener('DOMContentLoaded', async () => {
  await checkAuth();
  await loadPosts();
});
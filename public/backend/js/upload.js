const logoutBtn = document.getElementById('logout-btn');
const authStatus = document.getElementById('auth-status');
const postTitleInput = document.getElementById('post-title');
const postContentInput = document.getElementById('post-content');
const createPostBtn = document.getElementById('create-post-btn');
const blogPostsDiv = document.getElementById('blog-posts');
const blogSection = document.getElementById('blog-section');

const postMediaInput = document.getElementById('post-media');
const imagePreview = document.getElementById('image-preview');
const videoPreview = document.getElementById('video-preview');

const editModal = document.getElementById('edit-modal');
const editTitleInput = document.getElementById('edit-title');
const editContentInput = document.getElementById('edit-content');
const saveEditBtn = document.getElementById('save-edit-btn');
const cancelEditBtn = document.getElementById('cancel-edit-btn');

let base64Image = '';
let base64Video = '';
let currentEditPostId = null;

logoutBtn.addEventListener('click', async () => {
  try {
    await auth.signOut();
    authStatus.textContent = 'Logged out successfully.';
    blogSection.style.display = 'none';
    blogPostsDiv.innerHTML = '';
    setTimeout(() => {
      window.location.href = "/public/backend/admin/auth.html";
    }, 2000);
  } catch (error) {
    authStatus.textContent = 'Error: ' + error.message;
  }
});

document.addEventListener("DOMContentLoaded", () => {
  auth.onAuthStateChanged(async (user) => {
    if (user) {
      authStatus.textContent = user.email;
      logoutBtn.style.display = 'inline-block';
      blogSection.style.display = 'block';
      loadBlogPosts();
    } else {
      authStatus.textContent = 'Not logged in.';
      logoutBtn.style.display = 'none';
      blogSection.style.display = 'none';
      blogPostsDiv.innerHTML = '';
    }
  });
});

postMediaInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onloadend = () => {
    const base64 = reader.result;
    const fileType = file.type;

    imagePreview.style.display = 'none';
    videoPreview.style.display = 'none';
    base64Image = '';
    base64Video = '';

    if (fileType.startsWith('image/')) {
      base64Image = base64;
      imagePreview.src = base64Image;
      imagePreview.style.display = 'block';
    } else if (fileType.startsWith('video/')) {
      base64Video = base64;
      videoPreview.src = base64Video;
      videoPreview.style.display = 'block';
    }
  };

  reader.readAsDataURL(file);
});

createPostBtn.addEventListener('click', async (event) => {
  event.preventDefault();

  const title = postTitleInput.value.trim();
  const content = postContentInput.value.trim();
  const user = auth.currentUser;

  if (!title || !content) {
    alert("Please fill in both title and content.");
    return;
  }

  if (user) {
    try {
      const postData = {
        title,
        content,
        author: user.email,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        image: base64Image || null,
        video: base64Video || null
      };

      await db.collection('posts').add(postData);

      postTitleInput.value = '';
      postContentInput.value = '';
      imagePreview.style.display = 'none';
      videoPreview.style.display = 'none';
      postMediaInput.value = '';

      loadBlogPosts();
    } catch (error) {
      console.error("Error creating post: ", error);
      alert('Error creating post: ' + error.message);
    }
  } else {
    alert('You must be logged in to create a post.');
  }
});

async function loadBlogPosts() {
  blogPostsDiv.innerHTML = '';
  const user = auth.currentUser;

  try {
    const snapshot = await db.collection('posts').orderBy('createdAt', 'desc').get();
    snapshot.forEach(doc => {
      const post = doc.data();
      const postId = doc.id;

      const postDiv = document.createElement('div');
      postDiv.classList.add('blog-post');

      const imageHTML = post.image ? `<img src="${post.image}" style="max-width: 100px; margin-bottom: 10px;">` : '';
      const videoHTML = post.video ? `
        <video controls style="max-width: 200px; margin-top: 10px;">
          <source src="${post.video}" type="video/mp4">
          Your browser does not support the video tag.
        </video>` : '';

      let buttonsHTML = '';
      if (user && user.email === post.author) {
        buttonsHTML = `
          <button onclick="editPost('${postId}', \`${post.title}\`, \`${post.content}\`)">Edit</button>
          <button onclick="deletePost('${postId}')">Delete</button>
        `;
      }

      postDiv.innerHTML = `
        <h3>${post.title}</h3>
        <p>By: ${post.author}</p>
        <p>${post.content}</p>
        ${imageHTML}
        ${videoHTML}
        ${buttonsHTML}
      `;

      blogPostsDiv.appendChild(postDiv);
    });
  } catch (error) {
    console.error("Error loading posts: ", error);
    alert('Error loading posts: ' + error.message);
  }
}

window.editPost = function(postId, title, content) {
  currentEditPostId = postId;
  editTitleInput.value = title;
  editContentInput.value = content;
  editModal.style.display = 'block';
};

window.deletePost = async function(postId) {
  if (confirm("Are you sure you want to delete this post?")) {
    try {
      await db.collection('posts').doc(postId).delete();
      loadBlogPosts();
    } catch (error) {
      console.error("Error deleting post:", error);
      alert('Error deleting post: ' + error.message);
    }
  }
};

saveEditBtn.addEventListener('click', async () => {
  const newTitle = editTitleInput.value.trim();
  const newContent = editContentInput.value.trim();

  if (!newTitle || !newContent) {
    alert("Please enter both title and content.");
    return;
  }

  try {
    await db.collection('posts').doc(currentEditPostId).update({
      title: newTitle,
      content: newContent
    });
    editModal.style.display = 'none';
    loadBlogPosts();
  } catch (error) {
    console.error("Error updating post:", error);
    alert('Error updating post: ' + error.message);
  }
});

cancelEditBtn.addEventListener('click', () => {
  editModal.style.display = 'none';
});

const logoutBtn = document.getElementById('logout-btn');
const authStatus = document.getElementById('auth-status');
const postTitleInput = document.getElementById('post-title');
const postContentInput = document.getElementById('post-content');
const postImageInput = document.getElementById('post-image');
// const imagePreview = document.getElementById('image-preview')
const createPostBtn = document.getElementById('create-post-btn');
const blogPostsDiv = document.getElementById('blog-posts');
const blogSection = document.getElementById('blog-section');

logoutBtn.addEventListener('click', async () => {
  try {
    await auth.signOut();
    authStatus.textContent = 'Logged out successfully.';
    localStorage.removeItem("isAdmin");
    blogSection.style.display = 'none';
    blogPostsDiv.innerHTML = '';
    setTimeout(() => {
      window.location.href = "/backend/admin/auth.html";
    }, 2000);
  } catch (error) {
    authStatus.textContent = 'Error: ' + error.message;
  }
});

document.addEventListener("DOMContentLoaded", () => {
  auth.onAuthStateChanged(async (user) => {
    if (user) {
      authStatus.textContent =  user.email;
      logoutBtn.style.display = 'inline-block';

      try {
        const adminDoc = await db.collection("admins").doc(user.email).get();
        if (adminDoc.exists) {
          localStorage.setItem("isAdmin", true);
          blogSection.style.display = 'block';
        } else {
          localStorage.removeItem("isAdmin");
          blogSection.style.display = 'none';
        }
      } catch (error) {
        console.error("Error checking admin access:", error);
      }

      loadBlogPosts();
    } else {
      authStatus.textContent = 'Not logged in.';
      logoutBtn.style.display = 'none';
      blogSection.style.display = 'none';
      blogPostsDiv.innerHTML = '';
    }
  });
});

// postImageInput.addEventListener('change', (event) => {
//   const file = event.target.files[0];

//   if (file) {
//     const reader = new FileReader();
    
//     reader.onloadend = () => {
//       const base64Image = reader.result;
//       imagePreview.src = base64Image;
//       imagePreview.style.display = 'block';  // Show the image preview
//     };

//     reader.readAsDataURL(file);
//   }
// });

const postMediaInput = document.getElementById('post-media');
const imagePreview = document.getElementById('image-preview');
const videoPreview = document.getElementById('video-preview');

let base64Image = '';
let base64Video = '';

postMediaInput.addEventListener('change', (event) => {
  const file = event.target.files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onloadend = () => {
    const base64 = reader.result;
    const fileType = file.type;

    // Reset previews
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
  const image = imagePreview.src; // This will hold the base64 image string
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
      imagePreview.style.display = 'none';  // Hide the preview
      postImageInput.value = '';  // Reset the file input

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

  try {
    const snapshot = await db.collection('posts').orderBy('createdAt', 'desc').get();
    snapshot.forEach(doc => {
      const post = doc.data();
      const postDiv = document.createElement('div');
      postDiv.classList.add('blog-post');

      // Display the image if it exists
      const imageHTML = post.image ? `<img src="${post.image}" style="max-width: 100px; margin-bottom: 10px;">` : '';
      const videoHTML = post.video ? `
        <video controls style="max-width: 200px; margin-top: 10px;">
          <source src="${post.video}" type="video/mp4">
          Your browser does not support the video tag.
        </video>` : '';
      // const imageHTML = `<img src="${post.image ? post.image : "../../images/img-file.png"}" style="max-width: 100px; margin-bottom: 10px;">` ;

      postDiv.innerHTML = `
        <h3>${post.title}</h3>
        <p>By: ${post.author}</p>
        <p>${post.content}</p>
        ${imageHTML}
        ${videoHTML}
      `;

      blogPostsDiv.appendChild(postDiv);
    });
  } catch (error) {
    console.error("Error loading posts: ", error);
    alert('Error loading posts: ' + error.message);
  }
}
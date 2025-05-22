window.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const postId = params.get('id');
  const container = document.getElementById('blog-detail-container');

  if (!postId) {
    container.innerHTML = "<p>No blog ID provided.</p>";
    return;
  }

  try {
    const doc = await db.collection('posts').doc(postId).get();
    if (!doc.exists) {
      container.innerHTML = "<p>Blog post not found.</p>";
      return;
    }

    const post = doc.data();
    let date = '';
    if (post.createdAt?.toDate) {
      date = post.createdAt.toDate().toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric'
      });
    }

    const image = post.image ? `<img src="${post.image}" style="max-width:100%;"><br>` : '';
    const video = post.video ? `<video controls style="max-width:100%"><source src="${post.video}" type="video/mp4"></video>` : '';

    container.innerHTML = `
      <h1>${post.title}</h1>
      <p><strong>${post.author}</strong> - ${date}</p>
      ${image}
      ${video}
      <p class="content">${post.content}</p>
    `;
  } catch (error) {
    console.error("Error loading blog post:", error);
    container.innerHTML = "<p>Error loading blog post.</p>";
  }
});
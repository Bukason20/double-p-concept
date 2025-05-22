window.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('blog-container');
  container.innerHTML = '';

  try {
    const snapshot = await db.collection('posts').orderBy('createdAt', 'desc').get();
    snapshot.forEach(doc => {
      const post = doc.data();
      const postId = doc.id;

      let date = '';
      if (post.createdAt?.toDate) {
        date = post.createdAt.toDate().toLocaleDateString('en-US', {
          year: 'numeric', month: 'short', day: 'numeric'
        });
      }

      const image = post.image ? `<img src="${post.image}" style="max-width:100%;"><br>` : '';
      const video = post.video ? `<video controls style="max-width:100%"><source src="${post.video}" type="video/mp4"></video>` : '';

      const postDiv = document.createElement('div');
      postDiv.className = 'blog-post';
      postDiv.innerHTML = `
        <a href="blog-detail.html?id=${postId}" style="text-decoration:none; color:inherit;">
          ${image}
          ${video}
          <h2>${post.title}</h2>
          <p><strong>${post.author}</strong> - ${date}</p>
          <p>${post.content.substring(0, 100)}...</p>
        </a>
        <hr/>
      `;

      container.appendChild(postDiv);
    });
  } catch (error) {
    console.error("Error loading posts:", error);
  }
});

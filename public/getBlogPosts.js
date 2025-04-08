async function loadBlogPosts() {
  //   blogPostsDiv.innerHTML = ''; // Clear existing posts
  
    try {
        const snapshot = await db.collection('posts').orderBy('createdAt', 'desc').get();
        snapshot.forEach(doc => {
            const post = doc.data();
            const postDiv = document.createElement('div');
            postDiv.classList.add('blog-post');
            postDiv.innerHTML = `<h3>${post.title}</h3>
                                 <p>By: ${post.author}</p>
                                 <p>${post.content}</p>`;
            document.getElementById("blog-container").appendChild(postDiv);
        });
    } catch (error) {
        console.error("Error loading posts: ", error);
        alert('Error loading posts: ' + error.message);
    }
  }

  loadBlogPosts()
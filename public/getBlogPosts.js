async function loadBlogPosts() {
  //   blogPostsDiv.innerHTML = ''; // Clear existing posts
  
  try {
    const snapshot = await db.collection('posts').orderBy('createdAt', 'desc').get();
    snapshot.forEach(doc => {
      const post = doc.data();
      const postDiv = document.createElement('div');
      postDiv.classList.add('blog-post');
      
      // Convert Firestore timestamp to readable date
      let publishDate = '';
      if (post.createdAt && post.createdAt.toDate) {
        const date = post.createdAt.toDate();
        publishDate = date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      }

      // Display the image if it exists
      const imageHTML = post.image ? `<img src="${post.image}" style="margin-bottom: 10px;">` : '';
      // const imageHTML = `<img src="${post.image ? post.image : "images/img-file.png"}">` ;
      const videoHTML = post.video ? `
        <video controls style="max-width: 200px; margin-top: 10px;">
          <source src="${post.video}" type="video/mp4">
          Your browser does not support the video tag.
        </video>` : '';


      postDiv.innerHTML = `
        ${imageHTML}
        ${videoHTML}
        <div class="blog-content">
          <h1>${post.title}</h1>
          <p> <strong>${post.author}</strong> - ${publishDate}</p>
          <p>${post.content}</p>
        </div>
        
        
      `;
                                 
        document.getElementById("blog-container").appendChild(postDiv);
        });
    } catch (error) {
        console.error("Error loading posts: ", error);
        alert('Error loading posts: ' + error.message);
    }
  }

  loadBlogPosts()
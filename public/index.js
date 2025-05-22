// ---------------------------------AUTO TYPING-----------------------------------------
document.addEventListener("DOMContentLoaded", function() {
  var typed = new Typed(".auto-type", {
    strings: ["Are A Tech Agency", "Build Web Apps", "Build Websites", "Build Mobile Apps", "Create Designs", "Teach ICT Skills", "Prepare Documents"],
    typeSpeed: 150,
    backSpeed: 150,
    loop: true
  })  
})


// --------------------TESTIMONIAL SLIDER---------------------------
document.addEventListener("DOMContentLoaded", function () {
  var swiper = new Swiper(".mySwiper", {
    loop: true,
    spaceBetween: 30,
    // centeredSlides: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });
});

// --------------------------------------------------------------BLOG POSTS--------------------------------------------------------------------


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
          <div class="contents">
            <h2>${post.title}</h2>
            <p class="author"><strong>${post.author}</strong> - ${date}</p>
            <p class="content">${post.content.substring(0, 100)}...</p>
          </div>
        </a>
      `;

      container.appendChild(postDiv);
    });
  } catch (error) {
    console.error("Error loading posts:", error);
  }
});


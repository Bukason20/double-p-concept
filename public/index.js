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
    centeredSlides: true,
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


document.addEventListener("DOMContentLoaded", function () {
  const blogListContainer = document.getElementById("blogList");
  const blogDetailsContainer = document.getElementById("blogDetails");

  if (blogListContainer) {
      renderBlogList();
  }

  if (blogDetailsContainer) {
      renderBlogDetails();
  }
});
// Function to display the blog posts

// Function to display blog list
function renderBlogList() {
  const blogContainer = document.getElementById("blogList");
  // blogContainer.innerHTML = "";

  blogContainer.innerHTML = blogs.map(blog => `
    <div class="blog-card col-lg-4">
      <img src="${blog.picture}" alt="${blog.title}">
      <h3>${blog.title}</h3>
      <p><strong>${blog.author}</strong> - ${blog.date}</p>
      <p>${blog.body.substring(0, 100)}...</p>
      <a href="blogDetails.html?link=${blog.link}">Read More</a>
    </div>
  `).join("");

}

// Function to display blog details
function renderBlogDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const blogLink = urlParams.get("link");

  if (!blogLink) {
      document.getElementById("blogDetails").innerHTML = "<p>Blog not found!</p>";
      return;
  }

  const blog = blogs.find(b => b.link === blogLink);

  if (!blog) {
      document.getElementById("blogDetails").innerHTML = "<p>Blog not found!</p>";
      return;
  }

  document.getElementById("blogDetails").innerHTML = `
      <h1>${blog.title}</h1>
      <p><strong>By ${blog.author}</strong></p>
      <img src="${blog.picture}" alt="Blog Image" width="400">
      <p>${blog.body}</p>
      <p><small>Published on: ${blog.date}</small></p>
      <a href="index.html">Back to Blogs</a>
  `;
}
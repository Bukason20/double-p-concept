// Firebase configuration (Replace with your actual config)
const firebaseConfig = {
  apiKey: "AIzaSyB4eZ_BJw2UIw2hGKO0syf78wjzo1BG19M",
  authDomain: "double-p-concept.firebaseapp.com",
  projectId: "double-p-concept",
  storageBucket: "double-p-concept.firebasestorage.app",
  messagingSenderId: "1097085495030",
  appId: "1:1097085495030:web:2db41c5f37ac500f05eed7",
  measurementId: "G-S0P84W0KT9"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

// Get references to DOM elements
const logoutBtn = document.getElementById('logout-btn');
// const authStatus = document.getElementById('auth-status');
const postTitleInput = document.getElementById('post-title');
const postContentInput = document.getElementById('post-content');
const createPostBtn = document.getElementById('create-post-btn');
const blogPostsDiv = document.getElementById('blog-posts');

// Verify Admin Btn DOC
const verifyAdminBtn = document.getElementById("verify-admin-btn")
const adminId = document.getElementById("admin-id")
const adminPassword = document.getElementById("admin-password")
const adminAuth = document.getElementById("admin-auth")

// Signup and Login DOM
const signupEmail = document.getElementById('signup-email');
const signupPassword = document.getElementById('signup-password');
const signupBtn = document.getElementById('signup-btn');
const loginBtn = document.getElementById('login-btn');
const loginEmail = document.getElementById('login-email');
const loginPassword = document.getElementById('login-password');
const toSignup = document.getElementById("to-signup-btn")
const toLogin = document.getElementById("to-login-btn")

const authMessageFunc = (message) => {
  document.getElementById("auth-message").textContent = message

  setTimeout(() => {
    document.getElementById("auth-message").textContent = ""
  }, 2000)
}

let isAdmin = localStorage.getItem("isAdmin")
const adminCredentials = {
  id: "admin",
  password: "1234567"
}

if(isAdmin && adminAuth){
  adminAuth.style.display = "none"
  document.getElementById("author-signup-auth").style.display = "block"
}
else if(!isAdmin && adminAuth){
  adminAuth.style.display = "block"
  document.getElementById("author-signup-auth").style.display = "none"
}
// Verify Admin Credentials
verifyAdminBtn?.addEventListener("click", () => {
  if(adminId?.value === adminCredentials.id && adminPassword?.value === adminCredentials.password){
    isAdmin = true
    localStorage.setItem("isAdmin", isAdmin)

    if (adminAuth) adminAuth.style.display = "none"
    const authorSignup = document.getElementById("author-signup-auth")
    if (authorSignup) authorSignup.style.display = "block"
  } else {
    isAdmin = false
    localStorage.setItem("isAdmin", isAdmin)
    console.log(isAdmin)
  }
})

// toSignup.addEventListener("click", () => {
//   document.getElementById("author-signup-auth").style.display = "block"
//   document.getElementById("author-login-auth").style.display = "none"
// })

// toLogin.addEventListener("click", () => {
//   document.getElementById("author-signup-auth").style.display = "none"
//   document.getElementById("author-login-auth").style.display = "block"
// })
// Authentication functions
signupBtn.addEventListener('click', async () => {
  if(isAdmin){
    try {
      await auth.createUserWithEmailAndPassword(signupEmail.value, signupPassword.value);
      // authStatus.textContent = 'Sign up successful!';
      authMessageFunc("Sign Up succesful")

      document.getElementById("author-signup-auth").style.display = "none"
      document.getElementById("author-login-auth").style.display = "block"
        
    } catch (error) {
      authMessageFunc(`Error ${error.message}`)
      // authStatus.textContent = 'Error: ' + error.message;
    }
  }
    
});



loginBtn.addEventListener('click', async () => {
    // e.preventDefault()
    try {
        await auth.signInWithEmailAndPassword(loginEmail.value, loginPassword.value);
        // authStatus.textContent = 'Log in successful!';
        authMessageFunc("Login Successful")
        console.log(auth.currentUser)

        setTimeout(() => {
          window.location.href = "/admin/upload.html"
        }, 3000)
    } catch (error) {
        authStatus.textContent = 'Error: ' + error.message;

    }
});

logoutBtn.addEventListener('click', async () => {
    try {
        await auth.signOut();
        authStatus.textContent = 'Logged out.';
    } catch (error) {
        authStatus.textContent = 'Error: ' + error.message;
    }
});

// Listen for authentication state changes
document.addEventListener("DOMContentLoaded", () => {
  const authStatus = document.getElementById('auth-status');

  auth.onAuthStateChanged(user => {
    if (authStatus) {
      if (user) {
        authStatus.textContent = 'Logged in as ' + user.email;
        document.getElementById('blog-section').style.display = 'block';
        loadBlogPosts();
      } else {
        authStatus.textContent = 'Not logged in.';
        document.getElementById('blog-section').style.display = 'none';
        blogPostsDiv.innerHTML = '';
      }
    }
  });
});



// Blog post functions
createPostBtn.addEventListener('click', async () => {
    const title = postTitleInput.value;
    const content = postContentInput.value;
    const user = auth.currentUser;

    if (user) {
        try {
            await db.collection('posts').add({
                title: title,
                content: content,
                author: user.email,
                createdAt: firebase.firestore.FieldValue.serverTimestamp() //Timestamp
            });
            // Clear input fields
            postTitleInput.value = '';
            postContentInput.value = '';
            // Reload blog posts
            loadBlogPosts();
        } catch (error) {
            console.error("Error creating post: ", error);
            alert('Error creating post: ' + error.message);
        }
    } else {
        alert('You must be logged in to create a post.');
    }
});

// Load blog posts from Firestore
async function loadBlogPosts() {
    blogPostsDiv.innerHTML = ''; // Clear existing posts

    try {
        const snapshot = await db.collection('posts').orderBy('createdAt', 'desc').get();
        snapshot.forEach(doc => {
            const post = doc.data();
            const postDiv = document.createElement('div');
            postDiv.classList.add('blog-post');
            postDiv.innerHTML = `<h3>${post.title}</h3>
                                 <p>By: ${post.author}</p>
                                 <p>${post.content}</p>`;
            blogPostsDiv.appendChild(postDiv);
        });
    } catch (error) {
        console.error("Error loading posts: ", error);
        alert('Error loading posts: ' + error.message);
    }
}












































































































// // Import the functions you need from the SDKs you need
// import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
// import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyB4eZ_BJw2UIw2hGKO0syf78wjzo1BG19M",
//   authDomain: "double-p-concept.firebaseapp.com",
//   projectId: "double-p-concept",
//   storageBucket: "double-p-concept.firebasestorage.app",
//   messagingSenderId: "1097085495030",
//   appId: "1:1097085495030:web:2db41c5f37ac500f05eed7",
//   measurementId: "G-S0P84W0KT9"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);



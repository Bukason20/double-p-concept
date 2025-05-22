// js/auth.js
const adminCredentials = { id: "admin", password: "1234567" };
let isAdmin = localStorage.getItem("isAdmin");

const adminAuth = document.getElementById("admin-auth");
const authorSignupAuth = document.getElementById("author-signup-auth");
const authorLoginAuth = document.getElementById("author-login-auth");
const authMessage = document.getElementById("auth-message");

const adminId = document.getElementById("admin-id");
const adminPassword = document.getElementById("admin-password");
const verifyAdminBtn = document.getElementById("verify-admin-btn");

const signupEmail = document.getElementById('signup-email');
const signupPassword = document.getElementById('signup-password');
const signupBtn = document.getElementById('signup-btn');

const loginBtn = document.getElementById('login-btn');
const loginEmail = document.getElementById('login-email');
const loginPassword = document.getElementById('login-password');

const toSignup = document.getElementById("to-signup-btn");
const toLogin = document.getElementById("to-login-btn");

const authMessageFunc = (message) => {
  authMessage.textContent = message;
  setTimeout(() => (authMessage.textContent = ""), 2000);
};

if (isAdmin && adminAuth && authorSignupAuth) {
  adminAuth.style.display = "none";
  authorSignupAuth.style.display = "block";
}

verifyAdminBtn?.addEventListener("click", () => {
  if (adminId?.value === adminCredentials.id && adminPassword?.value === adminCredentials.password) {
    isAdmin = true;
    localStorage.setItem("isAdmin", isAdmin);
    if (adminAuth) adminAuth.style.display = "none";
    if (authorSignupAuth) authorSignupAuth.style.display = "block";
  } else {
    isAdmin = false;
    localStorage.setItem("isAdmin", isAdmin);
    authMessageFunc("Invalid admin credentials");
  }
});

toSignup?.addEventListener("click", () => {
  if (authorSignupAuth && authorLoginAuth) {
    authorSignupAuth.style.display = "block";
    authorLoginAuth.style.display = "none";
  }
});

toLogin?.addEventListener("click", () => {
  if (authorSignupAuth && authorLoginAuth) {
    authorSignupAuth.style.display = "none";
    authorLoginAuth.style.display = "block";
  }
});

signupBtn?.addEventListener("click", async () => {
  if (isAdmin) {
    try {
      const userCredential = await auth.createUserWithEmailAndPassword(signupEmail.value, signupPassword.value);
      const newAdminEmail = userCredential.user.email;

      // Automatically make this user an admin in Firestore
      // await db.collection("admins").doc(newAdminEmail).set({ role: "admin" });

      authMessageFunc("Sign Up successful & user added as admin.");
      // authMessageFunc("Sign Up successful");
      authorSignupAuth.style.display = "none";
      authorLoginAuth.style.display = "block";
    } catch (error) {
      authMessageFunc(`Error: ${error.message}`);
    }
  }
});

loginBtn?.addEventListener("click", async () => {
  try {
    await auth.signInWithEmailAndPassword(loginEmail.value, loginPassword.value);
    authMessageFunc("Login Successful");
    setTimeout(() => {
      window.location.href = "/backend/admin/upload.html";
    }, 2000);
  } catch (error) {
    authMessageFunc(`Login error: ${error.message}`);
  }
});

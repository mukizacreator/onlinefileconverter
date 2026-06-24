/* ============================================
   PASSWORD SHOW/HIDE TOGGLE LOGIC
   ============================================ */
// Reusable function to handle switching password input visibility and updating the eye icon
function togglePassword(inputId, buttonId) {
  const input = document.getElementById(inputId);
  const button = document.getElementById(buttonId);

  if (!input || !button) return;

  button.addEventListener("click", () => {
    const icon = button.querySelector("i");
    if (input.type === "password") {
      input.type = "text";
      if (icon) {
        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");
      }
    } else {
      input.type = "password";
      if (icon) {
        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye");
      }
    }
  });
}

// Initialize password toggle for both Sign Up and Sign In forms
togglePassword("signupPassword", "toggleSignup");
togglePassword("signinPassword", "toggleSignin");

/* ============================================
   SIGN UP FORM HANDLING
   ============================================ */
// Validates user input, checks for existing emails, enforces password security, and saves data to localStorage
const signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Get form values and trim whitespace
    const username = document.getElementById("signupUsername").value.trim();
    const email = document.getElementById("signupEmail").value.trim().toLowerCase();
    const password = document.getElementById("signupPassword").value;
    const message = document.getElementById("signupMessage");
    let users = JSON.parse(localStorage.getItem("users")) || [];

    // VALIDATION 1: Username must have at least 3 characters
    if (username.length < 3) {
      toastError("Username must have at least 3 characters.");
      return;
    }

    // VALIDATION 2: Check if email is already registered in the system
    const exists = users.some((user) => user.email === email);
    if (exists) {
      toastError("Email already registered. Please sign in.");
      setTimeout(() => { window.location.href = "signin.html"; }, 1500);
      return;
    }

    // VALIDATION 3: Password must be strong (Capital letter, number, symbol, min 5 characters)
    const strongPassword = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{5,}$/;
    if (!strongPassword.test(password)) {
      toastError("Password must contain: At least 5 characters, one capital letter, one number, and one symbol.");
      return;
    }

    // SUCCESS: Create new user object and save to localStorage
    const newUser = { username, email, password, photo: "" };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    // Display success message with link to Sign In page
    toastSuccess("Account created successfully!");
    setTimeout(() => { window.location.href = "signin.html"; }, 1500);
    signupForm.reset();
  });
}

/* ============================================
   SIGN IN FORM HANDLING
   ============================================ */
// Verifies user credentials against stored data and manages the login session
const signinForm = document.getElementById("signinForm");
if (signinForm) {
  signinForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Get login credentials
    const email = document.getElementById("signinEmail").value.trim().toLowerCase();
    const password = document.getElementById("signinPassword").value;
    const message = document.getElementById("signinMessage");
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find((u) => u.email === email);

    // ERROR 1: Account not found - prompt user to sign up
    if (!user) {
      toastError("Account not registered. Please sign up.");
      setTimeout(() => { window.location.href = "signup.html"; }, 1500);
      return;
    }

    // ERROR 2: Password doesn't match stored password
    if (user.password !== password) {
      toastError("Incorrect password.");
      return;
    }

    // SUCCESS: Store logged-in user session and redirect to dashboard
    localStorage.setItem("loggedInUser", email);
    toastSuccess("Sign in successful. Redirecting...");
    setTimeout(() => { window.location.href = "index.html"; }, 1000);
  });
}
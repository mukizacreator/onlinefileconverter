/* ============================================
   SESSION VERIFICATION & USER AUTHENTICATION
   ============================================ */
// Check if user is logged in, redirect to signin if not
const loggedInEmail = localStorage.getItem("loggedInUser");
if (!loggedInEmail) window.location.href = "signin.html";

// Load users from localStorage and find current user
let users = JSON.parse(localStorage.getItem("users")) || [];
let currentUser = users.find((u) => u.email === loggedInEmail);

// If user not found in storage, clear session and redirect
if (!currentUser) {
  localStorage.removeItem("loggedInUser");
  window.location.href = "signin.html";
}

/* ============================================
   DOM ELEMENT REFERENCES
   ============================================ */
// Get references to all profile page elements for manipulation
const profileImage = document.getElementById("profileImage");
const profilePhotoInput = document.getElementById("profilePhotoInput");
const profileUsername = document.getElementById("profileUsername");
const profileEmail = document.getElementById("profileEmail");
const profileUsernameInput = document.getElementById("profileUsernameInput");
const profileMessage = document.getElementById("profileMessage");
const accountPanel = document.getElementById("accountPanel");
const securityPanel = document.getElementById("securityPanel");

/* ============================================
   LOAD USER DATA INTO PROFILE FORM
   ============================================ */
// Populate all profile fields with current user data
function loadUserData() {
  profileUsername.textContent = currentUser.username;
  profileEmail.value = currentUser.email;
  profileUsernameInput.value = currentUser.username;
  if (currentUser.photo) profileImage.src = currentUser.photo;
}
loadUserData();

/* ============================================
   PROFILE PHOTO UPLOAD HANDLER
   ============================================ */
// Convert uploaded image to base64 and save to localStorage
profilePhotoInput.addEventListener("change", function () {
  const file = this.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    profileImage.src = e.target.result;
    currentUser.photo = e.target.result;
    localStorage.setItem("users", JSON.stringify(users));
  };
  reader.readAsDataURL(file);
});

/* ============================================
   ACCOUNT INFORMATION UPDATE
   ============================================ */
// Save changes to email and username with validation
document.getElementById("saveAccountBtn").addEventListener("click", () => {
  const newEmail = profileEmail.value.trim().toLowerCase();
  const newUsername = profileUsernameInput.value.trim();
  
  // Validate: Both fields must be filled
  if (!newEmail || !newUsername) {
    toastError("Please complete all fields.");
    return;
  }
  
  // Validate: Email must not be used by another account
  if (users.some((u) => u.email === newEmail && u !== currentUser)) {
    toastError("Email already belongs to another account.");
    return;
  }
  
  // Update user data and save to localStorage
  currentUser.email = newEmail;
  currentUser.username = newUsername;
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("loggedInUser", newEmail);
  profileUsername.textContent = newUsername;
  toastSuccess("Account updated successfully!");
});

/* ============================================
   TAB SWITCHING (ACCOUNT ↔ SECURITY)
   ============================================ */
// Show Account panel, hide Security panel
document.getElementById("accountTab").addEventListener("click", (e) => {
  e.preventDefault();
  accountPanel.style.display = "block";
  securityPanel.style.display = "none";
});

// Show Security panel, hide Account panel
document.getElementById("securityTab").addEventListener("click", (e) => {
  e.preventDefault();
  accountPanel.style.display = "none";
  securityPanel.style.display = "block";
});

/* ============================================
   PASSWORD CHANGE WITH EMAIL VERIFICATION
   ============================================ */
// Sends verification code, validates it, then updates password
document.getElementById("changePasswordBtn").addEventListener("click", async () => {
  const curPass = document.getElementById("currentPassword").value;
  const newPass = document.getElementById("newPassword").value;
  const confPass = document.getElementById("confirmPassword").value;

  // Validate current password
  if (curPass !== currentUser.password) {
    toastError("Incorrect current password.");
    return;
  }
  
  // Validate new password matches confirmation
  if (!newPass || newPass !== confPass) {
    toastError("Passwords do not match.");
    return;
  }

  try {
    // Request verification code from server
    const res = await fetch("/api/send-code", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: currentUser.email }) });
    if (!res.ok) throw new Error();
    
    // Prompt user for verification code
    const code = prompt("Enter the verification code sent to your email:");
    if (!code) return;
    
    // Verify the code with server
    const verifyRes = await fetch("/api/verify-code", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: currentUser.email, code }) });
    if (!(await verifyRes.json()).success) {
      toastError("Incorrect verification code.");
      return;
    }
    
    // Success: Update password and clear fields
    currentUser.password = newPass;
    localStorage.setItem("users", JSON.stringify(users));
    document.getElementById("currentPassword").value = document.getElementById("newPassword").value = document.getElementById("confirmPassword").value = "";
    toastSuccess("Password changed successfully!");
  } catch { 
    toastError("Failed to send verification email. Please try again.");
  }
});

/* ============================================
   LOGOUT FUNCTION
   ============================================ */
// Clear session and redirect to home page
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("loggedInUser");
  window.location.href = "index.html";
});

/* ============================================
   ACCOUNT DELETION WITH EMAIL VERIFICATION
   ============================================ */
// Sends verification code, validates it, then permanently deletes account
document.getElementById("deleteAccountBtn").addEventListener("click", async () => {
  // Confirm with user before proceeding
  if (!confirm("Are you sure you want to permanently delete your account?")) return;
  
  try {
    // Request verification code from server
    const res = await fetch("/api/send-code", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: currentUser.email }) });
    if (!res.ok) throw new Error();
    
    // Prompt user for verification code
    const code = prompt("Enter the verification code:");
    if (!code) return;
    
    // Verify the code with server
    const verifyRes = await fetch("/api/verify-code", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: currentUser.email, code }) });
    if (!(await verifyRes.json()).success) {
      toastError("Incorrect verification code.");
      return;
    }
    
    // Success: Remove user from storage and clear session
    users = users.filter((u) => u.email !== currentUser.email);
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.removeItem("loggedInUser");
    toastSuccess("Account deleted successfully!");
    setTimeout(() => { window.location.href = "index.html"; }, 1500);
  } catch { 
    toastError("Failed to send verification email. Please try again.");
  }
});
/* ============================================
   SESSION VERIFICATION & USER AUTHENTICATION
   ============================================ */
// Check if user is logged in, redirect to signin if not
const loggedInEmail = localStorage.getItem("loggedInUser");
if (!loggedInEmail) window.location.href = "signin.html";

let users = JSON.parse(localStorage.getItem("users")) || [];
let currentUser = users.find((u) => u.email === loggedInEmail);

if (!currentUser) {
  localStorage.removeItem("loggedInUser");
  window.location.href = "signin.html";
}

/* ============================================
   DOM ELEMENT REFERENCES
   ============================================ */
const profileImage = document.getElementById("profileImage");
const profilePhotoInput = document.getElementById("profilePhotoInput");
const uploadPhotoBtn = document.getElementById("uploadPhotoBtn");
const profileUsername = document.getElementById("profileUsername");
const profileEmailDisplay = document.getElementById("profileEmailDisplay");

// Profile View (default)
const profileViewUsername = document.getElementById("profileViewUsername");
const profileViewEmail = document.getElementById("profileViewEmail");

// Account Panel
const accountUsernameDisplay = document.getElementById("accountUsernameDisplay");
const accountEmailDisplay = document.getElementById("accountEmailDisplay");
const profileEmail = document.getElementById("profileEmail");
const profileUsernameInput = document.getElementById("profileUsernameInput");
const accountCurrentPassword = document.getElementById("accountCurrentPassword");

// Panels
const profileView = document.getElementById("profileView");
const accountPanel = document.getElementById("accountPanel");
const securityPanel = document.getElementById("securityPanel");

// Tabs
const accountTab = document.getElementById("accountTab");
const securityTab = document.getElementById("securityTab");

/* ============================================
   LOAD USER DATA INTO PROFILE
   ============================================ */
function loadUserData() {
  console.log("Loading user data:", currentUser);
  
  // Update sidebar
  profileUsername.textContent = currentUser.username || 'User';
  profileEmailDisplay.textContent = currentUser.email || 'user@email.com';
  
  // Update Profile View (default)
  if (profileViewUsername) profileViewUsername.textContent = currentUser.username || 'User';
  if (profileViewEmail) profileViewEmail.textContent = currentUser.email || 'user@email.com';
  
  // Update Account Panel
  if (accountUsernameDisplay) accountUsernameDisplay.textContent = currentUser.username || 'User';
  if (accountEmailDisplay) accountEmailDisplay.textContent = currentUser.email || 'user@email.com';
  
  // Update form fields
  if (profileEmail) profileEmail.value = currentUser.email || '';
  if (profileUsernameInput) profileUsernameInput.value = currentUser.username || '';
  
  // Update profile photo
  if (profileImage && currentUser.photo) {
    profileImage.src = currentUser.photo;
  }
  
  // Update top-right navigation username and photo
  const navUsername = document.getElementById("navUsername");
  if (navUsername) navUsername.textContent = currentUser.username || 'Profile';
  
  const navProfilePhoto = document.getElementById("navProfilePhoto");
  if (navProfilePhoto && currentUser.photo) {
    navProfilePhoto.src = currentUser.photo;
  }
}
loadUserData();

/* ============================================
   PROFILE PHOTO UPLOAD - FIXED
   ============================================ */
console.log("Setting up photo upload...");
console.log("uploadPhotoBtn exists:", !!uploadPhotoBtn);
console.log("profilePhotoInput exists:", !!profilePhotoInput);

// Click button triggers file input
if (uploadPhotoBtn && profilePhotoInput) {
  uploadPhotoBtn.addEventListener("click", function(e) {
    e.preventDefault();
    console.log("Upload button clicked - opening file picker");
    profilePhotoInput.click();
  });
  
  // File selected handler
  profilePhotoInput.addEventListener("change", function(e) {
    const file = this.files[0];
    if (!file) {
      console.log("No file selected");
      return;
    }
    
    console.log("File selected:", file.name, file.size, file.type);
    
    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toastError("Profile photo must be less than 2MB.");
      this.value = "";
      return;
    }
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toastError("Please select an image file.");
      this.value = "";
      return;
    }
    
    const reader = new FileReader();
    reader.onload = function(event) {
      const photoData = event.target.result;
      console.log("Photo loaded successfully, length:", photoData.length);
      
      // 1. Update profile image in sidebar
      if (profileImage) {
        profileImage.src = photoData;
        console.log("Sidebar photo updated");
      }
      
      // 2. Update navigation profile photo
      const navProfilePhoto = document.getElementById("navProfilePhoto");
      if (navProfilePhoto) {
        navProfilePhoto.src = photoData;
        console.log("Navigation photo updated");
      }
      
      // 3. Save to user data in localStorage
      const loggedInEmail = localStorage.getItem("loggedInUser");
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const currentUser = users.find((u) => u.email === loggedInEmail);
      
      if (currentUser) {
        currentUser.photo = photoData;
        localStorage.setItem("users", JSON.stringify(users));
        console.log("Photo saved to localStorage");
        toastSuccess("Profile photo updated successfully!");
      } else {
        toastError("User not found. Please sign in again.");
      }
    };
    reader.onerror = function() {
      toastError("Failed to read image file.");
      console.error("FileReader error");
    };
    reader.readAsDataURL(file);
  });
} else {
  console.error("Upload button or file input not found!");
}

/* ============================================
   ACCOUNT & SECURITY TABS - FIXED
   ============================================ */
console.log("Setting up profile tabs...");
console.log("accountTab exists:", !!accountTab);
console.log("securityTab exists:", !!securityTab);
console.log("profileView exists:", !!profileView);
console.log("accountPanel exists:", !!accountPanel);
console.log("securityPanel exists:", !!securityPanel);

// Make sure profile view is shown by default
if (profileView) {
  profileView.style.display = "block";
}
if (accountPanel) {
  accountPanel.style.display = "none";
}
if (securityPanel) {
  securityPanel.style.display = "none";
}

// Account Tab Click
if (accountTab) {
  accountTab.addEventListener("click", function(e) {
    e.preventDefault();
    console.log("Account tab clicked");
    
    // Hide profile view
    if (profileView) profileView.style.display = "none";
    
    // Show account panel, hide security
    if (accountPanel) accountPanel.style.display = "block";
    if (securityPanel) securityPanel.style.display = "none";
    
    // Update tab styles
    this.classList.add('active');
    if (securityTab) securityTab.classList.remove('active');
  });
} else {
  console.error("Account tab not found!");
}

// Security Tab Click
if (securityTab) {
  securityTab.addEventListener("click", function(e) {
    e.preventDefault();
    console.log("Security tab clicked");
    
    // Hide profile view
    if (profileView) profileView.style.display = "none";
    
    // Show security panel, hide account
    if (securityPanel) securityPanel.style.display = "block";
    if (accountPanel) accountPanel.style.display = "none";
    
    // Update tab styles
    this.classList.add('active');
    if (accountTab) accountTab.classList.remove('active');
  });
} else {
  console.error("Security tab not found!");
}

/* ============================================
   PASSWORD SHOW/HIDE TOGGLES
   ============================================ */
function togglePasswordVisibility(inputId, buttonId) {
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

togglePasswordVisibility("accountCurrentPassword", "toggleAccountPassword");
togglePasswordVisibility("currentPassword", "toggleCurrentPassword");
togglePasswordVisibility("newPassword", "toggleNewPassword");
togglePasswordVisibility("confirmPassword", "toggleConfirmPassword");

/* ============================================
   ACCOUNT INFORMATION UPDATE
   ============================================ */
document.getElementById("saveAccountBtn").addEventListener("click", async () => {
  const currentPassword = accountCurrentPassword.value;
  const newEmail = profileEmail.value.trim().toLowerCase();
  const newUsername = profileUsernameInput.value.trim();
  
  console.log("Save Account clicked:", { currentPassword: !!currentPassword, newEmail, newUsername });
  
  if (!currentPassword) {
    toastError("Please enter your current password to save changes.");
    return;
  }
  
  if (currentPassword !== currentUser.password) {
    toastError("Incorrect current password.");
    return;
  }
  
  if (!newEmail && !newUsername) {
    toastError("Please update at least one field (email or username).");
    return;
  }
  
  if (newEmail && newEmail !== currentUser.email) {
    if (users.some((u) => u.email === newEmail && u.email !== currentUser.email)) {
      toastError("Email already belongs to another account.");
      return;
    }
  }
  
  if (newUsername && newUsername.length < 3) {
    toastError("Username must have at least 3 characters.");
    return;
  }
  
  try {
    const res = await fetch("/api/send-code", { 
      method: "POST", 
      headers: { "Content-Type": "application/json" }, 
      body: JSON.stringify({ email: currentUser.email }) 
    });
    
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Failed to send verification code.");
    }
    
    toastInfo("Verification code sent to your email. Please check your inbox.");
    
    const code = await showVerificationModal('Enter the verification code sent to your email to confirm changes:');
    
    if (!code) {
      toastWarning("Account update cancelled.");
      return;
    }
    
    const verifyRes = await fetch("/api/verify-code", { 
      method: "POST", 
      headers: { "Content-Type": "application/json" }, 
      body: JSON.stringify({ email: currentUser.email, code: code.trim() }) 
    });
    
    const verifyData = await verifyRes.json();
    if (!verifyData.success) {
      toastError("Incorrect verification code.");
      return;
    }
    
    if (newEmail) currentUser.email = newEmail;
    if (newUsername) currentUser.username = newUsername;
    
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("loggedInUser", currentUser.email);
    
    loadUserData();
    accountCurrentPassword.value = "";
    toastSuccess("Account updated successfully!");
    console.log("Account updated:", currentUser);
    
  } catch (error) {
    toastError(error.message || "Failed to update account. Please try again.");
    console.error("Save account error:", error);
  }
});

/* ============================================
   CHANGE PASSWORD
   ============================================ */
document.getElementById("changePasswordBtn").addEventListener("click", async () => {
  const curPass = document.getElementById("currentPassword").value;
  const newPass = document.getElementById("newPassword").value;
  const confPass = document.getElementById("confirmPassword").value;

  console.log("Change Password clicked:", { curPass: !!curPass, newPass: !!newPass, confPass: !!confPass });

  if (curPass !== currentUser.password) {
    toastError("Incorrect current password.");
    return;
  }

  const strongPassword = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{5,}$/;
  if (!strongPassword.test(newPass)) {
    toastError("Password must contain: At least 5 characters, one capital letter, one number, and one symbol.");
    return;
  }

  if (!newPass || newPass !== confPass) {
    toastError("Passwords do not match.");
    return;
  }

  if (newPass === curPass) {
    toastError("New password must be different from current password.");
    return;
  }

  try {
    const btn = document.getElementById("changePasswordBtn");
    btn.disabled = true;
    btn.textContent = "Sending code...";

    const res = await fetch("/api/send-code", { 
      method: "POST", 
      headers: { "Content-Type": "application/json" }, 
      body: JSON.stringify({ email: currentUser.email }) 
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Failed to send verification code.");
    }

    toastInfo("Verification code sent to your email. Please check your inbox.");
    btn.textContent = "Waiting for code...";

    const code = await showVerificationModal('Enter the verification code sent to your email:');
    
    if (!code) {
      btn.disabled = false;
      btn.textContent = "Change Password";
      toastWarning("Password change cancelled.");
      return;
    }

    const verifyRes = await fetch("/api/verify-code", { 
      method: "POST", 
      headers: { "Content-Type": "application/json" }, 
      body: JSON.stringify({ email: currentUser.email, code: code.trim() }) 
    });

    const verifyData = await verifyRes.json();
    if (!verifyData.success) {
      toastError("Incorrect verification code. Please try again.");
      btn.disabled = false;
      btn.textContent = "Change Password";
      return;
    }

    currentUser.password = newPass;
    localStorage.setItem("users", JSON.stringify(users));

    document.getElementById("currentPassword").value = "";
    document.getElementById("newPassword").value = "";
    document.getElementById("confirmPassword").value = "";

    toastSuccess("Password changed successfully!");
    console.log("Password updated for:", currentUser.email);
    
    btn.disabled = false;
    btn.textContent = "Change Password";

  } catch (error) {
    toastError(error.message || "Failed to change password. Please try again.");
    const btn = document.getElementById("changePasswordBtn");
    btn.disabled = false;
    btn.textContent = "Change Password";
    console.error("Change password error:", error);
  }
});

/* ============================================
   LOGOUT
   ============================================ */
document.getElementById("logoutBtn").addEventListener("click", async () => {
  const confirm = await showConfirmModal(
    '🚪 Log Out',
    'Are you sure you want to log out?',
    'Yes, Log Out',
    'Cancel'
  );
  
  if (confirm) {
    localStorage.removeItem("loggedInUser");
    toastSuccess("Logged out successfully!");
    setTimeout(() => {
      window.location.href = "index.html";
    }, 1500);
  }
});

/* ============================================
   DELETE ACCOUNT
   ============================================ */
document.getElementById("deleteAccountBtn").addEventListener("click", async () => {
  const confirm1 = await showConfirmModal(
    '⚠️ Delete Account',
    'Are you sure you want to permanently delete your account?\n\nThis action cannot be undone. All your data will be lost.',
    'Yes, Delete',
    'Cancel'
  );
  
  if (!confirm1) return;

  const confirm2 = await showConfirmModal(
    '⚠️ Final Warning',
    'Are you absolutely sure? This will delete all your data permanently.',
    'Yes, Delete Permanently',
    'Cancel'
  );
  
  if (!confirm2) return;

  try {
    const btn = document.getElementById("deleteAccountBtn");
    btn.disabled = true;
    btn.textContent = "Sending code...";

    const res = await fetch("/api/send-code", { 
      method: "POST", 
      headers: { "Content-Type": "application/json" }, 
      body: JSON.stringify({ email: currentUser.email }) 
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Failed to send verification code.");
    }

    toastInfo("Verification code sent to your email. Please check your inbox.");
    btn.textContent = "Waiting for code...";

    const code = await showVerificationModal('Enter the verification code sent to your email to confirm deletion:');
    
    if (!code) {
      btn.disabled = false;
      btn.textContent = "Delete Account";
      toastWarning("Account deletion cancelled.");
      return;
    }

    const verifyRes = await fetch("/api/verify-code", { 
      method: "POST", 
      headers: { "Content-Type": "application/json" }, 
      body: JSON.stringify({ email: currentUser.email, code: code.trim() }) 
    });

    const verifyData = await verifyRes.json();
    if (!verifyData.success) {
      toastError("Incorrect verification code. Account deletion cancelled.");
      btn.disabled = false;
      btn.textContent = "Delete Account";
      return;
    }

    const finalConfirm = await showConfirmModal(
      '⚠️ Final Confirmation',
      'Delete your account permanently? This action cannot be undone.',
      'Yes, Delete',
      'Cancel'
    );
    
    if (!finalConfirm) {
      btn.disabled = false;
      btn.textContent = "Delete Account";
      toastWarning("Account deletion cancelled.");
      return;
    }

    users = users.filter((u) => u.email !== currentUser.email);
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.removeItem("loggedInUser");

    toastSuccess("Account deleted successfully!");
    console.log("Account deleted:", currentUser.email);
    
    setTimeout(() => {
      window.location.href = "index.html";
    }, 2000);

  } catch (error) {
    toastError(error.message || "Failed to delete account. Please try again.");
    const btn = document.getElementById("deleteAccountBtn");
    btn.disabled = false;
    btn.textContent = "Delete Account";
    console.error("Delete account error:", error);
  }
});

/* ============================================
   CLICKABLE PROFILE PICTURE - VIEW ENLARGED
   ============================================ */
const profileImageWrapper = document.getElementById("profileImageWrapper");
const profileImageView = document.getElementById("profileImage");

if (profileImageWrapper && profileImageView) {
  profileImageWrapper.addEventListener("click", function(e) {
    e.preventDefault();
    const imageSrc = profileImageView.src;
    
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.85);
      backdrop-filter: blur(10px);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10002;
      cursor: pointer;
      animation: fadeIn 0.3s ease;
    `;
    
    const img = document.createElement('img');
    img.src = imageSrc;
    img.style.cssText = `
      max-width: 80%;
      max-height: 80%;
      border-radius: 20px;
      border: 4px solid #00bcd4;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
      object-fit: contain;
      animation: zoomIn 0.3s ease;
    `;
    
    overlay.appendChild(img);
    
    overlay.addEventListener('click', function() {
      overlay.remove();
    });
    
    document.body.appendChild(overlay);
  });
}

console.log("Profile.js loaded successfully");
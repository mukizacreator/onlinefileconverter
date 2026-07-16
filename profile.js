// ============================================
// PROFILE.JS - VERSION 40 (COMPLETE)
// ============================================
console.log("🚀 profile.js v40 LOADED!");

const loggedInEmail = localStorage.getItem("loggedInUser");
if (!loggedInEmail) {
  window.location.href = "signin.html";
}

let currentUser = null;
const userData = localStorage.getItem("userData");
if (userData) {
  currentUser = JSON.parse(userData);
}

if (!currentUser) {
  localStorage.removeItem("loggedInUser");
  window.location.href = "signin.html";
}

console.log("Current user:", currentUser);

/* DOM ELEMENTS */
const profileImage = document.getElementById("profileImage");
const profilePhotoInput = document.getElementById("profilePhotoInput");
const uploadPhotoBtn = document.getElementById("uploadPhotoBtn");

const profileUsername = document.getElementById("profileUsername");
const profileEmailDisplay = document.getElementById("profileEmailDisplay");

const profileViewUsername = document.getElementById("profileViewUsername");
const profileViewEmail = document.getElementById("profileViewEmail");

const accountUsernameDisplay = document.getElementById("accountUsernameDisplay");
const accountEmailDisplay = document.getElementById("accountEmailDisplay");
const profileEmail = document.getElementById("profileEmail");
const profileUsernameInput = document.getElementById("profileUsernameInput");
const accountCurrentPassword = document.getElementById("accountCurrentPassword");

const profileView = document.getElementById("profileView");
const accountPanel = document.getElementById("accountPanel");
const securityPanel = document.getElementById("securityPanel");

const accountTab = document.getElementById("accountTab");
const securityTab = document.getElementById("securityTab");

const saveAccountBtn = document.getElementById("saveAccountBtn");
const changePasswordBtn = document.getElementById("changePasswordBtn");
const logoutBtn = document.getElementById("logoutBtn");
const deleteAccountBtn = document.getElementById("deleteAccountBtn");

const DEFAULT_ICON = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

console.log("🔍 Buttons found:");
console.log("  uploadPhotoBtn:", !!uploadPhotoBtn);
console.log("  saveAccountBtn:", !!saveAccountBtn);
console.log("  accountTab:", !!accountTab);
console.log("  securityTab:", !!securityTab);

/* ============================================
   LOAD USER DATA FROM MONGODB
   ============================================ */
async function loadUserData() {
  try {
    const res = await fetch("/api/get-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: loggedInEmail })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error);

    currentUser = data;
    localStorage.setItem("userData", JSON.stringify(data));

    console.log("User data loaded:", currentUser);

    if (profileUsername) profileUsername.textContent = data.username || 'User';
    if (profileEmailDisplay) profileEmailDisplay.textContent = data.email || 'user@email.com';
    if (profileViewUsername) profileViewUsername.textContent = data.username || 'User';
    if (profileViewEmail) profileViewEmail.textContent = data.email || 'user@email.com';
    if (accountUsernameDisplay) accountUsernameDisplay.textContent = data.username || 'User';
    if (accountEmailDisplay) accountEmailDisplay.textContent = data.email || 'user@email.com';
    if (profileEmail) profileEmail.value = data.email || '';
    if (profileUsernameInput) profileUsernameInput.value = data.username || '';
    if (profileImage) profileImage.src = data.photo || DEFAULT_ICON;

    const navProfilePhoto = document.getElementById("navProfilePhoto");
    if (navProfilePhoto) {
      navProfilePhoto.src = data.photo || DEFAULT_ICON;
    }
    const navUsername = document.getElementById("navUsername");
    if (navUsername) navUsername.textContent = data.username || 'Profile';

    updateDeletePhotoButton();
  } catch (error) {
    console.error("Load user error:", error);
    toastError("Failed to load user data.");
  }
}

/* ============================================
   DELETE PHOTO BUTTON
   ============================================ */
function updateDeletePhotoButton() {
  const container = document.getElementById("removePhotoContainer");
  if (!container) return;
  container.innerHTML = '';

  const hasPhoto = currentUser && currentUser.photo && currentUser.photo !== DEFAULT_ICON && currentUser.photo !== "";

  if (hasPhoto) {
    const deletePhotoBtn = document.createElement("button");
    deletePhotoBtn.id = "deletePhotoBtn";
    deletePhotoBtn.className = "convert-btn";
    deletePhotoBtn.style.cssText = "padding:5px 15px; font-size:0.75rem; background:#e53935; display:inline-block;";
    deletePhotoBtn.innerHTML = '<i class="fa-solid fa-trash"></i> Remove';
    
    deletePhotoBtn.onclick = async function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      try {
        const res = await fetch("/api/update-user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: loggedInEmail, photo: "" })
        });
        
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to remove photo.");
        }
        
        currentUser.photo = "";
        localStorage.setItem("userData", JSON.stringify(currentUser));
        
        if (profileImage) profileImage.src = DEFAULT_ICON;
        const navProfilePhoto = document.getElementById("navProfilePhoto");
        if (navProfilePhoto) navProfilePhoto.src = DEFAULT_ICON;
        
        updateDeletePhotoButton();
        toastSuccess("Profile photo removed!");
        
      } catch (error) {
        console.error("Remove photo error:", error);
        toastError(error.message || "Failed to remove photo.");
      }
    };
    
    container.appendChild(deletePhotoBtn);
  }
}

/* ============================================
   ACCOUNT & SECURITY TABS
   ============================================ */
console.log("Setting up tabs...");

if (profileView) profileView.style.display = "block";
if (accountPanel) accountPanel.style.display = "none";
if (securityPanel) securityPanel.style.display = "none";

if (accountTab) {
  accountTab.classList.remove('active');
}
if (securityTab) {
  securityTab.classList.remove('active');
}

if (accountTab) {
  console.log("✅ Adding Account tab listener");
  accountTab.addEventListener("click", function(e) {
    e.preventDefault();
    console.log("📋 Account tab CLICKED");
    
    if (profileView) profileView.style.display = "none";
    if (accountPanel) accountPanel.style.display = "block";
    if (securityPanel) securityPanel.style.display = "none";
    
    this.classList.add('active');
    if (securityTab) securityTab.classList.remove('active');
    
    console.log("Account panel display:", accountPanel.style.display);
  });
} else {
  console.error("❌ accountTab element not found!");
}

if (securityTab) {
  console.log("✅ Adding Security tab listener");
  securityTab.addEventListener("click", function(e) {
    e.preventDefault();
    console.log("🔒 Security tab CLICKED");
    
    if (profileView) profileView.style.display = "none";
    if (securityPanel) securityPanel.style.display = "block";
    if (accountPanel) accountPanel.style.display = "none";
    
    this.classList.add('active');
    if (accountTab) accountTab.classList.remove('active');
    
    console.log("Security panel display:", securityPanel.style.display);
  });
} else {
  console.error("❌ securityTab element not found!");
}

/* ============================================
   PASSWORD TOGGLES
   ============================================ */
function togglePasswordVisibility(inputId, buttonId) {
  const input = document.getElementById(inputId);
  const button = document.getElementById(buttonId);
  if (!input || !button) return;
  
  button.addEventListener("click", () => {
    const icon = button.querySelector("i");
    if (input.type === "password") {
      input.type = "text";
      if (icon) icon.classList.replace("fa-eye", "fa-eye-slash");
    } else {
      input.type = "password";
      if (icon) icon.classList.replace("fa-eye-slash", "fa-eye");
    }
  });
}

togglePasswordVisibility("accountCurrentPassword", "toggleAccountPassword");
togglePasswordVisibility("currentPassword", "toggleCurrentPassword");
togglePasswordVisibility("newPassword", "toggleNewPassword");
togglePasswordVisibility("confirmPassword", "toggleConfirmPassword");

/* ============================================
   UPLOAD PHOTO
   ============================================ */
if (uploadPhotoBtn && profilePhotoInput) {
  console.log("✅ Setting up Upload Photo");
  
  uploadPhotoBtn.onclick = function(e) {
    e.preventDefault();
    console.log("📸 Upload clicked - changing text");
    
    this.textContent = "Uploading...";
    this.disabled = true;
    
    profilePhotoInput.value = "";
    profilePhotoInput.click();
  };

  profilePhotoInput.onchange = async function(e) {
    const file = this.files[0];
    console.log("📸 File selected:", file ? file.name : "No file");
    
    if (!file) {
      uploadPhotoBtn.textContent = "Upload Photo";
      uploadPhotoBtn.disabled = false;
      return;
    }
    
    if (!file.type.startsWith('image/')) {
      toastError("Please select an image.");
      this.value = "";
      uploadPhotoBtn.textContent = "Upload Photo";
      uploadPhotoBtn.disabled = false;
      return;
    }

    const reader = new FileReader();
    reader.onload = async function(event) {
      const photoData = event.target.result;
      try {
        const formData = new FormData();
        formData.append('email', loggedInEmail);
        formData.append('photo', photoData);
        
        const res = await fetch("/api/update-user", {
          method: "POST",
          body: formData
        });
        
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to upload photo.");

        currentUser.photo = photoData;
        localStorage.setItem("userData", JSON.stringify(currentUser));
        if (profileImage) profileImage.src = photoData;
        const navProfilePhoto = document.getElementById("navProfilePhoto");
        if (navProfilePhoto) navProfilePhoto.src = photoData;
        updateDeletePhotoButton();
        
        uploadPhotoBtn.textContent = "Upload Photo";
        uploadPhotoBtn.disabled = false;
        
        toastSuccess("Profile photo updated!");
      } catch (error) {
        uploadPhotoBtn.textContent = "Upload Photo";
        uploadPhotoBtn.disabled = false;
        toastError(error.message);
        console.error("Photo upload error:", error);
      }
    };
    reader.readAsDataURL(file);
    this.value = "";
  };
}

/* ============================================
   SAVE ACCOUNT - WITH VERIFICATION LOOP
   ============================================ */
if (saveAccountBtn) {
  console.log("✅ Setting up Save Account");
  
  saveAccountBtn.onclick = async function(e) {
    e.preventDefault();
    console.log("💾 Save clicked");
    
    const currentPassword = accountCurrentPassword.value;
    const newEmail = profileEmail.value.trim().toLowerCase();
    const newUsername = profileUsernameInput.value.trim();
    
    if (!currentPassword) {
      toastError("Please enter your current password.");
      return;
    }
    
    const isEmailChanged = newEmail && newEmail !== currentUser.email;
    const isUsernameChanged = newUsername && newUsername !== currentUser.username;
    
    if (!isEmailChanged && !isUsernameChanged) {
      toastError("Please change your email or username.");
      return;
    }
    
    if (isUsernameChanged && newUsername.length < 3) {
      toastError("Username must have at least 3 characters.");
      return;
    }
    
    if (isEmailChanged) {
      const checkRes = await fetch("/api/get-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newEmail })
      });
      if (checkRes.ok) {
        toastError("Email already used by another account.");
        return;
      }
    }
    
    this.textContent = "Sending code...";
    this.disabled = true;
    console.log("💾 Button changed to: Sending code...");

    try {
      const verifyRes = await fetch("/api/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loggedInEmail, password: currentPassword })
      });

      if (!verifyRes.ok) {
        toastError("Incorrect current password.");
        this.textContent = "Save Changes";
        this.disabled = false;
        return;
      }

      const res = await fetch("/api/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: currentUser.email })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to send code.");
      }

      toastInfo("Verification code sent to your email. Please check your inbox (and SPAM folder if not found).");

      // Verification loop - stays open on wrong code
      let code = null;
      let verified = false;
      
      while (!verified) {
        code = await showVerificationModal();
        
        if (!code) {
          toastWarning("Update cancelled. Refreshing page...");
          this.textContent = "Save Changes";
          this.disabled = false;
          setTimeout(() => { window.location.reload(); }, 500);
          return;
        }

        const verifyCodeRes = await fetch("/api/verify-code", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: currentUser.email, code: code.trim() })
        });

        const verifyData = await verifyCodeRes.json();
        if (verifyData.success) {
          verified = true;
        } else {
          toastError("Incorrect verification code. Please try again.");
        }
      }

      const updateData = { email: currentUser.email };
      if (isEmailChanged) updateData.newEmail = newEmail;
      if (isUsernameChanged) updateData.newUsername = newUsername;

      const updateRes = await fetch("/api/update-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData)
      });

      const updateResult = await updateRes.json();
      if (!updateRes.ok) {
        throw new Error(updateResult.error || "Failed to update account.");
      }

      if (isEmailChanged) {
        currentUser.email = newEmail;
        localStorage.setItem("loggedInUser", newEmail);
      }
      if (isUsernameChanged) currentUser.username = newUsername;
      
      localStorage.setItem("userData", JSON.stringify(currentUser));
      accountCurrentPassword.value = "";
      
      toastSuccess("Account updated! Refreshing...");
      
      this.textContent = "Save Changes";
      this.disabled = false;
      
      setTimeout(function() {
        window.location.reload();
      }, 1500);

    } catch (error) {
      this.textContent = "Save Changes";
      this.disabled = false;
      toastError(error.message || "Failed to update account.");
      console.error("Save account error:", error);
    }
  };
}

/* ============================================
   CHANGE PASSWORD - WITH VERIFICATION LOOP
   ============================================ */
if (changePasswordBtn) {
  changePasswordBtn.addEventListener("click", async function() {
    const curPass = document.getElementById("currentPassword").value;
    const newPass = document.getElementById("newPassword").value;
    const confPass = document.getElementById("confirmPassword").value;

    const verifyRes = await fetch("/api/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: loggedInEmail, password: curPass })
    });

    if (!verifyRes.ok) {
      toastError("Incorrect current password.");
      return;
    }

    const strongPassword = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{5,}$/;
    if (!strongPassword.test(newPass)) {
      toastError("Password: 5+ chars, one capital, one number, one symbol.");
      return;
    }

    if (!newPass || newPass !== confPass) {
      toastError("Passwords do not match.");
      return;
    }

    if (newPass === curPass) {
      toastError("New password must be different.");
      return;
    }

    try {
      this.disabled = true;
      this.textContent = "Sending code...";

      const res = await fetch("/api/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: currentUser.email })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to send code.");
      }

      toastInfo("Verification code sent to your email. Please check your inbox (and SPAM folder if not found).");

      // Verification loop - stays open on wrong code
      let code = null;
      let verified = false;
      
      while (!verified) {
        code = await showVerificationModal();
        
        if (!code) {
          toastWarning("Password change cancelled. Refreshing page...");
          this.disabled = false;
          this.textContent = "Change Password";
          setTimeout(() => { window.location.reload(); }, 500);
          return;
        }

        const verifyCodeRes = await fetch("/api/verify-code", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: currentUser.email, code: code.trim() })
        });

        const verifyData = await verifyCodeRes.json();
        if (verifyData.success) {
          verified = true;
        } else {
          toastError("Incorrect verification code. Please try again.");
        }
      }

      const updateRes = await fetch("/api/update-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: currentUser.email,
          newPassword: newPass
        })
      });

      if (!updateRes.ok) {
        const data = await updateRes.json();
        throw new Error(data.error || "Failed to update password.");
      }

      document.getElementById("currentPassword").value = "";
      document.getElementById("newPassword").value = "";
      document.getElementById("confirmPassword").value = "";

      toastSuccess("Password changed successfully!");
      this.disabled = false;
      this.textContent = "Change Password";

    } catch (error) {
      toastError(error.message || "Failed to change password.");
      this.disabled = false;
      this.textContent = "Change Password";
      console.error("Change password error:", error);
    }
  });
}

/* ============================================
   LOGOUT - WITH REFRESH ON CANCEL
   ============================================ */
if (logoutBtn) {
  logoutBtn.addEventListener("click", async function(e) {
    e.preventDefault();
    
    const confirm = await showConfirmModal(
      '🚪 Log Out',
      'Are you sure you want to log out?',
      'Yes, Log Out',
      'Cancel'
    );
    
    if (confirm === null || confirm === false) {
      window.location.reload();
      return;
    }
    
    if (confirm) {
      localStorage.removeItem("loggedInUser");
      localStorage.removeItem("userData");
      toastSuccess("Logged out successfully!");
      setTimeout(() => {
        window.location.href = "index.html";
      }, 1500);
    }
  });
}

/* ============================================
   DELETE ACCOUNT - WITH VERIFICATION LOOP
   ============================================ */
if (deleteAccountBtn) {
  deleteAccountBtn.addEventListener("click", async function(e) {
    e.preventDefault();
    
    const confirm1 = await showConfirmModal(
      '⚠️ Delete Account',
      'Are you sure you want to permanently delete your account? This cannot be undone.',
      'Yes, Delete',
      'Cancel'
    );
    
    if (!confirm1) {
      window.location.reload();
      return;
    }

    const confirm2 = await showConfirmModal(
      '⚠️ Final Warning',
      'Are you absolutely sure? This will delete all your data permanently.',
      'Yes, Delete Permanently',
      'Cancel'
    );
    
    if (!confirm2) {
      window.location.reload();
      return;
    }

    try {
      this.disabled = true;
      this.textContent = "Sending code...";

      const res = await fetch("/api/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: currentUser.email })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to send code.");
      }

      toastInfo("Verification code sent to your email. Please check your inbox (and SPAM folder if not found).");

      // Verification loop - stays open on wrong code
      let code = null;
      let verified = false;
      
      while (!verified) {
        code = await showVerificationModal();
        
        if (!code) {
          toastWarning("Deletion cancelled. Refreshing page...");
          this.disabled = false;
          this.textContent = "Delete Account";
          setTimeout(() => { window.location.reload(); }, 500);
          return;
        }

        const verifyCodeRes = await fetch("/api/verify-code", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: currentUser.email, code: code.trim() })
        });

        const verifyData = await verifyCodeRes.json();
        if (verifyData.success) {
          verified = true;
        } else {
          toastError("Incorrect verification code. Please try again.");
        }
      }

      const finalConfirm = await showConfirmModal(
        '⚠️ Final Confirmation',
        'Delete your account permanently?',
        'Yes, Delete',
        'Cancel'
      );
      
      if (!finalConfirm) {
        this.disabled = false;
        this.textContent = "Delete Account";
        toastWarning("Deletion cancelled.");
        window.location.reload();
        return;
      }

      const deleteRes = await fetch("/api/delete-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: currentUser.email })
      });

      if (!deleteRes.ok) {
        const data = await deleteRes.json();
        throw new Error(data.error || "Failed to delete account.");
      }

      localStorage.removeItem("loggedInUser");
      localStorage.removeItem("userData");

      toastSuccess("Account deleted successfully!");
      this.disabled = false;
      this.textContent = "Delete Account";
      
      setTimeout(() => {
        window.location.href = "index.html";
      }, 2000);

    } catch (error) {
      toastError(error.message || "Failed to delete account.");
      this.disabled = false;
      this.textContent = "Delete Account";
      console.error("Delete account error:", error);
    }
  });
}

/* ============================================
   CLICKABLE PROFILE PICTURE - ENLARGE
   ============================================ */
const profileImageWrapper = document.getElementById("profileImageWrapper");

if (profileImageWrapper && profileImage) {
  profileImageWrapper.addEventListener("click", function(e) {
    e.preventDefault();
    const imageSrc = profileImage.src;
    
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
    `;
    
    overlay.appendChild(img);
    overlay.addEventListener('click', function() {
      overlay.remove();
    });
    document.body.appendChild(overlay);
  });
}

loadUserData();
console.log("✅ Profile.js v40 loaded successfully");

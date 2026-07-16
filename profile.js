// ============================================
// PROFILE.JS - VERSION 75 (COMPLETE)
// ============================================
console.log("🚀 profile.js v75 LOADED!");

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

// Mobile modal elements
const mobileModal = document.getElementById("mobileProfileModal");
const mobileModalContent = document.getElementById("mobileModalContent");
const mobileModalClose = document.getElementById("mobileModalClose");

const DEFAULT_ICON = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

// Check if on mobile
function isMobile() {
  return window.innerWidth <= 768;
}

console.log("🔍 Elements found:");
console.log("  profileView:", !!profileView);
console.log("  accountPanel:", !!accountPanel);
console.log("  securityPanel:", !!securityPanel);
console.log("  accountTab:", !!accountTab);
console.log("  securityTab:", !!securityTab);
console.log("  mobileModal:", !!mobileModal);

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
    
    // Ensure profile view is visible, panels are hidden
    showProfileView();
    
  } catch (error) {
    console.error("Load user error:", error);
    toastError("Failed to load user data.");
  }
}

/* ============================================
   MOBILE MODAL FUNCTIONS
   ============================================ */
function openMobileModal(contentHTML) {
  if (!mobileModal || !mobileModalContent) return;
  
  mobileModalContent.innerHTML = contentHTML;
  mobileModal.classList.add('open');
  document.body.style.overflow = 'hidden';
  
  // Re-bind any buttons inside the modal content
  bindModalButtons();
}

function closeMobileModal() {
  if (!mobileModal) return;
  mobileModal.classList.remove('open');
  document.body.style.overflow = '';
}

// Close modal on backdrop click
if (mobileModal) {
  mobileModal.addEventListener('click', function(e) {
    if (e.target === this) {
      closeMobileModal();
    }
  });
}

// Close modal on close button
if (mobileModalClose) {
  mobileModalClose.addEventListener('click', function() {
    closeMobileModal();
  });
}

// Close modal on Escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeMobileModal();
  }
});

/* ============================================
   BIND MODAL BUTTONS
   ============================================ */
function bindModalButtons() {
  // Find and bind save account button in modal
  const modalSaveBtn = document.getElementById('modalSaveAccountBtn');
  if (modalSaveBtn) {
    modalSaveBtn.addEventListener('click', async function(e) {
      e.preventDefault();
      // Trigger the same save account logic
      await saveAccountHandler();
    });
  }
  
  // Find and bind change password button in modal
  const modalChangePwdBtn = document.getElementById('modalChangePasswordBtn');
  if (modalChangePwdBtn) {
    modalChangePwdBtn.addEventListener('click', async function(e) {
      e.preventDefault();
      await changePasswordHandler();
    });
  }
  
  // Bind password toggle buttons in modal
  const modalToggleBtns = document.querySelectorAll('.modal-password-toggle');
  modalToggleBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      const input = document.getElementById(this.dataset.target);
      if (!input) return;
      const icon = this.querySelector('i');
      if (input.type === 'password') {
        input.type = 'text';
        if (icon) icon.classList.replace('fa-eye', 'fa-eye-slash');
      } else {
        input.type = 'password';
        if (icon) icon.classList.replace('fa-eye-slash', 'fa-eye');
      }
    });
  });
}

/* ============================================
   TAB SWITCHING FUNCTIONS
   ============================================ */
function showProfileView() {
  if (profileView) {
    profileView.style.display = "block";
    profileView.classList.remove('hidden-panel');
  }
  if (accountPanel) {
    accountPanel.style.display = "none";
    accountPanel.classList.remove('active-panel');
  }
  if (securityPanel) {
    securityPanel.style.display = "none";
    securityPanel.classList.remove('active-panel');
  }
  if (accountTab) accountTab.classList.remove('active');
  if (securityTab) securityTab.classList.remove('active');
  console.log("📋 Showing Profile View");
}

function showAccountPanel() {
  if (isMobile()) {
    // On mobile: Open modal with account content
    const accountHTML = document.getElementById('accountPanel').innerHTML;
    openMobileModal(`
      <h2><i class="fa-solid fa-user"></i> Account Information</h2>
      ${accountHTML}
    `);
  } else {
    // On desktop: Show inline
    if (profileView) {
      profileView.style.display = "none";
      profileView.classList.add('hidden-panel');
    }
    if (accountPanel) {
      accountPanel.style.display = "block";
      accountPanel.classList.add('active-panel');
    }
    if (securityPanel) {
      securityPanel.style.display = "none";
      securityPanel.classList.remove('active-panel');
    }
    if (accountTab) accountTab.classList.add('active');
    if (securityTab) securityTab.classList.remove('active');
  }
  console.log("📋 Showing Account Panel");
}

function showSecurityPanel() {
  if (isMobile()) {
    // On mobile: Open modal with security content
    const securityHTML = document.getElementById('securityPanel').innerHTML;
    openMobileModal(`
      <h2><i class="fa-solid fa-shield-halved"></i> Security Settings</h2>
      ${securityHTML}
    `);
  } else {
    // On desktop: Show inline
    if (profileView) {
      profileView.style.display = "none";
      profileView.classList.add('hidden-panel');
    }
    if (securityPanel) {
      securityPanel.style.display = "block";
      securityPanel.classList.add('active-panel');
    }
    if (accountPanel) {
      accountPanel.style.display = "none";
      accountPanel.classList.remove('active-panel');
    }
    if (securityTab) securityTab.classList.add('active');
    if (accountTab) accountTab.classList.remove('active');
  }
  console.log("📋 Showing Security Panel");
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
   ACCOUNT & SECURITY TABS - FIXED
   ============================================ */
console.log("Setting up tabs...");

// Ensure default state
showProfileView();

// ===== ACCOUNT TAB =====
if (accountTab) {
  console.log("✅ Adding Account tab listener");
  
  const newAccountTab = accountTab.cloneNode(true);
  accountTab.parentNode.replaceChild(newAccountTab, accountTab);
  
  newAccountTab.addEventListener("click", function(e) {
    e.preventDefault();
    e.stopPropagation();
    console.log("📋 Account tab CLICKED");
    showAccountPanel();
  });
  
  window.accountTabRef = newAccountTab;
} else {
  console.error("❌ accountTab element not found!");
}

// ===== SECURITY TAB =====
if (securityTab) {
  console.log("✅ Adding Security tab listener");
  
  const newSecurityTab = securityTab.cloneNode(true);
  securityTab.parentNode.replaceChild(newSecurityTab, securityTab);
  
  newSecurityTab.addEventListener("click", function(e) {
    e.preventDefault();
    e.stopPropagation();
    console.log("🔒 Security tab CLICKED");
    showSecurityPanel();
  });
  
  window.securityTabRef = newSecurityTab;
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
   SAVE ACCOUNT HANDLER - EXTRACTED FOR MODAL
   ============================================ */
async function saveAccountHandler() {
  const currentPassword = document.getElementById("accountCurrentPassword")?.value || document.getElementById("modalAccountCurrentPassword")?.value;
  const newEmail = document.getElementById("profileEmail")?.value?.trim().toLowerCase() || document.getElementById("modalProfileEmail")?.value?.trim().toLowerCase();
  const newUsername = document.getElementById("profileUsernameInput")?.value?.trim() || document.getElementById("modalProfileUsernameInput")?.value?.trim();

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

  const saveBtn = document.getElementById("saveAccountBtn") || document.getElementById("modalSaveAccountBtn");
  if (saveBtn) {
    saveBtn.textContent = "Sending code...";
    saveBtn.disabled = true;
  }

  try {
    const verifyRes = await fetch("/api/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: loggedInEmail, password: currentPassword })
    });

    if (!verifyRes.ok) {
      toastError("Incorrect current password.");
      if (saveBtn) {
        saveBtn.textContent = "Save Changes";
        saveBtn.disabled = false;
      }
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

    let code = null;
    let verified = false;

    while (!verified) {
      code = await showVerificationModal(currentUser.email);

      if (!code) {
        toastWarning("Update cancelled. Refreshing page...");
        if (saveBtn) {
          saveBtn.textContent = "Save Changes";
          saveBtn.disabled = false;
        }
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

    toastSuccess("Account updated! Refreshing...");

    if (saveBtn) {
      saveBtn.textContent = "Save Changes";
      saveBtn.disabled = false;
    }

    // Close mobile modal if open
    closeMobileModal();

    setTimeout(function() {
      window.location.reload();
    }, 1500);

  } catch (error) {
    if (saveBtn) {
      saveBtn.textContent = "Save Changes";
      saveBtn.disabled = false;
    }
    toastError(error.message || "Failed to update account.");
    console.error("Save account error:", error);
  }
}

/* ============================================
   SAVE ACCOUNT BUTTON
   ============================================ */
if (saveAccountBtn) {
  console.log("✅ Setting up Save Account");
  saveAccountBtn.addEventListener("click", saveAccountHandler);
}

/* ============================================
   CHANGE PASSWORD HANDLER - EXTRACTED FOR MODAL
   ============================================ */
async function changePasswordHandler() {
  const curPass = document.getElementById("currentPassword")?.value || document.getElementById("modalCurrentPassword")?.value;
  const newPass = document.getElementById("newPassword")?.value || document.getElementById("modalNewPassword")?.value;
  const confPass = document.getElementById("confirmPassword")?.value || document.getElementById("modalConfirmPassword")?.value;

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

  const changeBtn = document.getElementById("changePasswordBtn") || document.getElementById("modalChangePasswordBtn");
  if (changeBtn) {
    changeBtn.disabled = true;
    changeBtn.textContent = "Sending code...";
  }

  try {
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

    let code = null;
    let verified = false;

    while (!verified) {
      code = await showVerificationModal(currentUser.email);

      if (!code) {
        toastWarning("Password change cancelled. Refreshing page...");
        if (changeBtn) {
          changeBtn.disabled = false;
          changeBtn.textContent = "Change Password";
        }
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

    toastSuccess("Password changed successfully!");
    if (changeBtn) {
      changeBtn.disabled = false;
      changeBtn.textContent = "Change Password";
    }

    // Close mobile modal if open
    closeMobileModal();

    // Clear password fields
    document.getElementById("currentPassword").value = "";
    document.getElementById("newPassword").value = "";
    document.getElementById("confirmPassword").value = "";

  } catch (error) {
    if (changeBtn) {
      changeBtn.disabled = false;
      changeBtn.textContent = "Change Password";
    }
    toastError(error.message || "Failed to change password.");
    console.error("Change password error:", error);
  }
}

/* ============================================
   CHANGE PASSWORD BUTTON
   ============================================ */
if (changePasswordBtn) {
  console.log("✅ Setting up Change Password");
  changePasswordBtn.addEventListener("click", changePasswordHandler);
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
      closeMobileModal();
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

      let code = null;
      let verified = false;

      while (!verified) {
        code = await showVerificationModal(currentUser.email);

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
      closeMobileModal();
      
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

// Handle window resize - close modal if switching to desktop
window.addEventListener('resize', function() {
  if (window.innerWidth > 768 && mobileModal && mobileModal.classList.contains('open')) {
    closeMobileModal();
  }
});

loadUserData();
console.log("✅ Profile.js v75 loaded successfully");

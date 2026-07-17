// ============================================
// PROFILE.JS - VERSION 75 (SIMPLE & WORKING)
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

const DEFAULT_ICON = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

// ============================================
// IS MOBILE CHECK
// ============================================
function isMobile() {
  return window.innerWidth <= 768;
}

// ============================================
// MODAL ELEMENTS
// ============================================
let modal = document.getElementById('mobileProfileModal');
let modalContent = document.getElementById('mobileModalContent');
let modalClose = document.getElementById('mobileModalClose');

// Create modal if it doesn't exist
if (!modal) {
  modal = document.createElement('div');
  modal.id = 'mobileProfileModal';
  modal.className = 'mobile-profile-modal';
  modal.style.cssText = 'display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);backdrop-filter:blur(12px);z-index:99998;justify-content:center;align-items:center;padding:20px;';
  
  const inner = document.createElement('div');
  inner.className = 'mobile-profile-modal-content';
  inner.style.cssText = 'background:rgba(25,35,45,0.98);border:1px solid rgba(255,255,255,0.1);border-radius:20px;padding:24px 28px;max-width:500px;width:100%;max-height:90vh;overflow-y:auto;position:relative;';
  
  const close = document.createElement('button');
  close.id = 'mobileModalClose';
  close.className = 'mobile-profile-modal-close';
  close.innerHTML = '&times;';
  close.style.cssText = 'position:absolute;top:12px;right:16px;background:none;border:none;color:#aaa;font-size:1.8rem;cursor:pointer;padding:4px 8px;border-radius:8px;';
  
  const content = document.createElement('div');
  content.id = 'mobileModalContent';
  
  inner.appendChild(close);
  inner.appendChild(content);
  modal.appendChild(inner);
  document.body.appendChild(modal);
  
  modal = document.getElementById('mobileProfileModal');
  modalContent = document.getElementById('mobileModalContent');
  modalClose = document.getElementById('mobileModalClose');
}

// ============================================
// MODAL FUNCTIONS
// ============================================
function openModal(html) {
  if (!modal || !modalContent) return;
  modalContent.innerHTML = html;
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  setTimeout(bindModalButtons, 200);
}

function closeModal() {
  if (!modal) return;
  modal.style.display = 'none';
  document.body.style.overflow = '';
  // Show profile view again
  if (profileView) {
    profileView.style.display = 'block';
    profileView.classList.remove('hidden-panel');
  }
}

function bindModalButtons() {
  const content = document.getElementById('mobileModalContent');
  if (!content) return;
  
  const buttons = content.querySelectorAll('button');
  buttons.forEach(function(btn) {
    if (btn.dataset.bound === 'true') return;
    btn.dataset.bound = 'true';
    
    const id = btn.id;
    
    if (id === 'saveAccountBtn') {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        // Copy modal values to main inputs
        const modalPwd = document.getElementById('accountCurrentPassword');
        const modalEmail = document.getElementById('profileEmail');
        const modalUser = document.getElementById('profileUsernameInput');
        const mainPwd = document.getElementById('accountCurrentPassword');
        const mainEmail = document.getElementById('profileEmail');
        const mainUser = document.getElementById('profileUsernameInput');
        if (modalPwd && mainPwd) mainPwd.value = modalPwd.value;
        if (modalEmail && mainEmail) mainEmail.value = modalEmail.value;
        if (modalUser && mainUser) mainUser.value = modalUser.value;
        const mainBtn = document.getElementById('saveAccountBtn');
        if (mainBtn) mainBtn.click();
      });
    }
    else if (id === 'changePasswordBtn') {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        const modalCur = document.getElementById('currentPassword');
        const modalNew = document.getElementById('newPassword');
        const modalConf = document.getElementById('confirmPassword');
        const mainCur = document.getElementById('currentPassword');
        const mainNew = document.getElementById('newPassword');
        const mainConf = document.getElementById('confirmPassword');
        if (modalCur && mainCur) mainCur.value = modalCur.value;
        if (modalNew && mainNew) mainNew.value = modalNew.value;
        if (modalConf && mainConf) mainConf.value = modalConf.value;
        const mainBtn = document.getElementById('changePasswordBtn');
        if (mainBtn) mainBtn.click();
      });
    }
    else if (id === 'logoutBtn') {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        const mainBtn = document.getElementById('logoutBtn');
        if (mainBtn) mainBtn.click();
      });
    }
    else if (id === 'deleteAccountBtn') {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        const mainBtn = document.getElementById('deleteAccountBtn');
        if (mainBtn) mainBtn.click();
      });
    }
    else if (btn.classList && btn.classList.contains('password-toggle-btn')) {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        const wrapper = this.parentElement;
        let input = wrapper.querySelector('input');
        if (!input) {
          const id = this.id.replace('toggle', '');
          if (id) input = document.getElementById(id);
        }
        if (!input) return;
        const icon = this.querySelector('i');
        if (input.type === 'password') {
          input.type = 'text';
          if (icon) { icon.classList.remove('fa-eye'); icon.classList.add('fa-eye-slash'); }
        } else {
          input.type = 'password';
          if (icon) { icon.classList.remove('fa-eye-slash'); icon.classList.add('fa-eye'); }
        }
      });
    }
  });
}

// Close modal events
if (modalClose) {
  modalClose.addEventListener('click', closeModal);
}
if (modal) {
  modal.addEventListener('click', function(e) {
    if (e.target === this) closeModal();
  });
}
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeModal();
});

/* ============================================
   LOAD USER DATA
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
    
    showProfileView();
    
  } catch (error) {
    console.error("Load user error:", error);
    toastError("Failed to load user data.");
  }
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
  // Hide profile view
  if (profileView) {
    profileView.style.display = "none";
    profileView.classList.add('hidden-panel');
  }
  
  // MOBILE: Open modal
  if (isMobile()) {
    console.log("📱 MOBILE: Opening Account modal");
    if (accountPanel) {
      var html = accountPanel.innerHTML;
      html = html.replace(/<h2[^>]*>.*?<\/h2>/, '');
      openModal('<h2><i class="fa-solid fa-user"></i> Account Information</h2>' + html);
    }
    return;
  }
  
  // DESKTOP: Show inline
  console.log("💻 DESKTOP: Showing Account panel inline");
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

function showSecurityPanel() {
  // Hide profile view
  if (profileView) {
    profileView.style.display = "none";
    profileView.classList.add('hidden-panel');
  }
  
  // MOBILE: Open modal
  if (isMobile()) {
    console.log("📱 MOBILE: Opening Security modal");
    if (securityPanel) {
      var html = securityPanel.innerHTML;
      html = html.replace(/<h2[^>]*>.*?<\/h2>/, '');
      openModal('<h2><i class="fa-solid fa-shield-halved"></i> Security Settings</h2>' + html);
    }
    return;
  }
  
  // DESKTOP: Show inline
  console.log("💻 DESKTOP: Showing Security panel inline");
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
   SETUP TABS
   ============================================ */
console.log("Setting up tabs...");

showProfileView();

if (accountTab) {
  const newAccountTab = accountTab.cloneNode(true);
  accountTab.parentNode.replaceChild(newAccountTab, accountTab);
  
  newAccountTab.addEventListener("click", function(e) {
    e.preventDefault();
    e.stopPropagation();
    console.log("📋 Account tab CLICKED");
    showAccountPanel();
  });
}

if (securityTab) {
  const newSecurityTab = securityTab.cloneNode(true);
  securityTab.parentNode.replaceChild(newSecurityTab, securityTab);
  
  newSecurityTab.addEventListener("click", function(e) {
    e.preventDefault();
    e.stopPropagation();
    console.log("🔒 Security tab CLICKED");
    showSecurityPanel();
  });
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
    this.textContent = "Uploading...";
    this.disabled = true;
    profilePhotoInput.value = "";
    profilePhotoInput.click();
  };

  profilePhotoInput.onchange = async function(e) {
    const file = this.files[0];
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
   SAVE ACCOUNT
   ============================================ */
if (saveAccountBtn) {
  saveAccountBtn.onclick = async function(e) {
    e.preventDefault();
    
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

      toastInfo("Verification code sent to your email.");

      let code = null;
      let verified = false;
      
      while (!verified) {
        code = await showVerificationModal(currentUser.email);
        
        if (!code) {
          toastWarning("Update cancelled.");
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
          toastError("Incorrect verification code.");
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
      
      closeModal();
      
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
   CHANGE PASSWORD
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

      toastInfo("Verification code sent to your email.");

      let code = null;
      let verified = false;
      
      while (!verified) {
        code = await showVerificationModal(currentUser.email);
        
        if (!code) {
          toastWarning("Password change cancelled.");
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
          toastError("Incorrect verification code.");
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
      
      closeModal();

    } catch (error) {
      toastError(error.message || "Failed to change password.");
      this.disabled = false;
      this.textContent = "Change Password";
      console.error("Change password error:", error);
    }
  });
}

/* ============================================
   LOGOUT
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
      closeModal();
      setTimeout(() => {
        window.location.href = "index.html";
      }, 1500);
    }
  });
}

/* ============================================
   DELETE ACCOUNT
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

      toastInfo("Verification code sent to your email.");

      let code = null;
      let verified = false;
      
      while (!verified) {
        code = await showVerificationModal(currentUser.email);
        
        if (!code) {
          toastWarning("Deletion cancelled.");
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
          toastError("Incorrect verification code.");
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
      closeModal();
      
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
   PROFILE PICTURE ENLARGE
   ============================================ */
const profileImageWrapper = document.getElementById("profileImageWrapper");

if (profileImageWrapper && profileImage) {
  profileImageWrapper.addEventListener("click", function(e) {
    e.preventDefault();
    const imageSrc = profileImage.src;
    
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);backdrop-filter:blur(10px);display:flex;justify-content:center;align-items:center;z-index:10002;cursor:pointer;';
    const img = document.createElement('img');
    img.src = imageSrc;
    img.style.cssText = 'max-width:80%;max-height:80%;border-radius:20px;border:4px solid #00bcd4;box-shadow:0 20px 60px rgba(0,0,0,0.6);object-fit:contain;';
    overlay.appendChild(img);
    overlay.addEventListener('click', function() { overlay.remove(); });
    document.body.appendChild(overlay);
  });
}

loadUserData();
console.log("✅ Profile.js v75 loaded successfully");
console.log("📱 isMobile:", isMobile());

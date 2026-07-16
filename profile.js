// ============================================
// PROFILE.JS - VERSION 100 (COMPLETE)
// ============================================
console.log("🚀 profile.js v100 LOADED!");

// Immediately try to load user data from localStorage
const loggedInEmail = localStorage.getItem("loggedInUser");
console.log("📍 loggedInEmail:", loggedInEmail);

if (!loggedInEmail) {
  console.log("❌ No logged in user, redirecting to signin.html");
  window.location.href = "signin.html";
  // Stop execution
  throw new Error("No logged in user");
}

let currentUser = null;
const userData = localStorage.getItem("userData");
console.log("📍 userData from localStorage:", userData);

if (userData) {
  try {
    currentUser = JSON.parse(userData);
    console.log("📍 Parsed currentUser:", currentUser);
  } catch(e) {
    console.error("❌ Error parsing userData:", e);
  }
}

if (!currentUser) {
  console.log("❌ No currentUser, redirecting to signin.html");
  localStorage.removeItem("loggedInUser");
  window.location.href = "signin.html";
  throw new Error("No currentUser");
}

/* ============================================
   DOM ELEMENTS
   ============================================ */
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

/* ============================================
   UPDATE UI WITH USER DATA - IMMEDIATE
   ============================================ */
function updateUIWithUserData(data) {
  console.log("📝 Updating UI with user data:", data);
  console.log("📝 Data username:", data.username);
  console.log("📝 Data email:", data.email);
  
  // Update sidebar
  if (profileUsername) {
    profileUsername.textContent = data.username || 'User';
    console.log("  ✅ profileUsername updated to:", profileUsername.textContent);
  }
  if (profileEmailDisplay) {
    profileEmailDisplay.textContent = data.email || 'user@email.com';
    console.log("  ✅ profileEmailDisplay updated to:", profileEmailDisplay.textContent);
  }
  
  // Update profile view
  if (profileViewUsername) {
    profileViewUsername.textContent = data.username || 'User';
    console.log("  ✅ profileViewUsername updated to:", profileViewUsername.textContent);
  }
  if (profileViewEmail) {
    profileViewEmail.textContent = data.email || 'user@email.com';
    console.log("  ✅ profileViewEmail updated to:", profileViewEmail.textContent);
  }
  
  // Update account panel
  if (accountUsernameDisplay) {
    accountUsernameDisplay.textContent = data.username || 'User';
    console.log("  ✅ accountUsernameDisplay updated to:", accountUsernameDisplay.textContent);
  }
  if (accountEmailDisplay) {
    accountEmailDisplay.textContent = data.email || 'user@email.com';
    console.log("  ✅ accountEmailDisplay updated to:", accountEmailDisplay.textContent);
  }
  
  // Update form fields
  if (profileEmail) {
    profileEmail.value = data.email || '';
    console.log("  ✅ profileEmail value set to:", profileEmail.value);
  }
  if (profileUsernameInput) {
    profileUsernameInput.value = data.username || '';
    console.log("  ✅ profileUsernameInput value set to:", profileUsernameInput.value);
  }
  
  // Update profile photo
  if (profileImage) {
    const photoSrc = data.photo || DEFAULT_ICON;
    profileImage.src = photoSrc;
    console.log("  ✅ profileImage src set to:", photoSrc);
  }
  
  // Update navigation profile photo
  const navProfilePhoto = document.getElementById("navProfilePhoto");
  if (navProfilePhoto) {
    const photoSrc = data.photo || DEFAULT_ICON;
    navProfilePhoto.src = photoSrc;
    console.log("  ✅ navProfilePhoto src set to:", photoSrc);
  }
  
  const navUsername = document.getElementById("navUsername");
  if (navUsername) {
    navUsername.textContent = data.username || 'Profile';
    console.log("  ✅ navUsername updated to:", navUsername.textContent);
  }
  
  // Update delete photo button
  updateDeletePhotoButton();
  
  console.log("✅ UI update complete!");
}

/* ============================================
   LOAD USER DATA FROM SERVER
   ============================================ */
async function loadUserDataFromServer() {
  try {
    console.log("🔄 Loading user data from server for:", loggedInEmail);
    
    const res = await fetch("/api/get-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: loggedInEmail })
    });

    console.log("📡 Server response status:", res.status);
    
    const data = await res.json();
    console.log("📡 Server response data:", data);
    
    if (!res.ok) throw new Error(data.error);

    currentUser = data;
    localStorage.setItem("userData", JSON.stringify(data));

    console.log("✅ User data loaded from server:", currentUser);
    
    // Update all UI elements
    updateUIWithUserData(data);
    
    // Ensure profile view is visible, panels are hidden
    showProfileView();
    
    return true;
    
  } catch (error) {
    console.error("❌ Server load error:", error);
    // Try to use cached data if available
    if (currentUser) {
      console.log("⚠️ Using cached user data:", currentUser);
      updateUIWithUserData(currentUser);
      showProfileView();
      return true;
    } else {
      console.error("❌ No cached data available!");
      toastError("Failed to load user data.");
      return false;
    }
  }
}

/* ============================================
   IMMEDIATE UI UPDATE ON PAGE LOAD
   ============================================ */
// Immediately update UI with cached data
if (currentUser) {
  console.log("📦 Immediately updating UI with cached data:", currentUser);
  updateUIWithUserData(currentUser);
  showProfileView();
}

// Then load from server to get latest data
document.addEventListener('DOMContentLoaded', function() {
  console.log("📄 DOM fully loaded, loading from server...");
  loadUserDataFromServer();
});

/* ============================================
   MOBILE MODAL FUNCTIONS
   ============================================ */
function openMobileModal(contentHTML) {
  if (!mobileModal || !mobileModalContent) {
    console.error("❌ Mobile modal elements not found!");
    return;
  }
  
  console.log("📱 Opening mobile modal");
  mobileModalContent.innerHTML = contentHTML;
  mobileModal.classList.add('open');
  document.body.style.overflow = 'hidden';
  
  // Re-bind any buttons inside the modal content
  setTimeout(function() {
    bindModalButtons();
  }, 150);
}

function closeMobileModal() {
  if (!mobileModal) return;
  console.log("📱 Closing mobile modal");
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
  console.log("🔗 Binding modal buttons...");
  
  const modalSaveBtn = document.getElementById('modalSaveAccountBtn');
  if (modalSaveBtn) {
    console.log("  Found modalSaveAccountBtn");
    modalSaveBtn.addEventListener('click', async function(e) {
      e.preventDefault();
      await saveAccountHandler();
    });
  }
  
  const modalChangePwdBtn = document.getElementById('modalChangePasswordBtn');
  if (modalChangePwdBtn) {
    console.log("  Found modalChangePasswordBtn");
    modalChangePwdBtn.addEventListener('click', async function(e) {
      e.preventDefault();
      await changePasswordHandler();
    });
  }
  
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
  
  const modalLogoutBtn = document.getElementById('modalLogoutBtn');
  if (modalLogoutBtn) {
    console.log("  Found modalLogoutBtn");
    modalLogoutBtn.addEventListener('click', async function(e) {
      e.preventDefault();
      const confirm = await showConfirmModal(
        '🚪 Log Out',
        'Are you sure you want to log out?',
        'Yes, Log Out',
        'Cancel'
      );
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
  
  const modalDeleteBtn = document.getElementById('modalDeleteAccountBtn');
  if (modalDeleteBtn) {
    console.log("  Found modalDeleteAccountBtn");
    modalDeleteBtn.addEventListener('click', async function(e) {
      e.preventDefault();
      await deleteAccountHandler();
    });
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
  console.log("📋 showAccountPanel called, isMobile:", isMobile());
  
  if (isMobile()) {
    const accountPanelEl = document.getElementById('accountPanel');
    if (!accountPanelEl) {
      console.error("❌ accountPanel element not found!");
      return;
    }
    
    let accountHTML = accountPanelEl.innerHTML;
    console.log("📋 Account HTML length:", accountHTML.length);
    
    // Replace IDs for modal compatibility
    accountHTML = accountHTML
      .replace(/id="saveAccountBtn"/g, 'id="modalSaveAccountBtn"')
      .replace(/id="accountCurrentPassword"/g, 'id="modalAccountCurrentPassword"')
      .replace(/id="profileEmail"/g, 'id="modalProfileEmail"')
      .replace(/id="profileUsernameInput"/g, 'id="modalProfileUsernameInput"')
      .replace(/id="toggleAccountPassword"/g, 'id="modalToggleAccountPassword"')
      .replace(/class="password-toggle-btn"/g, 'class="password-toggle-btn modal-password-toggle"')
      .replace(/for="accountCurrentPassword"/g, 'for="modalAccountCurrentPassword"')
      .replace(/for="profileEmail"/g, 'for="modalProfileEmail"')
      .replace(/for="profileUsernameInput"/g, 'for="modalProfileUsernameInput"');
    
    openMobileModal(`
      <h2><i class="fa-solid fa-user"></i> Account Information</h2>
      ${accountHTML}
    `);
  } else {
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
}

function showSecurityPanel() {
  console.log("🔒 showSecurityPanel called, isMobile:", isMobile());
  
  if (isMobile()) {
    const securityPanelEl = document.getElementById('securityPanel');
    if (!securityPanelEl) {
      console.error("❌ securityPanel element not found!");
      return;
    }
    
    let securityHTML = securityPanelEl.innerHTML;
    console.log("🔒 Security HTML length:", securityHTML.length);
    
    // Replace IDs for modal compatibility
    securityHTML = securityHTML
      .replace(/id="changePasswordBtn"/g, 'id="modalChangePasswordBtn"')
      .replace(/id="currentPassword"/g, 'id="modalCurrentPassword"')
      .replace(/id="newPassword"/g, 'id="modalNewPassword"')
      .replace(/id="confirmPassword"/g, 'id="modalConfirmPassword"')
      .replace(/id="toggleCurrentPassword"/g, 'id="modalToggleCurrentPassword"')
      .replace(/id="toggleNewPassword"/g, 'id="modalToggleNewPassword"')
      .replace(/id="toggleConfirmPassword"/g, 'id="modalToggleConfirmPassword"')
      .replace(/id="logoutBtn"/g, 'id="modalLogoutBtn"')
      .replace(/id="deleteAccountBtn"/g, 'id="modalDeleteAccountBtn"')
      .replace(/class="password-toggle-btn"/g, 'class="password-toggle-btn modal-password-toggle"')
      .replace(/for="currentPassword"/g, 'for="modalCurrentPassword"')
      .replace(/for="newPassword"/g, 'for="modalNewPassword"')
      .replace(/for="confirmPassword"/g, 'for="modalConfirmPassword"');
    
    openMobileModal(`
      <h2><i class="fa-solid fa-shield-halved"></i> Security Settings</h2>
      ${securityHTML}
    `);
  } else {
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

showProfileView();

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
   SAVE ACCOUNT HANDLER
   ============================================ */
async function saveAccountHandler() {
  console.log("💾 saveAccountHandler called");
  
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

if (saveAccountBtn) {
  console.log("✅ Setting up Save Account");
  saveAccountBtn.addEventListener("click", saveAccountHandler);
}

/* ============================================
   CHANGE PASSWORD HANDLER
   ============================================ */
async function changePasswordHandler() {
  console.log("🔑 changePasswordHandler called");
  
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

    closeMobileModal();

    const curPassInput = document.getElementById("currentPassword");
    const newPassInput = document.getElementById("newPassword");
    const confPassInput = document.getElementById("confirmPassword");
    if (curPassInput) curPassInput.value = "";
    if (newPassInput) newPassInput.value = "";
    if (confPassInput) confPassInput.value = "";

  } catch (error) {
    if (changeBtn) {
      changeBtn.disabled = false;
      changeBtn.textContent = "Change Password";
    }
    toastError(error.message || "Failed to change password.");
    console.error("Change password error:", error);
  }
}

if (changePasswordBtn) {
  console.log("✅ Setting up Change Password");
  changePasswordBtn.addEventListener("click", changePasswordHandler);
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
      closeMobileModal();
      setTimeout(() => {
        window.location.href = "index.html";
      }, 1500);
    }
  });
}

/* ============================================
   DELETE ACCOUNT HANDLER
   ============================================ */
async function deleteAccountHandler() {
  console.log("🗑️ deleteAccountHandler called");
  
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

  const deleteBtn = document.getElementById("deleteAccountBtn") || document.getElementById("modalDeleteAccountBtn");
  if (deleteBtn) {
    deleteBtn.disabled = true;
    deleteBtn.textContent = "Sending code...";
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
        toastWarning("Deletion cancelled. Refreshing page...");
        if (deleteBtn) {
          deleteBtn.disabled = false;
          deleteBtn.textContent = "Delete Account";
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

    const finalConfirm = await showConfirmModal(
      '⚠️ Final Confirmation',
      'Delete your account permanently?',
      'Yes, Delete',
      'Cancel'
    );
    
    if (!finalConfirm) {
      if (deleteBtn) {
        deleteBtn.disabled = false;
        deleteBtn.textContent = "Delete Account";
      }
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
    if (deleteBtn) {
      deleteBtn.disabled = false;
      deleteBtn.textContent = "Delete Account";
    }
    closeMobileModal();
    
    setTimeout(() => {
      window.location.href = "index.html";
    }, 2000);

  } catch (error) {
    if (deleteBtn) {
      deleteBtn.disabled = false;
      deleteBtn.textContent = "Delete Account";
    }
    toastError(error.message || "Failed to delete account.");
    console.error("Delete account error:", error);
  }
}

if (deleteAccountBtn) {
  deleteAccountBtn.addEventListener("click", deleteAccountHandler);
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

console.log("✅ Profile.js v100 loaded successfully");

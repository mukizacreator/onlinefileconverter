// ============================================
// SCRIPT.JS - VERSION 78 (FIXED)
// ============================================
console.log("🚀 script.js v78 LOADED!");

// ============================================
// CHECK IF WE'RE ON PROFILE PAGE
// Only redirect on profile page, not on index.html
// ============================================
const isProfilePage = window.location.pathname.includes('profile.html') || 
                      window.location.pathname.endsWith('/profile');

// If on profile page, check authentication
if (isProfilePage) {
  const loggedInEmail = localStorage.getItem("loggedInUser");
  if (!loggedInEmail) {
    console.log("🔒 No user logged in - redirecting to signin");
    window.location.href = "signin.html";
    // Exit immediately
    throw new Error("Redirecting to signin");
  }
} else {
  console.log("📄 Not on profile page - running normally without redirect");
}

// ============================================
// LOAD USER DATA (if logged in)
// ============================================
let currentUser = null;
const userData = localStorage.getItem("userData");
if (userData) {
  try {
    currentUser = JSON.parse(userData);
  } catch(e) {
    console.error("Error parsing userData:", e);
  }
}
console.log("Current user:", currentUser);

// ============================================
// FILE CONVERTER LOGIC - For index.html
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  // Only run converter on index.html
  if (!window.location.pathname.includes('index.html') && 
      window.location.pathname !== '/' && 
      window.location.pathname === '') {
    // Not on index.html, skip converter
    console.log("📄 Not on index.html - skipping converter initialization");
    return;
  }
  
  console.log("🔄 Initializing file converter...");
  
  const fileInput = document.getElementById('fileInput');
  const fileName = document.getElementById('fileName');
  const formatSelect = document.getElementById('formatSelect');
  const convertBtn = document.getElementById('convertBtn');
  const resultDiv = document.getElementById('result');

  if (!fileInput || !formatSelect || !convertBtn || !resultDiv) {
    console.log("❌ Converter elements not found on this page");
    return;
  }

  // File selection handler
  fileInput.addEventListener('change', function(e) {
    const file = this.files[0];
    if (file) {
      fileName.textContent = file.name;
    } else {
      fileName.textContent = 'No file chosen';
    }
  });

  // Convert button handler
  convertBtn.addEventListener('click', async function() {
    const file = fileInput.files[0];
    const format = formatSelect.value;

    if (!file) {
      toastError('Please select a file first.');
      return;
    }

    // Check file size limit for guests
    const loggedInEmail = localStorage.getItem("loggedInUser");
    const maxSize = loggedInEmail ? Infinity : 2 * 1024 * 1024; // 2MB for guests

    if (file.size > maxSize) {
      toastError(loggedInEmail ? 'File too large.' : 'Guest users are limited to 2MB. Please sign in for larger files.');
      return;
    }

    this.disabled = true;
    this.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Converting...';

    const formData = new FormData();
    formData.append('file', file);
    formData.append('format', format);

    try {
      const res = await fetch('/api/convert', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();

      if (res.ok && data.url) {
        resultDiv.innerHTML = `
          <a href="${data.url}" class="download-btn" download>
            <i class="fa-solid fa-download"></i> Download Converted File
          </a>
        `;
        toastSuccess('File converted successfully!');
      } else {
        toastError(data.error || 'Conversion failed.');
        resultDiv.innerHTML = `<p style="color:#ff6b6b;">Error: ${data.error || 'Conversion failed'}</p>`;
      }
    } catch (error) {
      toastError('Error: ' + error.message);
      resultDiv.innerHTML = `<p style="color:#ff6b6b;">Error: ${error.message}</p>`;
    } finally {
      this.disabled = false;
      this.innerHTML = '<i class="fa-solid fa-arrows-rotate"></i> Convert';
    }
  });
});

// ============================================
// PROFILE FUNCTIONS - Only run on profile.html
// ============================================
if (isProfilePage) {
  console.log("📄 On profile page - initializing profile system");

  // ============================================
  // PROFILE PAGE - AUTHENTICATION CHECK (already done above)
  // ============================================
  const loggedInEmail = localStorage.getItem("loggedInUser");
  if (!loggedInEmail) {
    // This should not happen due to the check above, but just in case
    window.location.href = "signin.html";
    throw new Error("Redirecting to signin");
  }

  // ============================================
  // DOM ELEMENTS
  // ============================================
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

  console.log("🔍 DOM Elements found:");
  console.log("  profileView:", !!profileView);
  console.log("  accountPanel:", !!accountPanel);
  console.log("  securityPanel:", !!securityPanel);
  console.log("  accountTab:", !!accountTab);
  console.log("  securityTab:", !!securityTab);

  // ============================================
  // MOBILE DETECTION
  // ============================================
  function isMobile() {
    return window.innerWidth <= 768;
  }

  console.log("📱 Is mobile:", isMobile());

  // ============================================
  // MODAL ELEMENTS - Using existing modal from HTML
  // ============================================
  var mobileModal = document.getElementById('mobileProfileModal');
  var mobileModalContent = document.getElementById('mobileModalContent');

  console.log("📱 Modal element exists:", !!mobileModal);

  // ============================================
  // MODAL FUNCTIONS
  // ============================================
  function openMobileModal(html) {
    if (!mobileModal || !mobileModalContent) {
      console.error("❌ Modal elements not found!");
      return;
    }
    console.log("📱 Opening modal");
    mobileModalContent.innerHTML = html;
    mobileModal.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(bindModalButtons, 200);
  }

  function closeMobileModal() {
    if (!mobileModal) return;
    console.log("📱 Closing modal");
    mobileModal.classList.remove('open');
    document.body.style.overflow = '';
    if (profileView) {
      profileView.style.display = 'block';
      profileView.classList.remove('hidden-panel');
    }
  }

  // Close button event
  var closeBtn = document.getElementById('mobileModalClose');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeMobileModal);
  }

  // Backdrop click
  if (mobileModal) {
    mobileModal.addEventListener('click', function(e) {
      if (e.target === this) {
        closeMobileModal();
      }
    });
  }

  // Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeMobileModal();
    }
  });

  function bindModalButtons() {
    var content = document.getElementById('mobileModalContent');
    if (!content) return;
    
    var buttons = content.querySelectorAll('button');
    buttons.forEach(function(btn) {
      if (btn.dataset.bound === 'true') return;
      btn.dataset.bound = 'true';
      
      var id = btn.id;
      
      if (id === 'saveAccountBtn') {
        btn.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          console.log("💾 Save Account clicked in modal");
          var modalPwd = document.getElementById('accountCurrentPassword');
          var modalEmail = document.getElementById('profileEmail');
          var modalUser = document.getElementById('profileUsernameInput');
          var mainPwd = document.getElementById('accountCurrentPassword');
          var mainEmail = document.getElementById('profileEmail');
          var mainUser = document.getElementById('profileUsernameInput');
          if (modalPwd && mainPwd) mainPwd.value = modalPwd.value;
          if (modalEmail && mainEmail) mainEmail.value = modalEmail.value;
          if (modalUser && mainUser) mainUser.value = modalUser.value;
          var mainBtn = document.getElementById('saveAccountBtn');
          if (mainBtn) mainBtn.click();
        });
      }
      else if (id === 'changePasswordBtn') {
        btn.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          console.log("🔑 Change Password clicked in modal");
          var modalCur = document.getElementById('currentPassword');
          var modalNew = document.getElementById('newPassword');
          var modalConf = document.getElementById('confirmPassword');
          var mainCur = document.getElementById('currentPassword');
          var mainNew = document.getElementById('newPassword');
          var mainConf = document.getElementById('confirmPassword');
          if (modalCur && mainCur) mainCur.value = modalCur.value;
          if (modalNew && mainNew) mainNew.value = modalNew.value;
          if (modalConf && mainConf) mainConf.value = modalConf.value;
          var mainBtn = document.getElementById('changePasswordBtn');
          if (mainBtn) mainBtn.click();
        });
      }
      else if (id === 'logoutBtn') {
        btn.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          console.log("🚪 Logout clicked in modal");
          var mainBtn = document.getElementById('logoutBtn');
          if (mainBtn) mainBtn.click();
        });
      }
      else if (id === 'deleteAccountBtn') {
        btn.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          console.log("🗑️ Delete Account clicked in modal");
          var mainBtn = document.getElementById('deleteAccountBtn');
          if (mainBtn) mainBtn.click();
        });
      }
      else if (btn.classList && btn.classList.contains('password-toggle-btn')) {
        btn.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          var wrapper = this.parentElement;
          var input = wrapper.querySelector('input');
          if (!input) {
            var id = this.id.replace('toggle', '');
            if (id) input = document.getElementById(id);
          }
          if (!input) return;
          var icon = this.querySelector('i');
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

  // ============================================
  // LOAD USER DATA FROM MONGODB
  // ============================================
  async function loadUserData() {
    const loggedInEmail = localStorage.getItem("loggedInUser");
    
    if (!loggedInEmail) {
      console.log("👤 No user logged in - skipping profile data load");
      return;
    }
    
    try {
      console.log("📡 Fetching user data for:", loggedInEmail);
      const res = await fetch("/api/get-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loggedInEmail })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      currentUser = data;
      localStorage.setItem("userData", JSON.stringify(data));

      console.log("✅ User data loaded:", currentUser);

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
      console.error("❌ Load user error:", error);
      toastError("Failed to load user data.");
    }
  }

  // ============================================
  // TAB SWITCHING FUNCTIONS
  // ============================================
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
    if (accountTab) {
      accountTab.classList.remove('active');
    }
    if (securityTab) {
      securityTab.classList.remove('active');
    }
    console.log("📋 Showing Profile View");
  }

  function showAccountPanel() {
    console.log("📋 showAccountPanel - isMobile:", isMobile());
    console.log("📋 accountPanel exists:", !!accountPanel);
    
    if (!accountPanel) {
      console.error("❌ accountPanel not found!");
      return;
    }
    
    // Hide profile view
    if (profileView) {
      profileView.style.display = "none";
      profileView.classList.add('hidden-panel');
    }
    
    // MOBILE: Open modal
    if (isMobile()) {
      var html = accountPanel.innerHTML;
      console.log("📋 Account HTML length:", html.length);
      html = html.replace(/<h2[^>]*>.*?<\/h2>/, '');
      openMobileModal('<h2><i class="fa-solid fa-user"></i> Account Information</h2>' + html);
      return;
    }
    
    // DESKTOP: Show inline
    console.log("💻 DESKTOP: Showing Account panel inline");
    accountPanel.style.display = "block";
    accountPanel.classList.add('active-panel');
    if (securityPanel) {
      securityPanel.style.display = "none";
      securityPanel.classList.remove('active-panel');
    }
    if (accountTab) {
      accountTab.classList.add('active');
    }
    if (securityTab) {
      securityTab.classList.remove('active');
    }
  }

  function showSecurityPanel() {
    console.log("🔒 showSecurityPanel - isMobile:", isMobile());
    console.log("🔒 securityPanel exists:", !!securityPanel);
    
    if (!securityPanel) {
      console.error("❌ securityPanel not found!");
      return;
    }
    
    // Hide profile view
    if (profileView) {
      profileView.style.display = "none";
      profileView.classList.add('hidden-panel');
    }
    
    // MOBILE: Open modal
    if (isMobile()) {
      var html = securityPanel.innerHTML;
      console.log("🔒 Security HTML length:", html.length);
      html = html.replace(/<h2[^>]*>.*?<\/h2>/, '');
      openMobileModal('<h2><i class="fa-solid fa-shield-halved"></i> Security Settings</h2>' + html);
      return;
    }
    
    // DESKTOP: Show inline
    console.log("💻 DESKTOP: Showing Security panel inline");
    securityPanel.style.display = "block";
    securityPanel.classList.add('active-panel');
    if (accountPanel) {
      accountPanel.style.display = "none";
      accountPanel.classList.remove('active-panel');
    }
    if (securityTab) {
      securityTab.classList.add('active');
    }
    if (accountTab) {
      accountTab.classList.remove('active');
    }
  }

  // ============================================
  // DELETE PHOTO BUTTON
  // ============================================
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
        
        const loggedInEmail = localStorage.getItem("loggedInUser");
        if (!loggedInEmail) return;
        
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

  // ============================================
  // ACCOUNT & SECURITY TABS
  // ============================================
  console.log("Setting up tabs...");

  // Ensure default state: Profile View visible, panels hidden
  showProfileView();

  // ===== ACCOUNT TAB =====
  if (accountTab) {
    console.log("✅ Adding Account tab listener");
    
    // Remove any existing listeners by cloning
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
    console.warn("⚠️ accountTab element not found!");
  }

  // ===== SECURITY TAB =====
  if (securityTab) {
    console.log("✅ Adding Security tab listener");
    
    // Remove any existing listeners by cloning
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
    console.warn("⚠️ securityTab element not found!");
  }

  // ============================================
  // PASSWORD TOGGLES
  // ============================================
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

  // ============================================
  // UPLOAD PHOTO
  // ============================================
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
      
      const loggedInEmail = localStorage.getItem("loggedInUser");
      if (!loggedInEmail) {
        toastError("You must be logged in to upload a photo.");
        uploadPhotoBtn.textContent = "Upload Photo";
        uploadPhotoBtn.disabled = false;
        return;
      }
      
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

  // ============================================
  // SAVE ACCOUNT - WITH VERIFICATION LOOP
  // ============================================
  if (saveAccountBtn) {
    console.log("✅ Setting up Save Account");
    
    saveAccountBtn.onclick = async function(e) {
      e.preventDefault();
      console.log("💾 Save clicked");
      
      const loggedInEmail = localStorage.getItem("loggedInUser");
      if (!loggedInEmail) {
        toastError("You must be logged in.");
        return;
      }
      
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
          code = await showVerificationModal(currentUser.email);
          
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
        
        closeMobileModal();
        
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

  // ============================================
  // CHANGE PASSWORD - WITH VERIFICATION LOOP
  // ============================================
  if (changePasswordBtn) {
    changePasswordBtn.addEventListener("click", async function() {
      const loggedInEmail = localStorage.getItem("loggedInUser");
      if (!loggedInEmail) {
        toastError("You must be logged in.");
        return;
      }
      
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
          code = await showVerificationModal(currentUser.email);
          
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
        
        closeMobileModal();

      } catch (error) {
        toastError(error.message || "Failed to change password.");
        this.disabled = false;
        this.textContent = "Change Password";
        console.error("Change password error:", error);
      }
    });
  }

  // ============================================
  // LOGOUT - WITH REFRESH ON CANCEL
  // ============================================
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

  // ============================================
  // DELETE ACCOUNT - WITH VERIFICATION LOOP
  // ============================================
  if (deleteAccountBtn) {
    deleteAccountBtn.addEventListener("click", async function(e) {
      e.preventDefault();
      
      const loggedInEmail = localStorage.getItem("loggedInUser");
      if (!loggedInEmail) {
        toastError("You must be logged in.");
        return;
      }
      
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

  // ============================================
  // CLICKABLE PROFILE PICTURE - ENLARGE
  // ============================================
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

  // ============================================
  // INITIALIZE PROFILE PAGE
  // ============================================
  console.log("✅ Initializing profile page...");
  loadUserData();

  console.log("✅ Profile system initialized successfully");
  console.log("📱 isMobile():", isMobile());
  console.log("📱 mobileModal exists:", !!document.getElementById('mobileProfileModal'));
  console.log("📄 Current page:", window.location.pathname);

} else {
  console.log("📄 Not on profile page - profile system skipped");
}

console.log("✅ script.js v78 loaded successfully");

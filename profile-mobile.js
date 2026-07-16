// ============================================
// PROFILE-MOBILE.JS - Mobile-only modal override
// Does NOT affect desktop behavior
// ============================================

(function() {
  'use strict';
  
  // Only run on mobile (≤ 768px)
  if (window.innerWidth > 768) {
    console.log("📱 profile-mobile: Desktop detected, skipping");
    return;
  }
  
  console.log("📱 profile-mobile: Mobile detected, activating modal mode");
  
  // Wait for profile.js to fully load and initialize
  var checkInterval = setInterval(function() {
    // Check if profile.js has finished loading
    var accountTab = document.getElementById('accountTab');
    var securityTab = document.getElementById('securityTab');
    var profileView = document.getElementById('profileView');
    var accountPanel = document.getElementById('accountPanel');
    var securityPanel = document.getElementById('securityPanel');
    
    if (!accountTab || !securityTab || !profileView || !accountPanel || !securityPanel) {
      return; // Elements not ready yet
    }
    
    clearInterval(checkInterval);
    console.log("📱 profile-mobile: DOM ready, setting up mobile modals");
    
    // ============================================
    // GET OR CREATE MODAL ELEMENTS
    // ============================================
    var modal = document.getElementById('mobileProfileModal');
    var modalContent = document.getElementById('mobileModalContent');
    var modalClose = document.getElementById('mobileModalClose');
    
    // If modal doesn't exist, create it
    if (!modal) {
      console.log("📱 profile-mobile: Creating modal elements");
      
      modal = document.createElement('div');
      modal.id = 'mobileProfileModal';
      modal.className = 'mobile-profile-modal';
      modal.style.cssText = 'display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);z-index:99998;justify-content:center;align-items:center;padding:20px;';
      
      var modalInner = document.createElement('div');
      modalInner.className = 'mobile-profile-modal-content';
      modalInner.style.cssText = 'background:rgba(25,35,45,0.98);border:1px solid rgba(255,255,255,0.1);border-radius:20px;padding:24px 28px;max-width:500px;width:100%;max-height:90vh;overflow-y:auto;position:relative;';
      
      var closeBtn = document.createElement('button');
      closeBtn.id = 'mobileModalClose';
      closeBtn.className = 'mobile-profile-modal-close';
      closeBtn.innerHTML = '&times;';
      closeBtn.style.cssText = 'position:absolute;top:12px;right:16px;background:none;border:none;color:#aaa;font-size:1.8rem;cursor:pointer;transition:0.3s;padding:4px 8px;border-radius:8px;';
      
      var contentDiv = document.createElement('div');
      contentDiv.id = 'mobileModalContent';
      
      modalInner.appendChild(closeBtn);
      modalInner.appendChild(contentDiv);
      modal.appendChild(modalInner);
      document.body.appendChild(modal);
      
      modal = document.getElementById('mobileProfileModal');
      modalContent = document.getElementById('mobileModalContent');
      modalClose = document.getElementById('mobileModalClose');
      
      console.log("📱 profile-mobile: Modal elements created");
    }
    
    // ============================================
    // MODAL FUNCTIONS
    // ============================================
    function openModal(contentHTML) {
      if (!modal || !modalContent) return;
      
      modalContent.innerHTML = contentHTML;
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
      
      // Setup event delegation after modal opens
      setTimeout(function() {
        setupModalEvents();
      }, 150);
    }
    
    function closeModal() {
      if (!modal) return;
      modal.style.display = 'none';
      document.body.style.overflow = '';
    }
    
    // ============================================
    // MODAL EVENT DELEGATION
    // ============================================
    function setupModalEvents() {
      var content = document.getElementById('mobileModalContent');
      if (!content) return;
      
      // Remove existing listeners by cloning
      var newContent = content.cloneNode(true);
      content.parentNode.replaceChild(newContent, content);
      content = newContent;
      
      content.addEventListener('click', function(e) {
        var target = e.target;
        var button = target.closest('button');
        if (!button) return;
        
        var buttonId = button.id;
        console.log("🔘 Modal button clicked:", buttonId);
        
        // SAVE ACCOUNT BUTTON
        if (buttonId === 'saveAccountBtn') {
          e.preventDefault();
          console.log("💾 Save Account clicked in modal");
          
          // Get values from modal inputs
          var modalPassword = document.getElementById('accountCurrentPassword') || document.getElementById('modalAccountCurrentPassword');
          var modalEmail = document.getElementById('profileEmail') || document.getElementById('modalProfileEmail');
          var modalUsername = document.getElementById('profileUsernameInput') || document.getElementById('modalProfileUsernameInput');
          
          // If modal inputs have different IDs, try to find them
          if (!modalPassword) {
            modalPassword = document.querySelector('#mobileModalContent #accountCurrentPassword');
          }
          if (!modalEmail) {
            modalEmail = document.querySelector('#mobileModalContent #profileEmail');
          }
          if (!modalUsername) {
            modalUsername = document.querySelector('#mobileModalContent #profileUsernameInput');
          }
          
          // If we found modal inputs, copy values to main inputs then trigger click
          var mainPassword = document.getElementById('accountCurrentPassword');
          var mainEmail = document.getElementById('profileEmail');
          var mainUsername = document.getElementById('profileUsernameInput');
          var mainSaveBtn = document.getElementById('saveAccountBtn');
          
          if (modalPassword && mainPassword) {
            mainPassword.value = modalPassword.value;
          }
          if (modalEmail && mainEmail) {
            mainEmail.value = modalEmail.value;
          }
          if (modalUsername && mainUsername) {
            mainUsername.value = modalUsername.value;
          }
          
          if (mainSaveBtn) {
            mainSaveBtn.click();
          } else {
            console.error("❌ saveAccountBtn not found in main DOM");
          }
          return;
        }
        
        // CHANGE PASSWORD BUTTON
        if (buttonId === 'changePasswordBtn') {
          e.preventDefault();
          console.log("🔑 Change Password clicked in modal");
          
          // Get values from modal inputs
          var modalCurPass = document.getElementById('currentPassword') || document.getElementById('modalCurrentPassword');
          var modalNewPass = document.getElementById('newPassword') || document.getElementById('modalNewPassword');
          var modalConfPass = document.getElementById('confirmPassword') || document.getElementById('modalConfirmPassword');
          
          // If modal inputs have different IDs, try to find them
          if (!modalCurPass) {
            modalCurPass = document.querySelector('#mobileModalContent #currentPassword');
          }
          if (!modalNewPass) {
            modalNewPass = document.querySelector('#mobileModalContent #newPassword');
          }
          if (!modalConfPass) {
            modalConfPass = document.querySelector('#mobileModalContent #confirmPassword');
          }
          
          var mainCurPass = document.getElementById('currentPassword');
          var mainNewPass = document.getElementById('newPassword');
          var mainConfPass = document.getElementById('confirmPassword');
          var mainChangeBtn = document.getElementById('changePasswordBtn');
          
          if (modalCurPass && mainCurPass) {
            mainCurPass.value = modalCurPass.value;
          }
          if (modalNewPass && mainNewPass) {
            mainNewPass.value = modalNewPass.value;
          }
          if (modalConfPass && mainConfPass) {
            mainConfPass.value = modalConfPass.value;
          }
          
          if (mainChangeBtn) {
            mainChangeBtn.click();
          } else {
            console.error("❌ changePasswordBtn not found in main DOM");
          }
          return;
        }
        
        // LOGOUT BUTTON
        if (buttonId === 'logoutBtn') {
          e.preventDefault();
          console.log("🚪 Logout clicked in modal");
          var mainLogoutBtn = document.getElementById('logoutBtn');
          if (mainLogoutBtn) {
            mainLogoutBtn.click();
          }
          return;
        }
        
        // DELETE ACCOUNT BUTTON
        if (buttonId === 'deleteAccountBtn') {
          e.preventDefault();
          console.log("🗑️ Delete Account clicked in modal");
          var mainDeleteBtn = document.getElementById('deleteAccountBtn');
          if (mainDeleteBtn) {
            mainDeleteBtn.click();
          }
          return;
        }
        
        // PASSWORD TOGGLE
        if (button.classList.contains('password-toggle-btn')) {
          e.preventDefault();
          var parentWrapper = button.parentElement;
          var input = parentWrapper.querySelector('input');
          if (!input) {
            var inputId = buttonId.replace('toggle', '');
            if (inputId) input = document.getElementById(inputId);
          }
          if (!input) return;
          var icon = button.querySelector('i');
          if (input.type === 'password') {
            input.type = 'text';
            if (icon) { icon.classList.remove('fa-eye'); icon.classList.add('fa-eye-slash'); }
          } else {
            input.type = 'password';
            if (icon) { icon.classList.remove('fa-eye-slash'); icon.classList.add('fa-eye'); }
          }
          return;
        }
      });
      
      console.log("✅ Modal event delegation setup complete");
    }
    
    // ============================================
    // OVERRIDE TAB BEHAVIOR - MOBILE ONLY
    // ============================================
    function setupMobileTabs() {
      // Remove existing listeners by cloning tabs
      var newAccountTab = accountTab.cloneNode(true);
      accountTab.parentNode.replaceChild(newAccountTab, accountTab);
      accountTab = newAccountTab;
      
      var newSecurityTab = securityTab.cloneNode(true);
      securityTab.parentNode.replaceChild(newSecurityTab, securityTab);
      securityTab = newSecurityTab;
      
      // ACCOUNT TAB - opens Account modal
      accountTab.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log("📱 Mobile: Account tab clicked - opening Account modal");
        
        // Hide profile view
        if (profileView) {
          profileView.style.display = "none";
          profileView.classList.add('hidden-panel');
        }
        
        // Get account panel content
        if (accountPanel) {
          var html = accountPanel.innerHTML;
          // Remove h2 from panel (modal adds its own)
          html = html.replace(/<h2[^>]*>.*?<\/h2>/, '');
          openModal('<h2><i class="fa-solid fa-user"></i> Account Information</h2>' + html);
        }
      });
      
      // SECURITY TAB - opens Security modal
      securityTab.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log("📱 Mobile: Security tab clicked - opening Security modal");
        
        // Hide profile view
        if (profileView) {
          profileView.style.display = "none";
          profileView.classList.add('hidden-panel');
        }
        
        // Get security panel content
        if (securityPanel) {
          var html = securityPanel.innerHTML;
          // Remove h2 from panel (modal adds its own)
          html = html.replace(/<h2[^>]*>.*?<\/h2>/, '');
          openModal('<h2><i class="fa-solid fa-shield-halved"></i> Security Settings</h2>' + html);
        }
      });
      
      console.log("📱 profile-mobile: Mobile tabs configured");
    }
    
    // ============================================
    // CLOSE MODAL EVENTS
    // ============================================
    if (modalClose) {
      modalClose.addEventListener('click', function() {
        closeModal();
        // Show profile view again
        if (profileView) {
          profileView.style.display = "block";
          profileView.classList.remove('hidden-panel');
        }
      });
    }
    
    if (modal) {
      modal.addEventListener('click', function(e) {
        if (e.target === this) {
          closeModal();
          if (profileView) {
            profileView.style.display = "block";
            profileView.classList.remove('hidden-panel');
          }
        }
      });
    }
    
    // Close modal on Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        closeModal();
        if (profileView) {
          profileView.style.display = "block";
          profileView.classList.remove('hidden-panel');
        }
      }
    });
    
    // Close modal on resize to desktop
    window.addEventListener('resize', function() {
      if (window.innerWidth > 768) {
        closeModal();
        if (profileView) {
          profileView.style.display = "block";
          profileView.classList.remove('hidden-panel');
        }
      }
    });
    
    // ============================================
    // ACTIVATE MOBILE MODE
    // ============================================
    setupMobileTabs();
    
    console.log("📱 profile-mobile: Mobile mode activated successfully!");
    console.log("📱 profile-mobile: Account tab → Account modal, Security tab → Security modal");
    
  }, 300);
  
})();

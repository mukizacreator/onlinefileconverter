// ============================================
// PROFILE-MOBILE.JS - FINAL WORKING SOLUTION
// ============================================

(function() {
  'use strict';
  
  // Only run on mobile (≤ 768px)
  if (window.innerWidth > 768) {
    console.log("📱 profile-mobile: Desktop detected, skipping");
    return;
  }
  
  console.log("📱 profile-mobile: Mobile detected, activating modal mode");
  
  // Wait for DOM to be fully ready
  var checkInterval = setInterval(function() {
    var accountTab = document.getElementById('accountTab');
    var securityTab = document.getElementById('securityTab');
    var profileView = document.getElementById('profileView');
    var accountPanel = document.getElementById('accountPanel');
    var securityPanel = document.getElementById('securityPanel');
    
    if (!accountTab || !securityTab || !profileView || !accountPanel || !securityPanel) {
      return;
    }
    
    clearInterval(checkInterval);
    console.log("📱 profile-mobile: All elements ready");
    
    // ============================================
    // GET OR CREATE MODAL ELEMENTS
    // ============================================
    var modal = document.getElementById('mobileProfileModal');
    var modalContent = document.getElementById('mobileModalContent');
    var modalClose = document.getElementById('mobileModalClose');
    
    if (!modal) {
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
    }
    
    // ============================================
    // MODAL FUNCTIONS
    // ============================================
    function openModal(contentHTML) {
      if (!modal || !modalContent) return;
      
      modalContent.innerHTML = contentHTML;
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
      
      // Bind modal buttons after content loads
      setTimeout(function() {
        bindModalButtons();
      }, 200);
    }
    
    function closeModal() {
      if (!modal) return;
      modal.style.display = 'none';
      document.body.style.overflow = '';
      if (profileView) {
        profileView.style.display = 'block';
        profileView.classList.remove('hidden-panel');
      }
    }
    
    // ============================================
    // BIND MODAL BUTTONS - USING ORIGINAL HANDLERS
    // ============================================
    function bindModalButtons() {
      console.log("🔗 Binding modal buttons");
      
      var content = document.getElementById('mobileModalContent');
      if (!content) return;
      
      // Find all buttons in modal
      var buttons = content.querySelectorAll('button');
      console.log("  Found", buttons.length, "buttons");
      
      buttons.forEach(function(btn) {
        var btnId = btn.id;
        
        // Remove existing listeners by cloning
        var newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        btn = newBtn;
        
        // --- SAVE ACCOUNT ---
        if (btnId === 'saveAccountBtn') {
          btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log("💾 Save Account clicked");
            
            // Get values from modal inputs
            var modalPassword = document.getElementById('accountCurrentPassword');
            var modalEmail = document.getElementById('profileEmail');
            var modalUsername = document.getElementById('profileUsernameInput');
            
            // Copy values to main DOM inputs
            var mainPassword = document.getElementById('accountCurrentPassword');
            var mainEmail = document.getElementById('profileEmail');
            var mainUsername = document.getElementById('profileUsernameInput');
            
            if (modalPassword && mainPassword) {
              mainPassword.value = modalPassword.value;
            }
            if (modalEmail && mainEmail) {
              mainEmail.value = modalEmail.value;
            }
            if (modalUsername && mainUsername) {
              mainUsername.value = modalUsername.value;
            }
            
            // Trigger the main button click
            var mainBtn = document.getElementById('saveAccountBtn');
            if (mainBtn) {
              mainBtn.click();
              console.log("  ✅ Main save button clicked");
            }
          });
          console.log("  ✅ Save Account bound");
          return;
        }
        
        // --- CHANGE PASSWORD ---
        if (btnId === 'changePasswordBtn') {
          btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log("🔑 Change Password clicked");
            
            // Get values from modal inputs
            var modalCurPass = document.getElementById('currentPassword');
            var modalNewPass = document.getElementById('newPassword');
            var modalConfPass = document.getElementById('confirmPassword');
            
            // Copy values to main DOM inputs
            var mainCurPass = document.getElementById('currentPassword');
            var mainNewPass = document.getElementById('newPassword');
            var mainConfPass = document.getElementById('confirmPassword');
            
            if (modalCurPass && mainCurPass) {
              mainCurPass.value = modalCurPass.value;
            }
            if (modalNewPass && mainNewPass) {
              mainNewPass.value = modalNewPass.value;
            }
            if (modalConfPass && mainConfPass) {
              mainConfPass.value = modalConfPass.value;
            }
            
            // Trigger the main button click
            var mainBtn = document.getElementById('changePasswordBtn');
            if (mainBtn) {
              mainBtn.click();
              console.log("  ✅ Main change password button clicked");
            }
          });
          console.log("  ✅ Change Password bound");
          return;
        }
        
        // --- LOGOUT ---
        if (btnId === 'logoutBtn') {
          btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log("🚪 Logout clicked");
            var mainBtn = document.getElementById('logoutBtn');
            if (mainBtn) {
              mainBtn.click();
              console.log("  ✅ Main logout button clicked");
            }
          });
          console.log("  ✅ Logout bound");
          return;
        }
        
        // --- DELETE ACCOUNT ---
        if (btnId === 'deleteAccountBtn') {
          btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log("🗑️ Delete Account clicked");
            var mainBtn = document.getElementById('deleteAccountBtn');
            if (mainBtn) {
              mainBtn.click();
              console.log("  ✅ Main delete button clicked");
            }
          });
          console.log("  ✅ Delete Account bound");
          return;
        }
        
        // --- PASSWORD TOGGLE ---
        if (btn.classList && btn.classList.contains('password-toggle-btn')) {
          btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            var parentWrapper = this.parentElement;
            var input = parentWrapper.querySelector('input');
            if (!input) {
              var inputId = this.id.replace('toggle', '');
              if (inputId) input = document.getElementById(inputId);
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
          console.log("  ✅ Password toggle bound");
          return;
        }
      });
    }
    
    // ============================================
    // OVERRIDE TAB BEHAVIOR
    // ============================================
    function setupMobileTabs() {
      // Clone tabs to remove old listeners
      var newAccountTab = accountTab.cloneNode(true);
      accountTab.parentNode.replaceChild(newAccountTab, accountTab);
      accountTab = newAccountTab;
      
      var newSecurityTab = securityTab.cloneNode(true);
      securityTab.parentNode.replaceChild(newSecurityTab, securityTab);
      securityTab = newSecurityTab;
      
      // ACCOUNT TAB
      accountTab.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log("📱 Account tab clicked");
        
        if (profileView) {
          profileView.style.display = 'none';
          profileView.classList.add('hidden-panel');
        }
        
        if (accountPanel) {
          var html = accountPanel.innerHTML;
          html = html.replace(/<h2[^>]*>.*?<\/h2>/, '');
          openModal('<h2><i class="fa-solid fa-user"></i> Account Information</h2>' + html);
        }
      });
      
      // SECURITY TAB
      securityTab.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log("📱 Security tab clicked");
        
        if (profileView) {
          profileView.style.display = 'none';
          profileView.classList.add('hidden-panel');
        }
        
        if (securityPanel) {
          var html = securityPanel.innerHTML;
          html = html.replace(/<h2[^>]*>.*?<\/h2>/, '');
          openModal('<h2><i class="fa-solid fa-shield-halved"></i> Security Settings</h2>' + html);
        }
      });
      
      console.log("📱 profile-mobile: Tabs configured");
    }
    
    // ============================================
    // CLOSE MODAL EVENTS
    // ============================================
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
    
    window.addEventListener('resize', function() {
      if (window.innerWidth > 768) closeModal();
    });
    
    // ============================================
    // ACTIVATE
    // ============================================
    setupMobileTabs();
    
    console.log("📱 profile-mobile: Mobile mode activated successfully!");
    
  }, 500);
  
})();

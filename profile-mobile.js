// ============================================
// PROFILE-MOBILE.JS - FINAL WORKING SOLUTION
// Completely overrides tab behavior on mobile
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
    var saveAccountBtn = document.getElementById('saveAccountBtn');
    var changePasswordBtn = document.getElementById('changePasswordBtn');
    var logoutBtn = document.getElementById('logoutBtn');
    var deleteAccountBtn = document.getElementById('deleteAccountBtn');
    
    if (!accountTab || !securityTab || !profileView || !accountPanel || !securityPanel) {
      return;
    }
    
    clearInterval(checkInterval);
    console.log("📱 profile-mobile: All elements ready");
    
    // ============================================
    // REMOVE EXISTING TAB LISTENERS BY CLONING
    // This removes the listeners from profile.js
    // ============================================
    var newAccountTab = accountTab.cloneNode(true);
    accountTab.parentNode.replaceChild(newAccountTab, accountTab);
    accountTab = newAccountTab;
    
    var newSecurityTab = securityTab.cloneNode(true);
    securityTab.parentNode.replaceChild(newSecurityTab, securityTab);
    securityTab = newSecurityTab;
    
    console.log("📱 profile-mobile: Removed original tab listeners");
    
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
      console.log("📱 profile-mobile: Created modal elements");
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
      // Show profile view again
      if (profileView) {
        profileView.style.display = 'block';
        profileView.classList.remove('hidden-panel');
      }
    }
    
    // ============================================
    // BIND MODAL BUTTONS
    // ============================================
    function bindModalButtons() {
      console.log("🔗 Binding modal buttons");
      
      var content = document.getElementById('mobileModalContent');
      if (!content) return;
      
      // Find all buttons in modal
      var buttons = content.querySelectorAll('button');
      console.log("  Found", buttons.length, "buttons in modal");
      
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
            console.log("💾 Save Account clicked in modal");
            
            // Get values from modal inputs
            var modalPassword = document.getElementById('accountCurrentPassword');
            var modalEmail = document.getElementById('profileEmail');
            var modalUsername = document.getElementById('profileUsernameInput');
            
            // Copy values to main DOM inputs (which profile.js uses)
            var mainPassword = document.getElementById('accountCurrentPassword');
            var mainEmail = document.getElementById('profileEmail');
            var mainUsername = document.getElementById('profileUsernameInput');
            
            if (modalPassword && mainPassword) {
              mainPassword.value = modalPassword.value;
              console.log("  Copied password to main input");
            }
            if (modalEmail && mainEmail) {
              mainEmail.value = modalEmail.value;
              console.log("  Copied email to main input");
            }
            if (modalUsername && mainUsername) {
              mainUsername.value = modalUsername.value;
              console.log("  Copied username to main input");
            }
            
            // Find the main save button and click it
            var mainBtn = document.getElementById('saveAccountBtn');
            if (mainBtn) {
              mainBtn.click();
              console.log("  ✅ Main save button clicked");
            } else {
              console.error("  ❌ Main save button not found");
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
            console.log("🔑 Change Password clicked in modal");
            
            // Get values from modal inputs
            var modalCurPass = document.getElementById('currentPassword');
            var modalNewPass = document.getElementById('newPassword');
            var modalConfPass = document.getElementById('confirmPassword');
            
            // Copy values to main DOM inputs (which profile.js uses)
            var mainCurPass = document.getElementById('currentPassword');
            var mainNewPass = document.getElementById('newPassword');
            var mainConfPass = document.getElementById('confirmPassword');
            
            if (modalCurPass && mainCurPass) {
              mainCurPass.value = modalCurPass.value;
              console.log("  Copied current password to main input");
            }
            if (modalNewPass && mainNewPass) {
              mainNewPass.value = modalNewPass.value;
              console.log("  Copied new password to main input");
            }
            if (modalConfPass && mainConfPass) {
              mainConfPass.value = modalConfPass.value;
              console.log("  Copied confirm password to main input");
            }
            
            var mainBtn = document.getElementById('changePasswordBtn');
            if (mainBtn) {
              mainBtn.click();
              console.log("  ✅ Main change password button clicked");
            } else {
              console.error("  ❌ Main change password button not found");
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
            console.log("🚪 Logout clicked in modal");
            var mainBtn = document.getElementById('logoutBtn');
            if (mainBtn) {
              mainBtn.click();
              console.log("  ✅ Main logout button clicked");
            } else {
              console.error("  ❌ Main logout button not found");
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
            console.log("🗑️ Delete Account clicked in modal");
            var mainBtn = document.getElementById('deleteAccountBtn');
            if (mainBtn) {
              mainBtn.click();
              console.log("  ✅ Main delete button clicked");
            } else {
              console.error("  ❌ Main delete button not found");
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
            console.log("  👁️ Password visibility toggled");
          });
          console.log("  ✅ Password toggle bound");
          return;
        }
      });
      
      console.log("✅ Modal buttons binding complete");
    }
    
    // ============================================
    // SETUP MOBILE TABS - COMPLETE OVERRIDE
    // ============================================
    function setupMobileTabs() {
      
      // ACCOUNT TAB - opens Account panel in modal
      accountTab.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log("📱 Account tab clicked - opening Account modal");
        
        // Hide profile view
        if (profileView) {
          profileView.style.display = 'none';
          profileView.classList.add('hidden-panel');
        }
        
        // Get account panel content and open modal
        if (accountPanel) {
          var html = accountPanel.innerHTML;
          // Remove h2 from panel (modal adds its own)
          html = html.replace(/<h2[^>]*>.*?<\/h2>/, '');
          openModal('<h2><i class="fa-solid fa-user"></i> Account Information</h2>' + html);
        } else {
          console.error("❌ accountPanel not found");
        }
      });
      
      // SECURITY TAB - opens Security panel in modal
      securityTab.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log("📱 Security tab clicked - opening Security modal");
        
        // Hide profile view
        if (profileView) {
          profileView.style.display = 'none';
          profileView.classList.add('hidden-panel');
        }
        
        // Get security panel content and open modal
        if (securityPanel) {
          var html = securityPanel.innerHTML;
          // Remove h2 from panel (modal adds its own)
          html = html.replace(/<h2[^>]*>.*?<\/h2>/, '');
          openModal('<h2><i class="fa-solid fa-shield-halved"></i> Security Settings</h2>' + html);
        } else {
          console.error("❌ securityPanel not found");
        }
      });
      
      console.log("📱 profile-mobile: Mobile tabs configured - Account -> Account panel, Security -> Security panel");
    }
    
    // ============================================
    // CLOSE MODAL EVENTS
    // ============================================
    if (modalClose) {
      modalClose.addEventListener('click', function() {
        closeModal();
      });
    }
    
    if (modal) {
      modal.addEventListener('click', function(e) {
        if (e.target === this) {
          closeModal();
        }
      });
    }
    
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        closeModal();
      }
    });
    
    window.addEventListener('resize', function() {
      if (window.innerWidth > 768) {
        closeModal();
      }
    });
    
    // ============================================
    // ACTIVATE MOBILE MODE
    // ============================================
    setupMobileTabs();
    
    console.log("📱 profile-mobile: Mobile mode activated successfully!");
    console.log("📱 profile-mobile: Account tab -> Account modal, Security tab -> Security modal");
    
  }, 500);
  
})();

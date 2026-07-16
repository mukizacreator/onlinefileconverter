// ============================================
// PROFILE-MOBILE.JS - FINAL v4
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
  
  // Wait for profile.js to finish setting up (it uses cloneNode)
  var checkInterval = setInterval(function() {
    var accountTab = document.getElementById('accountTab');
    var securityTab = document.getElementById('securityTab');
    var profileView = document.getElementById('profileView');
    var accountPanel = document.getElementById('accountPanel');
    var securityPanel = document.getElementById('securityPanel');
    
    if (!accountTab || !securityTab || !profileView || !accountPanel || !securityPanel) {
      return;
    }
    
    // Check if profile.js has attached its listeners (check for active class or clone)
    // We'll wait a bit longer to ensure profile.js is done
    clearInterval(checkInterval);
    
    console.log("📱 profile-mobile: profile.js detected, waiting 300ms before overriding...");
    
    // Wait a bit more for profile.js to fully initialize
    setTimeout(function() {
      console.log("📱 profile-mobile: Starting override...");
      
      // ============================================
      // STEP 1: COMPLETELY REMOVE EXISTING TABS
      // And recreate them fresh (remove all listeners)
      // ============================================
      var navLeftWrapper = document.querySelector('.nav-left-wrapper');
      var navRight = document.querySelector('.nav-right');
      
      // Get the parent of the tabs (the nav-left or the actual tab container)
      var accountTabParent = accountTab.parentNode;
      var securityTabParent = securityTab.parentNode;
      
      // Store the text content for later
      var accountTabHTML = accountTab.outerHTML;
      var securityTabHTML = securityTab.outerHTML;
      
      // Remove existing tabs completely
      accountTab.remove();
      securityTab.remove();
      
      // Create new tabs with the same HTML but NO event listeners
      var tempDiv = document.createElement('div');
      tempDiv.innerHTML = accountTabHTML;
      var newAccountTab = tempDiv.firstElementChild;
      
      tempDiv = document.createElement('div');
      tempDiv.innerHTML = securityTabHTML;
      var newSecurityTab = tempDiv.firstElementChild;
      
      // Add them back to the DOM
      accountTabParent.appendChild(newAccountTab);
      securityTabParent.appendChild(newSecurityTab);
      
      // Update references
      accountTab = newAccountTab;
      securityTab = newSecurityTab;
      
      console.log("📱 profile-mobile: Recreated tabs without listeners");
      
      // ============================================
      // STEP 2: GET OR CREATE MODAL
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
        console.log("📱 profile-mobile: Created modal");
      }
      
      // ============================================
      // STEP 3: MODAL FUNCTIONS
      // ============================================
      function openModal(contentHTML) {
        if (!modal || !modalContent) return;
        modalContent.innerHTML = contentHTML;
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        setTimeout(function() { bindModalButtons(); }, 200);
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
      // STEP 4: BIND MODAL BUTTONS
      // ============================================
      function bindModalButtons() {
        var content = document.getElementById('mobileModalContent');
        if (!content) return;
        
        var buttons = content.querySelectorAll('button');
        buttons.forEach(function(btn) {
          var btnId = btn.id;
          
          // Clone to remove existing listeners
          var newBtn = btn.cloneNode(true);
          btn.parentNode.replaceChild(newBtn, btn);
          btn = newBtn;
          
          if (btnId === 'saveAccountBtn') {
            btn.addEventListener('click', function(e) {
              e.preventDefault();
              e.stopPropagation();
              console.log("💾 Save Account clicked in modal");
              
              // Copy modal values to main inputs
              var modalPassword = document.getElementById('accountCurrentPassword');
              var modalEmail = document.getElementById('profileEmail');
              var modalUsername = document.getElementById('profileUsernameInput');
              
              var mainPassword = document.getElementById('accountCurrentPassword');
              var mainEmail = document.getElementById('profileEmail');
              var mainUsername = document.getElementById('profileUsernameInput');
              
              if (modalPassword && mainPassword) mainPassword.value = modalPassword.value;
              if (modalEmail && mainEmail) mainEmail.value = modalEmail.value;
              if (modalUsername && mainUsername) mainUsername.value = modalUsername.value;
              
              var mainBtn = document.getElementById('saveAccountBtn');
              if (mainBtn) mainBtn.click();
            });
          }
          else if (btnId === 'changePasswordBtn') {
            btn.addEventListener('click', function(e) {
              e.preventDefault();
              e.stopPropagation();
              console.log("🔑 Change Password clicked in modal");
              
              var modalCurPass = document.getElementById('currentPassword');
              var modalNewPass = document.getElementById('newPassword');
              var modalConfPass = document.getElementById('confirmPassword');
              
              var mainCurPass = document.getElementById('currentPassword');
              var mainNewPass = document.getElementById('newPassword');
              var mainConfPass = document.getElementById('confirmPassword');
              
              if (modalCurPass && mainCurPass) mainCurPass.value = modalCurPass.value;
              if (modalNewPass && mainNewPass) mainNewPass.value = modalNewPass.value;
              if (modalConfPass && mainConfPass) mainConfPass.value = modalConfPass.value;
              
              var mainBtn = document.getElementById('changePasswordBtn');
              if (mainBtn) mainBtn.click();
            });
          }
          else if (btnId === 'logoutBtn') {
            btn.addEventListener('click', function(e) {
              e.preventDefault();
              e.stopPropagation();
              console.log("🚪 Logout clicked in modal");
              var mainBtn = document.getElementById('logoutBtn');
              if (mainBtn) mainBtn.click();
            });
          }
          else if (btnId === 'deleteAccountBtn') {
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
          }
        });
      }
      
      // ============================================
      // STEP 5: SETUP MOBILE TABS
      // ============================================
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
      
      // ============================================
      // STEP 6: CLOSE MODAL EVENTS
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
      
      console.log("📱 profile-mobile: Mobile mode activated successfully!");
      
    }, 300); // Wait for profile.js to finish
    
  }, 200);
  
})();

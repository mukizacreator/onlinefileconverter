// ============================================
// PROFILE-MOBILE.JS - Mobile-only modal override
// Directly calls the handler functions from profile.js
// ============================================

(function() {
  'use strict';
  
  // Only run on mobile (≤ 768px)
  if (window.innerWidth > 768) {
    console.log("📱 profile-mobile: Desktop detected, skipping");
    return;
  }
  
  console.log("📱 profile-mobile: Mobile detected, activating modal mode");
  
  // Wait for DOM and profile.js to fully load
  var checkInterval = setInterval(function() {
    var accountTab = document.getElementById('accountTab');
    var securityTab = document.getElementById('securityTab');
    var profileView = document.getElementById('profileView');
    var accountPanel = document.getElementById('accountPanel');
    var securityPanel = document.getElementById('securityPanel');
    
    if (!accountTab || !securityTab || !profileView || !accountPanel || !securityPanel) {
      return;
    }
    
    // Check if profile.js handlers are available
    // We need to wait for profile.js to attach its event listeners
    var saveBtn = document.getElementById('saveAccountBtn');
    var changeBtn = document.getElementById('changePasswordBtn');
    var logoutBtn = document.getElementById('logoutBtn');
    var deleteBtn = document.getElementById('deleteAccountBtn');
    
    if (!saveBtn || !changeBtn || !logoutBtn || !deleteBtn) {
      return;
    }
    
    clearInterval(checkInterval);
    console.log("📱 profile-mobile: All elements ready, setting up modals");
    
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
      
      // Re-bind modal buttons after content is loaded
      setTimeout(function() {
        bindModalButtons();
      }, 150);
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
    // BIND MODAL BUTTONS - DIRECT HANDLER CALLS
    // ============================================
    function bindModalButtons() {
      console.log("🔗 Binding modal buttons with direct handlers");
      
      // SAVE ACCOUNT - Call the handler directly
      var modalSaveBtn = document.getElementById('saveAccountBtn');
      if (modalSaveBtn) {
        // Remove any existing listeners by cloning
        var newSaveBtn = modalSaveBtn.cloneNode(true);
        modalSaveBtn.parentNode.replaceChild(newSaveBtn, modalSaveBtn);
        modalSaveBtn = newSaveBtn;
        
        modalSaveBtn.addEventListener('click', function(e) {
          e.preventDefault();
          console.log("💾 Save Account clicked in modal - calling handler");
          
          // Get values from modal inputs
          var modalPassword = document.getElementById('accountCurrentPassword');
          var modalEmail = document.getElementById('profileEmail');
          var modalUsername = document.getElementById('profileUsernameInput');
          
          // If inputs exist in modal, use them
          if (modalPassword && modalPassword.value) {
            // Values are already in the modal inputs, the main handler will use them
            // But we need to make sure the main handler uses the modal values
            // Since the main handler uses getElementById, and the IDs are the same,
            // it should work if the modal inputs have the same IDs
            console.log("  Modal password value:", modalPassword.value);
            console.log("  Modal email value:", modalEmail ? modalEmail.value : 'N/A');
            console.log("  Modal username value:", modalUsername ? modalUsername.value : 'N/A');
          }
          
          // Find the main save button and trigger its click
          // The main button has the same ID, but it might be hidden
          // We need to trigger the click event on the main button
          var mainSaveBtn = document.getElementById('saveAccountBtn');
          if (mainSaveBtn) {
            // Create and dispatch a click event
            var clickEvent = new MouseEvent('click', {
              view: window,
              bubbles: true,
              cancelable: true
            });
            mainSaveBtn.dispatchEvent(clickEvent);
            console.log("  Dispatched click on main save button");
          } else {
            console.error("  Main save button not found");
          }
        });
        console.log("  ✅ Save Account bound");
      }
      
      // CHANGE PASSWORD - Call the handler directly
      var modalChangeBtn = document.getElementById('changePasswordBtn');
      if (modalChangeBtn) {
        var newChangeBtn = modalChangeBtn.cloneNode(true);
        modalChangeBtn.parentNode.replaceChild(newChangeBtn, modalChangeBtn);
        modalChangeBtn = newChangeBtn;
        
        modalChangeBtn.addEventListener('click', function(e) {
          e.preventDefault();
          console.log("🔑 Change Password clicked in modal - calling handler");
          
          var mainChangeBtn = document.getElementById('changePasswordBtn');
          if (mainChangeBtn) {
            var clickEvent = new MouseEvent('click', {
              view: window,
              bubbles: true,
              cancelable: true
            });
            mainChangeBtn.dispatchEvent(clickEvent);
            console.log("  Dispatched click on main change password button");
          }
        });
        console.log("  ✅ Change Password bound");
      }
      
      // LOGOUT
      var modalLogoutBtn = document.getElementById('logoutBtn');
      if (modalLogoutBtn) {
        var newLogoutBtn = modalLogoutBtn.cloneNode(true);
        modalLogoutBtn.parentNode.replaceChild(newLogoutBtn, modalLogoutBtn);
        modalLogoutBtn = newLogoutBtn;
        
        modalLogoutBtn.addEventListener('click', function(e) {
          e.preventDefault();
          console.log("🚪 Logout clicked in modal");
          
          var mainLogoutBtn = document.getElementById('logoutBtn');
          if (mainLogoutBtn) {
            var clickEvent = new MouseEvent('click', {
              view: window,
              bubbles: true,
              cancelable: true
            });
            mainLogoutBtn.dispatchEvent(clickEvent);
          }
        });
        console.log("  ✅ Logout bound");
      }
      
      // DELETE ACCOUNT
      var modalDeleteBtn = document.getElementById('deleteAccountBtn');
      if (modalDeleteBtn) {
        var newDeleteBtn = modalDeleteBtn.cloneNode(true);
        modalDeleteBtn.parentNode.replaceChild(newDeleteBtn, modalDeleteBtn);
        modalDeleteBtn = newDeleteBtn;
        
        modalDeleteBtn.addEventListener('click', function(e) {
          e.preventDefault();
          console.log("🗑️ Delete Account clicked in modal");
          
          var mainDeleteBtn = document.getElementById('deleteAccountBtn');
          if (mainDeleteBtn) {
            var clickEvent = new MouseEvent('click', {
              view: window,
              bubbles: true,
              cancelable: true
            });
            mainDeleteBtn.dispatchEvent(clickEvent);
          }
        });
        console.log("  ✅ Delete Account bound");
      }
      
      // PASSWORD TOGGLES
      var toggles = document.querySelectorAll('.password-toggle-btn');
      toggles.forEach(function(btn) {
        var newToggle = btn.cloneNode(true);
        btn.parentNode.replaceChild(newToggle, btn);
        btn = newToggle;
        
        btn.addEventListener('click', function(e) {
          e.preventDefault();
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
      });
      console.log("  ✅ Password toggles bound");
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
        console.log("📱 Mobile: Account tab clicked");
        
        if (profileView) {
          profileView.style.display = "none";
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
        console.log("📱 Mobile: Security tab clicked");
        
        if (profileView) {
          profileView.style.display = "none";
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
    
    console.log("📱 profile-mobile: Mobile mode activated!");
    
  }, 500);
  
})();

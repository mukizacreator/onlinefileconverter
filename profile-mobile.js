// ============================================
// PROFILE-MOBILE.JS - SIMPLE OVERRIDE
// Does NOT fight with profile.js - just intercepts clicks
// ============================================

(function() {
  'use strict';
  
  // Only run on mobile
  if (window.innerWidth > 768) {
    console.log("📱 profile-mobile: Desktop, skipping");
    return;
  }
  
  console.log("📱 profile-mobile: Mobile mode activating");
  
  // Wait for DOM to be ready
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
    console.log("📱 profile-mobile: Elements found");
    
    // ============================================
    // GET OR CREATE MODAL
    // ============================================
    var modal = document.getElementById('mobileProfileModal');
    var modalContent = document.getElementById('mobileModalContent');
    var modalClose = document.getElementById('mobileModalClose');
    
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'mobileProfileModal';
      modal.className = 'mobile-profile-modal';
      modal.style.cssText = 'display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);backdrop-filter:blur(12px);z-index:99998;justify-content:center;align-items:center;padding:20px;';
      
      var inner = document.createElement('div');
      inner.className = 'mobile-profile-modal-content';
      inner.style.cssText = 'background:rgba(25,35,45,0.98);border:1px solid rgba(255,255,255,0.1);border-radius:20px;padding:24px 28px;max-width:500px;width:100%;max-height:90vh;overflow-y:auto;position:relative;';
      
      var close = document.createElement('button');
      close.id = 'mobileModalClose';
      close.className = 'mobile-profile-modal-close';
      close.innerHTML = '&times;';
      close.style.cssText = 'position:absolute;top:12px;right:16px;background:none;border:none;color:#aaa;font-size:1.8rem;cursor:pointer;padding:4px 8px;border-radius:8px;';
      
      var content = document.createElement('div');
      content.id = 'mobileModalContent';
      
      inner.appendChild(close);
      inner.appendChild(content);
      modal.appendChild(inner);
      document.body.appendChild(modal);
      
      modal = document.getElementById('mobileProfileModal');
      modalContent = document.getElementById('mobileModalContent');
      modalClose = document.getElementById('mobileModalClose');
      console.log("📱 profile-mobile: Modal created");
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
      if (profileView) {
        profileView.style.display = 'block';
        profileView.classList.remove('hidden-panel');
      }
    }
    
    // ============================================
    // BIND MODAL BUTTONS
    // ============================================
    function bindModalButtons() {
      var content = document.getElementById('mobileModalContent');
      if (!content) return;
      
      var buttons = content.querySelectorAll('button');
      buttons.forEach(function(btn) {
        // Skip if already bound
        if (btn.dataset.bound === 'true') return;
        btn.dataset.bound = 'true';
        
        var id = btn.id;
        
        if (id === 'saveAccountBtn') {
          btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            // Copy values from modal to main
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
            var mainBtn = document.getElementById('logoutBtn');
            if (mainBtn) mainBtn.click();
          });
        }
        else if (id === 'deleteAccountBtn') {
          btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
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
    // OVERRIDE TAB BEHAVIOR - SIMPLE APPROACH
    // ============================================
    // Instead of fighting profile.js, we'll intercept the click
    // and prevent the default behavior, then show modal
    
    function setupTabs() {
      // ACCOUNT TAB
      accountTab.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log("📱 Account tab clicked - opening modal");
        
        // Hide profile view
        if (profileView) {
          profileView.style.display = 'none';
          profileView.classList.add('hidden-panel');
        }
        
        // Get account panel content
        if (accountPanel) {
          var html = accountPanel.innerHTML;
          html = html.replace(/<h2[^>]*>.*?<\/h2>/, '');
          openModal('<h2><i class="fa-solid fa-user"></i> Account Information</h2>' + html);
        }
      }, true); // Use capture phase to intercept before profile.js
    
      // SECURITY TAB
      securityTab.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log("📱 Security tab clicked - opening modal");
        
        // Hide profile view
        if (profileView) {
          profileView.style.display = 'none';
          profileView.classList.add('hidden-panel');
        }
        
        // Get security panel content
        if (securityPanel) {
          var html = securityPanel.innerHTML;
          html = html.replace(/<h2[^>]*>.*?<\/h2>/, '');
          openModal('<h2><i class="fa-solid fa-shield-halved"></i> Security Settings</h2>' + html);
        }
      }, true); // Use capture phase to intercept before profile.js
      
      console.log("📱 profile-mobile: Tabs configured with intercept");
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
    
    // ============================================
    // ACTIVATE
    // ============================================
    setupTabs();
    
    console.log("📱 profile-mobile: Activated!");
    
  }, 300);
  
})();

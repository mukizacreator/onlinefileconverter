/* ============================================
   NAVIGATION CONTROLLER - Hamburger Menu
   ============================================ */

(function() {
  'use strict';
  
  // Get DOM elements
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileDropdown = document.getElementById('mobileDropdown');
  const body = document.body;
  
  // State
  let isOpen = false;
  
  // Hamburger click handler
  if (hamburgerBtn && mobileDropdown) {
    hamburgerBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      toggleMenu();
    });
  }
  
  // Toggle menu function
  function toggleMenu() {
    isOpen = !isOpen;
    
    // Toggle classes
    if (hamburgerBtn) {
      hamburgerBtn.classList.toggle('open', isOpen);
      
      // Change icon between bars and times
      const icon = hamburgerBtn.querySelector('i');
      if (icon) {
        if (isOpen) {
          icon.className = 'fa-solid fa-times';
        } else {
          icon.className = 'fa-solid fa-bars';
        }
      }
    }
    
    if (mobileDropdown) {
      mobileDropdown.classList.toggle('open', isOpen);
    }
    
    // Prevent body scroll when menu is open (optional)
    if (isOpen) {
      body.style.overflow = 'hidden';
    } else {
      body.style.overflow = '';
    }
  }
  
  // Close menu function
  function closeMenu() {
    if (isOpen) {
      isOpen = false;
      
      if (hamburgerBtn) {
        hamburgerBtn.classList.remove('open');
        const icon = hamburgerBtn.querySelector('i');
        if (icon) {
          icon.className = 'fa-solid fa-bars';
        }
      }
      
      if (mobileDropdown) {
        mobileDropdown.classList.remove('open');
      }
      
      body.style.overflow = '';
    }
  }
  
  // Close dropdown when clicking outside
  document.addEventListener('click', function(e) {
    if (isOpen) {
      const target = e.target;
      const isHamburger = hamburgerBtn && hamburgerBtn.contains(target);
      const isDropdown = mobileDropdown && mobileDropdown.contains(target);
      
      if (!isHamburger && !isDropdown) {
        closeMenu();
      }
    }
  });
  
  // Close dropdown when pressing Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && isOpen) {
      closeMenu();
    }
  });
  
  // Close dropdown when window resizes to desktop size
  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      if (window.innerWidth > 768 && isOpen) {
        closeMenu();
      }
    }, 100);
  });
  
  // Close dropdown when clicking a dropdown link
  if (mobileDropdown) {
    const links = mobileDropdown.querySelectorAll('.dropdown-link');
    links.forEach(function(link) {
      link.addEventListener('click', function() {
        closeMenu();
      });
    });
  }
  
  console.log('✅ Navigation controller loaded!');
})();

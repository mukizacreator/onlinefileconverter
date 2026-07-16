/* ============================================
   NAVIGATION CONTROLLER - Hamburger Menu
   ============================================ */

(function() {
  'use strict';
  
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileDropdown = document.getElementById('mobileDropdown');
  const body = document.body;
  
  let isOpen = false;
  
  if (hamburgerBtn && mobileDropdown) {
    hamburgerBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      toggleMenu();
    });
  }
  
  function toggleMenu() {
    isOpen = !isOpen;
    
    if (hamburgerBtn) {
      hamburgerBtn.classList.toggle('open', isOpen);
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
    
    if (isOpen) {
      body.style.overflow = 'hidden';
    } else {
      body.style.overflow = '';
    }
  }
  
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
  
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && isOpen) {
      closeMenu();
    }
  });
  
  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      if (window.innerWidth > 768 && isOpen) {
        closeMenu();
      }
    }, 100);
  });
  
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

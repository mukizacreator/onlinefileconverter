/* ============================================
   DOM ELEMENT SELECTION
   ============================================ */
// Get references to converter UI elements
const fileInput = document.getElementById("fileInput");
const result = document.getElementById("result");
const fileName = document.getElementById("fileName");
const convertBtn = document.getElementById("convertBtn");

// Only initialize if elements exist to prevent errors on non-converter pages
if (fileInput && result && fileName && convertBtn) {

  /* ============================================
     FILE SELECTION HANDLING
     ============================================ */
  // Updates the display with the chosen filename and truncates long names for UI consistency
  fileInput.addEventListener("change", function () {
    const file = this.files[0];
    if (!file) {
      fileName.textContent = "No file chosen";
      result.innerHTML = "";
      return;
    }

    // Truncate long filenames: keep first 15 chars + last 6 chars + extension
    let name = file.name;
    if (name.length > 30) {
      const ext = name.substring(name.lastIndexOf("."));
      const base = name.substring(0, name.lastIndexOf("."));
      name = base.substring(0, 15) + "..." + base.substring(Math.max(base.length - 6, 15)) + ext;
    }
    fileName.textContent = name;
    result.innerHTML = ""; // Clear previous results
  });

  /* ============================================
     CONVERSION PROCESS
     ============================================ */
  // Manages user authentication limits, visual progress tracking, and server interaction
  convertBtn.addEventListener("click", async () => {
    const file = fileInput.files[0];
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    // UI Feedback: Disable button and show spinner
    convertBtn.disabled = true;
    convertBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Converting...`;

    /* ============================================
   AUTHENTICATION & FILE SIZE VALIDATION
   ============================================*/
// Guests are limited to 2MB files, logged-in users have no restriction
const loggedInUser = localStorage.getItem("loggedInUser");
const maxFreeSize = 2 * 1024 * 1024; // 2MB

if (file.size > maxFreeSize && !loggedInUser) {
  toastWarning("The file size is over the limit. Please sign in or sign up to convert files of 2+ MB");
  setTimeout(() => { 
    result.innerHTML = `
      <div style="background: rgba(255, 255, 255, 0.08); padding:20px; border-radius:15px;">
        <p style="color:#ffcc80; line-height:1.8;">The file size is over the limit.<br><br>Please sign in or create an account to convert files of 2+ MB.</p>
        <a href="signin.html" class="download-btn" style="margin-right:10px;">Sign In</a>
        <a href="signup.html" class="download-btn">Sign Up</a>
      </div>
    `;
  }, 2000);
  // Reset button state
  convertBtn.disabled = false;
  convertBtn.innerHTML = `<i class="fa-solid fa-arrows-rotate"></i> Convert`;
  return;
}

    /* ============================================
       PROGRESS TRACKING UI
       ============================================ */
    // Renders progress bar and starts a mock timer for client-side feedback
    result.innerHTML = `
      <div style="width:100%; background:#333; border-radius:12px; overflow:hidden;">
        <div id="progressBar" style="width:0%; height:22px; background:#28a745; transition: width .3s;"></div>
      </div>
      <p id="progressText">Preparing...</p>
    `;

    const bar = document.getElementById("progressBar");
    const text = document.getElementById("progressText");
    let progress = 0;
    // Simulate progress up to 95% while waiting for server response
    const timer = setInterval(() => {
      if (progress < 95) {
        progress += 5;
        bar.style.width = progress + "%";
        text.textContent = progress + "%";
      }
    }, 300);

    /* ============================================
       UPLOAD AND API INTERACTION
       ============================================ */
    // Prepare form data with file and selected output format
    const formData = new FormData();
    formData.append("file", file);
    formData.append("format", document.getElementById("formatSelect").value);

    try {
      // Send conversion request to server
      const response = await fetch("/api/convert", { method: "POST", body: formData });
      const data = await response.json();
      clearInterval(timer); // Stop the progress simulation

      // Handle server-side failure
      if (!response.ok) {
        toastError(data.error || "Conversion failed."); 
      } 
      // Handle successful conversion - show download link
      else {
        bar.style.width = "100%";
        text.textContent = "100%";
        result.innerHTML = `
          <p>✅ Conversion completed successfully!</p>
          <a href="${data.url}" class="download-btn">Download File</a>
        `;
      }
    } catch (error) {
      // Handle network or server errors
      clearInterval(timer);
      toastError("Server error. Please try again.");
    }

    // Reset button state after completion
    convertBtn.disabled = false;
    convertBtn.innerHTML = `<i class="fa-solid fa-arrows-rotate"></i> Convert`;
  });
}

/* ============================================
   HAMBURGER MENU TOGGLE
   ============================================ */
document.addEventListener('DOMContentLoaded', function() {
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileDropdown = document.getElementById('mobileDropdown');
  
  if (hamburgerBtn && mobileDropdown) {
    // Toggle dropdown on hamburger click
    hamburgerBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      mobileDropdown.classList.toggle('open');
      
      // Change icon between bars and times
      const icon = this.querySelector('i');
      if (mobileDropdown.classList.contains('open')) {
        icon.className = 'fa-solid fa-times';
      } else {
        icon.className = 'fa-solid fa-bars';
      }
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
      if (!hamburgerBtn.contains(e.target) && !mobileDropdown.contains(e.target)) {
        mobileDropdown.classList.remove('open');
        const icon = hamburgerBtn.querySelector('i');
        if (icon) {
          icon.className = 'fa-solid fa-bars';
        }
      }
    });
    
    // Close dropdown when a mobile link is clicked
    const mobileLinks = mobileDropdown.querySelectorAll('.mobile-nav-link');
    mobileLinks.forEach(link => {
      link.addEventListener('click', function() {
        mobileDropdown.classList.remove('open');
        const icon = hamburgerBtn.querySelector('i');
        if (icon) {
          icon.className = 'fa-solid fa-bars';
        }
      });
    });
  }
});

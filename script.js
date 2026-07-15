/* ============================================
   DOM ELEMENT SELECTION
   ============================================ */
const fileInput = document.getElementById("fileInput");
const result = document.getElementById("result");
const fileName = document.getElementById("fileName");
const convertBtn = document.getElementById("convertBtn");

if (fileInput && result && fileName && convertBtn) {

  /* ============================================
     FILE SELECTION HANDLING
     ============================================ */
  fileInput.addEventListener("change", function () {
    const file = this.files[0];
    if (!file) {
      fileName.textContent = "No file chosen";
      result.innerHTML = "";
      return;
    }

    let name = file.name;
    if (name.length > 30) {
      const ext = name.substring(name.lastIndexOf("."));
      const base = name.substring(0, name.lastIndexOf("."));
      name = base.substring(0, 15) + "..." + base.substring(Math.max(base.length - 6, 15)) + ext;
    }
    fileName.textContent = name;
    result.innerHTML = "";
  });

  /* ============================================
     CONVERSION PROCESS
     ============================================ */
  convertBtn.addEventListener("click", async () => {
    const file = fileInput.files[0];
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    convertBtn.disabled = true;
    convertBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Converting...`;

    const loggedInUser = localStorage.getItem("loggedInUser");
    const maxFreeSize = 2 * 1024 * 1024;

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
      convertBtn.disabled = false;
      convertBtn.innerHTML = `<i class="fa-solid fa-arrows-rotate"></i> Convert`;
      return;
    }

    result.innerHTML = `
      <div style="width:100%; background:#333; border-radius:12px; overflow:hidden;">
        <div id="progressBar" style="width:0%; height:22px; background:#28a745; transition: width .3s;"></div>
      </div>
      <p id="progressText">Preparing...</p>
    `;

    const bar = document.getElementById("progressBar");
    const text = document.getElementById("progressText");
    let progress = 0;
    const timer = setInterval(() => {
      if (progress < 95) {
        progress += 5;
        bar.style.width = progress + "%";
        text.textContent = progress + "%";
      }
    }, 300);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("format", document.getElementById("formatSelect").value);

    try {
      const response = await fetch("/api/convert", { method: "POST", body: formData });
      const data = await response.json();
      clearInterval(timer);

      if (!response.ok) {
        toastError(data.error || "Conversion failed."); 
      } else {
        bar.style.width = "100%";
        text.textContent = "100%";
        result.innerHTML = `
          <p>✅ Conversion completed successfully!</p>
          <a href="${data.url}" class="download-btn">Download File</a>
        `;
      }
    } catch (error) {
      clearInterval(timer);
      toastError("Server error. Please try again.");
    }

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
    hamburgerBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      mobileDropdown.classList.toggle('open');
      
      const icon = this.querySelector('i');
      if (mobileDropdown.classList.contains('open')) {
        icon.className = 'fa-solid fa-times';
      } else {
        icon.className = 'fa-solid fa-bars';
      }
    });
    
    document.addEventListener('click', function(e) {
      const isHamburger = hamburgerBtn.contains(e.target);
      const isDropdown = mobileDropdown.contains(e.target);
      
      if (!isHamburger && !isDropdown) {
        mobileDropdown.classList.remove('open');
        const icon = hamburgerBtn.querySelector('i');
        if (icon) {
          icon.className = 'fa-solid fa-bars';
        }
      }
    });
    
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

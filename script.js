// ============================================
// MOBILE NAVIGATION TOGGLE
// ============================================
function toggleMenu() {
  const menu = document.getElementById("mobileMenu");
  if (menu) {
    menu.classList.toggle("active");
  }
}

// ============================================
// DOM ELEMENT SELECTION
// ============================================
const fileInput = document.getElementById("fileInput");
const result = document.getElementById("result");
const fileName = document.getElementById("fileName");
const convertBtn = document.getElementById("convertBtn");

// Only initialize if elements exist to prevent errors on non-converter pages
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

    // Truncate long filenames
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

    // AUTHENTICATION & FILE SIZE VALIDATION
    const loggedInUser = localStorage.getItem("loggedInUser");
    const maxFreeSize = 2 * 1024 * 1024; // 2MB

    if (file.size > maxFreeSize && !loggedInUser) {
      result.innerHTML = `
        <div style="background: rgba(255, 255, 255, 0.08); padding:20px; border-radius:15px;">
          <p style="color:#ffcc80; line-height:1.8;">The file size is over the limit.<br><br>Please sign in or create an account to convert files of 2+ MB.</p>
          <a href="signin.html" class="download-btn" style="margin-right:10px;">Sign In</a>
          <a href="signup.html" class="download-btn">Sign Up</a>
        </div>
      `;
      convertBtn.disabled = false;
      convertBtn.innerHTML = `<i class="fa-solid fa-arrows-rotate"></i> Convert`;
      return;
    }

    // PROGRESS TRACKING UI
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

    // UPLOAD AND API INTERACTION
    const formData = new FormData();
    formData.append("file", file);
    formData.append("format", document.getElementById("formatSelect").value);

    try {
      const response = await fetch("/api/convert", { method: "POST", body: formData });
      const data = await response.json();
      clearInterval(timer); 

      if (!response.ok) {
        result.innerHTML = `<p style="color:#ff6b6b;">Error: ${data.error || "Conversion failed."}</p>`;
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
      result.innerHTML = `<p style="color:#ff6b6b;">Server error. Please try again.</p>`;
    }

    convertBtn.disabled = false;
    convertBtn.innerHTML = `<i class="fa-solid fa-arrows-rotate"></i> Convert`;
  });
}

/* ===== FILE CONVERTER ===== */
const fileInput = document.getElementById("fileInput");
const result = document.getElementById("result");
const fileName = document.getElementById("fileName");
const convertBtn = document.getElementById("convertBtn");

if (fileInput && result && fileName && convertBtn) {

  fileInput.addEventListener("change", function () {
    const file = this.files[0];
    if (!file) {
      fileName.textContent = "No file chosen";
      result.innerHTML = "";
      return;
    }
    fileName.textContent = file.name;
    result.innerHTML = "";
  });

  convertBtn.addEventListener("click", async () => {
    const file = fileInput.files[0];
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    convertBtn.disabled = true;
    convertBtn.innerHTML = `⏳ Converting...`;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("format", document.getElementById("formatSelect").value);

    try {
      const response = await fetch("/api/convert", { method: "POST", body: formData });
      const data = await response.json();

      if (!response.ok) {
        result.innerHTML = `<p style="color:#ff6b6b;">❌ ${data.error || "Conversion failed."}</p>`;
      } else {
        result.innerHTML = `
          <p>✅ Conversion completed successfully!</p>
          <a href="${data.url}" class="download-btn">⬇️ Download File</a>
        `;
      }
    } catch (error) {
      result.innerHTML = `<p style="color:#ff6b6b;">❌ Server error. Please try again.</p>`;
    }

    convertBtn.disabled = false;
    convertBtn.innerHTML = `🔄 Convert`;
  });
}

/* ===== HAMBURGER MENU ===== */
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
      if (!hamburgerBtn.contains(e.target) && !mobileDropdown.contains(e.target)) {
        mobileDropdown.classList.remove('open');
        const icon = hamburgerBtn.querySelector('i');
        if (icon) icon.className = 'fa-solid fa-bars';
      }
    });
  }
});

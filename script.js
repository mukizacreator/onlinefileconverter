const fileInput =
  document.getElementById("fileInput");

const result =
  document.getElementById("result");

const fileName =
  document.getElementById("fileName");

const convertBtn =
  document.getElementById("convertBtn");

fileInput.addEventListener(
  "change",
  function () {

    const file =
      this.files[0];

    if (!file) {
      fileName.textContent =
        "No file chosen";
      return;
    }

    let name = file.name;

    if (name.length > 30) {

      const ext =
        name.substring(
          name.lastIndexOf(".")
        );

      const base =
        name.substring(
          0,
          name.lastIndexOf(".")
        );

      name =
        base.substring(0, 15) +
        "..." +
        base.substring(
          Math.max(
            base.length - 6,
            15
          )
        ) +
        ext;
    }

    fileName.textContent = name;
    result.innerHTML = "";
  }
);

convertBtn.addEventListener(
  "click",
  async () => {

    const file =
      fileInput.files[0];

    if (!file) {
      alert(
        "Please select a file first."
      );
      return;
    }

    const loggedInUser =
      localStorage.getItem(
        "loggedInUser"
      );

    const maxFreeSize =
      3 * 1024 * 1024;

    if (
      file.size > maxFreeSize &&
      !loggedInUser
    ) {

      result.innerHTML = `
        <div
          style="
            background:
              rgba(255,255,255,0.08);
            padding:20px;
            border-radius:15px;
          "
        >
          <p
            style="
              color:#ffcc80;
              line-height:1.8;
            "
          >
            Your file is over the limit size
            (3 MB).
            <br><br>
            Please sign in or sign up
            to convert files over 3 MB.
          </p>

          <a
            href="signin.html"
            class="download-btn"
            style="
              margin-right:10px;
            "
          >
            Sign In
          </a>

          <a
            href="signup.html"
            class="download-btn"
          >
            Sign Up
          </a>
        </div>
      `;

      return;
    }

    result.innerHTML = `
      <div
        style="
          width:100%;
          background:#333;
          border-radius:12px;
          overflow:hidden;
        "
      >
        <div
          id="progressBar"
          style="
            width:0%;
            height:22px;
            background:#28a745;
            transition:width .3s;
          "
        ></div>
      </div>

      <p id="progressText">
        Preparing...
      </p>
    `;

    const bar =
      document.getElementById(
        "progressBar"
      );

    const text =
      document.getElementById(
        "progressText"
      );

    let progress = 0;

    const timer =
      setInterval(() => {

        if (progress < 95) {

          progress += 5;

          bar.style.width =
            progress + "%";

          text.textContent =
            progress + "%";
        }

      }, 300);

    const formData =
      new FormData();

    formData.append(
      "file",
      file
    );

    formData.append(
      "format",
      document.getElementById(
        "formatSelect"
      ).value
    );

    try {

      const response =
        await fetch(
          "/api/convert",
          {
            method: "POST",
            body: formData
          }
        );

      const data =
        await response.json();

      clearInterval(timer);

      if (!response.ok) {

        result.innerHTML =
          `<p>❌ ${
            data.error ||
            "Conversion failed."
          }</p>`;

        return;
      }

      bar.style.width =
        "100%";

      text.textContent =
        "100%";

      result.innerHTML =
        `
        <p>
          ✅ Conversion completed successfully!
        </p>

        <a
          href="${data.url}"
          class="download-btn"
        >
          Download File
        </a>
        `;

    } catch (error) {

      clearInterval(timer);

      result.innerHTML =
        `
        <p>
          ❌ Server error.
          Please try again.
        </p>
        `;
    }
  }
);
function togglePassword(inputId, buttonId) {
  const input = document.getElementById(inputId);
  const button = document.getElementById(buttonId);

  if (!input || !button) return;

  button.addEventListener("click", () => {
    const icon = button.querySelector("i");

    if (input.type === "password") {
      input.type = "text";

      if (icon) {
        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");
      }
    } else {
      input.type = "password";

      if (icon) {
        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye");
      }
    }
  });
}

togglePassword(
  "signupPassword",
  "toggleSignup"
);

togglePassword(
  "signinPassword",
  "toggleSignin"
);

/* ---------- Sign Up ---------- */

const signupForm =
  document.getElementById(
    "signupForm"
  );

if (signupForm) {
  signupForm.addEventListener(
    "submit",
    (e) => {
      e.preventDefault();

      const email =
        document
          .getElementById(
            "signupEmail"
          )
          .value
          .trim()
          .toLowerCase();

      const password =
        document.getElementById(
          "signupPassword"
        ).value;

      const message =
        document.getElementById(
          "signupMessage"
        );

      const users =
        JSON.parse(
          localStorage.getItem(
            "users"
          )
        ) || [];

      const exists =
        users.some(
          (user) =>
            user.email === email
        );

      if (exists) {
        message.innerHTML = `
          <p style="color:#ff9d9d;">
            Email already registered.
            Please sign in.
          </p>

          <a
            href="signin.html"
            class="download-btn"
          >
            Sign In
          </a>
        `;

        return;
      }

      const strongPassword =
        /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{5,}$/;

      if (
        !strongPassword.test(
          password
        )
      ) {
        message.innerHTML = `
          <p style="color:#ff9d9d;">
            Password must contain:
            <br>
            • At least 5 characters
            <br>
            • One capital letter
            <br>
            • One number
            <br>
            • One symbol
          </p>
        `;

        return;
      }

      users.push({
        email,
        password
      });

      localStorage.setItem(
        "users",
        JSON.stringify(users)
      );

      message.innerHTML = `
        <p style="color:#9fff9f;">
          Account created successfully.
        </p>

        <a
          href="signin.html"
          class="download-btn"
        >
          Sign In
        </a>
      `;

      signupForm.reset();
    }
  );
}

/* ---------- Sign In ---------- */

const signinForm =
  document.getElementById(
    "signinForm"
  );

if (signinForm) {
  signinForm.addEventListener(
    "submit",
    (e) => {
      e.preventDefault();

      const email =
        document
          .getElementById(
            "signinEmail"
          )
          .value
          .trim()
          .toLowerCase();

      const password =
        document.getElementById(
          "signinPassword"
        ).value;

      const message =
        document.getElementById(
          "signinMessage"
        );

      const users =
        JSON.parse(
          localStorage.getItem(
            "users"
          )
        ) || [];

      const user =
        users.find(
          (u) =>
            u.email === email
        );

      if (!user) {
        message.innerHTML = `
          <p style="color:#ff9d9d;">
            Account not registered.
            Please sign up.
          </p>

          <a
            href="signup.html"
            class="download-btn"
          >
            Sign Up
          </a>
        `;

        return;
      }

      if (
        user.password !==
        password
      ) {
        message.innerHTML = `
          <p style="color:#ff9d9d;">
            Incorrect password.
          </p>
        `;

        return;
      }

      localStorage.setItem(
        "loggedInUser",
        email
      );

      message.innerHTML = `
        <p style="color:#9fff9f;">
          Sign in successful.
          Redirecting...
        </p>
      `;

      setTimeout(() => {
        window.location.href =
          "index.html";
      }, 1000);
    }
  );
}
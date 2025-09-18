document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");

  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();
    console.log("Your information is being sent!");

    const loginText = document.getElementById("loginText");
    const loginSpinner = document.getElementById("loginSpinner");
    const submitButton = document.querySelector("button[type='submit']");

    loginText.classList.add("hidden");
    loginSpinner.classList.remove("hidden");
    submitButton.disabled = true;

    const emailInput = document.getElementById("email");
    const emailValue = emailInput.value.trim().toLowerCase();

    const passwordInput = document.getElementById("password");
    const passwordValue = passwordInput.value;

    console.log({ emailValue, passwordValue });

    const credentials = {
      email: emailValue,
      password: passwordValue,
    };

    loginUser(credentials)
      .then((data) => {
        console.log("Login successful!", data);
        setToken(data.token);
        window.location.href = "dashboard.html";
      })
      .catch((error) => {
        console.error("Login failed!", error);
        alert("Error: " + error.message);
      })
      .finally(() => {
        loginText.classList.remove("hidden");
        loginSpinner.classList.add("hidden");
        submitButton.disabled = false;
      });
  });
});

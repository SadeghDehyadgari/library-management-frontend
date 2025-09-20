document.addEventListener("DOMContentLoaded", function () {
  initializeMobileMenu();
});

function initializeMobileMenu() {
  const hamburgerBtn = document.getElementById("hamburgerBtn");
  const closeBtn = document.getElementById("closeBtn");
  const mobileNav = document.getElementById("mobileNav");
  const body = document.body;

  if (!hamburgerBtn || !closeBtn || !mobileNav) {
    return;
  }

  hamburgerBtn.addEventListener("click", function () {
    mobileNav.classList.add("active");
    body.style.overflow = "hidden";
  });

  closeBtn.addEventListener("click", function () {
    mobileNav.classList.remove("active");
    body.style.overflow = "";
  });

  const mobileLinks = mobileNav.querySelectorAll("a");
  mobileLinks.forEach((link) => {
    link.addEventListener("click", function () {
      mobileNav.classList.remove("active");
      body.style.overflow = "";
    });
  });

  document.addEventListener("click", function (event) {
    if (
      mobileNav.classList.contains("active") &&
      !mobileNav.contains(event.target) &&
      !hamburgerBtn.contains(event.target)
    ) {
      mobileNav.classList.remove("active");
      body.style.overflow = "";
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && mobileNav.classList.contains("active")) {
      mobileNav.classList.remove("active");
      body.style.overflow = "";
      console.log("keydown works");
    }
  });

  setupLogout();
}

// keeping a separate function for closing mobile menu just in case
function closeMobileMenu() {
  const mobileNav = document.getElementById("mobileNav");
  const body = document.body;

  if (mobileNav) {
    mobileNav.classList.remove("active");
    body.style.overflow = "";
  }
}

function setupLogout() {
  const logoutButtons = document.querySelectorAll(
    "#logoutLink, a[href='login.html']"
  );

  logoutButtons.forEach((button) => {
    button.addEventListener("click", function (event) {
      event.preventDefault();
      handleLogout();
    });
  });
}

function handleLogout() {
  logout();
  window.location.href = "login.html";
}

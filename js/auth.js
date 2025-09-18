const TOKEN_COOKIE_NAME = "library_token";

function setToken(token) {
  const expires = new Date();
  expires.setTime(expires.getTime() + 1 * 24 * 60 * 60 * 1000);
  document.cookie = `${TOKEN_COOKIE_NAME}=${token}; expires=${expires.toUTCString()}; path=/`;
}

function getToken() {
  const cookieString = document.cookie;
  const cookies = cookieString.split("; ");

  for (const cookie of cookies) {
    const [name, value] = cookie.split("=");
    if (name === TOKEN_COOKIE_NAME) {
      return value;
    }
  }

  return null;
}

function logout() {
  document.cookie = `${TOKEN_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
}

function isLoggedIn() {
  return getToken() !== null;
}

function checkAuthAndRedirect() {
  if (!isLoggedIn()) {
    window.location.href = "login.html";
  }
}

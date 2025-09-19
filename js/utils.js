async function loadUserDataToHeader() {
  try {
    const userData = await getCurrentUserProfile();

    const userNameElements = document.querySelectorAll(".user-name");
    userNameElements.forEach((element) => {
      element.textContent = `${userData.data.user.firstName} ${userData.data.user.lastName}`;
    });

    const userAvatarElements = document.querySelectorAll(".user-avatar");
    userAvatarElements.forEach((element) => {
      element.textContent = userData.data.user.firstName.charAt(0);
    });
  } catch (err) {
    console.error("Error receiving user data: ", err);
  }
}

function setCache(key, data, expiresInMinutes = 5) {
  const cacheData = {
    data: data,
    timestamp: Date.now(),
    expiresIn: expiresInMinutes * 60 * 1000,
  };
  localStorage.setItem(key, JSON.stringify(cacheData));
  console.log(`Data cached for ${expiresInMinutes} minutes`);
}

function getCache(key) {
  const cached = localStorage.getItem(key);

  if (!cached) return null;

  return JSON.parse(cached);
}

function isCacheValid(cachedData) {
  if (!cachedData) return false;

  const currentTime = Date.now();
  const cacheAge = currentTime - cachedData.timestamp;

  return cacheAge < cachedData.expiresIn;
}

function invalidateBooksCache() {
  localStorage.removeItem("books");
  console.log("Cache successfully invalidated");
}

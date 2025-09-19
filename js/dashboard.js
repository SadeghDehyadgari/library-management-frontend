document.addEventListener("DOMContentLoaded", function () {
  checkAuthAndRedirect();
  loadUserDataToHeader();
  loadUserData();
});

async function loadUserData() {
  try {
    const cachedUserData = getCache("userData");

    if (cachedUserData && isCacheValid(cachedUserData)) {
      displayUserData(cachedUserData.data);
      return;
    }

    const userData = await getCurrentUserProfile();

    setCache("userData", userData, 20);

    displayUserData(userData.data);
  } catch (err) {
    console.error("Error:", err);
    alert(`Error: ${err.message}`);
  }
}

function displayUserData(userData) {
  const studentNameElement = document.getElementById("studentName");

  const user = userData.user || userData.data?.user;
  const stats = userData.stats || userData.data?.stats;

  if (studentNameElement && user) {
    studentNameElement.textContent = `${user.firstName} ${user.lastName}`;
  }

  const activeLoansElement = document.getElementById("activeLoans");
  const availableBooksElement = document.getElementById("availableBooks");

  if (stats) {
    if (activeLoansElement) {
      activeLoansElement.textContent = stats.activeLoans;
    }
    if (availableBooksElement) {
      availableBooksElement.textContent = stats.availableBooks;
    }
  }
}

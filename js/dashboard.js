document.addEventListener("DOMContentLoaded", function () {
  checkAuthAndRedirect();
  loadUserDataToHeader();
  loadUserData();
});

async function loadUserData() {
  try {
    console.log("Receiving user data...");
    const userData = await getCurrentUserProfile();
    console.log(userData);

    const studentNameElement = document.getElementById("studentName");
    if (studentNameElement) {
      studentNameElement.textContent = `${userData.data.user.firstName} ${userData.data.user.lastName}`;
    }

    const activeLoansElement = document.getElementById("activeLoans");
    if (activeLoansElement && userData.data.stats) {
      activeLoansElement.textContent = userData.data.stats.activeLoans;
    }

    const availableBooksElement = document.getElementById("availableBooks");
    if (availableBooksElement && userData.data.stats) {
      availableBooksElement.textContent = userData.data.stats.availableBooks;
    }
  } catch (err) {
    console.error(`Error receiving user data: ${err}`);
    alert(`Error: ${err.message}`);
  }
}

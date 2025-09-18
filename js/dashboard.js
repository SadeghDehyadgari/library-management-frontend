document.addEventListener("DOMContentLoaded", function () {
  checkAuthAndRedirect();
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
  } catch (err) {
    console.error(`Error receiving user data: ${err}`);
    alert(`Error: ${err.message}`);
  }
}

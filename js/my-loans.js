document.addEventListener("DOMContentLoaded", function () {
  checkAuthAndRedirect();
  loadUserDataToHeader();
  loadMyLoans();
});

async function loadMyLoans() {
  try {
    const loansData = await getMyLoans();
    console.log(loansData);

    displayLoans(loansData);
  } catch (err) {
    console.error(err);
    alert(`Error: ${err.message}`);
  }
}

function displayLoans(loansData) {
  console.log("displaying loans");

  const loansTableBody = document.querySelector(".table tbody");
  const totalLoansElement = document.querySelector(".card-header span");

  if (!loansTableBody || !totalLoansElement) {
    console.error("Page elements were not found");
    return;
  }

  if (!loansData.success || !loansData.data || loansData.data.length === 0) {
    loansTableBody.innerHTML = `
        <tr>
            <td colspan="5" style="text-align: center; padding: 2rem; color: #666;">
                You have not borrowed any book yet
            </td>
        </tr>
    `;
    totalLoansElement.textContent = "Total: 0 loans";
    return;
  }

  totalLoansElement.textContent = `Total: ${loansData.data.length} loans`;

  loansTableBody.innerHTML = "";
  loansData.data.forEach((loan) => {
    const row = createLoanRow(loan);
    loansTableBody.innerHTML += row;
  });

  updateLoanStats(loansData.data);

  attachReturnEventListeners();

  console.log("Loans successfully rendered");
}

function createLoanRow(loan) {
  const isReturned = loan.status === "returned";
  const statusClass = isReturned ? "status-returned" : "status-active";
  const statusText = isReturned ? "Returned" : "Active";
  const loanDate = new Date(loan.loanDate).toLocaleDateString("en-US");

  return `
        <tr>
            <td>
                <strong>${loan.book.title}</strong>
                <br>
                <small style="color: #666">ISBN: ${loan.book.isbn}</small>
            </td>
            <td>${loan.book.author}</td>
            <td>${loanDate}</td>
            <td><span class="status ${statusClass}">${statusText}</span></td>
            <td>${
              isReturned
                ? `<button class="btn btn-secondary btn-sm" disabled>Returned</button>`
                : `<button class="btn btn-success btn-sm" data-loan-id="${loan.id}">Return</button>`
            }</td>
        </tr>
    `;
}

function updateLoanStats(loans) {
  const activeLoans = loans.filter((loan) => loan.status === "active").length;
  const returnedLoans = loans.filter(
    (loan) => loan.status === "returned"
  ).length;

  console.log(`Stats: ${activeLoans} active, ${returnedLoans} returned`);

  const statNumbers = document.querySelectorAll(".stat-number");

  if (statNumbers.length >= 2) {
    statNumbers[0].textContent = activeLoans;
    statNumbers[1].textContent = returnedLoans;
    console.log("Stats updated");
  } else {
    console.warn("Stats could not be updated");
  }
}

function attachReturnEventListeners() {
  console.log("Attaching event listeners to return buttons");

  const returnButtons = document.querySelectorAll(".btn-success[data-loan-id]");

  returnButtons.forEach((button) => {
    button.removeEventListener("click", handleReturnBook);
    button.addEventListener("click", handleReturnBook);
  });

  console.log(`${returnButtons.length} buttons were added`);
}

async function handleReturnBook(event) {
  const button = event.target;
  const loanId = button.getAttribute("data-loan-id");
  const row = button.closest("tr");
  const bookTitle = row.querySelector("strong").textContent;

  console.log(`Processing to return: ${bookTitle} (ID: ${loanId})`);

  button.disabled = true;
  button.textContent = "Processing...";

  try {
    const result = await returnBook(loanId);
    alert(`Book "${bookTitle}" was returned successfully`);
    await loadMyLoans();
  } catch (err) {
    console.error(err);
    alert(`Error: ${err.message}`);

    button.disabled = false;
    button.textContent = "Return";
  }
}

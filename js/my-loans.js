let currentPage = 1;
const loansPerPage = 10;
let allLoansData = [];
let totalPages = 1;

document.addEventListener("DOMContentLoaded", function () {
  checkAuthAndRedirect();
  loadUserDataToHeader();
  loadMyLoans();
});

async function loadMyLoans() {
  try {
    const loansData = await getMyLoans();
    console.log("Data from API: ", loansData);
    allLoansData = loansData.data || [];

    totalPages = Math.ceil(allLoansData.length / loansPerPage);

    displayPaginatedLoans();
    updateLoanStats();
  } catch (err) {
    console.error(err);
    alert(`Error: ${err.message}`);
  }
}

function displayLoans(loansData) {
  const loansTableBody = document.querySelector(".table tbody");
  const totalLoansElement = document.querySelector(".card-header span");

  if (!loansTableBody || !totalLoansElement) return;

  loansTableBody.innerHTML = "";

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

  const startItem = (currentPage - 1) * loansPerPage + 1;
  const endItem = Math.min(currentPage * loansPerPage, allLoansData.length);

  totalLoansElement.textContent = `Total: ${allLoansData.length} loans (showing ${startItem}-${endItem})`;

  loansData.data.forEach((loan) => {
    const row = createLoanRow(loan);
    loansTableBody.innerHTML += row;
  });

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

function updateLoanStats() {
  const activeLoans = allLoansData.filter(
    (loan) => loan.status === "active"
  ).length;
  const returnedLoans = allLoansData.filter(
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

function displayPaginatedLoans() {
  const startIndex = (currentPage - 1) * loansPerPage;
  const endIndex = Math.min(startIndex + loansPerPage, allLoansData.length);

  const currentPageData = allLoansData.slice(startIndex, endIndex);

  const paginatedData = {
    success: true,
    data: currentPageData,
    totalCount: allLoansData.length,
  };

  displayLoans(paginatedData);
  updateLoanStats();
  renderPagination();
}

function renderPagination() {
  const paginationContainer = document.getElementById("paginationContainer");
  if (!paginationContainer) return;

  paginationContainer.innerHTML = "";

  if (totalPages <= 1) return;

  console.log(`Rendering pagination - Page ${currentPage} of ${totalPages}`);

  if (currentPage > 1) {
    const prevBtn = document.createElement("button");
    prevBtn.textContent = "← Previous";
    prevBtn.className = "pagination-btn";
    prevBtn.onclick = () => {
      currentPage--;
      displayPaginatedLoans();
    };
    paginationContainer.appendChild(prevBtn);
  }

  for (let i = 1; i <= totalPages; i++) {
    const pageBtn = document.createElement("button");
    pageBtn.textContent = i;
    pageBtn.className = "pagination-btn";

    if (i === currentPage) {
      pageBtn.classList.add("active");
    }

    pageBtn.onclick = () => {
      currentPage = i;
      displayPaginatedLoans();
    };

    paginationContainer.appendChild(pageBtn);
  }

  if (currentPage < totalPages) {
    const nextBtn = document.createElement("button");
    nextBtn.textContent = "Next →";
    nextBtn.className = "pagination-btn";
    nextBtn.onclick = () => {
      currentPage++;
      displayPaginatedLoans();
    };
    paginationContainer.appendChild(nextBtn);
  }
}

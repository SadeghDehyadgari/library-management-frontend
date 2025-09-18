document.addEventListener("DOMContentLoaded", function () {
  checkAuthAndRedirect();
  clearBookPlaceholders();
  loadUserDataToHeader();
  loadBooks();
});

function clearBookPlaceholders() {
  const booksContainer = document.getElementById("booksContainer");
  if (booksContainer) {
    booksContainer.innerHTML = "";
    console.log("Placeholder books were deleted");
  }
}

async function loadBooks() {
  try {
    const cachedBooks = getCache("books");
    if (cachedBooks && isCacheValid(cachedBooks)) {
      renderBooks(cachedBooks.data);
      return;
    }

    console.log("Cache did not exist; receiving books from server...");
    const booksData = await getBooks();

    if (booksData.success) {
      setCache("books", booksData, 5);
      console.log("New data was restored in cache");
    }

    renderBooks(booksData);
  } catch (err) {
    console.error("error while receiving books:", err);
    const cachedBooks = getCache("books");
    if (cachedBooks) {
      console.log("Using cached data as fallback");
      renderBooks(cachedBooks.data);
    } else {
      alert("Error: " + err.message);
    }
  }
}

function renderBooks(booksData) {
  const booksContainer = document.getElementById("booksContainer");

  if (booksContainer && booksData.success && booksData.data) {
    booksContainer.innerHTML = "";

    booksData.data.forEach((book) => {
      const bookCardHTML = createBookCard(book);
      booksContainer.innerHTML += bookCardHTML;
    });
    console.log("Books are rendered successfully");
  }

  attachEventListeners();
}

function createBookCard(book) {
  const isAvailable = book.availableCopies > 0;
  const statusClass = isAvailable ? "status-available" : "status-unavailable";
  const statusText = isAvailable ? "Available" : "Unavailable";

  return `
    <div class="card">
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
            <h3 style="margin: 0; color: #2c3e50;">${book.title}</h3>
            <span class="status ${statusClass}">${statusText}</span>
        </div>
        <p style="color: #666; margin-bottom: 0.5rem;"><strong>Author:</strong> ${
          book.author
        }</p>
        <p style="color: #666; margin-bottom: 0.5rem;"><strong>ISBN:</strong> ${
          book.isbn
        }</p>
        <p style="color: #666; margin-bottom: 0.5rem;"><strong>Category:</strong> ${
          book.category.name
        }</p>
        <p style="color: #666; margin-bottom: 1rem;"><strong>Available Copies:</strong> ${
          book.availableCopies
        }</p>
        <p style="margin-bottom: 1rem; font-size: 0.9rem; color: #555;">${
          book.description
        }</p>
        <div style="display: flex; gap: 0.5rem;">
            ${
              isAvailable
                ? `<button class="btn btn-primary btn-sm" data-book-id="${book.id}">Borrow Book</button>`
                : `<button class="btn btn-secondary btn-sm" disabled>Not Available</button>`
            }
            <button class="btn btn-secondary btn-sm">View Details</button>
        </div>
    </div>
    `;
}

function attachEventListeners() {
  console.log("Attaching event listeners...");

  const borrowButtons = document.querySelectorAll(
    ".btn-primary:not([disabled])"
  );
  borrowButtons.forEach((button) => {
    button.addEventListener("click", handleBorrowBook);
  });

  const viewDetailsButtons = document.querySelectorAll(
    ".btn-secondary:not([disabled])"
  );
  viewDetailsButtons.forEach((button) => {
    button.addEventListener("click", handleViewDetails);
  });

  console.log(
    `${borrowButtons.length} borrow buttons and ${viewDetailsButtons.length} view details buttons were added.`
  );
}

async function handleBorrowBook(event) {
  const button = event.target;
  const card = button.closest(".card");
  const title = card.querySelector("h3").textContent;
  const bookId = button.getAttribute("data-book-id");
  console.log(`Attemp to borrow book: ${title} (ID: ${bookId})`);

  button.disabled = true;
  button.textContent = "Proccessing...";

  try {
    const result = await borrowBook(bookId);
    alert(`Book "${title}" successfully borrowed`);
    invalidateBooksCache();
    await loadBooks();
  } catch (err) {
    console.error(`Error borrowing book ${err}`);
    alert(`Error: ${err.message}`);

    button.disabled = false;
    button.textContent = "Borrow Book";
  }
}

function handleViewDetails(event) {
  const card = event.target.closest(".card");
  const title = card.querySelector("h3").textContent;
  console.log(`Viewing details of ${title}`);

  alert(`Viewing details of ${title}`);
}

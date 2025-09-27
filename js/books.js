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
      initializeFilterToggle();
      populateCategoryFilter();
      initializeSearch();
      return;
    }

    console.log("Cache did not exist; receiving books from server...");
    const booksData = await getBooks();

    if (booksData.success) {
      setCache("books", booksData, 5);
      console.log("New data was restored in cache");
    }

    renderBooks(booksData);
    initializeFilterToggle();
    populateCategoryFilter();
    initializeSearch();
  } catch (err) {
    console.error("error while receiving books:", err);
    const cachedBooks = getCache("books");
    if (cachedBooks) {
      console.log("Using cached data as fallback");
      renderBooks(cachedBooks.data);
      initializeFilterToggle();
      populateCategoryFilter();
      initializeSearch();
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
    if (button.textContent.trim() === "View Details") {
      button.addEventListener("click", handleViewDetails);
    }
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

async function handleViewDetails(event) {
  const card = event.target.closest(".card");
  const bookId =
    card.querySelector(".btn-primary")?.getAttribute("data-book-id") ||
    card.querySelector(".btn-secondary")?.getAttribute("data-book-id");

  if (!bookId) {
    console.error("Book ID not found");
    alert("Book ID not found");
    return;
  }

  console.log(`Viewing details of book ID: ${bookId}`);

  try {
    // اول سعی می‌کنیم از داده‌های cached شده استفاده کنیم
    const cachedBooks = getCache("books");

    if (cachedBooks && cachedBooks.data && cachedBooks.data.data) {
      const book = cachedBooks.data.data.find((b) => b.id === bookId);

      if (book) {
        console.log("Using cached book data:", book);
        displayBookDetails(book);
        const modal = document.getElementById("bookDetailsModal");
        modal.showModal();
        return;
      }
    }

    event.target.disabled = true;
    event.target.textContent = "Loading...";

    const bookDetails = await getBookDetails(bookId);
    console.log("Book details received:", bookDetails);

    displayBookDetails(bookDetails.book);
    const modal = document.getElementById("bookDetailsModal");
    modal.showModal();
  } catch (err) {
    console.error("Error fetching book details:", err);

    const cachedBooks = getCache("books");
    if (cachedBooks && cachedBooks.data && cachedBooks.data.data) {
      const book = cachedBooks.data.data.find((b) => b.id === bookId);
      if (book) {
        alert("Using cached data (API unavailable)");
        displayBookDetails(book);
        const modal = document.getElementById("bookDetailsModal");
        modal.showModal();
        return;
      }
    }
    alert(`Error loading book details: ${err.message}`);
  } finally {
    event.target.disabled = false;
    event.target.textContent = "View Details";
  }
}

function displayBookDetails(book) {
  document.getElementById("modalBookTitle").textContent = book.title;
  document.getElementById("modalBookAuthor").textContent = book.author;
  document.getElementById("modalBookISBN").textContent = book.isbn;
  document.getElementById("modalBookCategory").textContent =
    book.category?.name || "N/A";
  document.getElementById("modalBookYear").textContent =
    book.publicationYear || "N/A";
  document.getElementById("modalBookPublisher").textContent =
    book.publisher || "N/A";
  document.getElementById(
    "modalBookCopies"
  ).textContent = `${book.availableCopies} / ${book.totalCopies}`;
  document.getElementById("modalBookDescription").textContent =
    book.description || "No description available";

  const closeButton = document.getElementById("closeModal");
  const modal = document.getElementById("bookDetailsModal");

  document.body.style.overflow = "hidden";

  closeButton.onclick = () => {
    modal.close();
    document.body.style.overflow = "";
  };

  modal.onclick = (event) => {
    if (event.target === modal) {
      modal.close();
      document.body.style.overflow = "";
    }
  };

  modal.addEventListener("close", () => {
    document.body.style.overflow = "";
  });
}

function initializeFilterToggle() {
  const toggleBtn = document.getElementById("toggleFilters");
  const filtersSection = document.getElementById("advancedFilters");
  const filterIcon = toggleBtn.querySelector(".filter-icon");

  toggleBtn.addEventListener("click", () => {
    filtersSection.classList.toggle("hidden");

    filterIcon.classList.toggle("expanded");

    const isExpanded = !filtersSection.classList.contains("hidden");
    toggleBtn.querySelector("span").textContent = isExpanded
      ? "Hide Filters"
      : "Filters";
  });
}

function populateCategoryFilter() {
  const categoryFilter = document.getElementById("categoryFilter");
  const cachedBooks = getCache("books");

  if (!cachedBooks || !cachedBooks.data || !cachedBooks.data.data) {
    console.log("No cached books data available for categories");
    return;
  }

  while (categoryFilter.children.length > 1) {
    categoryFilter.removeChild(categoryFilter.lastChild);
  }

  const categories = [
    ...new Set(cachedBooks.data.data.map((book) => book.category.name)),
  ];

  console.log("Found categories:", categories);

  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

function performSearch() {
  console.log("Performing search...");

  const searchTerm = document
    .getElementById("searchInput")
    .value.toLowerCase()
    .trim();
  const selectedCategory = document.getElementById("categoryFilter").value;
  const availability = document.getElementById("availabilityFilter").value;

  const cachedBooks = getCache("books");
  if (!cachedBooks || !cachedBooks.data || !cachedBooks.data.data) {
    console.log("No books data available for search");
    return;
  }

  let filteredBoodks = cachedBooks.data.data.filter((book) => {
    const matchesSearch =
      !searchTerm ||
      book.title.toLowerCase().includes(searchTerm) ||
      book.author.toLowerCase().includes(searchTerm) ||
      book.category.name.toLowerCase().includes(searchTerm);

    const matchesCategory =
      !selectedCategory || book.category.name === selectedCategory;

    const matchesAvailability =
      !availability ||
      (availability === "available" && book.availableCopies > 0) ||
      (availability === "unavailable" && book.availableCopies === 0);

    return matchesSearch && matchesCategory && matchesAvailability;
  });

  console.log(`Found ${filteredBoodks.length} books after filtering`);

  renderBooks({ success: true, data: filteredBoodks });
}

function clearSearch(event) {
  console.log("Clearing search...");

  if (event) {
    event.stopPropagation();
    event.preventDefault();
  }
  document.getElementById("searchInput").value = "";
  document.getElementById("categoryFilter").value = "";
  document.getElementById("availabilityFilter").value = "";

  loadBooks();
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function initializeSearch() {
  const searchBtn = document.getElementById("searchBtn");
  const clearBtn = document.getElementById("clearSearch");
  const searchInput = document.getElementById("searchInput");
  const categoryFilter = document.getElementById("categoryFilter");
  const availabilityFilter = document.getElementById("availabilityFilter");

  searchBtn.addEventListener("click", performSearch);
  clearBtn.addEventListener("click", clearSearch);
  searchInput.addEventListener("input", debounce(performSearch, 300));
  categoryFilter.addEventListener("change", performSearch);
  availabilityFilter.addEventListener("change", performSearch);

  console.log("Search functionality initialized");
}

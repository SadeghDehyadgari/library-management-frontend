const BASE_URL = "https://karyar-library-management-system.liara.run/api";

async function loginUser(credentials) {
  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Invalid credentials");
    }
    return data;
  } catch (err) {
    throw new Error(err.message || "Can not log in");
  }
}

function getAuthHeaders() {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

async function getCurrentUserProfile() {
  try {
    const response = await fetch(`${BASE_URL}/auth/me`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to get user's info");
    }

    return data;
  } catch (err) {
    throw new Error(err.message || "There was a problem receiving user info");
  }
}

async function getBooks() {
  try {
    const response = await fetch(`${BASE_URL}/books`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error receiving list of books");
    }

    return data;
  } catch (err) {
    throw new Error(err.message || "Unable to connect to server");
  }
}

async function borrowBook(bookId) {
  try {
    console.log(`Borrowing book by id: ${bookId}`);
    const userId = getUserIdFromToken();
    if (!userId) {
      throw new Error("User ID not found in token");
    }
    const response = await fetch(`${BASE_URL}/loans`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        bookId: bookId,
        userId: userId,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Unable to borrow book");
    }

    console.log("Book successfully borrowed");
    return data;
  } catch (err) {
    console.error(`Error borrowing book ${err}`);
    throw new Error(err.message || "Unable to borrow book");
  }
}

async function getMyLoans() {
  try {
    const response = await fetch(`${BASE_URL}/loans/my-loans`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Unable to fetch loans");
    }

    return data;
  } catch (err) {
    console.error(err);
    throw new Error(err.message || "Unabel to fetch loans");
  }
}

async function returnBook(loanId) {
  try {
    console.log("Returning book...");

    const response = await fetch(`${BASE_URL}/loans/${loanId}/return`, {
      method: "POST",
      headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Unable to return book");
    }

    return data;
  } catch (err) {
    console.error(err);
    throw new Error(err.message || "Unable to return book");
  }
}

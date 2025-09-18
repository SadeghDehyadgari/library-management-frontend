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

const API_URL = import.meta.env.VITE_API_URL;

// 🔹 LOGIN
export const loginUser = async (payload) => {
  const res = await fetch(`${API_URL}/api/v1/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    credentials: "include", // ✅ REQUIRED FOR COOKIES
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "Login failed");
  }

  // backend sends { user }
  return json.data;
};

// 🔹 REGISTER
export const registerUser = async (payload) => {
  const res = await fetch(`${API_URL}/api/v1/users/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    credentials: "include", // ✅ REQUIRED
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "Registration failed");
  }

  return json.data;
};

// 🔹 GET CURRENT USER (PERSIST LOGIN)
export const getCurrentUser = async () => {
  const res = await fetch(`${API_URL}/api/v1/users/me`, {
    method: "GET",
    credentials: "include", // ✅ SEND COOKIES
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "Failed to fetch user");
  }

  return json.data;
};

// 🔹 LOGOUT
export const logoutUser = async () => {
  await fetch(`${API_URL}/api/v1/users/logout`, {
    method: "POST",
    credentials: "include", // ✅ CLEAR COOKIE ON BACKEND
  });
};

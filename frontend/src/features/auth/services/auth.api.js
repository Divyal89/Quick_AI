import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

export async function register({ username, email, password }) {
  try {
    const response = await api.post("/api/auth/register", {
      username,
      email,
      password,
    });

    return response.data;
  } catch (err) {
    console.log("Backend Error:", err.response?.data);
    throw err;
  }
}

export async function login({ email, password }) {
  try {
    const response = await api.post("/api/auth/login", {
      email,
      password,
    });

    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function getMe() {
  try {
    const response = await api.get("/api/auth/get-me", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function logout() {
  try {
    const response = await api.get("/api/auth/logout", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

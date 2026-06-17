import api from "./api";

export async function register({ username, email, password }) {
  const response = await api.post("register/", { username, email, password });
  return response.data;
}

export async function login({ username, password }) {
  const response = await api.post("login/", { username, password });
  return response.data;
}

export async function refreshToken(refresh) {
  const response = await api.post("login/refresh/", { refresh });
  return response.data;
}

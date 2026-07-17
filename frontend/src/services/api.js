import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  withCredentials: true,
});

// Attach Access Token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function uploadLinkedInPdf(file) {
  const form = new FormData();
  form.append("pdf", file);

  return api
    .post("/api/linkedin/import", form, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((res) => res.data);
}

// Auto refresh expired token
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
        const refresh = await axios.get(
          `${API_URL}/auth/refresh-token`,
          { withCredentials: true }
        );

        const newAccessToken = refresh.data.accessToken;

        // Save new token
        localStorage.setItem("accessToken", newAccessToken);

        // Retry original request
        original.headers.Authorization = `Bearer ${newAccessToken}`;

        return api(original);
      } catch {
        console.log("Session expired, redirecting to login");
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5000", // change when deploying
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

export async function uploadLinkedInPdf(file, userId) {
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
        const refresh = await axios.get(
          "http://localhost:5000/auth/refresh-token",
          { withCredentials: true }
        );

        const newAccessToken = refresh.data.accessToken;

        // Save new token
        localStorage.setItem("accessToken", newAccessToken);

        // Retry original request
        original.headers.Authorization = `Bearer ${newAccessToken}`;

        return api(original);
      } catch (err) {
        console.log("Session expired, redirecting to login");
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

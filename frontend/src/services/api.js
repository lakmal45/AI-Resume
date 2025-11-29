import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5000", // change when deploying
});

// Attach JWT from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
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

import React, { useEffect, useState, useRef } from "react";
import { uploadLinkedInPdf } from "../services/api";
import DashboardLayout from "../layouts/DashboardLayout";
import ResumeCard from "../components/ResumeCard";
import { api } from "../services/api";
import Button from "../components/ui/Button";

export default function LinkedInImport() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef();

  // Fetch LinkedIn resumes only
  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/api/resumes");
        // Filter only LinkedIn imported resumes
        const linkedInResumes = res.data.filter((r) => r.source === "linkedin");

        setResumes(linkedInResumes);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const getUserIdFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        window
          .atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      const decoded = JSON.parse(jsonPayload);
      return decoded._id || decoded.id || decoded.userId;
    } catch {
      return null;
    }
  };

  // Handle file input
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.type === "application/pdf") {
      setFile(selected);
      setError("");
    } else {
      setFile(null);
      setError("Please select a valid PDF.");
    }
  };

  // Upload PDF
  const handleUpload = async () => {
    if (!file) return;

    setIsLoading(true);
    setError("");

    try {
      let userId = null;
      const localUser = localStorage.getItem("user");
      if (localUser) {
        const parsed = JSON.parse(localUser);
        userId = parsed._id;
      }
      if (!userId) userId = getUserIdFromToken();

      const res = await uploadLinkedInPdf(file, userId);

      if (res.success) {
        setResumes((prev) => [...prev, res.data]); // add new resume to list
        setModalOpen(false);
        setFile(null);
      }
      if (res.success) {
        window.location.href = `/editor/${res.data._id}`;
      }
    } catch (e) {
      setError(e.response?.data?.message || "Upload failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">LinkedIn Import Resumes</h2>
        <Button onClick={() => setModalOpen(true)}>Import PDF</Button>
      </div>

      {/* LOADING */}
      {loading ? (
        <p>Loading...</p>
      ) : resumes.length === 0 ? (
        <p>No LinkedIn import resumes here.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {resumes.map((r) => (
            <ResumeCard
              key={r._id}
              resume={r}
              onClick={() => (window.location.href = `/editor/${r._id}`)}
            />
          ))}
        </div>
      )}

      {/* IMPORT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-center">
              Import LinkedIn PDF
            </h2>

            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition">
              <div className="flex flex-col items-center pt-5 pb-6">
                <p className="mb-2 text-sm text-gray-500 font-semibold">
                  Click to upload PDF
                </p>
                <p className="text-xs text-gray-500">Max 5MB</p>
              </div>
              <input
                type="file"
                className="hidden"
                ref={fileInputRef}
                accept=".pdf"
                onChange={handleFileChange}
              />
            </label>

            {file && (
              <p className="mt-2 text-sm text-green-600 truncate">
                {file.name}
              </p>
            )}

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mt-4">
                {error}
              </div>
            )}

            <button
              onClick={handleUpload}
              disabled={!file || isLoading}
              className={`w-full mt-6 py-3 px-4 rounded-lg text-white font-medium ${
                !file || isLoading
                  ? "bg-gray-400"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isLoading ? "Analyzing..." : "Generate Resume"}
            </button>

            <button
              onClick={() => setModalOpen(false)}
              className="w-full mt-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

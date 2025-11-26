import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // ⭐ UPDATED
import { api } from "../services/api";
import ResumeCard from "../components/ResumeCard.jsx";
import { DeleteModal } from "../components/DeleteModal.jsx";

export default function Dashboard() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // ⭐ ADDED
  const [toast, setToast] = useState(location.state?.toast || ""); // ⭐ ADDED

  const fetchResumes = async () => {
    try {
      const res = await api.get("/api/resumes");
      setResumes(res.data || []);
    } catch (err) {
      console.error("Failed to fetch resumes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  // ⭐ ADDED – auto-hide toast after 2s
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(""), 2000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const handleNew = () => {
    navigate("/editor/new");
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await api.delete(`/api/resumes/${deleteId}`);
      setResumes((prev) => prev.filter((r) => r._id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      alert("Failed to delete resume");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Your resumes</h2>

        <button
          onClick={handleNew}
          className="px-4 py-2 rounded-lg bg-purple-500 text-white font-semibold hover:bg-purple-600"
        >
          + New Resume
        </button>
      </div>

      {loading ? (
        <p className="text-base-subt">Loading...</p>
      ) : resumes.length === 0 ? (
        <p className="text-base-subt">
          No resumes yet. Click "New Resume" to create your first one.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {resumes.map((r) => (
            <ResumeCard
              key={r._id}
              resume={r}
              onClick={() => navigate(`/editor/${r._id}`)}
              onDelete={() => setDeleteId(r._id)}
            />
          ))}
        </div>
      )}

      {/* DELETE CONFIRMATION */}
      <DeleteModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        loading={deleting}
      />

      {/* ⭐ ADDED – dashboard toast (used when coming back from Editor) */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-black text-white px-4 py-2 rounded-lg text-sm shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}

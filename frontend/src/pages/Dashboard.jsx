import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import ResumeCard from "../components/ResumeCard.jsx";
import { DeleteModal } from "../components/DeleteModal.jsx";

export default function Dashboard() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

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

  const handleNew = () => {
    // Navigate to a fresh editor; it will only create on first save if user types.
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
          className="px-4 py-2 rounded-lg bg-primary-500 text-white font-semibold hover:bg-primary-hover"
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
    </div>
  );
}

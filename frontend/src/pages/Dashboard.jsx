import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { api } from "../services/api";
import DashboardLayout from "../layouts/DashboardLayout";
import ResumeCard from "../components/ResumeCard";
import { DeleteModal } from "../components/DeleteModal";
import Button from "../components/ui/Button";

export default function Dashboard() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const [toast, setToast] = useState(location.state?.toast || "");

  useEffect(() => {
    if (location.state?.toast) {
      navigate(location.pathname, { replace: true });
    }
  }, []);

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const res = await api.get("/api/resumes");
        setResumes(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchResumes();
  }, []);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(""), 2000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Your resumes</h2>
        <Button variant="default" onClick={() => navigate("/editor/new")}>
          + New Resume
        </Button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : resumes.length === 0 ? (
        <p>No resumes yet.</p>
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

      <DeleteModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={async () => {
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
        }}
        loading={deleting}
      />

      {toast && (
        <div
          className="
      fixed bottom-6 right-6 
      bg-primary text-white shadow-lg
      px-5 py-3 rounded-xl text-sm font-medium
      animate-toast
    "
        >
          {toast}
        </div>
      )}
    </DashboardLayout>
  );
}

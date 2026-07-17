import React, { useEffect, useState, useRef } from "react";
import { uploadLinkedInPdf } from "../services/api";
import ResumeCard from "../components/ResumeCard";
import { api } from "../services/api";
import {
  Upload, FileText, Linkedin, X, CheckCircle, AlertCircle,
  CloudUpload, File, Sparkles,
} from "lucide-react";

export default function LinkedInImport() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef();

  // Fetch LinkedIn resumes only
  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/api/resumes");
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

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.type === "application/pdf") {
      setFile(selected);
      setError("");
    } else {
      setFile(null);
      setError("Please select a valid PDF file.");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped && dropped.type === "application/pdf") {
      setFile(dropped);
      setError("");
    } else {
      setError("Please drop a valid PDF file.");
    }
  };

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
        setResumes((prev) => [...prev, res.data]);
        setModalOpen(false);
        setFile(null);
        window.location.href = `/editor/${res.data._id}`;
      }
    } catch (e) {
      setError(e.response?.data?.message || "Upload failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .li-root { max-width: 1100px; margin: 0 auto; }

        /* Header card */
        .li-header {
          background: linear-gradient(135deg, #0077b5, #0a66c2, #004182);
          border-radius: 20px;
          padding: 32px 36px;
          color: white;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 28px;
          position: relative;
          overflow: hidden;
        }
        .li-header::before {
          content: '';
          position: absolute;
          top: -40%;
          right: -10%;
          width: 280px;
          height: 280px;
          border-radius: 50%;
          background: rgba(255,255,255,0.08);
        }
        .li-header-text h1 { font-size: 24px; font-weight: 700; margin: 0 0 6px; position: relative; z-index: 1; }
        .li-header-text p { font-size: 14px; opacity: 0.85; margin: 0; position: relative; z-index: 1; }
        .li-header-btn {
          padding: 11px 22px;
          border-radius: 12px;
          background: rgba(255,255,255,0.2);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.3);
          color: white;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s;
          position: relative;
          z-index: 1;
          white-space: nowrap;
        }
        .li-header-btn:hover { background: rgba(255,255,255,0.35); transform: translateY(-1px); }
        @media(max-width:600px){
          .li-header { flex-direction: column; align-items: flex-start; gap: 16px; padding: 24px; }
        }

        /* How it works */
        .li-steps {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 28px;
        }
        @media(max-width:700px){ .li-steps { grid-template-columns: 1fr; } }
        .li-step {
          background: var(--c-card);
          border: 1px solid var(--c-border);
          border-radius: 16px;
          padding: 22px;
          text-align: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.03);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .li-step:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.06); }
        .li-step-num {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: #ede9fe;
          color: #6366f1;
          font-size: 15px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 12px;
        }
        .li-step-title { font-size: 14px; font-weight: 600; color: var(--c-dark); margin-bottom: 4px; }
        .li-step-desc { font-size: 12px; color: var(--c-mutedTxt); line-height: 1.5; }

        /* Section */
        .li-section-title { font-size: 18px; font-weight: 700; color: var(--c-dark); margin: 0 0 4px; }
        .li-section-sub { font-size: 13px; color: var(--c-mutedTxt); margin: 0 0 20px; }

        /* Grid */
        .li-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 18px;
        }

        /* Empty */
        .li-empty {
          text-align: center;
          padding: 48px 20px;
          background: var(--c-card);
          border: 2px dashed var(--c-border);
          border-radius: 20px;
        }
        .li-empty-icon {
          width: 64px;
          height: 64px;
          border-radius: 16px;
          background: linear-gradient(135deg, rgba(0,119,181,0.1), rgba(10,102,194,0.1));
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
        }
        .li-empty h3 { font-size: 16px; font-weight: 600; color: var(--c-dark); margin: 0 0 6px; }
        .li-empty p { font-size: 13px; color: var(--c-mutedTxt); margin: 0 0 20px; }
        .li-empty-btn {
          padding: 10px 20px;
          border-radius: 10px;
          background: linear-gradient(135deg, #0077b5, #0a66c2);
          color: #fff;
          border: none;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          transition: all 0.2s;
          box-shadow: 0 2px 10px rgba(0,119,181,0.3);
        }
        .li-empty-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 16px rgba(0,119,181,0.4); }

        /* Loading skeleton */
        @keyframes li-shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        .li-skeleton {
          height: 140px;
          border-radius: 16px;
          background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
          background-size: 200% 100%;
          animation: li-shimmer 1.5s ease-in-out infinite;
        }

        /* ── MODAL ──────────────────────────── */
        .li-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.4);
          backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
          animation: li-fadeIn 0.2s;
        }
        @keyframes li-fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .li-modal {
          background: var(--c-card);
          border-radius: 22px;
          width: 100%;
          max-width: 460px;
          margin: 16px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.2);
          animation: li-slideUp 0.3s ease;
          overflow: hidden;
        }
        @keyframes li-slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .li-modal-header {
          padding: 24px 28px 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--c-border);
        }
        .li-modal-title { font-size: 18px; font-weight: 700; color: var(--c-dark); display: flex; align-items: center; gap: 10px; }
        .li-modal-close {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: var(--c-bg);
          border: 1px solid var(--c-border);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: var(--c-mutedTxt);
          transition: all 0.15s;
        }
        .li-modal-close:hover { background: #fef2f2; color: #ef4444; border-color: #fecaca; }
        .li-modal-body { padding: 24px 28px; }

        /* Drop zone */
        .li-dropzone {
          border: 2px dashed #cbd5e1;
          border-radius: 16px;
          padding: 32px 20px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
          background: var(--c-bg);
        }
        .li-dropzone:hover, .li-dropzone.drag-over {
          border-color: #6366f1;
          background: var(--c-primaryLt);
        }
        .li-dropzone-icon {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          background: #ede9fe;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 14px;
        }
        .li-dropzone-text { font-size: 14px; font-weight: 500; color: var(--c-dark); margin-bottom: 4px; }
        .li-dropzone-sub { font-size: 12px; color: var(--c-mutedTxt); }

        /* File preview */
        .li-file-preview {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 16px;
          padding: 12px 14px;
          background: var(--c-bg);
          border: 1px solid var(--c-border);
          border-radius: 12px;
        }
        .li-file-icon {
          width: 38px;
          height: 38px;
          border-radius: 9px;
          background: #dcfce7;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .li-file-name { font-size: 13px; font-weight: 500; color: var(--c-dark); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .li-file-size { font-size: 11px; color: var(--c-mutedTxt); margin-top: 1px; }
        .li-file-remove {
          margin-left: auto;
          width: 28px;
          height: 28px;
          border-radius: 6px;
          background: none;
          border: none;
          cursor: pointer;
          color: var(--c-mutedTxt);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.15s;
        }
        .li-file-remove:hover { color: #ef4444; }

        /* Error */
        .li-error {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 14px;
          padding: 10px 14px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 10px;
          font-size: 13px;
          color: #ef4444;
        }

        /* Modal actions */
        .li-modal-actions {
          padding: 18px 28px;
          border-top: 1px solid var(--c-border);
          display: flex;
          gap: 10px;
          justify-content: flex-end;
          background: var(--c-bg);
        }
        .li-btn-cancel {
          padding: 10px 18px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 500;
          color: var(--c-mutedTxt);
          background: var(--c-bg);
          border: 1px solid var(--c-border);
          cursor: pointer;
          transition: all 0.15s;
        }
        .li-btn-cancel:hover { background: var(--c-border); color: var(--c-dark); }
        .li-btn-upload {
          padding: 10px 22px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          color: #fff;
          background: linear-gradient(135deg, #6366f1, #4f46e5);
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 7px;
          transition: all 0.2s;
          box-shadow: 0 2px 8px rgba(99,102,241,0.3);
        }
        .li-btn-upload:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
        .li-btn-upload:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

        /* Spinner */
        @keyframes li-spin { to { transform: rotate(360deg); } }
        .li-spinner {
          width: 15px;
          height: 15px;
          border: 2px solid rgba(255,255,255,0.4);
          border-top-color: #fff;
          border-radius: 50%;
          animation: li-spin 0.7s linear infinite;
        }
      `}</style>

      <div className="li-root">
        {/* Header */}
        <div className="li-header">
          <div className="li-header-text">
            <h1><Linkedin size={22} style={{ display: "inline", verticalAlign: "middle", marginRight: 8 }} />LinkedIn Import</h1>
            <p>Turn your LinkedIn profile into a polished, ATS-optimized resume</p>
          </div>
          <button className="li-header-btn" onClick={() => setModalOpen(true)}>
            <Upload size={16} /> Import PDF
          </button>
        </div>

        {/* How it works steps */}
        <div className="li-steps">
          <div className="li-step">
            <div className="li-step-num">1</div>
            <div className="li-step-title">Export from LinkedIn</div>
            <div className="li-step-desc">Go to LinkedIn Settings → Data Privacy → Get a copy of your data → Download PDF</div>
          </div>
          <div className="li-step">
            <div className="li-step-num">2</div>
            <div className="li-step-title">Upload PDF</div>
            <div className="li-step-desc">Drop your LinkedIn PDF file here and our AI will extract all your information</div>
          </div>
          <div className="li-step">
            <div className="li-step-num">3</div>
            <div className="li-step-title">Edit & Export</div>
            <div className="li-step-desc">Customize your generated resume with our editor and export it in any format</div>
          </div>
        </div>

        {/* Section header */}
        <h2 className="li-section-title">Imported Resumes</h2>
        <p className="li-section-sub">Resumes created from your LinkedIn profile</p>

        {/* Content */}
        {loading ? (
          <div className="li-grid">
            {[1,2,3].map(i => <div key={i} className="li-skeleton" />)}
          </div>
        ) : resumes.length === 0 ? (
          <div className="li-empty">
            <div className="li-empty-icon"><Linkedin size={28} color="#0077b5" /></div>
            <h3>No LinkedIn imports yet</h3>
            <p>Upload your LinkedIn PDF to generate an AI-powered resume</p>
            <button className="li-empty-btn" onClick={() => setModalOpen(true)}>
              <Upload size={15} /> Import Your First PDF
            </button>
          </div>
        ) : (
          <div className="li-grid">
            {resumes.map((r) => (
              <ResumeCard
                key={r._id}
                resume={r}
                onClick={() => (window.location.href = `/editor/${r._id}`)}
              />
            ))}
          </div>
        )}

        {/* Import Modal */}
        {modalOpen && (
          <div className="li-modal-overlay" onClick={() => setModalOpen(false)}>
            <div className="li-modal" onClick={(e) => e.stopPropagation()}>
              <div className="li-modal-header">
                <div className="li-modal-title"><Linkedin size={18} color="#0077b5" /> Import LinkedIn PDF</div>
                <button className="li-modal-close" onClick={() => setModalOpen(false)}><X size={16} /></button>
              </div>

              <div className="li-modal-body">
                <div
                  className={`li-dropzone ${dragOver ? "drag-over" : ""}`}
                  onClick={() => fileInputRef.current.click()}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                >
                  <div className="li-dropzone-icon"><CloudUpload size={24} color="#6366f1" /></div>
                  <div className="li-dropzone-text">Drop your PDF here, or click to browse</div>
                  <div className="li-dropzone-sub">Supports LinkedIn export PDF files (max 5MB)</div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept=".pdf"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                </div>

                {file && (
                  <div className="li-file-preview">
                    <div className="li-file-icon"><File size={16} color="#22c55e" /></div>
                    <div style={{ overflow: "hidden", flex: 1 }}>
                      <div className="li-file-name">{file.name}</div>
                      <div className="li-file-size">{(file.size / 1024).toFixed(0)} KB</div>
                    </div>
                    <button className="li-file-remove" onClick={() => setFile(null)}><X size={14} /></button>
                  </div>
                )}

                {error && (
                  <div className="li-error"><AlertCircle size={15} />{error}</div>
                )}
              </div>

              <div className="li-modal-actions">
                <button className="li-btn-cancel" onClick={() => { setModalOpen(false); setFile(null); setError(""); }}>Cancel</button>
                <button className="li-btn-upload" disabled={!file || isLoading} onClick={handleUpload}>
                  {isLoading ? <><span className="li-spinner" /> Analyzing...</> : <><Sparkles size={14} /> Generate Resume</>}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

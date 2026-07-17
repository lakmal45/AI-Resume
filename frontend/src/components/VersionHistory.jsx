import React, { useCallback, useState, useEffect } from "react";
import { api } from "../services/api";
import { useToast } from "../context/ToastContext";
import { X, Clock, RotateCcw, FileText, ChevronRight, Loader2 } from "lucide-react";

export default function VersionHistory({ resumeId, onClose, onRestore }) {
  const { toast } = useToast();
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchVersions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/resumes/${resumeId}/versions`);
      setVersions(res.data);
    } catch (err) {
      toast("Failed to load version history", "error");
    } finally {
      setLoading(false);
    }
  }, [resumeId, toast]);

  useEffect(() => {
    fetchVersions();
  }, [fetchVersions]);

  const handleRestore = async (version) => {
    if (!window.confirm("Restore this version? Unsaved changes will be lost.")) return;
    
    try {
      // 1. Update the backend resume with the old version data
      const res = await api.put(`/api/resumes/${resumeId}`, {
        resumeJson: version.resumeJson,
        title: version.title,
        template: version.template
      });
      // 2. Call parent callback to update frontend state
      onRestore(res.data);
      toast("Version restored successfully", "success");
      onClose();
    } catch (err) {
      toast("Failed to restore version", "error");
    }
  };

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleString();
  };

  return (
    <div style={{
      position: "fixed",
      top: 0,
      right: 0,
      width: 350,
      height: "100vh",
      background: "var(--c-card)",
      borderLeft: "1px solid var(--c-border)",
      boxShadow: "-8px 0 32px rgba(0,0,0,0.08)",
      zIndex: 100,
      display: "flex",
      flexDirection: "column",
      animation: "slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
    }}>
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        
        .vh-header {
          padding: 20px;
          border-bottom: 1px solid var(--c-border);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .vh-title {
          font-size: 16px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--c-dark);
        }
        .vh-close {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--c-muted-txt);
          padding: 4px;
          border-radius: 6px;
        }
        .vh-close:hover {
          background: var(--c-bg);
          color: var(--c-dark);
        }
        
        .vh-content {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .vh-item {
          padding: 14px;
          border-radius: 12px;
          border: 1px solid var(--c-border);
          background: var(--c-bg);
          transition: all 0.2s;
          cursor: pointer;
        }
        .vh-item:hover {
          border-color: var(--c-primary-lt);
          background: var(--c-card);
          box-shadow: 0 4px 12px rgba(0,0,0,0.03);
        }
        
        .vh-item-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        .vh-item-time {
          font-size: 12px;
          font-weight: 500;
          color: var(--c-primary);
          display: flex;
          align-items: center;
          gap: 4px;
        }
        
        .vh-item-title {
          font-size: 14px;
          font-weight: 600;
          color: var(--c-dark);
          margin-bottom: 4px;
        }
        
        .vh-item-meta {
          font-size: 12px;
          color: var(--c-muted-txt);
          display: flex;
          align-items: center;
          gap: 6px;
        }
        
        .vh-restore-btn {
          width: 100%;
          padding: 8px;
          border-radius: 8px;
          border: 1px solid var(--c-primary-bdr);
          background: var(--c-bg);
          color: var(--c-primary);
          font-size: 13px;
          font-weight: 500;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          cursor: pointer;
          margin-top: 12px;
          transition: all 0.2s;
        }
        .vh-restore-btn:hover {
          background: var(--c-primary);
          color: white;
        }
      `}</style>

      <div className="vh-header">
        <div className="vh-title">
          <Clock size={18} color="var(--c-primary)" />
          Version History
        </div>
        <button className="vh-close" onClick={onClose}>
          <X size={18} />
        </button>
      </div>

      <div className="vh-content">
        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 200, color: "var(--c-muted-txt)" }}>
            <Loader2 size={24} className="animate-spin" style={{ marginBottom: 12 }} />
            Loading versions...
          </div>
        ) : versions.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--c-muted-txt)", fontSize: 14 }}>
            No versions saved yet. 
            <br/><br/>
            Versions are automatically saved when you make changes.
          </div>
        ) : (
          versions.map((v, index) => (
            <div key={v._id} className="vh-item">
              <div className="vh-item-top">
                <div className="vh-item-time">
                  <Clock size={12} /> {index === 0 ? "Latest Version" : formatTime(v.createdAt)}
                </div>
              </div>
              <div className="vh-item-title">
                {v.title || "Untitled Resume"}
              </div>
              <div className="vh-item-meta">
                <FileText size={12} /> Template: {v.template || "Minimal"}
              </div>
              
              {index !== 0 && (
                <button className="vh-restore-btn" onClick={() => handleRestore(v)}>
                  <RotateCcw size={14} /> Restore this version
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

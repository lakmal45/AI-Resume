import React, { useCallback, useState, useEffect } from "react";
import { api } from "../services/api";
import { useToast } from "../context/ToastContext";
import { Briefcase, Building, MapPin, Link2, Plus, Clock, FileText, ChevronRight, Edit2, Trash2, X } from "lucide-react";

const C = {
  primary: "var(--c-primary)",
  primaryDk: "var(--c-primary-dk)",
  primaryDkr: "var(--c-primary-dkr)",
  primaryLt: "var(--c-primary-lt)",
  primaryBdr: "var(--c-primary-bdr)",
  primaryTxt: "var(--c-primary-txt)",
  bg: "var(--c-bg)",
  card: "var(--c-card)",
  border: "var(--c-border)",
  muted: "var(--c-muted-txt)",
  dark: "var(--c-dark)",
};

const S = `
.jt-root{max-width:1100px;margin:0 auto;font-family:'Inter','Segoe UI',sans-serif;}

/* ── Banner ─────────────────────────────── */
.jt-banner{background:linear-gradient(135deg,#0077b5,#0a66c2,#004182);border-radius:22px;padding:28px 36px;color:#fff;margin-bottom:24px;position:relative;overflow:hidden;display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;}
.jt-banner::before{content:'';position:absolute;top:-50px;right:-50px;width:220px;height:220px;border-radius:50%;background:rgba(255,255,255,0.07);}
.jt-banner::after{content:'';position:absolute;bottom:-80px;left:30%;width:200px;height:200px;border-radius:50%;background:rgba(255,255,255,0.05);}
.jt-banner h1{font-size:23px;font-weight:700;margin:0 0 4px;position:relative;z-index:1;}
.jt-banner p{font-size:13px;opacity:.82;margin:0;position:relative;z-index:1;}
.jt-banner-left{position:relative;z-index:1;}

/* ── Add Button ─────────────────────────── */
.jt-add-btn{position:relative;z-index:1;padding:10px 22px;border-radius:12px;border:none;background:rgba(255,255,255,.15);color:#fff;border:1px solid rgba(255,255,255,.3);font-size:13px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:8px;transition:all .2s;white-space:nowrap;}
.jt-add-btn:hover{background:rgba(255,255,255,.28);transform:translateY(-1px);}

/* ── Kanban Columns ─────────────────────── */
.jt-columns{display:flex;gap:18px;overflow-x:auto;padding-bottom:8px;scroll-snap-type:x mandatory;}
.jt-column{flex-shrink:0;width:280px;background:var(--c-card);border:1px solid var(--c-border);border-radius:18px;display:flex;flex-direction:column;scroll-snap-align:center;overflow:hidden;box-shadow:0 2px 8px rgba(0,119,181,0.04);}

/* ── Column Header ──────────────────────── */
.jt-col-header{padding:14px 16px;border-bottom:1px solid var(--c-border);display:flex;justify-content:space-between;align-items:center;}
.jt-col-header h3{font-weight:600;color:var(--c-dark);text-transform:uppercase;letter-spacing:.06em;font-size:11px;margin:0;}
.jt-col-count{background:var(--c-bg);border:1px solid var(--c-border);color:var(--c-muted-txt);font-size:11px;padding:2px 9px;border-radius:20px;font-weight:600;}

/* ── Job Cards ──────────────────────────── */
.jt-cards{flex:1;padding:12px;display:flex;flex-direction:column;gap:10px;min-height:350px;}
.jt-card{background:var(--c-bg);border:1px solid var(--c-border);padding:14px 16px;border-radius:14px;cursor:grab;transition:all .2s;position:relative;}
.jt-card:hover{box-shadow:0 4px 14px rgba(0,119,181,0.1);border-color:var(--c-primary);transform:translateY(-1px);}
.jt-card:active{cursor:grabbing;}
.jt-card-actions{position:absolute;top:10px;right:10px;display:flex;gap:6px;opacity:0;transition:opacity .15s;}
.jt-card:hover .jt-card-actions{opacity:1;}
.jt-card-action{background:none;border:none;cursor:pointer;padding:4px;border-radius:6px;color:var(--c-muted-txt);transition:all .15s;display:flex;align-items:center;justify-content:center;}
.jt-card-action:hover{background:var(--c-border);color:var(--c-primary);}
.jt-card-action.del:hover{color:#ef4444;}
.jt-card-role{font-size:13px;font-weight:700;color:var(--c-dark);padding-right:48px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.jt-card-company{font-size:12px;color:var(--c-muted-txt);margin-top:4px;display:flex;align-items:center;gap:5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.jt-card-link{font-size:11px;color:var(--c-primary);display:inline-flex;align-items:center;gap:4px;margin-top:10px;text-decoration:none;font-weight:500;}
.jt-card-link:hover{text-decoration:underline;}
.jt-card-footer{margin-top:12px;padding-top:10px;border-top:1px solid var(--c-border);display:flex;justify-content:space-between;align-items:center;font-size:11px;color:var(--c-muted-txt);}

/* ── Empty Column ───────────────────────── */
.jt-empty{flex:1;display:flex;align-items:center;justify-content:center;border:2px dashed var(--c-border);border-radius:12px;margin:4px;color:var(--c-muted-txt);font-size:12px;font-weight:500;}

/* ── Modal ──────────────────────────────── */
.jt-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.4);backdrop-filter:blur(4px);z-index:50;display:flex;align-items:center;justify-content:center;padding:16px;}
.jt-modal{background:var(--c-card);border:1px solid var(--c-border);border-radius:20px;width:100%;max-width:520px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,0.2);}
.jt-modal-header{padding:18px 24px;border-bottom:1px solid var(--c-border);display:flex;justify-content:space-between;align-items:center;}
.jt-modal-title{font-size:18px;font-weight:700;color:var(--c-dark);margin:0;}
.jt-modal-close{background:none;border:none;cursor:pointer;color:var(--c-muted-txt);padding:4px;border-radius:8px;display:flex;align-items:center;transition:all .15s;}
.jt-modal-close:hover{background:var(--c-border);color:var(--c-dark);}
.jt-modal-body{padding:20px 24px;display:flex;flex-direction:column;gap:14px;}
.jt-form-row{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
@media(max-width:500px){.jt-form-row{grid-template-columns:1fr;}}
.jt-label{display:block;font-size:11px;font-weight:600;color:var(--c-muted-txt);text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px;}
.jt-label span{color:#ef4444;}
.jt-input{width:100%;padding:10px 14px;border:1.5px solid var(--c-border);border-radius:10px;font-size:13px;color:var(--c-dark);background:var(--c-bg);outline:none;transition:all .2s;font-family:inherit;}
.jt-input:focus{border-color:#0077b5;box-shadow:0 0 0 3px rgba(0,119,181,.08);}
.jt-textarea{width:100%;padding:10px 14px;border:1.5px solid var(--c-border);border-radius:10px;font-size:13px;color:var(--c-dark);background:var(--c-bg);outline:none;transition:all .2s;font-family:inherit;resize:none;min-height:80px;}
.jt-textarea:focus{border-color:#0077b5;box-shadow:0 0 0 3px rgba(0,119,181,.08);}
.jt-modal-footer{padding:16px 24px;border-top:1px solid var(--c-border);display:flex;justify-content:flex-end;gap:10px;}
.jt-btn-cancel{padding:9px 20px;border-radius:11px;border:1px solid var(--c-border);background:var(--c-card);font-size:13px;font-weight:600;color:var(--c-dark);cursor:pointer;transition:all .15s;}
.jt-btn-cancel:hover{background:var(--c-bg);}
.jt-btn-save{padding:9px 20px;border-radius:11px;border:none;background:linear-gradient(135deg,#0077b5,#0a66c2);color:#fff;font-size:13px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:6px;transition:all .2s;box-shadow:0 2px 10px rgba(0,119,181,0.3);}
.jt-btn-save:hover{opacity:.9;transform:translateY(-1px);}

/* ── Spinner ────────────────────────────── */
@keyframes jt-spin{to{transform:rotate(360deg);}}
.jt-spinner{width:32px;height:32px;border:3px solid var(--c-border);border-top-color:var(--c-primary);border-radius:50%;animation:jt-spin .7s linear infinite;margin:80px auto;}

@media(max-width:640px){
  .jt-banner{flex-direction:column;align-items:flex-start;padding:22px 20px;}
  .jt-banner h1{font-size:20px;}
}
`;

export default function JobTracker() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJobId, setEditingJobId] = useState(null);
  const [formData, setFormData] = useState({
    company: "",
    role: "",
    jobUrl: "",
    status: "Applied",
    notes: ""
  });

  const fetchJobs = useCallback(async () => {
    try {
      const res = await api.get("/api/jobs");
      setJobs(res.data || []);
    } catch (err) {
      // Only show error toast for genuine server/network errors, not empty results
      const status = err?.response?.status;
      if (status && status !== 404) {
        toast("Failed to load jobs", "error");
      }
      // For 404 or no response status, silently set empty
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleOpenModal = (job = null) => {
    if (job) {
      setEditingJobId(job._id);
      setFormData({
        company: job.company,
        role: job.role,
        jobUrl: job.jobUrl || "",
        status: job.status,
        notes: job.notes || ""
      });
    } else {
      setEditingJobId(null);
      setFormData({ company: "", role: "", jobUrl: "", status: "Applied", notes: "" });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingJobId) {
        await api.put(`/api/jobs/${editingJobId}`, formData);
        toast("Job updated!", "success");
      } else {
        await api.post("/api/jobs", formData);
        toast("Job added!", "success");
      }
      setIsModalOpen(false);
      fetchJobs();
    } catch (err) {
      toast("Failed to save job", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this application?")) return;
    try {
      await api.delete(`/api/jobs/${id}`);
      toast("Job deleted", "success");
      fetchJobs();
    } catch (err) {
      toast("Failed to delete job", "error");
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await api.put(`/api/jobs/${id}`, { status: newStatus });
      fetchJobs();
    } catch (err) {
      toast("Failed to update status", "error");
    }
  };

  const COLUMNS = ["Applied", "Screening", "Interview", "Offer", "Rejected"];

  // Drag and drop handlers
  const onDragStart = (e, id) => {
    e.dataTransfer.setData("jobId", id);
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const onDrop = (e, targetStatus) => {
    const id = e.dataTransfer.getData("jobId");
    if (id) {
      updateStatus(id, targetStatus);
    }
  };

  return (
    <>
      <style>{S}</style>

      <div className="jt-root">
        {/* ── Banner ─────────────────────────── */}
        <div className="jt-banner">
          <div className="jt-banner-left">
            <h1>Job Tracker</h1>
            <p>Manage your job applications and interview pipeline</p>
          </div>
          <button className="jt-add-btn" onClick={() => handleOpenModal()}>
            <Plus size={15} /> Add Application
          </button>
        </div>

        {/* ── Kanban Board ───────────────────── */}
        {loading ? (
          <div className="jt-spinner" />
        ) : (
          <div className="jt-columns">
            {COLUMNS.map(col => (
              <div
                key={col}
                className="jt-column"
                onDragOver={onDragOver}
                onDrop={(e) => onDrop(e, col)}
              >
                <div className="jt-col-header">
                  <h3>{col}</h3>
                  <span className="jt-col-count">
                    {jobs.filter(j => j.status === col).length}
                  </span>
                </div>

                <div className="jt-cards">
                  {jobs.filter(j => j.status === col).map(job => (
                    <div
                      key={job._id}
                      draggable
                      onDragStart={(e) => onDragStart(e, job._id)}
                      className="jt-card"
                    >
                      <div className="jt-card-actions">
                        <button className="jt-card-action" onClick={() => handleOpenModal(job)}>
                          <Edit2 size={13} />
                        </button>
                        <button className="jt-card-action del" onClick={() => handleDelete(job._id)}>
                          <Trash2 size={13} />
                        </button>
                      </div>

                      <div className="jt-card-role">{job.role}</div>
                      <div className="jt-card-company">
                        <Building size={13} /> {job.company}
                      </div>

                      {job.jobUrl && (
                        <a href={job.jobUrl} target="_blank" rel="noreferrer" className="jt-card-link">
                          <Link2 size={11} /> View Job Post
                        </a>
                      )}

                      <div className="jt-card-footer">
                        <span>{new Date(job.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}

                  {jobs.filter(j => j.status === col).length === 0 && (
                    <div className="jt-empty">Drop here</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── MODAL ──────────────────────────── */}
        {isModalOpen && (
          <div className="jt-overlay" onClick={() => setIsModalOpen(false)}>
            <div className="jt-modal" onClick={e => e.stopPropagation()}>
              <div className="jt-modal-header">
                <h2 className="jt-modal-title">{editingJobId ? "Edit Application" : "New Application"}</h2>
                <button className="jt-modal-close" onClick={() => setIsModalOpen(false)}>
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="jt-modal-body">
                  <div className="jt-form-row">
                    <div>
                      <label className="jt-label">Company <span>*</span></label>
                      <input required type="text" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} className="jt-input" placeholder="Acme Inc." />
                    </div>
                    <div>
                      <label className="jt-label">Role <span>*</span></label>
                      <input required type="text" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="jt-input" placeholder="Frontend Developer" />
                    </div>
                  </div>

                  <div>
                    <label className="jt-label">Job Posting URL</label>
                    <input type="url" value={formData.jobUrl} onChange={e => setFormData({...formData, jobUrl: e.target.value})} className="jt-input" placeholder="https://..." />
                  </div>

                  <div>
                    <label className="jt-label">Status</label>
                    <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="jt-input">
                      {COLUMNS.map(col => <option key={col} value={col}>{col}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="jt-label">Notes</label>
                    <textarea rows="3" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="jt-textarea" placeholder="Any details..." />
                  </div>
                </div>

                <div className="jt-modal-footer">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="jt-btn-cancel">Cancel</button>
                  <button type="submit" className="jt-btn-save">Save Application</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

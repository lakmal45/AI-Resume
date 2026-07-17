import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import { useToast } from "../context/ToastContext";
import { PenTool, FileText, Download, Save, Copy, ChevronDown, CheckCircle2, Loader2 } from "lucide-react";
import AILoadingOverlay from "../components/AILoadingOverlay";

const C = {
  primary: "var(--c-primary)",
  primaryDk: "var(--c-primary-dk)",
  primaryLt: "var(--c-primary-lt)",
  primaryBdr: "var(--c-primary-bdr)",
  bg: "var(--c-bg)",
  card: "var(--c-card)",
  border: "var(--c-border)",
  text: "var(--c-dark)",
  muted: "var(--c-muted-txt)",
};

export default function CoverLetter() {
  const { toast } = useToast();
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [tone, setTone] = useState("professional");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  useEffect(() => {
    api.get("/api/resumes")
      .then(res => {
        setResumes(res.data || []);
        if (res.data?.length > 0) setSelectedResumeId(res.data[0]._id);
      })
      .catch((err) => {
        // Only show error toast for genuine server/network errors, not empty results
        const status = err?.response?.status;
        if (status && status !== 404) {
          toast("Failed to load resumes", "error");
        }
        setResumes([]);
      });
  }, [toast]);

  const generate = async () => {
    if (!selectedResumeId) return toast("Please select a resume", "error");
    if (!jobDescription || jobDescription.length < 20) return toast("Please provide a detailed job description", "error");
    
    setLoading(true);
    try {
      const res = await api.post("/api/cover-letter/generate", {
        resumeId: selectedResumeId,
        jobDescription,
        tone
      });
      setContent(res.data.content);
      toast("Cover letter generated successfully!", "success");
    } catch {
      toast("Failed to generate cover letter", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!content) return;
    setSaving(true);
    try {
      await api.post("/api/cover-letter", {
        resumeId: selectedResumeId,
        jobDescription: jobDescription.substring(0, 100) + "...", // Save a snippet
        content,
        tone
      });
      toast("Cover letter saved to database!", "success");
    } catch {
      toast("Failed to save cover letter", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    toast("Copied to clipboard!", "success");
  };

  return (
    <>
      <style>{`
        .cl-root { max-width: 1100px; margin: 0 auto; font-family: 'Inter','Segoe UI', sans-serif; }
        .cl-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        @media (max-width: 900px) { .cl-grid { grid-template-columns: 1fr; } }
        
        .cl-banner { background: linear-gradient(135deg, #0077b5, #0a66c2, #004182); border-radius: 22px; padding: 28px 36px; color: #fff; margin-bottom: 24px; position: relative; overflow: hidden; }
        .cl-banner::before { content:''; position:absolute; top:-50px; right:-50px; width:220px; height:220px; border-radius:50%; background:rgba(255,255,255,0.07); }
        .cl-banner h1 { font-size: 23px; font-weight: 700; margin: 0 0 4px; position: relative; z-index: 1; display: flex; align-items: center; gap: 10px; }
        .cl-banner p { font-size: 13px; opacity: .82; margin: 0; position: relative; z-index: 1; }
        @media(max-width:640px){ .cl-banner { padding: 22px 20px; } .cl-banner h1 { font-size: 20px; } }
        
        .cl-card { background: ${C.card}; border: 1px solid ${C.border}; border-radius: 16px; padding: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.03); display: flex; flex-direction: column; gap: 16px; }
        
        .cl-label { font-size: 13px; font-weight: 600; color: ${C.text}; margin-bottom: 6px; display: block; }
        
        .cl-input { width: 100%; padding: 12px 14px; border: 1px solid ${C.border}; border-radius: 10px; font-size: 14px; background: ${C.bg}; color: ${C.text}; outline: none; transition: all 0.2s; }
        .cl-input:focus { border-color: ${C.primary}; box-shadow: 0 0 0 3px ${C.primaryLt}; }
        
        .cl-select-wrapper { position: relative; }
        .cl-select-icon { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); pointer-events: none; color: ${C.muted}; }
        
        .cl-textarea { width: 100%; padding: 14px; border: 1px solid ${C.border}; border-radius: 10px; font-size: 14px; background: ${C.bg}; color: ${C.text}; min-height: 200px; resize: vertical; outline: none; transition: all 0.2s; }
        .cl-textarea:focus { border-color: ${C.primary}; box-shadow: 0 0 0 3px ${C.primaryLt}; }
        
        .cl-btn { padding: 14px; border-radius: 10px; font-size: 14px; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer; transition: all 0.2s; border: none; width: 100%; }
        .cl-btn-primary { background: linear-gradient(135deg, #0077b5, #0a66c2); color: white; box-shadow: 0 2px 10px rgba(0, 119, 181, 0.3); }
        .cl-btn-primary:hover { opacity: .9; transform: translateY(-1px); }
        .cl-btn-primary:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }
        
        .cl-btn-outline { background: transparent; border: 1px solid ${C.border}; color: ${C.text}; }
        .cl-btn-outline:hover { background: ${C.bg}; }
        
        .cl-actions { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-top: 16px; }
        
        .cl-editor { flex: 1; min-height: 400px; font-family: inherit; line-height: 1.6; padding: 20px; border: 1px solid ${C.border}; border-radius: 12px; font-size: 14px; resize: none; background: ${C.bg}; color: ${C.text}; outline: none; }
        .cl-editor:focus { border-color: ${C.primary}; }
        
        .cl-empty { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; color: ${C.muted}; border: 1px dashed ${C.border}; border-radius: 12px; padding: 40px; background: ${C.bg}; }
      `}</style>

      {loading && <AILoadingOverlay step="Writing your cover letter..." progress={65} />}

      <div className="cl-root">

      <div className="cl-banner">
        <h1><PenTool size={22} /> Cover Letter Generator</h1>
        <p>Generate a highly tailored cover letter based on your resume and a target job description.</p>
      </div>

      <div className="cl-grid">
        {/* Left Column: Controls */}
        <div className="cl-card">
          <div>
            <label className="cl-label">Select Base Resume</label>
            <div className="cl-select-wrapper">
              <select 
                className="cl-input appearance-none" 
                value={selectedResumeId}
                onChange={(e) => setSelectedResumeId(e.target.value)}
              >
                <option value="" disabled>Select a resume...</option>
                {resumes.map(r => (
                  <option key={r._id} value={r._id}>
                    {(() => {
                      try { return JSON.parse(r.resumeJson || "{}").header?.name || "Untitled"; }
                      catch { return "Untitled"; }
                    })()} ({r.template || "Default"})
                  </option>
                ))}
              </select>
              <ChevronDown size={16} className="cl-select-icon" />
            </div>
          </div>

          <div>
            <label className="cl-label">Target Job Description</label>
            <textarea 
              className="cl-textarea"
              placeholder="Paste the full job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </div>

          <div>
            <label className="cl-label">Tone</label>
            <div className="cl-select-wrapper">
              <select 
                className="cl-input appearance-none"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
              >
                <option value="professional">Professional & Direct</option>
                <option value="friendly">Friendly & Enthusiastic</option>
                <option value="formal">Highly Formal (Traditional)</option>
              </select>
              <ChevronDown size={16} className="cl-select-icon" />
            </div>
          </div>

          <button 
            className="cl-btn cl-btn-primary" 
            onClick={generate}
            disabled={loading || !selectedResumeId || !jobDescription}
          >
            {loading ? <><Loader2 size={18} className="animate-spin" /> Generating...</> : <><PenTool size={18} /> Generate Cover Letter</>}
          </button>
        </div>

        {/* Right Column: Output */}
        <div className="cl-card" style={{ height: "100%" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <label className="cl-label" style={{ margin: 0 }}>Generated Output</label>
            {content && <span className="text-xs text-[var(--c-primary)] font-semibold flex items-center gap-1"><CheckCircle2 size={14}/> Ready to edit</span>}
          </div>

          {content ? (
            <>
              <textarea 
                className="cl-editor"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <div className="cl-actions">
                <button className="cl-btn cl-btn-outline" onClick={handleCopy}>
                  <Copy size={16} /> Copy Text
                </button>
                <button className="cl-btn cl-btn-primary" onClick={handleSave} disabled={saving}>
                  {saving ? <Loader2 size={16} className="animate-spin"/> : <Save size={16} />} Save Letter
                </button>
              </div>
            </>
          ) : (
            <div className="cl-empty">
              <FileText size={48} opacity={0.2} style={{ marginBottom: 16 }} />
              <p style={{ margin: 0, fontWeight: 500 }}>No cover letter generated yet.</p>
              <p style={{ margin: "8px 0 0", fontSize: 13, maxWidth: 300 }}>Fill out the form on the left and click Generate to see the magic happen.</p>
            </div>
          )}
        </div>
      </div>
      </div>
    </>
  );
}

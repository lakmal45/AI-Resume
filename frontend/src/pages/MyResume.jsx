import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import { api } from "../services/api";
import ResumeCard from "../components/ResumeCard";
import { DeleteModal } from "../components/DeleteModal";
import {
  Plus, FileText, SquareKanban, Clock, Sparkles,
  Search, SlidersHorizontal, Grid2x2, List, X,
} from "lucide-react";

// ── Colour tokens (LinkedIn palette) ────────────────────────────────────────
const C = {
  primary: "var(--c-primary)",
  primaryDk: "var(--c-primary-dk)",
  primaryDkr: "var(--c-primary-dkr)",
  primaryLt: "var(--c-primary-lt)",
  primaryBdr: "var(--c-primary-bdr)",
  primaryTxt: "var(--c-primary-txt)",
  accent: "var(--c-primary)",
  bg: "var(--c-bg)",
  card: "var(--c-card)",
  border: "var(--c-border)",
  muted: "var(--c-muted)",
  mutedTxt: "var(--c-muted-txt)",
  dark: "var(--c-dark)",
};

export default function MyResume() {
  const [resumes,  setResumes]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [search,   setSearch]   = useState("");
  const [view,     setView]     = useState("grid"); // "grid" | "list"
  const [sortBy,   setSortBy]   = useState("updated"); // "updated" | "name"

  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    if (location.state?.toast) {
      toast(location.state.toast, "success");
      navigate(location.pathname, { replace: true });
    }
  }, [location.pathname, location.state, navigate, toast]);

  useEffect(() => {
    api.get("/api/resumes")
      .then(r => setResumes(r.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);



  // Filter + sort
  const filtered = resumes
    .filter(r => {
      if (!search) return true;
      try {
        const d = JSON.parse(r.resumeJson || "{}");
        const q = search.toLowerCase();
        return (d.header?.name || "").toLowerCase().includes(q) ||
               (d.header?.role || "").toLowerCase().includes(q);
      } catch { return true; }
    })
    .sort((a, b) => {
      if (sortBy === "name") {
        const na = (() => { try { return JSON.parse(a.resumeJson||"{}").header?.name||""; } catch { return ""; } })();
        const nb = (() => { try { return JSON.parse(b.resumeJson||"{}").header?.name||""; } catch { return ""; } })();
        return na.localeCompare(nb);
      }
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    });

  const stats = [
    { label:"Total Resumes",   value: resumes.length,
      icon: FileText,     color: C.primary,   bg: C.primaryLt },
    { label:"Last Updated",    value: resumes[0]?.updatedAt
        ? new Date(resumes[0].updatedAt).toLocaleDateString("en-US",{month:"short",day:"numeric"}) : "—",
      icon: Clock,        color: "#0284c7",   bg: "#e0f2fe" },
    { label:"Templates",       value: [...new Set(resumes.map(r => r.template))].length,
      icon: SquareKanban, color: "#0369a1",   bg: "#bae6fd" },
    { label:"AI Imports",      value: resumes.filter(r => r.source === "linkedin").length,
      icon: Sparkles,     color: "#075985",   bg: "#cffafe" },
  ];

  return (
    <>
      <style>{`
        .mr-root { max-width: 1100px; margin: 0 auto; font-family: 'Inter','Segoe UI',sans-serif; }

        /* ── Banner ──────────────────────────────────── */
        .mr-banner {
          background: linear-gradient(135deg, ${C.primary} 0%, ${C.primaryDk} 55%, ${C.primaryDkr} 100%);
          border-radius: 22px;
          padding: 30px 36px;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
          position: relative;
          overflow: hidden;
        }
        .mr-banner::before {
          content:''; position:absolute; top:-50px; right:-50px;
          width:220px; height:220px; border-radius:50%;
          background:rgba(255,255,255,0.07);
        }
        .mr-banner::after {
          content:''; position:absolute; bottom:-70px; left:25%;
          width:170px; height:170px; border-radius:50%;
          background:rgba(255,255,255,0.05);
        }
        .mr-banner-left { position:relative; z-index:1; }
        .mr-banner-tag  { font-size:11px; text-transform:uppercase; letter-spacing:.09em; opacity:.75; margin-bottom:6px; }
        .mr-banner-title{ font-size:24px; font-weight:700; margin:0 0 4px; }
        .mr-banner-sub  { font-size:13px; opacity:.82; margin:0; }
        .mr-banner-btn {
          position:relative; z-index:1;
          padding:11px 22px; border-radius:12px;
          background:rgba(255,255,255,0.18);
          backdrop-filter:blur(8px);
          border:1px solid rgba(255,255,255,0.32);
          color:#fff; font-size:14px; font-weight:600;
          cursor:pointer; display:flex; align-items:center; gap:8px;
          transition:all .2s; white-space:nowrap;
        }
        .mr-banner-btn:hover { background:rgba(255,255,255,0.32); transform:translateY(-1px); }
        @media(max-width:600px){
          .mr-banner { flex-direction:column; align-items:flex-start; gap:16px; padding:22px 20px; }
        }

        /* ── Stats ───────────────────────────────────── */
        .mr-stats {
          display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin-bottom:24px;
        }
        @media(max-width:800px){ .mr-stats { grid-template-columns:repeat(2,1fr); } }
        @media(max-width:420px){ .mr-stats { grid-template-columns:1fr; } }
        .mr-stat {
          background:${C.card}; border:1px solid ${C.border}; border-radius:16px;
          padding:18px 20px; display:flex; align-items:center; gap:14px;
          box-shadow:0 2px 8px rgba(0,119,181,0.05);
          transition:transform .2s,box-shadow .2s;
        }
        .mr-stat:hover { transform:translateY(-2px); box-shadow:0 6px 20px rgba(0,119,181,0.1); }
        .mr-stat-icon { width:44px;height:44px;border-radius:11px;display:flex;align-items:center;justify-content:center;flex-shrink:0; }
        .mr-stat-val  { font-size:21px;font-weight:700;color:${C.dark}; }
        .mr-stat-lbl  { font-size:12px;color:${C.mutedTxt};margin-top:2px; }

        /* ── Toolbar ─────────────────────────────────── */
        .mr-toolbar {
          display:flex; align-items:center; justify-content:space-between;
          gap:12px; margin-bottom:20px; flex-wrap:wrap;
        }
        .mr-toolbar-left { display:flex; flex-direction:column; }
        .mr-toolbar-title { font-size:17px; font-weight:700; color:${C.dark}; margin:0; }
        .mr-toolbar-sub   { font-size:12px; color:${C.mutedTxt}; margin-top:3px; }
        .mr-toolbar-right { display:flex; align-items:center; gap:10px; flex-wrap:wrap; }

        /* Search */
        .mr-search-wrap { position:relative; }
        .mr-search-wrap svg { position:absolute;left:11px;top:50%;transform:translateY(-50%);color:${C.muted}; }
        .mr-search {
          padding:8px 14px 8px 36px; border:1.5px solid ${C.border};
          border-radius:10px; font-size:13px; color:${C.dark};
          background:${C.card}; outline:none; width:220px;
          transition:border-color .2s,box-shadow .2s;
        }
        .mr-search:focus { border-color:${C.primary}; box-shadow:0 0 0 3px rgba(0,119,181,.1); }
        @media(max-width:480px){ .mr-search { width:100%; } }

        /* Sort select */
        .mr-select {
          padding:8px 12px; border:1.5px solid ${C.border};
          border-radius:10px; font-size:13px; color:${C.dark};
          background:${C.card}; outline:none; cursor:pointer;
          transition:border-color .2s;
        }
        .mr-select:focus { border-color:${C.primary}; }

        /* View toggle */
        .mr-view-btn {
          width:34px;height:34px;border-radius:9px;border:1.5px solid ${C.border};
          display:flex;align-items:center;justify-content:center;
          cursor:pointer;background:${C.card};color:${C.mutedTxt};transition:all .15s;
        }
        .mr-view-btn.active { background:${C.primaryLt};border-color:${C.primary};color:${C.primary}; }
        .mr-view-btn:hover  { background:${C.primaryLt};border-color:${C.primary};color:${C.primary}; }

        /* New resume button */
        .mr-new-btn {
          padding:8px 18px; border-radius:10px;
          background:linear-gradient(135deg,${C.primary},${C.primaryDk});
          color:#fff; border:none; font-size:13px; font-weight:600;
          cursor:pointer; display:flex; align-items:center; gap:7px;
          transition:all .2s; white-space:nowrap;
          box-shadow:0 2px 10px rgba(0,119,181,0.3);
        }
        .mr-new-btn:hover { opacity:.92; transform:translateY(-1px); box-shadow:0 4px 16px rgba(0,119,181,0.4); }

        /* ── Grid ────────────────────────────────────── */
        .mr-grid {
          display:grid;
          grid-template-columns:repeat(auto-fill,minmax(280px,1fr));
          gap:18px;
        }

        /* ── List view ───────────────────────────────── */
        .mr-list { display:flex; flex-direction:column; gap:10px; }
        .mr-list-item {
          background:${C.card}; border:1px solid ${C.border}; border-radius:14px;
          padding:16px 20px; display:flex; align-items:center; gap:16px;
          cursor:pointer; transition:all .2s;
          box-shadow:0 1px 4px rgba(0,119,181,0.04);
        }
        .mr-list-item:hover { box-shadow:0 4px 14px rgba(0,119,181,0.1); border-color:${C.primary}; }
        .mr-list-icon { width:42px;height:42px;border-radius:10px;background:${C.primaryLt};display:flex;align-items:center;justify-content:center;flex-shrink:0; }
        .mr-list-name { font-size:14px;font-weight:600;color:${C.dark};overflow:hidden;text-overflow:ellipsis;white-space:nowrap; }
        .mr-list-meta { font-size:12px;color:${C.mutedTxt};margin-top:2px; }
        .mr-list-badge { margin-left:auto;padding:4px 11px;border-radius:20px;background:${C.primaryLt};color:${C.primary};font-size:11px;font-weight:600;flex-shrink:0; }
        .mr-list-del {
          width:30px;height:30px;border-radius:8px;border:1px solid #fecaca;
          background:#fef2f2;display:flex;align-items:center;justify-content:center;
          cursor:pointer;color:#ef4444;flex-shrink:0;transition:background .15s;
        }
        .mr-list-del:hover { background:#fee2e2; }

        /* ── Empty ───────────────────────────────────── */
        .mr-empty {
          text-align:center; padding:60px 20px;
          background:${C.card}; border:2px dashed ${C.border}; border-radius:20px;
        }
        .mr-empty-icon {
          width:64px;height:64px;border-radius:16px;background:${C.primaryLt};
          display:flex;align-items:center;justify-content:center;margin:0 auto 14px;
        }
        .mr-empty h3 { font-size:16px;font-weight:600;color:${C.dark};margin:0 0 6px; }
        .mr-empty p  { font-size:13px;color:${C.mutedTxt};margin:0 0 20px; }
        .mr-empty-btn {
          padding:10px 22px; border-radius:11px;
          background:linear-gradient(135deg,${C.primary},${C.primaryDk});
          color:#fff; border:none; font-size:14px; font-weight:600;
          cursor:pointer; display:inline-flex; align-items:center; gap:8px;
          transition:all .2s; box-shadow:0 2px 10px rgba(0,119,181,0.3);
        }
        .mr-empty-btn:hover { transform:translateY(-1px); box-shadow:0 4px 16px rgba(0,119,181,0.4); }

        /* ── Skeleton ────────────────────────────────── */
        @keyframes mr-sh { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        .mr-skel {
          border-radius:16px; height:160px;
          background:linear-gradient(90deg,#e0f2fe 25%,#bae6fd 50%,#e0f2fe 75%);
          background-size:200% 100%; animation:mr-sh 1.4s ease infinite;
        }

      `}</style>

      <div className="mr-root">

        {/* Banner */}
        <div className="mr-banner">
          <div className="mr-banner-left">
            <div className="mr-banner-tag"><FileText size={11} style={{display:"inline",marginRight:4}} />Resume Manager</div>
            <h1 className="mr-banner-title">My Resumes</h1>
            <p className="mr-banner-sub">Build, manage and export all your AI-powered resumes</p>
          </div>
          <button className="mr-banner-btn" onClick={() => navigate("/editor/new")}>
            <Plus size={15} /> New Resume
          </button>
        </div>

        {/* Stats */}
        <div className="mr-stats">
          {stats.map(s => {
            const Icon = s.icon;
            return (
              <div className="mr-stat" key={s.label}>
                <div className="mr-stat-icon" style={{background:s.bg}}><Icon size={20} color={s.color} /></div>
                <div>
                  <div className="mr-stat-val">{s.value}</div>
                  <div className="mr-stat-lbl">{s.label}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Toolbar */}
        <div className="mr-toolbar">
          <div className="mr-toolbar-left">
            <span className="mr-toolbar-title">
              {loading ? "Loading…" : `${filtered.length} resume${filtered.length !== 1 ? "s" : ""}`}
            </span>
            <span className="mr-toolbar-sub">Manage and edit your generated resumes</span>
          </div>

          <div className="mr-toolbar-right">
            {/* Search */}
            <div className="mr-search-wrap">
              <Search size={14} />
              <input
                className="mr-search"
                placeholder="Search resumes…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            {/* Sort */}
            <select className="mr-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="updated">Latest first</option>
              <option value="name">Name A–Z</option>
            </select>

            {/* View toggle */}
            <button className={`mr-view-btn ${view==="grid"?"active":""}`} onClick={() => setView("grid")} title="Grid view">
              <Grid2x2 size={15} />
            </button>
            <button className={`mr-view-btn ${view==="list"?"active":""}`} onClick={() => setView("list")} title="List view">
              <List size={15} />
            </button>

            {/* New btn */}
            <button className="mr-new-btn" onClick={() => navigate("/editor/new")}>
              <Plus size={14} /> New
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="mr-grid">
            {[1,2,3,4,5,6].map(i => <div key={i} className="mr-skel" />)}
          </div>
        ) : filtered.length === 0 && !search ? (
          <div className="mr-empty">
            <div className="mr-empty-icon"><FileText size={28} color={C.primary} /></div>
            <h3>No resumes yet</h3>
            <p>Create your first AI-powered resume in minutes</p>
            <button className="mr-empty-btn" onClick={() => navigate("/editor/new")}>
              <Plus size={15} /> Create Your First Resume
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="mr-empty">
            <div className="mr-empty-icon"><Search size={28} color={C.primary} /></div>
            <h3>No results for "{search}"</h3>
            <p>Try a different name or role</p>
            <button className="mr-empty-btn" style={{background:"none",color:C.primary,border:`1.5px solid ${C.primary}`,boxShadow:"none"}}
              onClick={() => setSearch("")}>
              <X size={14} /> Clear Search
            </button>
          </div>
        ) : view === "grid" ? (
          <div className="mr-grid">
            {filtered.map(r => (
              <ResumeCard
                key={r._id}
                resume={r}
                onClick={() => navigate(`/editor/${r._id}`)}
                onDelete={() => setDeleteId(r._id)}
              />
            ))}
          </div>
        ) : (
          /* List view */
          <div className="mr-list">
            {filtered.map(r => {
              let name = "Untitled";
              let role = "";
              try { const d = JSON.parse(r.resumeJson||"{}"); name = d.header?.name||"Untitled"; role = d.header?.role||""; } catch {}
              return (
                <div key={r._id} className="mr-list-item" onClick={() => navigate(`/editor/${r._id}`)}>
                  <div className="mr-list-icon"><FileText size={18} color={C.primary} /></div>
                  <div style={{overflow:"hidden",flex:1}}>
                    <div className="mr-list-name">{name}</div>
                    <div className="mr-list-meta">
                      {role && <span>{role} · </span>}
                      {r.template?.replace("Template","") || "Default"} · {r.updatedAt?.slice(0,10)}
                    </div>
                  </div>
                  <div className="mr-list-badge">Open</div>
                  <button
                    className="mr-list-del"
                    onClick={e => { e.stopPropagation(); setDeleteId(r._id); }}
                    title="Delete"
                  >
                    <X size={13} />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Delete modal */}
        <DeleteModal
          open={!!deleteId}
          onClose={() => setDeleteId(null)}
          onConfirm={async () => {
            if (!deleteId) return;
            setDeleting(true);
            try {
              await api.delete(`/api/resumes/${deleteId}`);
              setResumes(prev => prev.filter(r => r._id !== deleteId));
              setDeleteId(null);
            } catch {
              toast("Failed to delete resume", "error");
            } finally {
              setDeleting(false);
            }
          }}
          loading={deleting}
        />

      </div>
    </>
  );
}

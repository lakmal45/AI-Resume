import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import {
  FileText, SquareKanban, MessageCircleQuestion,
  FileScan, FilePlusCorner, Plus, ArrowRight, Zap, Target,
  Clock, Sparkles, CheckCircle, ChevronRight, Activity,
  BarChart3, Star, TrendingUp, User, PenTool, Briefcase, BookOpen
} from "lucide-react";
import TemplateGallery from "../components/TemplateGallery";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function Dashboard() {
  const navigate = useNavigate();
  const [resumes,  setResumes]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  // Best-effort name from localStorage
  const userName = (() => {
    try {
      const u = JSON.parse(localStorage.getItem("user") || "{}");
      return u.name || u.firstName || u.email?.split("@")[0] || "there";
    } catch { return "there"; }
  })();

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  useEffect(() => {
    api.get("/api/resumes")
      .then(r => setResumes(r.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totalResumes = resumes.length;
  const liImports    = resumes.filter(r => r.source === "linkedin").length;
  const templates    = [...new Set(resumes.map(r => r.template))].length;
  const lastUpdated  = resumes[0]?.updatedAt
    ? new Date(resumes[0].updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })
    : "—";

  const stats = [
    { label: "Total Resumes",    value: totalResumes, icon: FileText,      color: "#0077b5", bg: "var(--c-primary-lt)", delta: "All time" },
    { label: "LinkedIn Imports", value: liImports,    icon: FilePlusCorner, color: "#0a66c2", bg: "var(--c-primary-lt)", delta: "Auto-imported" },
    { label: "Templates Used",   value: templates,    icon: SquareKanban,  color: "#0369a1", bg: "var(--c-primary-lt)", delta: "Mix & match" },
    { label: "Last Activity",    value: lastUpdated,  icon: Clock,         color: "#075985", bg: "var(--c-primary-lt)", delta: "Keep building!" },
  ];

  const quickActions = [
    { label: "Create New Resume",    desc: "Start from scratch with AI",            icon: Plus,                  action: () => setIsGalleryOpen(true) },
    { label: "My Resumes",           desc: "View & edit your saved resumes",         icon: FileText,              to: "/my-resumes" },
    { label: "Import from LinkedIn", desc: "Auto-fill from your LinkedIn profile",   icon: FilePlusCorner,        to: "/linkedin-import" },
    { label: "ATS Analyzer",         desc: "Score your resume against job postings", icon: SquareKanban,          to: "/atsanalyzer" },
    { label: "Job Scanner",          desc: "Match jobs to your resume",              icon: FileScan,              to: "/jobscanner" },
    { label: "Interview Guide",      desc: "Prepare with AI-powered Q&A",           icon: MessageCircleQuestion, to: "/interview-guide" },
  ];

  const tips = [
    { icon: Target,    title: "Tailor to Each Job",    body: 'Customise resume keywords for every application to beat ATS filters.' },
    { icon: BarChart3, title: "Quantify Achievements", body: '"Grew revenue by 32%" beats "Improved revenue" every single time.' },
    { icon: Star,      title: "Keep It One Page",      body: "Recruiters spend ~7 seconds. Lead with impact, cut the fluff." },
  ];

  const recent = resumes.slice(0, 3);
  
  // Calculate Resume Completeness
  let completeness = 0;
  let actionItems = [];
  if (resumes.length > 0) {
    try {
      const latest = JSON.parse(resumes[0].resumeJson || "{}");
      let score = 0;
      if (latest.header?.name) score += 20;
      else actionItems.push({ id: 1, text: "Add your contact information", icon: User });
      
      if (latest.summary) score += 20;
      else actionItems.push({ id: 2, text: "Write a professional summary", icon: PenTool });
      
      if (latest.experience?.length > 0) score += 25;
      else actionItems.push({ id: 3, text: "Add your work experience", icon: Briefcase });
      
      if (latest.education?.length > 0) score += 20;
      else actionItems.push({ id: 4, text: "Your resume is missing education", icon: BookOpen });
      
      if (latest.skills?.length > 0) score += 15;
      else actionItems.push({ id: 5, text: "List your core skills", icon: Star });
      
      completeness = score;
      
      // Check last updated
      const daysSinceUpdate = (new Date() - new Date(resumes[0].updatedAt)) / (1000 * 3600 * 24);
      if (daysSinceUpdate > 14) {
        actionItems.push({ id: 6, text: "You haven't updated your resume in 2 weeks", icon: Clock });
      }
    } catch {
      completeness = 0;
    }
  } else {
    actionItems.push({ id: 0, text: "Create your first resume to get started", icon: Plus });
  }

  // Mock ATS Trend Data
  const atsTrendData = [
    { name: 'Jan', score: 45 },
    { name: 'Feb', score: 58 },
    { name: 'Mar', score: 62 },
    { name: 'Apr', score: 71 },
    { name: 'May', score: 85 },
    { name: 'Jun', score: 92 },
  ];

  return (
    <>
      <style>{`
        .dash-root { max-width: 1100px; margin: 0 auto; font-family: 'Inter','Segoe UI',sans-serif; }

        /* ── Greeting banner ───────────────────────── */
        .dash-banner {
          background: linear-gradient(135deg, #0077b5 0%, #0a66c2 55%, #004182 100%);
          border-radius: 22px;
          padding: 30px 36px;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 26px;
          position: relative;
          overflow: hidden;
        }
        .dash-banner::before {
          content:''; position:absolute; top:-60px; right:-60px;
          width:260px; height:260px; border-radius:50%;
          background:rgba(255,255,255,0.07);
        }
        .dash-banner::after {
          content:''; position:absolute; bottom:-80px; left:30%;
          width:200px; height:200px; border-radius:50%;
          background:rgba(255,255,255,0.05);
        }
        .dash-banner-left { position:relative; z-index:1; }
        .dash-banner-tag  { font-size:11px; text-transform:uppercase; letter-spacing:.09em; opacity:.75; margin-bottom:6px; }
        .dash-banner-name { font-size:25px; font-weight:700; margin:0 0 5px; }
        .dash-banner-sub  { font-size:13px; opacity:.82; margin:0; }
        .dash-banner-btns { display:flex; gap:10px; position:relative; z-index:1; flex-shrink:0; }
        .dash-banner-btn {
          padding:10px 20px; border-radius:12px; font-size:13px; font-weight:600;
          cursor:pointer; display:flex; align-items:center; gap:7px;
          transition:all .2s; border:none; white-space:nowrap;
        }
        .dash-banner-btn.solid { background:rgba(255,255,255,.2); color:#fff; border:1px solid rgba(255,255,255,.35); }
        .dash-banner-btn.solid:hover { background:rgba(255,255,255,.32); transform:translateY(-1px); }
        .dash-banner-btn.ghost { background:rgba(255,255,255,.1); color:#fff; border:1px solid rgba(255,255,255,.2); }
        .dash-banner-btn.ghost:hover { background:rgba(255,255,255,.22); }
        @media(max-width:640px){
          .dash-banner { flex-direction:column; align-items:flex-start; gap:18px; padding:24px 20px; }
          .dash-banner-name { font-size:20px; }
        }

        /* ── Stats ──────────────────────────────────── */
        .dash-stats {
          display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin-bottom:26px;
        }
        @media(max-width:860px){ .dash-stats { grid-template-columns:repeat(2,1fr); } }
        @media(max-width:460px){ .dash-stats { grid-template-columns:1fr; } }
        .dash-stat {
          background:var(--c-card); border:1px solid var(--c-border); border-radius:16px;
          padding:18px 20px; display:flex; align-items:center; gap:14px;
          box-shadow:0 2px 8px rgba(0,0,0,0.04);
          transition:transform .2s, box-shadow .2s;
        }
        .dash-stat:hover { transform:translateY(-2px); box-shadow:0 6px 20px rgba(0,0,0,0.08); }
        .dash-stat-icon { width:44px;height:44px;border-radius:11px;display:flex;align-items:center;justify-content:center;flex-shrink:0; }
        .dash-stat-val  { font-size:21px;font-weight:700;color:var(--c-dark); }
        .dash-stat-lbl  { font-size:12px;color:var(--c-muted-txt);margin-top:2px; }
        .dash-stat-delta{ font-size:11px;color:#0077b5;margin-top:4px;display:flex;align-items:center;gap:3px; }

        /* ── Two-col layout ─────────────────────────── */
        .dash-cols { display:grid; grid-template-columns:1fr 330px; gap:18px; margin-bottom:18px; }
        @media(max-width:900px){ .dash-cols { grid-template-columns:1fr; } }
        
        .dash-cols-3 { display:grid; grid-template-columns:1fr 1fr 1fr; gap:18px; margin-bottom:18px; }
        @media(max-width:900px){ .dash-cols-3 { grid-template-columns:1fr; } }

        /* ── Card shell ─────────────────────────────── */
        .dash-card {
          background:var(--c-card); border:1px solid var(--c-border); border-radius:18px;
          box-shadow:0 2px 8px rgba(0,0,0,0.04); overflow:hidden;
        }
        .dash-card-top-bar { height:3px; background:linear-gradient(to right,#0077b5,#0a66c2); }
        .dash-card-header {
          padding:16px 20px 13px; border-bottom:1px solid var(--c-border);
          display:flex; align-items:center; gap:10px;
        }
        .dash-card-hicon { width:36px;height:36px;border-radius:9px;display:flex;align-items:center;justify-content:center;flex-shrink:0; }
        .dash-card-title { font-size:14px;font-weight:700;color:var(--c-dark);margin:0; }
        .dash-card-sub   { font-size:11px;color:var(--c-muted-txt);margin:2px 0 0; }

        /* ── Quick actions ──────────────────────────── */
        .qa-grid { display:grid; grid-template-columns:1fr 1fr; gap:1px; background:var(--c-border); }
        .qa-item {
          background:var(--c-card); padding:16px 18px; display:flex; align-items:center; gap:13px;
          cursor:pointer; transition:background .15s;
        }
        .qa-item:hover { background:var(--c-bg); }
        .qa-icon  { width:38px;height:38px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;background:var(--c-primary-lt); }
        .qa-label { font-size:13px;font-weight:600;color:var(--c-dark);margin-bottom:2px; }
        .qa-desc  { font-size:11px;color:var(--c-muted-txt);line-height:1.4; }
        .qa-arrow { margin-left:auto;color:var(--c-muted-txt);flex-shrink:0;transition:color .15s,transform .15s; }
        .qa-item:hover .qa-arrow { color:#0077b5;transform:translateX(2px); }
        @media(max-width:500px){ .qa-grid { grid-template-columns:1fr; } }

        /* ── Recent resumes ─────────────────────────── */
        .rr-item {
          display:flex; align-items:center; gap:13px;
          padding:13px 20px; border-bottom:1px solid var(--c-border);
          cursor:pointer; transition:background .15s;
        }
        .rr-item:last-child { border-bottom:none; }
        .rr-item:hover { background:var(--c-bg); }
        .rr-icon  { width:36px;height:36px;border-radius:9px;background:var(--c-primary-lt);display:flex;align-items:center;justify-content:center;flex-shrink:0; }
        .rr-name  { font-size:13px;font-weight:600;color:var(--c-dark);overflow:hidden;text-overflow:ellipsis;white-space:nowrap; }
        .rr-meta  { font-size:11px;color:var(--c-muted-txt);margin-top:2px; }
        .rr-badge { margin-left:auto;padding:3px 10px;border-radius:20px;background:var(--c-primary-lt);color:#0077b5;font-size:10px;font-weight:600;flex-shrink:0;border:1px solid var(--c-primary-bdr); }
        .rr-empty { padding:30px 20px;text-align:center;color:var(--c-muted-txt);font-size:13px; }
        .rr-empty-btn {
          margin-top:12px; padding:8px 18px; border-radius:9px;
          background:linear-gradient(135deg,#0077b5,#0a66c2);
          color:#fff; border:none; font-size:13px; font-weight:600;
          cursor:pointer; display:inline-flex; align-items:center; gap:6px;
          transition:all .2s; box-shadow:0 2px 8px rgba(0,119,181,0.25);
        }
        .rr-empty-btn:hover { transform:translateY(-1px); }
        .rr-view-all {
          margin:10px 16px 14px; padding:9px; border-radius:10px;
          background:var(--c-primary-lt); border:1px solid var(--c-primary-bdr);
          font-size:13px; font-weight:600; color:#0077b5;
          cursor:pointer; display:flex; align-items:center; justify-content:center;
          gap:6px; transition:all .2s; width:calc(100% - 32px);
        }
        .rr-view-all:hover { background:var(--c-primary-bdr); }

        /* ── Action Items ───────────────────────────── */
        .ai-item {
          display:flex; align-items:center; gap:12px;
          padding:12px 20px; border-bottom:1px solid var(--c-border);
        }
        .ai-item:last-child { border-bottom:none; }
        .ai-icon-wrap { width:32px;height:32px;border-radius:8px;background:var(--c-primary-lt);color:#0077b5;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
        .ai-text { font-size:13px;color:var(--c-dark);font-weight:500; }
        .ai-done { padding:18px 20px;text-align:center;font-size:13px;color:var(--c-muted-txt); }
        .ai-done-icon { color:#22c55e;margin:0 auto 8px;display:block; }
        
        /* ── Completeness Ring ──────────────────────── */
        .comp-circle {
          position: relative; width: 120px; height: 120px; margin: 20px auto;
          border-radius: 50%; background: conic-gradient(#0077b5 ${completeness * 3.6}deg, var(--c-primary-lt) 0deg);
          display: flex; align-items: center; justify-content: center;
        }
        .comp-inner {
          width: 96px; height: 96px; background: var(--c-card); border-radius: 50%;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
        }
        .comp-val { font-size: 24px; font-weight: 800; color: #0077b5; }
        .comp-lbl { font-size: 10px; font-weight: 600; color: var(--c-muted-txt); text-transform: uppercase; }
        .comp-note { font-size:12px; color:var(--c-muted-txt); margin-top:10px; padding:0 16px 20px; text-align:center; }

        /* ── Tips ───────────────────────────────────── */
        .dash-tips { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; margin-bottom:18px; }
        @media(max-width:720px){ .dash-tips { grid-template-columns:1fr; } }
        .tip-card {
          background:var(--c-card); border:1px solid var(--c-border); border-radius:16px; padding:20px;
          box-shadow:0 2px 8px rgba(0,0,0,0.04);
          transition:transform .2s,box-shadow .2s;
        }
        .tip-card:hover { transform:translateY(-2px); box-shadow:0 6px 18px rgba(0,0,0,0.08); }
        .tip-icon  { width:38px;height:38px;border-radius:10px;display:flex;align-items:center;justify-content:center;margin-bottom:11px;background:var(--c-primary-lt); }
        .tip-title { font-size:13px;font-weight:700;color:var(--c-dark);margin-bottom:5px; }
        .tip-body  { font-size:12px;color:var(--c-muted-txt);line-height:1.55; }

        /* ── LinkedIn CTA ───────────────────────────── */
        .dash-cta {
          background:var(--c-card);
          border:1px solid var(--c-border); border-radius:18px;
          padding:22px 28px; display:flex; align-items:center;
          justify-content:space-between; gap:20px;
          box-shadow:0 2px 8px rgba(0,0,0,0.04);
        }
        @media(max-width:580px){ .dash-cta { flex-direction:column; align-items:flex-start; } }
        .dash-cta-title { font-size:15px;font-weight:700;color:var(--c-dark);margin-bottom:4px; }
        .dash-cta-sub   { font-size:13px;color:var(--c-muted-txt); }
        .dash-cta-btn {
          padding:10px 22px; border-radius:11px;
          background:linear-gradient(135deg,#0077b5,#0a66c2);
          color:#fff; border:none; font-size:13px; font-weight:600;
          cursor:pointer; white-space:nowrap;
          display:flex; align-items:center; gap:7px;
          transition:all .2s; box-shadow:0 2px 10px rgba(0,119,181,0.3);
        }
        .dash-cta-btn:hover { opacity:.9; transform:translateY(-1px); }

        /* ── Chart card ─────────────────────────────── */
        .dash-chart-body { flex:1; padding:12px 16px 16px; }

        /* ── Skeleton ───────────────────────────────── */
        @keyframes sh { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        .dash-skel {
          border-radius:10px;
          background:linear-gradient(90deg,var(--c-border) 25%,var(--c-primary-lt) 50%,var(--c-border) 75%);
          background-size:200% 100%; animation:sh 1.4s ease infinite;
        }
      `}</style>

      <div className="dash-root">

        {/* ── Greeting Banner ─────────────────────── */}
        <div className="dash-banner">
          <div className="dash-banner-left">
            <div className="dash-banner-tag">
              <Sparkles size={10} style={{display:"inline",marginRight:4}} />
              {greeting}
            </div>
            <h1 className="dash-banner-name">Welcome back, {userName}! 👋</h1>
            <p className="dash-banner-sub">Here's what's happening with your resumes today.</p>
          </div>
          <div className="dash-banner-btns">
            <button className="dash-banner-btn solid" onClick={() => setIsGalleryOpen(true)}>
              <Plus size={14} /> New Resume
            </button>
            <button className="dash-banner-btn ghost" onClick={() => navigate("/atsanalyzer")}>
              <Zap size={14} /> ATS Score
            </button>
          </div>
        </div>

        {/* ── Stats ───────────────────────────────── */}
        <div className="dash-stats">
          {loading ? [1,2,3,4].map(i => (
            <div key={i} className="dash-stat">
              <div style={{width:44,height:44,borderRadius:11,flexShrink:0}} className="dash-skel" />
              <div style={{flex:1,display:"flex",flexDirection:"column",gap:7}}>
                <div className="dash-skel" style={{height:16,width:"55%"}} />
                <div className="dash-skel" style={{height:12,width:"40%"}} />
              </div>
            </div>
          )) : stats.map(s => {
            const Icon = s.icon;
            return (
              <div className="dash-stat" key={s.label}>
                <div className="dash-stat-icon" style={{background:s.bg}}>
                  <Icon size={20} color={s.color} />
                </div>
                <div>
                  <div className="dash-stat-val">{s.value}</div>
                  <div className="dash-stat-lbl">{s.label}</div>
                  <div className="dash-stat-delta"><CheckCircle size={10} />{s.delta}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── ANALYTICS ROW ────────────────────────── */}
        <div className="dash-cols-3">
          
          {/* Action Items */}
          <div className="dash-card">
            <div className="dash-card-top-bar" />
            <div className="dash-card-header">
              <div className="dash-card-hicon" style={{background:"var(--c-primary-lt)"}}>
                <Target size={16} color="#0077b5" />
              </div>
              <div>
                <div className="dash-card-title">Action Items</div>
                <div className="dash-card-sub">Suggested next steps</div>
              </div>
            </div>
            <div>
              {actionItems.slice(0,4).map(item => {
                const Icon = item.icon;
                return (
                  <div key={item.id} className="ai-item">
                    <div className="ai-icon-wrap"><Icon size={16} /></div>
                    <div className="ai-text">{item.text}</div>
                  </div>
                )
              })}
              {actionItems.length === 0 && (
                <div className="ai-done">
                  <CheckCircle size={24} className="ai-done-icon" />
                  You're all caught up!
                </div>
              )}
            </div>
          </div>

          {/* Completeness */}
          <div className="dash-card" style={{display:"flex",flexDirection:"column",justifyContent:"center",textAlign:"center"}}>
            <div className="dash-card-header" style={{justifyContent:"center",borderBottom:"none",paddingBottom:0}}>
              <div className="dash-card-title" style={{fontSize:16}}>Resume Completeness</div>
            </div>
            <div className="comp-circle">
              <div className="comp-inner">
                <span className="comp-val">{completeness}%</span>
                <span className="comp-lbl">Complete</span>
              </div>
            </div>
            <p className="comp-note">Based on your primary resume sections</p>
          </div>

          {/* ATS Trend Chart */}
          <div className="dash-card" style={{display:"flex",flexDirection:"column"}}>
            <div className="dash-card-header" style={{borderBottom:"none",paddingBottom:8}}>
              <div className="dash-card-hicon" style={{background:"var(--c-primary-lt)"}}>
                <TrendingUp size={16} color="#0077b5" />
              </div>
              <div>
                <div className="dash-card-title">ATS Score Trend</div>
                <div className="dash-card-sub">Last 6 months</div>
              </div>
            </div>
            <div className="dash-chart-body">
              <ResponsiveContainer width="100%" height={160}>
                <LineChart data={atsTrendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--c-border)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: 'var(--c-muted-txt)'}} dy={10} />
                  <YAxis hide domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: '1px solid var(--c-border)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', background: 'var(--c-card)', color: 'var(--c-dark)' }}
                    itemStyle={{ color: '#0077b5', fontWeight: 'bold' }}
                    labelStyle={{ color: 'var(--c-muted-txt)', fontSize: 12 }}
                  />
                  <Line type="monotone" dataKey="score" stroke="#0077b5" strokeWidth={3} dot={{r: 4, fill: '#0077b5', strokeWidth: 2, stroke: 'var(--c-card)'}} activeDot={{r: 6}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* ── Two-col area ────────────────────────── */}
        <div className="dash-cols">

          {/* Quick Actions */}
          <div className="dash-card">
            <div className="dash-card-top-bar" />
            <div className="dash-card-header">
              <div className="dash-card-hicon" style={{background:"var(--c-primary-lt)"}}>
                <Activity size={16} color="#0077b5" />
              </div>
              <div>
                <div className="dash-card-title">Quick Actions</div>
                <div className="dash-card-sub">Jump right into your work</div>
              </div>
            </div>
            <div className="qa-grid">
              {quickActions.map(a => {
                const Icon = a.icon;
                return (
                  <div key={a.label} className="qa-item" onClick={a.action || (() => navigate(a.to))}>
                    <div className="qa-icon">
                      <Icon size={17} color="#0077b5" />
                    </div>
                    <div style={{overflow:"hidden",flex:1}}>
                      <div className="qa-label">{a.label}</div>
                      <div className="qa-desc">{a.desc}</div>
                    </div>
                    <ChevronRight size={14} className="qa-arrow" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Resumes */}
          <div className="dash-card">
            <div className="dash-card-top-bar" />
            <div className="dash-card-header">
              <div className="dash-card-hicon" style={{background:"var(--c-primary-lt)"}}>
                <FileText size={16} color="#0077b5" />
              </div>
              <div>
                <div className="dash-card-title">Recent Resumes</div>
                <div className="dash-card-sub">Your latest work</div>
              </div>
            </div>

            {loading ? (
              <div style={{padding:"16px 20px",display:"flex",flexDirection:"column",gap:14}}>
                {[1,2,3].map(i => (
                  <div key={i} style={{display:"flex",gap:12,alignItems:"center"}}>
                    <div className="dash-skel" style={{width:36,height:36,borderRadius:9,flexShrink:0}} />
                    <div style={{flex:1,display:"flex",flexDirection:"column",gap:7}}>
                      <div className="dash-skel" style={{height:13,width:"70%"}} />
                      <div className="dash-skel" style={{height:11,width:"45%"}} />
                    </div>
                  </div>
                ))}
              </div>
            ) : recent.length === 0 ? (
              <div className="rr-empty">
                <FileText size={26} color="var(--c-muted-txt)" style={{margin:"0 auto 10px"}} />
                <div>No resumes yet</div>
                <button className="rr-empty-btn" onClick={() => setIsGalleryOpen(true)}>
                  <Plus size={13} /> Create One
                </button>
              </div>
            ) : (
              <>
                {recent.map(r => {
                  let name = "Untitled";
                  try { name = JSON.parse(r.resumeJson||"{}")?.header?.name || "Untitled"; } catch {}
                  return (
                    <div key={r._id} className="rr-item" onClick={() => navigate(`/editor/${r._id}`)}>
                      <div className="rr-icon"><FileText size={15} color="#0077b5" /></div>
                      <div style={{overflow:"hidden",flex:1}}>
                        <div className="rr-name">{name}</div>
                        <div className="rr-meta">
                          {r.template?.replace("Template","") || "Default"} · {r.updatedAt?.slice(0,10)}
                        </div>
                      </div>
                      <div className="rr-badge">Edit</div>
                    </div>
                  );
                })}
                <button className="rr-view-all" onClick={() => navigate("/my-resumes")}>
                  View All Resumes <ArrowRight size={13} />
                 </button>
              </>
            )}
          </div>
        </div>

        {/* ── Tips ────────────────────────────────── */}
        <div className="dash-tips">
          {tips.map(t => {
            const Icon = t.icon;
            return (
              <div className="tip-card" key={t.title}>
                <div className="tip-icon">
                  <Icon size={17} color="#0077b5" />
                </div>
                <div className="tip-title">{t.title}</div>
                <div className="tip-body">{t.body}</div>
              </div>
            );
          })}
        </div>

        {/* ── LinkedIn CTA ─────────────────────────── */}
        <div className="dash-cta">
          <div>
            <div className="dash-cta-title">🔗 Import your LinkedIn profile</div>
            <div className="dash-cta-sub">Turn your LinkedIn data into a polished, ATS-ready resume in seconds.</div>
          </div>
          <button className="dash-cta-btn" onClick={() => navigate("/linkedin-import")}>
            <FilePlusCorner size={14} /> Import Now
          </button>
        </div>

      </div>

      <TemplateGallery 
        isOpen={isGalleryOpen} 
        onClose={() => setIsGalleryOpen(false)} 
        selectedTemplate=""
        onSelect={(templateId) => navigate(`/editor/new?template=${templateId}`)} 
      />
    </>
  );
}

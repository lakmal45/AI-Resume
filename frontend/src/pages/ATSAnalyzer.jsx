import { createElement, useState, useEffect } from "react";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import AILoadingOverlay from "../components/AILoadingOverlay";
import { FileCheck, AlertTriangle, Sparkles, FileText, Layout, Zap, History } from "lucide-react";

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
.ats-root{max-width:1100px;margin:0 auto;font-family:'Inter','Segoe UI',sans-serif;}
.ats-banner{background:linear-gradient(135deg,#0077b5,#0a66c2,#004182);border-radius:22px;padding:28px 36px;color:#fff;margin-bottom:22px;position:relative;overflow:hidden;}
.ats-banner::before{content:'';position:absolute;top:-50px;right:-50px;width:220px;height:220px;border-radius:50%;background:rgba(255,255,255,0.07);}
.ats-banner h1{font-size:23px;font-weight:700;margin:0 0 4px;position:relative;z-index:1;}
.ats-banner p{font-size:13px;opacity:.82;margin:0;position:relative;z-index:1;}
.ats-how{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:22px;}
@media(max-width:680px){.ats-how{grid-template-columns:1fr;}}
.ats-how-item{background:var(--c-card);border:1px solid var(--c-border);border-radius:14px;padding:15px 17px;display:flex;align-items:flex-start;gap:12px;box-shadow:0 2px 8px rgba(0,119,181,0.05);transition:transform .2s,box-shadow .2s;}
.ats-how-item:hover{transform:translateY(-2px);box-shadow:0 6px 18px rgba(0,119,181,0.1);}
.ats-how-icon{width:36px;height:36px;border-radius:10px;background:var(--c-border);display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.ats-how-title{font-size:13px;font-weight:600;color:var(--c-dark);margin-bottom:3px;}
.ats-how-desc{font-size:12px;color:var(--c-mutedTxt);}
.ats-cols{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-bottom:18px;}
@media(max-width:800px){.ats-cols{grid-template-columns:1fr;}}
.ats-card{background:var(--c-card);border:1px solid var(--c-border);border-radius:18px;overflow:hidden;box-shadow:0 2px 8px rgba(0,119,181,0.04);}
.ats-card-bar{height:3px;background:linear-gradient(to right,#0077b5,#0a66c2);}
.ats-card-hd{padding:16px 22px 13px;border-bottom:1px solid var(--c-border);}
.ats-card-title{font-size:14px;font-weight:700;color:var(--c-dark);margin:0;}
.ats-card-sub{font-size:12px;color:var(--c-mutedTxt);margin:3px 0 0;}
.ats-card-body{padding:18px 22px;}
.ats-select{width:100%;padding:9px 12px;border:1.5px solid var(--c-border);border-radius:10px;font-size:13px;color:var(--c-dark);background:var(--c-card);outline:none;margin-bottom:12px;transition:border-color .2s;}
.ats-select:focus{border-color:#0077b5;box-shadow:0 0 0 3px rgba(0,119,181,.08);}
.ats-select:disabled{opacity:.5;pointer-events:none;}
.ats-or{text-align:center;font-size:12px;color:var(--c-mutedTxt);margin:10px 0;font-weight:600;letter-spacing:.05em;}
.ats-drop{border:2px dashed var(--c-border);border-radius:14px;padding:20px;text-align:center;background:var(--c-bg);transition:all .2s;cursor:pointer;}
.ats-drop.drag{border-color:#0077b5;background:var(--c-border);}
.ats-drop.disabled{opacity:.5;pointer-events:none;}
.ats-drop-emoji{font-size:24px;margin-bottom:6px;}
.ats-drop-label{font-size:13px;color:var(--c-mutedTxt);}
.ats-drop-sub{font-size:11px;color:var(--c-mutedTxt);margin-top:4px;}
.ats-drop-file{font-size:13px;font-weight:600;color:var(--c-dark);margin-bottom:8px;}
.ats-drop-clear{padding:5px 14px;border:1px solid var(--c-border);border-radius:8px;background:var(--c-card);font-size:12px;cursor:pointer;color:var(--c-mutedTxt);transition:background .15s;}
.ats-drop-clear:hover{background:var(--c-bg);}
.ats-jd-label{font-size:12px;color:var(--c-mutedTxt);margin:12px 0 6px;}
.ats-textarea{width:100%;min-height:110px;border:1.5px solid var(--c-border);border-radius:10px;padding:10px 12px;font-size:13px;color:var(--c-dark);background:var(--c-card);font-family:inherit;resize:none;outline:none;transition:border-color .2s;}
.ats-textarea:focus{border-color:#0077b5;box-shadow:0 0 0 3px rgba(0,119,181,.08);}
.ats-btn{width:100%;margin-top:14px;padding:12px;border-radius:12px;border:none;background:linear-gradient(135deg,#0077b5,#0a66c2);color:#fff;font-size:14px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;transition:all .2s;box-shadow:0 2px 10px rgba(0,119,181,0.3);}
.ats-btn:hover:not(:disabled){opacity:.9;transform:translateY(-1px);}
.ats-btn:disabled{opacity:.55;cursor:not-allowed;transform:none;}
@keyframes ats-spin{to{transform:rotate(360deg);}} .ats-spin{animation:ats-spin .8s linear infinite;}
.ats-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:260px;text-align:center;padding:24px;}
.ats-empty-icon{font-size:36px;margin-bottom:10px;opacity:.4;}
.ats-empty p{font-size:13px;color:var(--c-mutedTxt);}
.ats-score-box{text-align:center;padding:18px 0 12px;position:relative;}
.ats-score-num{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:26px;font-weight:700;color:var(--c-dark);}
.ats-metrics{display:flex;flex-direction:column;gap:8px;margin-top:8px;}
.ats-metric-row{display:flex;justify-content:space-between;font-size:13px;}
.ats-metric-lbl{color:var(--c-mutedTxt);} .ats-metric-val{font-weight:600;color:var(--c-dark);}
.ats-prog{height:7px;border-radius:4px;background:var(--c-border);overflow:hidden;margin-top:2px;}
.ats-prog-fill{height:100%;border-radius:4px;background:linear-gradient(to right,#0077b5,#0a66c2);transition:width .8s ease;}
.ats-history-item{cursor:pointer;padding:14px 16px;border-radius:12px;border:1px solid var(--c-border);margin-bottom:10px;transition:all .15s;}
.ats-history-item:hover{background:var(--c-bg);}
.ats-history-item.active{border-color:#0077b5;background:var(--c-border);}
.ats-history-row{display:flex;justify-content:space-between;align-items:center;}
.ats-history-score{font-size:14px;font-weight:600;color:var(--c-dark);}
.ats-history-date{font-size:11px;color:var(--c-mutedTxt);margin-top:2px;}
.ats-badge{display:inline-flex;align-items:center;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600;border:1px solid;}
.ats-badge-ok{background:#d1fae5;color:#065f46;border-color:#6ee7b7;}
.ats-badge-warn{background:#fef2f2;color:#ef4444;border-color:#fecaca;}
.ats-badge-blue{background:#dbeafe;color:#0369a1;border-color:#bae6fd;}
.ats-show-btn{font-size:13px;color:#0077b5;background:none;border:none;cursor:pointer;font-weight:600;}
.ats-show-btn:hover{text-decoration:underline;}
.ats-suggestion-item{display:flex;gap:12px;padding:14px;border-radius:12px;border:1px solid var(--c-border);margin-bottom:10px;transition:background .15s;}
.ats-suggestion-item:hover{background:var(--c-bg);}
.ats-suggestion-item.accepted{border-color:#6ee7b7;background:#d1fae5;}
.ats-sug-icon{width:34px;height:34px;border-radius:9px;background:#fef3c7;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.ats-sug-title{font-size:13px;font-weight:600;color:var(--c-dark);margin-bottom:3px;}
.ats-sug-body{font-size:12px;color:var(--c-mutedTxt);line-height:1.5;}
.ats-sug-code{font-size:12px;background:var(--c-bg);border:1px solid var(--c-border);padding:8px 10px;border-radius:8px;margin-top:6px;color:#0369a1;line-height:1.5;}
.ats-actions{display:flex;justify-content:flex-end;gap:10px;margin-top:18px;}
.ats-export-btn{padding:9px 18px;border-radius:10px;border:1.5px solid #0077b5;color:#0077b5;background:var(--c-card);font-size:13px;font-weight:600;cursor:pointer;transition:background .15s;}
.ats-export-btn:hover{background:var(--c-border);}
.ats-apply-btn{padding:9px 18px;border-radius:10px;border:none;background:linear-gradient(135deg,#0077b5,#0a66c2);color:#fff;font-size:13px;font-weight:600;cursor:pointer;box-shadow:0 2px 8px rgba(0,119,181,0.3);transition:all .2s;}
.ats-apply-btn:hover{opacity:.9;transform:translateY(-1px);}
`;

export default function ATSAnalyzer() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading,setLoading]=useState(false);const [analysis,setAnalysis]=useState(null);const [scoreAnim,setScoreAnim]=useState(0);
  const [accepted,setAccepted]=useState({});const [jobDesc,setJobDesc]=useState("");const [history,setHistory]=useState([]);
  const [selectedResumeId,setSelectedResumeId]=useState("");const [selectedResumeJson,setSelectedResumeJson]=useState(null);
  const [resumes,setResumes]=useState([]);const [uploadFile,setUploadFile]=useState(null);
  const [isDragging,setIsDragging]=useState(false);const [selectedHistory,setSelectedHistory]=useState(null);const [showHistory,setShowHistory]=useState(false);
  const hasUploadedFile=!!uploadFile;const hasSelectedResume=!!selectedResumeId;

  useEffect(()=>{(async()=>{try{const r=await api.get("/api/ats/history");setHistory(r.data||[]);}catch{}})();},[]);
  useEffect(()=>{api.get("/api/resumes").then(r=>setResumes(r.data||[])).catch(()=>{});},[]);
  useEffect(()=>{
    if(!selectedResumeId){setSelectedResumeJson(null);return;}
    api.get(`/api/resumes/${selectedResumeId}`).then(r=>setSelectedResumeJson(r.data.resumeJson?JSON.parse(r.data.resumeJson):{})).catch(()=>{});
  },[selectedResumeId]);

  const animateScore=(target)=>{let i=0;const iv=setInterval(()=>{i++;setScoreAnim(Math.min(i,target));if(i>=target)clearInterval(iv);},8);};

  const loadHistoryAnalysis=(item)=>{
    setAnalysis(item);setSelectedHistory(item);
    const map={};(item.suggestions||[]).forEach(s=>{map[s.id]=false;});setAccepted(map);
    animateScore(item.atsScore||0);
  };

  const handleDrop=(e)=>{e.preventDefault();e.stopPropagation();setIsDragging(false);if(hasSelectedResume)return;const f=e.dataTransfer.files?.[0];if(f)setUploadFile(f);};
  const handleDragOver=(e)=>{e.preventDefault();e.stopPropagation();if(!hasSelectedResume)setIsDragging(true);};
  const handleDragLeave=()=>setIsDragging(false);

  const humanizeSuggestion=(s)=>{
    if(s.category==="keyword"&&Array.isArray(s.proposedChange))return`Add missing keywords: ${s.proposedChange.join(", ")}`;
    if(typeof s.proposedChange==="string")return s.proposedChange;
    if(typeof s.proposedChange==="object"&&s.proposedChange?.newSkill)return`Add skill: ${s.proposedChange.newSkill}`;
    return"Improve this section based on ATS recommendation.";
  };

  const analyze=async()=>{
    if(!selectedResumeJson&&!uploadFile)return toast("Select a resume or upload a file first.", "warning");
    setLoading(true);setAnalysis(null);
    try{
      let resumePayload=selectedResumeJson;
      if(uploadFile){
        const fd=new FormData();fd.append("file",uploadFile);
        const er=await api.post("/api/ats/extract-resume",fd,{headers:{"Content-Type":"multipart/form-data"}});
        resumePayload=er.data.parsed||{rawText:er.data.text};setSelectedResumeJson(resumePayload);
      }
      const r=await api.post("/api/ats/analyze",{resume:selectedResumeJson,jobDescription:jobDesc||""});
      setAnalysis(r.data);
      const map={};r.data.suggestions.forEach(s=>{map[s.id]=false;});setAccepted(map);
      animateScore(r.data.atsScore);
    }catch{toast("ATS analysis failed", "error");}finally{setLoading(false);}
  };

  const applyAccepted=()=>{
    if(!analysis?.suggestions?.length)return toast("No suggestions available.", "warning");
    if(!selectedResumeJson)return toast("No resume loaded.", "warning");
    const payload={resume:selectedResumeJson,suggestions:analysis.suggestions,analysisId:analysis.analysisId,resumeId:selectedResumeId||null,sourceType:uploadFile?"upload":"resume"};
    navigate(`/editor/ats?data=${encodeURIComponent(JSON.stringify(payload))}`);
  };

  const mapImpact=(impact)=>{if(!impact)return 2;const i=impact.toLowerCase();if(i.includes("high")||i.includes("crit"))return 0;if(i.includes("medium")||i.includes("important"))return 1;return 2;};

  const exportChecklist=async()=>{
    if(!analysis)return toast("Run analysis first.", "warning");
    const sorted=[...analysis.suggestions].sort((a,b)=>mapImpact(a.impact)-mapImpact(b.impact));
    const html=`<html><body style="font-family:Arial;padding:20px;"><h1>ATS Improvement Checklist</h1><p>Score: ${analysis.atsScore}</p>${sorted.map(s=>`<div style="margin:12px 0;padding:12px;border-left:4px solid ${mapImpact(s.impact)===0?"#d9534f":mapImpact(s.impact)===1?"#f0ad4e":"#5bc0de"};"><strong>${s.title}</strong> (${s.impact||""})<p>${s.explanation}</p><pre style="background:#f2f2f2;padding:10px;">${typeof s.proposedChange==="string"?s.proposedChange:JSON.stringify(s.proposedChange,null,2)}</pre></div>`).join("")}</body></html>`;
    try{
      const r=await api.post("/api/pdf/export",{html},{responseType:"blob"});
      const blob=new Blob([r.data],{type:"application/pdf"});const url=URL.createObjectURL(blob);
      const a=document.createElement("a");a.href=url;a.download=`ats-checklist-${analysis.analysisId}.pdf`;a.click();URL.revokeObjectURL(url);
    }catch{toast("Failed to export checklist.", "error");}
  };

  const radius=56,circumference=2*Math.PI*radius,strokeDashoffset=circumference-(scoreAnim/100)*circumference;

  return (
    <>
    <AILoadingOverlay isVisible={loading} message="Analyzing resume against ATS..." />
    <style>{S}</style>
    <div className="ats-root">

      {/* Banner */}
      <div className="ats-banner">
        <h1><FileCheck size={20} style={{display:"inline",verticalAlign:"middle",marginRight:8}}/>ATS Analyzer</h1>
        <p>Check if your resume is optimized for Applicant Tracking Systems — over 75% of companies use them</p>
      </div>

      {/* How it works */}
      <div className="ats-how">
        {[{icon:Zap,title:"Keyword Scanning",desc:"ATS searches for specific keywords matching the job"},{icon:Layout,title:"Format Parsing",desc:"Complex layouts and tables confuse ATS systems"},{icon:FileText,title:"Section Recognition",desc:"ATS looks for standard headers like Experience, Skills"}].map(({icon,title,desc})=>(
          <div className="ats-how-item" key={title}><div className="ats-how-icon">{createElement(icon, { size: 17, color: C.primary })}</div><div><div className="ats-how-title">{title}</div><div className="ats-how-desc">{desc}</div></div></div>
        ))}
      </div>

      {/* Two-col */}
      <div className="ats-cols">

        {/* Controls */}
        <div className="ats-card">
          <div className="ats-card-bar"/>
          <div className="ats-card-hd"><div className="ats-card-title">Run Analysis</div><div className="ats-card-sub">Select a saved resume or upload one</div></div>
          <div className="ats-card-body">
            <select className={`ats-select${hasUploadedFile?" ats-select disabled":""}`} disabled={hasUploadedFile} value={selectedResumeId} onChange={e=>setSelectedResumeId(e.target.value)}>
              <option value="">Select a resume…</option>
              {resumes.map(r=>{let n="Resume";try{n=JSON.parse(r.resumeJson)?.header?.name||"Resume";}catch{}return<option key={r._id} value={r._id}>{n}</option>;})}
            </select>
            <div className="ats-or">— OR —</div>
            <div className={`ats-drop${isDragging?" drag":""}${hasSelectedResume?" disabled":""}`} onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave}>
              <input type="file" accept=".pdf,image/*" disabled={hasSelectedResume} onChange={e=>setUploadFile(e.target.files[0])} style={{display:"none"}} id="atsUpload"/>
              <label htmlFor="atsUpload" style={{cursor:"pointer",display:"block"}}>
                {!uploadFile?(<><div className="ats-drop-emoji">📄</div><div className="ats-drop-label">Upload resume PDF / Image</div><div className="ats-drop-sub">We auto-parse text using OCR</div></>)
                :(<><div className="ats-drop-file">{uploadFile.name}</div><button onClick={e=>{e.preventDefault();setUploadFile(null);}} className="ats-drop-clear">Remove</button></>)}
              </label>
            </div>
            <div className="ats-jd-label">Optional: Paste job description for better accuracy</div>
            <textarea className="ats-textarea" placeholder="Paste job description here…" value={jobDesc} onChange={e=>setJobDesc(e.target.value)}/>
            <button className="ats-btn" onClick={analyze} disabled={loading}>
              {loading?<><Sparkles size={15} className="ats-spin"/> Analyzing…</>:<><Sparkles size={15}/> Analyze Resume</>}
            </button>
          </div>
        </div>

        {/* Score */}
        <div className="ats-card">
          <div className="ats-card-bar"/>
          <div className="ats-card-hd"><div className="ats-card-title">ATS Compatibility Score</div><div className="ats-card-sub">Based on formatting and keywords</div></div>
          <div className="ats-card-body">
            {analysis?(<>
              <div className="ats-score-box">
                <svg width="120" height="120" style={{transform:"rotate(-90deg)"}}>
                  <circle cx="60" cy="60" r={radius} stroke={C.primaryLt} strokeWidth="12" fill="none"/>
                  <circle cx="60" cy="60" r={radius} stroke={C.primary} strokeWidth="12" fill="none" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" style={{transition:"stroke-dashoffset 1s ease"}}/>
                </svg>
                <div className="ats-score-num">{scoreAnim}%</div>
              </div>
              <p style={{textAlign:"center",fontSize:13,color:C.muted,margin:"0 0 12px"}}>Analysis Complete</p>
              <div className="ats-metrics">
                <div className="ats-metric-row"><span className="ats-metric-lbl">Keyword Match</span><span className="ats-metric-val">{analysis.metrics.keywordMatch}%</span></div>
                <div className="ats-prog"><div className="ats-prog-fill" style={{width:`${analysis.metrics.keywordMatch}%`}}/></div>
                <div className="ats-metric-row"><span className="ats-metric-lbl">Formatting Quality</span><span className="ats-metric-val">{100-analysis.metrics.formattingIssuesScore}%</span></div>
                <div className="ats-prog"><div className="ats-prog-fill" style={{width:`${100-analysis.metrics.formattingIssuesScore}%`}}/></div>
              </div>
            </>):(
              <div className="ats-empty"><div className="ats-empty-icon"><Zap size={36} color={C.muted}/></div><p>Run analysis to see your ATS score</p></div>
            )}
          </div>
        </div>
      </div>

      {/* History */}
      {history.length>0&&(
        <div className="ats-card" style={{marginBottom:18}}>
          <div className="ats-card-bar"/>
          <div className="ats-card-hd" style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div>
              <div className="ats-card-title" style={{display:"flex",alignItems:"center",gap:8}}><History size={15} color={C.primary}/> Previous ATS Analyses</div>
              <div className="ats-card-sub">Click any previous analysis to view results</div>
            </div>
            <button className="ats-show-btn" onClick={()=>setShowHistory(p=>!p)}>{showHistory?"Hide":"Show"}</button>
          </div>
          {showHistory&&(
            <div className="ats-card-body">
              {history.map(h=>(
                <div key={h.analysisId} className={`ats-history-item${selectedHistory?.analysisId===h.analysisId?" active":""}`} onClick={()=>loadHistoryAnalysis(h)}>
                  <div className="ats-history-row">
                    <div><div className="ats-history-score">ATS Score: {h.atsScore}%</div><div className="ats-history-date">{new Date(h.createdAt).toLocaleString()}</div></div>
                    <span className={`ats-badge ${h.atsScore>=80?"ats-badge-ok":"ats-badge-warn"}`}>{h.suggestions?.length||0} issues</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Suggestions */}
      {analysis&&(
        <div className="ats-card">
          <div className="ats-card-bar"/>
          <div className="ats-card-hd"><div className="ats-card-title">Detailed ATS Suggestions</div><div className="ats-card-sub">{analysis.suggestions.length} issues found — review and apply fixes below</div></div>
          <div className="ats-card-body">
            {analysis.suggestions.map(s=>(
              <div key={s.id} className={`ats-suggestion-item${accepted[s.id]?" accepted":""}`}>
                <div className="ats-sug-icon"><AlertTriangle size={16} color="#f59e0b"/></div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                    <div className="ats-sug-title">{s.title}</div>
                    <span className={`ats-badge ${accepted[s.id]?"ats-badge-ok":"ats-badge-warn"}`}>{accepted[s.id]?"Accepted":"Issue"}</span>
                  </div>
                  <div className="ats-sug-body">{s.explanation}</div>
                  <div className="ats-sug-code">{humanizeSuggestion(s)}</div>
                </div>
              </div>
            ))}
            <div className="ats-actions">
              <button className="ats-export-btn" onClick={exportChecklist}>Export Checklist (PDF)</button>
              <button className="ats-apply-btn" onClick={applyAccepted}>Apply Accepted Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  </>);
}

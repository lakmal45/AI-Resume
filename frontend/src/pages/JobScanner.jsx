import { createElement, useState, useEffect } from "react";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import AILoadingOverlay from "../components/AILoadingOverlay";
import {
  Search, FileText, Target, Zap, CheckCircle2, AlertCircle,
  TrendingUp, Sparkles, BarChart3, Lightbulb, ArrowRight, Upload, X,
} from "lucide-react";

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

export default function JobScanner() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [jdText,setJdText]=useState("");const [loading,setLoading]=useState(false);
  const [result,setResult]=useState(null);const [scoreAnim,setScoreAnim]=useState(0);
  const [resumes,setResumes]=useState([]);const [selectedResumeId,setSelectedResumeId]=useState("");
  const [selectedResumeJson,setSelectedResumeJson]=useState(null);const [file,setFile]=useState(null);

  useEffect(()=>{api.get("/api/resumes").then(r=>setResumes(r.data||[])).catch(()=>{});},[]);
  useEffect(()=>{
    if(!selectedResumeId){setSelectedResumeJson(null);return;}
    api.get(`/api/resumes/${selectedResumeId}`)
      .then(r=>setSelectedResumeJson(r.data.resumeJson?JSON.parse(r.data.resumeJson):{}))
      .catch(()=>{});
  },[selectedResumeId]);

  const validate=()=>{
    if(!jdText.trim()){toast("Job description cannot be empty!", "error");return false;}
    if(jdText.trim().length<100){toast("Job description must be at least 100 characters!", "error");return false;}
    return true;
  };
  const animateScore=(target)=>{let i=0;const iv=setInterval(()=>{if(i<=target)setScoreAnim(i++);else clearInterval(iv);},10);};
  const analyze=async()=>{
    if(!validate())return;setLoading(true);
    try{const res=await api.post("/api/jobscan/analyze",{jdText,selectedResumeJson});setResult(res.data);animateScore(res.data.matchScore);}
    catch{toast("Error analyzing JD.", "error");}finally{setLoading(false);}
  };
  const uploadFile=async()=>{
    if(!file)return toast("Upload a JD PDF or Image!", "warning");setLoading(true);
    try{
      const form=new FormData();form.append("file",file);
      const ext=await api.post("/api/jobscan/extract-file",form,{headers:{"Content-Type":"multipart/form-data"}});
      const an=await api.post("/api/jobscan/analyze",{jdText:ext.data.text,selectedResumeJson});
      setResult(an.data);animateScore(an.data.matchScore);
    }catch{toast("Error extracting or analyzing JD", "error");}finally{setLoading(false);}
  };
  const submitButton=()=>{if(file)return uploadFile();if(validate())return analyze();toast("Type a JD or upload a file first.", "warning");};
  const applyChanges=()=>{
    const obj={header:{name:"",role:"",email:"",phone:""},summary:result.updatedSummary,skills:result.skills||[],experience:[{role:"",company:"",tech:[],bullets:result.updatedBullets||[]}],projects:[]};
    if(selectedResumeJson){obj.header=selectedResumeJson.header||obj.header;obj.experience=selectedResumeJson.experience?.length?[...selectedResumeJson.experience]:obj.experience;if(!obj.experience[0])obj.experience[0]={role:"",company:"",tech:[],bullets:[]};obj.experience[0].bullets=result.updatedBullets||[];obj.skills=Array.from(new Set([...(selectedResumeJson.skills||[]),...(result.skills||[])]));obj.summary=result.updatedSummary||obj.summary;}
    const encoded=encodeURIComponent(JSON.stringify(obj));
    if(!selectedResumeId){navigate(`/editor/new?data=${encoded}`);return;}
    api.put(`/api/resumes/${selectedResumeId}`,{template:"Minimal",resumeJson:JSON.stringify(obj)}).then(()=>navigate(`/editor/${selectedResumeId}`)).catch(()=>toast("Failed to update resume", "error"));
  };

  const radius=56,circumference=2*Math.PI*radius,strokeDashoffset=circumference-(scoreAnim/100)*circumference;

  return(<>
    <style>{`
      .js-root{max-width:1100px;margin:0 auto;font-family:'Inter','Segoe UI',sans-serif;}
      .js-banner{background:linear-gradient(135deg,${C.primary},${C.primaryDk},${C.primaryDkr});border-radius:22px;padding:28px 36px;color:#fff;margin-bottom:22px;position:relative;overflow:hidden;}
      .js-banner::before{content:'';position:absolute;top:-50px;right:-50px;width:220px;height:220px;border-radius:50%;background:rgba(255,255,255,0.07);}
      .js-banner h1{font-size:23px;font-weight:700;margin:0 0 4px;position:relative;z-index:1;}
      .js-banner p{font-size:13px;opacity:.82;margin:0;position:relative;z-index:1;}
      .js-how{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:22px;}
      @media(max-width:680px){.js-how{grid-template-columns:1fr;}}
      .js-how-item{background:${C.card};border:1px solid ${C.border};border-radius:14px;padding:16px 18px;display:flex;align-items:flex-start;gap:12px;box-shadow:0 2px 8px rgba(0,119,181,0.05);transition:transform .2s,box-shadow .2s;}
      .js-how-item:hover{transform:translateY(-2px);box-shadow:0 6px 18px rgba(0,119,181,0.1);}
      .js-how-icon{width:38px;height:38px;border-radius:10px;background:${C.primaryLt};display:flex;align-items:center;justify-content:center;flex-shrink:0;}
      .js-how-title{font-size:13px;font-weight:600;color:${C.dark};margin-bottom:3px;}
      .js-how-desc{font-size:12px;color:${C.muted};}
      .js-cols{display:grid;grid-template-columns:1fr 1fr;gap:18px;}
      @media(max-width:800px){.js-cols{grid-template-columns:1fr;}}
      .js-card{background:${C.card};border:1px solid ${C.border};border-radius:18px;overflow:hidden;box-shadow:0 2px 8px rgba(0,119,181,0.04);}
      .js-card-bar{height:3px;background:linear-gradient(to right,${C.primary},${C.primaryDk});}
      .js-card-hd{padding:16px 22px 13px;border-bottom:1px solid ${C.primaryLt};}
      .js-hd-row{display:flex;align-items:center;gap:10px;}
      .js-hicon{width:36px;height:36px;border-radius:9px;background:${C.primaryLt};display:flex;align-items:center;justify-content:center;flex-shrink:0;}
      .js-card-title{font-size:14px;font-weight:700;color:${C.dark};margin:0;}
      .js-card-sub{font-size:12px;color:${C.muted};margin:3px 0 0;}
      .js-card-body{padding:18px 22px;}
      .js-select{width:100%;padding:9px 12px;border:1.5px solid ${C.border};border-radius:10px;font-size:13px;color:${C.dark};background:${C.card};outline:none;margin-bottom:14px;cursor:pointer;transition:border-color .2s;}
      .js-select:focus{border-color:${C.primary};box-shadow:0 0 0 3px rgba(0,119,181,.08);}
      .js-drop{border:2px dashed ${C.primaryBdr};border-radius:14px;padding:16px;background:${C.bg};transition:all .2s;margin-bottom:14px;}
      .js-drop.has-file{border-color:${C.primary};background:${C.primaryLt};}
      .js-drop textarea{width:100%;min-height:155px;resize:none;background:transparent;border:none;outline:none;font-size:13px;color:${C.dark};font-family:inherit;}
      .js-drop-foot{display:flex;justify-content:space-between;align-items:center;border-top:1px solid ${C.border};padding-top:9px;margin-top:7px;}
      .js-drop-foot span{font-size:11px;color:${C.muted};}
      .js-upload-lbl{font-size:12px;font-weight:600;color:${C.primary};display:flex;align-items:center;gap:5px;cursor:pointer;}
      .js-upload-lbl:hover{text-decoration:underline;}
      .js-file-preview{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:155px;gap:8px;}
      .js-file-name{font-size:13px;font-weight:600;color:${C.dark};}
      .js-remove-btn{font-size:12px;color:#ef4444;background:none;border:none;cursor:pointer;display:flex;align-items:center;gap:4px;}
      .js-btn{width:100%;padding:12px;border-radius:12px;border:none;background:linear-gradient(135deg,${C.primary},${C.primaryDk});color:#fff;font-size:14px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;transition:all .2s;box-shadow:0 2px 10px rgba(0,119,181,0.3);}
      .js-btn:hover:not(:disabled){opacity:.9;transform:translateY(-1px);}
      .js-btn:disabled{opacity:.55;cursor:not-allowed;transform:none;}
      @keyframes js-spin{to{transform:rotate(360deg);}} .js-spin{animation:js-spin .8s linear infinite;}
      .js-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:260px;text-align:center;padding:24px;border:2px dashed ${C.border};border-radius:18px;background:${C.card};}
      .js-empty-icon{width:60px;height:60px;border-radius:16px;background:${C.primaryLt};display:flex;align-items:center;justify-content:center;margin-bottom:14px;}
      .js-empty h3{font-size:15px;font-weight:600;color:${C.dark};margin:0 0 5px;}
      .js-empty p{font-size:13px;color:${C.muted};}
      .js-score-box{text-align:center;padding:20px 0 12px;position:relative;}
      .js-score-num{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:26px;font-weight:700;color:${C.dark};}
      .js-metrics{display:flex;flex-direction:column;gap:8px;margin-top:4px;}
      .js-metric-row{display:flex;justify-content:space-between;font-size:13px;}
      .js-metric-lbl{color:${C.muted};} .js-metric-val{font-weight:600;color:${C.dark};}
      .js-prog-track{height:7px;border-radius:4px;background:${C.primaryLt};overflow:hidden;}
      .js-prog-fill{height:100%;border-radius:4px;background:linear-gradient(to right,${C.primary},${C.primaryDk});transition:width .8s ease;}
      .js-badges{display:flex;flex-wrap:wrap;gap:7px;margin-bottom:14px;}
      .js-badge{display:inline-flex;align-items:center;gap:4px;padding:4px 10px;border-radius:20px;font-size:11px;font-weight:500;border:1px solid;}
      .js-badge-match{background:${C.primaryLt};color:${C.primaryTxt};border-color:${C.primaryBdr};}
      .js-badge-miss{background:#fef2f2;color:#ef4444;border-color:#fecaca;}
      .js-ai-box{display:flex;gap:10px;padding:13px;border-radius:12px;background:${C.bg};border:1px solid ${C.border};margin-bottom:14px;}
      .js-ai-icon{width:32px;height:32px;border-radius:8px;background:${C.primaryLt};display:flex;align-items:center;justify-content:center;flex-shrink:0;}
      .js-ai-title{font-size:13px;font-weight:600;color:${C.dark};margin-bottom:3px;}
      .js-ai-body{font-size:12px;color:${C.muted};line-height:1.5;}
      .js-apply-btn{width:100%;padding:11px;border-radius:11px;border:none;background:linear-gradient(135deg,#059669,#047857);color:#fff;font-size:14px;font-weight:600;cursor:pointer;transition:all .2s;box-shadow:0 2px 8px rgba(5,150,105,0.3);}
      .js-apply-btn:hover{opacity:.9;transform:translateY(-1px);}
    `}</style>
    
    <AILoadingOverlay isVisible={loading} message="Scanning job description..." />

    <div className="js-root">
      {/* Banner */}
      <div className="js-banner">
        <h1><Search size={20} style={{display:"inline",verticalAlign:"middle",marginRight:8}}/>Job Scanner</h1>
        <p>Analyze job postings and optimize your resume to increase your chances of landing interviews</p>
      </div>

      {/* How it works */}
      <div className="js-how">
        {[{icon:Target,title:"Keyword Matching",desc:"Identifies key skills and terms from the job description"},{icon:BarChart3,title:"Match Scoring",desc:"Calculates how well your resume fits the role"},{icon:Lightbulb,title:"Smart Suggestions",desc:"Get actionable tips to close the gap"}].map(({icon,title,desc})=>(
          <div className="js-how-item" key={title}>
            <div className="js-how-icon">{createElement(icon, { size: 17, color: C.primary })}</div>
            <div><div className="js-how-title">{title}</div><div className="js-how-desc">{desc}</div></div>
          </div>
        ))}
      </div>

      <div className="js-cols">
        {/* LEFT: Inputs */}
        <div className="js-card">
          <div className="js-card-bar"/>
          <div className="js-card-hd">
            <div className="js-hd-row">
              <div className="js-hicon"><FileText size={16} color={C.primary}/></div>
              <div><div className="js-card-title">Select Resume &amp; Job Description</div><div className="js-card-sub">Choose a resume and paste or upload the JD</div></div>
            </div>
          </div>
          <div className="js-card-body">
            <select className="js-select" value={selectedResumeId} onChange={e=>setSelectedResumeId(e.target.value)}>
              <option value="">Select a resume…</option>
              {resumes.map(r=>{let n="Resume";try{n=JSON.parse(r.resumeJson)?.header?.name||"Resume";}catch{}return<option key={r._id} value={r._id}>{n}</option>;})}
            </select>
            <div className={`js-drop ${file?"has-file":""}`} onDrop={e=>{e.preventDefault();if(e.dataTransfer.files[0])setFile(e.dataTransfer.files[0]);}} onDragOver={e=>e.preventDefault()}>
              {!file?(<>
                <textarea placeholder="Paste job description text here…" value={jdText} onChange={e=>setJdText(e.target.value)}/>
                <div className="js-drop-foot">
                  <span>Or drag &amp; drop a PDF / image</span>
                  <label className="js-upload-lbl"><Upload size={12}/> Upload File<input type="file" accept=".pdf,image/*" style={{display:"none"}} onChange={e=>setFile(e.target.files[0])}/></label>
                </div>
              </>):(<div className="js-file-preview"><FileText size={36} color={C.primary}/><div className="js-file-name">{file.name}</div><button className="js-remove-btn" onClick={()=>setFile(null)}><X size={12}/> Remove File</button></div>)}
            </div>
            <button className="js-btn" onClick={submitButton} disabled={loading}>
              {loading?<><Sparkles size={15} className="js-spin"/> Analyzing…</>:<><Sparkles size={15}/> Scan Job Posting <ArrowRight size={14}/></>}
            </button>
          </div>
        </div>

        {/* RIGHT: Results */}
        {result?(
          <div style={{display:"flex",flexDirection:"column",gap:18}}>
            <div className="js-card">
              <div className="js-card-bar"/>
              <div className="js-card-hd"><div className="js-hd-row"><div className="js-hicon"><TrendingUp size={16} color={C.primary}/></div><div><div className="js-card-title">Match Score</div><div className="js-card-sub">How well your resume matches the role</div></div></div></div>
              <div className="js-card-body">
                <div className="js-score-box">
                  <svg width="120" height="120" style={{transform:"rotate(-90deg)"}}>
                    <circle cx="60" cy="60" r={radius} stroke={C.primaryLt} strokeWidth="12" fill="none"/>
                    <circle cx="60" cy="60" r={radius} stroke={C.primary} strokeWidth="12" fill="none" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" style={{transition:"stroke-dashoffset 1s ease"}}/>
                  </svg>
                  <div className="js-score-num">{scoreAnim}%</div>
                </div>
                <div className="js-metrics">
                  <div className="js-metric-row"><span className="js-metric-lbl">Skills Match</span><span className="js-metric-val">{scoreAnim>80?"High":"Moderate"}</span></div>
                  <div className="js-prog-track"><div className="js-prog-fill" style={{width:`${Math.min(scoreAnim+10,100)}%`}}/></div>
                </div>
              </div>
            </div>
            <div className="js-card">
              <div className="js-card-bar"/>
              <div className="js-card-hd"><div className="js-hd-row"><div className="js-hicon"><Target size={16} color={C.primary}/></div><div><div className="js-card-title">Keyword Analysis</div><div className="js-card-sub">{result.skills?.length} found · {result.missingSkills?.length} missing</div></div></div></div>
              <div className="js-card-body">
                <div className="js-badges">
                  {result.skills?.map((s,i)=><span key={i} className="js-badge js-badge-match"><CheckCircle2 size={11}/>{s}</span>)}
                  {result.missingSkills?.map((s,i)=><span key={i} className="js-badge js-badge-miss"><AlertCircle size={11}/>{s}</span>)}
                </div>
                <div className="js-ai-box"><div className="js-ai-icon"><Lightbulb size={15} color={C.primary}/></div><div><div className="js-ai-title">AI Suggestion</div><div className="js-ai-body">{result.updatedSummary}</div></div></div>
                <button className="js-apply-btn" onClick={applyChanges}>Apply Changes to Resume</button>
              </div>
            </div>
          </div>
        ):(
          <div className="js-empty">
            <div className="js-empty-icon"><TrendingUp size={26} color={C.primary}/></div>
            <h3>Ready to Scan</h3>
            <p>Upload a job description to see your match score and analysis here.</p>
          </div>
        )}
      </div>
    </div>
  </>);
}

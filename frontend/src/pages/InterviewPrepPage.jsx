import React, { useState, useEffect } from "react";
import { useToast } from "../context/ToastContext";
import AILoadingOverlay from "../components/AILoadingOverlay";

import { MessageSquare, Lightbulb, Target, BookOpen, Mic, Clock, CheckCircle2, ChevronRight, ChevronDown, Sparkles } from "lucide-react";
import { api } from "../services/api";

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

const interviewTips = [
  { category:"Behavioral Questions", icon:MessageSquare, tips:["Use the STAR method (Situation, Task, Action, Result)","Prepare 5-7 stories that showcase different skills","Keep answers between 1-2 minutes"] },
  { category:"Technical Preparation", icon:Target,         tips:["Review fundamentals related to your role","Practice coding problems or case studies","Be ready to explain your past projects in depth"] },
  { category:"Research & Preparation", icon:BookOpen,      tips:["Research the company's mission and recent news","Understand the role requirements thoroughly","Prepare thoughtful questions for the interviewer"] },
];

const S = `
.ip-root{max-width:1100px;margin:0 auto;font-family:'Inter','Segoe UI',sans-serif;display:flex;flex-direction:column;gap:20px;}
.ip-banner{background:linear-gradient(135deg,#0077b5,#0a66c2,#004182);border-radius:22px;padding:28px 36px;color:#fff;position:relative;overflow:hidden;}
.ip-banner::before{content:'';position:absolute;top:-50px;right:-50px;width:220px;height:220px;border-radius:50%;background:rgba(255,255,255,0.07);}
.ip-banner h1{font-size:23px;font-weight:700;margin:0 0 4px;position:relative;z-index:1;}
.ip-banner p{font-size:13px;opacity:.82;margin:0;position:relative;z-index:1;}
.ip-card{background:var(--c-card);border:1px solid var(--c-border);border-radius:18px;overflow:hidden;box-shadow:0 2px 8px rgba(0,119,181,0.04);}
.ip-card-bar{height:3px;background:linear-gradient(to right,#0077b5,#0a66c2);}
.ip-card-hd{padding:18px 22px 14px;border-bottom:1px solid var(--c-border);}
.ip-card-hd-row{display:flex;align-items:center;gap:10px;}
.ip-hicon{width:36px;height:36px;border-radius:9px;background:var(--c-border);display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.ip-card-title{font-size:14px;font-weight:700;color:var(--c-dark);margin:0;}
.ip-card-sub{font-size:12px;color:var(--c-mutedTxt);margin:3px 0 0;}
.ip-card-body{padding:18px 22px;}
.ip-select-wrap{position:relative;width:100%;max-width:420px;}
.ip-select{width:100%;padding:9px 36px 9px 12px;border:1.5px solid var(--c-border);border-radius:10px;font-size:13px;color:var(--c-dark);background:var(--c-card);outline:none;appearance:none;cursor:pointer;transition:border-color .2s;}
.ip-select:focus{border-color:#0077b5;box-shadow:0 0 0 3px rgba(0,119,181,.08);}
.ip-select-arrow{position:absolute;right:10px;top:50%;transform:translateY(-50%);pointer-events:none;color:var(--c-mutedTxt);}
.ip-gen-btn{margin-top:14px;padding:10px 22px;border-radius:11px;border:none;background:linear-gradient(135deg,#0077b5,#0a66c2);color:#fff;font-size:14px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:8px;transition:all .2s;box-shadow:0 2px 10px rgba(0,119,181,0.3);}
.ip-gen-btn:hover:not(:disabled){opacity:.9;transform:translateY(-1px);}
.ip-gen-btn:disabled{opacity:.55;cursor:not-allowed;transform:none;}
@keyframes ip-spin{to{transform:rotate(360deg);}} .ip-spin{animation:ip-spin .8s linear infinite;}
.ip-result{margin-top:18px;padding:16px;background:var(--c-bg);border:1px solid var(--c-border);border-radius:14px;font-size:13px;color:var(--c-dark);line-height:1.7;white-space:pre-wrap;}
.ip-tips-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;}
@media(max-width:760px){.ip-tips-grid{grid-template-columns:1fr;}}
.ip-tip-card{background:var(--c-card);border:1px solid var(--c-border);border-radius:16px;overflow:hidden;box-shadow:0 2px 8px rgba(0,119,181,0.04);transition:transform .2s,box-shadow .2s;}
.ip-tip-card:hover{transform:translateY(-2px);box-shadow:0 6px 18px rgba(0,119,181,0.1);}
.ip-tip-bar{height:3px;background:linear-gradient(to right,#0077b5,#0a66c2);}
.ip-tip-hd{padding:16px 18px 12px;border-bottom:1px solid var(--c-border);display:flex;align-items:center;gap:10px;}
.ip-tip-icon{width:34px;height:34px;border-radius:9px;background:var(--c-border);display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.ip-tip-title{font-size:13px;font-weight:700;color:var(--c-dark);}
.ip-tip-body{padding:14px 18px;}
.ip-tip-li{display:flex;align-items:flex-start;gap:8px;font-size:12px;color:var(--c-mutedTxt);margin-bottom:9px;line-height:1.5;}
.ip-tip-li:last-child{margin-bottom:0;}
.ip-tip-check{color:#0077b5;flex-shrink:0;margin-top:1px;}
.ip-q-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
@media(max-width:640px){.ip-q-grid{grid-template-columns:1fr;}}
.ip-q-item{display:flex;align-items:flex-start;gap:12px;padding:14px 16px;border-radius:12px;border:1px solid var(--c-border);background:var(--c-bg);transition:all .15s;}
.ip-q-item:hover{background:var(--c-border);border-color:var(--c-primaryLt);}
.ip-q-num{width:28px;height:28px;border-radius:50%;background:var(--c-border);color:#0077b5;font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.ip-q-text{font-size:13px;color:var(--c-dark);line-height:1.5;}
.ip-feat-card{background:var(--c-bg);border:1px solid var(--c-border);border-radius:18px;padding:24px 22px;}
.ip-feat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:4px;}
@media(max-width:640px){.ip-feat-grid{grid-template-columns:1fr;}}
.ip-feat-item{text-align:center;padding:16px 12px;}
.ip-feat-icon-wrap{width:48px;height:48px;border-radius:50%;background:var(--c-card);border:1px solid var(--c-border);display:flex;align-items:center;justify-content:center;margin:0 auto 12px;box-shadow:0 2px 8px rgba(0,119,181,0.1);}
.ip-feat-title{font-size:13px;font-weight:700;color:var(--c-dark);margin-bottom:5px;}
.ip-feat-desc{font-size:12px;color:var(--c-mutedTxt);line-height:1.5;}
`;

export default function InterviewGenerator() {
  const [resumes, setResumes] = useState([]);
  const [role, setRole] = useState("");
  const [result, setResult] = useState(null); // Will hold the parsed JSON
  const [loading, setLoading] = useState(false);
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const { toast } = useToast();
  
  // Practice Mode State
  const [isPracticeMode, setIsPracticeMode] = useState(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [allQuestions, setAllQuestions] = useState([]); // Flattened questions array

  useEffect(() => {
    api.get("/api/resumes/").then(r => setResumes(r.data)).catch(console.error);
    // Also fetch history
    api.get("/api/interview/history").then(r => {
      if (r.data && r.data.length > 0) {
        setResult(r.data[0].questions); // load latest session
      }
    }).catch(console.error);
  }, []);

  const generate = async () => {
    if (!selectedResumeId) return toast("Select a resume!", "warning");
    setLoading(true);
    try {
      const res = await api.post("/api/interview/generate", { resumeId: selectedResumeId, role });
      setResult(res.data.saved.questions);
      toast("Questions generated and saved!", "success");
    } catch {
      toast("Error generating interview questions!", "error");
    } finally {
      setLoading(false);
    }
  };

  const startPractice = () => {
    if (!result || !result.categories) return;
    
    // Flatten categories into a single array for practice mode
    let flatQs = [];
    result.categories.forEach(cat => {
      cat.questions.forEach(q => {
        flatQs.push({ ...q, category: cat.name });
      });
    });
    
    setAllQuestions(flatQs);
    setCurrentQuestionIdx(0);
    setShowAnswer(false);
    setIsPracticeMode(true);
  };

  const nextQuestion = () => {
    if (currentQuestionIdx < allQuestions.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
      setShowAnswer(false);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIdx > 0) {
      setCurrentQuestionIdx(currentQuestionIdx - 1);
      setShowAnswer(false);
    }
  };

  return (
    <>
      <AILoadingOverlay isVisible={loading} message="Generating tailored interview questions..." />
      <style dangerouslySetInnerHTML={{ __html: S }} />
      
      {/* Flip Card CSS */}
      <style dangerouslySetInnerHTML={{ __html: `
        .flip-card {
          background-color: transparent;
          width: 100%;
          height: 300px;
          perspective: 1000px;
          cursor: pointer;
        }
        .flip-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          text-align: center;
          transition: transform 0.6s;
          transform-style: preserve-3d;
        }
        .flip-card.show-answer .flip-card-inner {
          transform: rotateY(180deg);
        }
        .flip-card-front, .flip-card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
          border-radius: 18px;
          border: 1px solid var(--c-border);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 30px;
          box-shadow: 0 4px 15px rgba(0,119,181,0.08);
        }
        .flip-card-front {
          background: var(--c-card);
          color: var(--c-dark);
        }
        .flip-card-back {
          background: linear-gradient(135deg, #0077b5, #0a66c2);
          color: white;
          transform: rotateY(180deg);
        }
        .practice-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 20px;
        }
        .nav-btn {
          padding: 8px 16px;
          border-radius: 8px;
          border: 1px solid var(--c-border);
          background: var(--c-card);
          color: var(--c-dark);
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
        }
        .nav-btn:hover:not(:disabled) { background: var(--c-bg); }
        .nav-btn:disabled { opacity: 0.5; cursor: not-allowed; }
      `}} />

      <div className="ip-root">
        
        {isPracticeMode ? (
          // PRACTICE MODE VIEW
          <div className="ip-card">
            <div className="ip-card-bar"/>
            <div className="ip-card-hd flex justify-between items-center">
              <div className="ip-card-hd-row">
                <div className="ip-hicon"><Lightbulb size={16} color={C.primary}/></div>
                <div>
                  <div className="ip-card-title">Practice Mode</div>
                  <div className="ip-card-sub">Question {currentQuestionIdx + 1} of {allQuestions.length}</div>
                </div>
              </div>
              <button 
                onClick={() => setIsPracticeMode(false)}
                className="text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                Exit Practice
              </button>
            </div>
            
            <div className="ip-card-body">
              <div className="text-center mb-4 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                {allQuestions[currentQuestionIdx]?.category}
              </div>
              
              <div 
                className={`flip-card ${showAnswer ? "show-answer" : ""}`} 
                onClick={() => setShowAnswer(!showAnswer)}
              >
                <div className="flip-card-inner">
                  <div className="flip-card-front">
                    <h3 className="text-xl font-bold mb-4">Question</h3>
                    <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                      {allQuestions[currentQuestionIdx]?.question}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-auto">Click card to reveal suggested answer</p>
                  </div>
                  <div className="flip-card-back">
                    <h3 className="text-xl font-bold mb-4 text-blue-100">Suggested Answer</h3>
                    <p className="text-md text-white leading-relaxed">
                      {allQuestions[currentQuestionIdx]?.answer}
                    </p>
                  </div>
                </div>
              </div>

              <div className="practice-nav">
                <button className="nav-btn" disabled={currentQuestionIdx === 0} onClick={prevQuestion}>
                  Previous
                </button>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {currentQuestionIdx + 1} / {allQuestions.length}
                </div>
                <button className="nav-btn" disabled={currentQuestionIdx === allQuestions.length - 1} onClick={nextQuestion}>
                  Next
                </button>
              </div>
            </div>
          </div>
        ) : (
          // NORMAL GENERATOR VIEW
          <>
            <div className="ip-banner">
              <h1><Mic size={20} style={{display:"inline",verticalAlign:"middle",marginRight:8}}/>Interview Guide</h1>
              <p>Prepare for your interviews with AI-personalized tips based on your resume</p>
            </div>

            <div className="ip-card">
              <div className="ip-card-bar"/>
              <div className="ip-card-hd">
                <div className="ip-card-hd-row">
                  <div className="ip-hicon"><Mic size={16} color={C.primary}/></div>
                  <div>
                    <div className="ip-card-title">Generate Interview Prep</div>
                    <div className="ip-card-sub">Select a resume and target role to generate personalised questions</div>
                  </div>
                </div>
              </div>
              <div className="ip-card-body">
                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                  <div className="ip-select-wrap">
                    <select className="ip-select" value={selectedResumeId} onChange={e=>setSelectedResumeId(e.target.value)}>
                      <option value="">Select a resume…</option>
                      {resumes.map(r=>{let n="Resume";try{n=JSON.parse(r.resumeJson)?.header?.name||"Resume";}catch{}return<option key={r._id} value={r._id}>{n}</option>;})}
                    </select>
                    <div className="ip-select-arrow"><ChevronDown size={16}/></div>
                  </div>
                  <input 
                    type="text" 
                    placeholder="Target Role (e.g. Frontend Developer)" 
                    value={role} 
                    onChange={e=>setRole(e.target.value)} 
                    className="ip-select" 
                    style={{maxWidth: "300px"}}
                  />
                </div>
                
                <button className="ip-gen-btn" disabled={loading} onClick={generate}>
                  {loading?<><Sparkles size={14} className="ip-spin"/> Generating…</>:<>Generate Interview Guide <ChevronRight size={14}/></>}
                </button>
              </div>
            </div>

            {/* Results Display */}
            {result && result.categories && (
              <div className="ip-card">
                <div className="ip-card-bar"/>
                <div className="ip-card-hd flex justify-between items-center">
                  <div className="ip-card-hd-row">
                    <div className="ip-hicon"><Lightbulb size={16} color={C.primary}/></div>
                    <div><div className="ip-card-title">Your Tailored Questions</div><div className="ip-card-sub">Review or enter Practice Mode</div></div>
                  </div>
                  <button onClick={startPractice} className="ip-gen-btn" style={{marginTop: 0, padding: "8px 16px"}}>
                    Enter Practice Mode
                  </button>
                </div>
                <div className="ip-card-body">
                  {result.categories.map((cat, i) => (
                    <div key={i} className="mb-6 last:mb-0">
                      <h3 className="text-sm font-bold uppercase tracking-widest text-slate-800 dark:text-slate-200 border-b border-gray-200 dark:border-slate-700 pb-2 mb-3">
                        {cat.name}
                      </h3>
                      <div className="space-y-4">
                        {cat.questions.map((q, j) => (
                          <div key={j} className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-lg">
                            <p className="font-semibold text-sm text-slate-900 dark:text-slate-100 mb-2">Q: {q.question}</p>
                            <p className="text-sm text-slate-600 dark:text-slate-300">A: {q.answer}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!result && (
              <div className="ip-tips-grid">
                {interviewTips.map(section=>(
                  <div className="ip-tip-card" key={section.category}>
                    <div className="ip-tip-bar"/>
                    <div className="ip-tip-hd">
                      <div className="ip-tip-icon"><section.icon size={16} color={C.primary}/></div>
                      <div className="ip-tip-title">{section.category}</div>
                    </div>
                    <div className="ip-tip-body">
                      {section.tips.map((tip,i)=>(
                        <div className="ip-tip-li" key={i}>
                          <CheckCircle2 size={14} className="ip-tip-check"/>
                          <span>{tip}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

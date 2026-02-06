import { useState, useEffect } from "react";
import axios from "axios";
import { api } from "../services/api";
import DashboardLayout from "../layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import {
  FileCheck,
  AlertTriangle,
  Sparkles,
  FileText,
  Layout,
  Zap,
  History,
} from "lucide-react";

// --- UI Components ---
const Card = ({ children, className }) => (
  <div className={`rounded-xl border bg-white shadow-sm ${className || ""}`}>
    {children}
  </div>
);
const CardHeader = ({ children }) => (
  <div className="flex flex-col space-y-1.5 p-6">{children}</div>
);
const CardTitle = ({ children, className }) => (
  <h3
    className={`font-semibold leading-none tracking-tight ${className || ""}`}
  >
    {children}
  </h3>
);
const CardDescription = ({ children }) => (
  <p className="text-sm text-gray-500">{children}</p>
);
const CardContent = ({ children, className }) => (
  <div className={`p-6 pt-0 ${className || ""}`}>{children}</div>
);
const Badge = ({ children, variant }) => {
  let styles = "bg-blue-100 text-blue-800";
  if (variant === "destructive") styles = "bg-red-100 text-red-800";
  if (variant === "success") styles = "bg-green-100 text-green-800";
  return (
    <div
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${styles}`}
    >
      {children}
    </div>
  );
};
const Progress = ({ value, className }) => (
  <div
    className={`relative h-2 w-full overflow-hidden rounded-full bg-gray-100 ${
      className || ""
    }`}
  >
    <div
      className="h-full bg-primary transition-all"
      style={{ width: `${value}%` }}
    />
  </div>
);

export default function ATSAnalyzer({ userResume, setUserResume }) {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [scoreAnim, setScoreAnim] = useState(0);
  const [accepted, setAccepted] = useState({});
  const [jobDesc, setJobDesc] = useState("");
  const [history, setHistory] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [selectedResumeJson, setSelectedResumeJson] = useState(null);

  const [resumes, setResumes] = useState([]);
  const [uploadFile, setUploadFile] = useState(null);
  const navigate = useNavigate();
  const [isDragging, setIsDragging] = useState(false);
  const hasUploadedFile = !!uploadFile;
  const hasSelectedResume = !!selectedResumeId;

  const [selectedHistory, setSelectedHistory] = useState(null);
  const [showHistory, setShowHistory] = useState(false);

  // LOAD HISTORY
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/api/ats/history");
        setHistory(res.data || []);
      } catch (e) {}
    })();
  }, []);

  // LOAD ALL RESUMES
  useEffect(() => {
    const loadResumes = async () => {
      try {
        const r = await api.get("/api/resumes");
        setResumes(r.data || []);
      } catch (err) {
        console.error("Failed to load resumes");
      }
    };
    loadResumes();
  }, []);

  // LOAD SELECTED RESUME JSON
  useEffect(() => {
    if (!selectedResumeId) {
      setSelectedResumeJson(null);
      return;
    }

    // Load selected resume JSON when resume ID changes
    const loadOne = async () => {
      try {
        const res = await api.get(`/api/resumes/${selectedResumeId}`);
        const json = res.data.resumeJson ? JSON.parse(res.data.resumeJson) : {};
        setSelectedResumeJson(json);
      } catch (err) {
        console.error("Failed to load resume");
      }
    };
    loadOne();
  }, [selectedResumeId]);

  // LOAD HISTORY ITEM INTO ANALYSIS
  const loadHistoryAnalysis = (item) => {
    setAnalysis(item);
    setSelectedHistory(item);

    // reset accepted map
    const map = {};
    (item.suggestions || []).forEach((s) => {
      map[s.id] = false;
    });
    setAccepted(map);

    // animate score
    let i = 0;
    const target = item.atsScore || 0;
    const interval = setInterval(() => {
      i++;
      setScoreAnim(Math.min(i, target));
      if (i >= target) clearInterval(interval);
    }, 8);
  };

  // DRAG & DROP HANDLERS
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (hasSelectedResume) return;

    const file = e.dataTransfer.files?.[0];
    if (file) setUploadFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!hasSelectedResume) setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  // HUMANIZE SUGGESTION DISPLAY
  const humanizeSuggestion = (s) => {
    if (s.category === "keyword" && Array.isArray(s.proposedChange)) {
      return `Add missing keywords: ${s.proposedChange.join(", ")}`;
    }

    if (typeof s.proposedChange === "string") {
      return s.proposedChange;
    }

    if (typeof s.proposedChange === "object" && s.proposedChange?.newSkill) {
      return `Add skill: ${s.proposedChange.newSkill}`;
    }

    return "Improve this section based on ATS recommendation.";
  };

  // ANALYZE RESUME
  const analyze = async () => {
    if (!selectedResumeJson && !uploadFile) {
      return alert("Select a resume or upload a file first.");
    }

    setLoading(true);
    setAnalysis(null);
    try {
      let resumePayload = selectedResumeJson;
      // CASE 1: FILE UPLOAD → extract + parse
      if (uploadFile) {
        const fd = new FormData();
        fd.append("file", uploadFile);

        const extractRes = await api.post("/api/ats/extract-resume", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        resumePayload = extractRes.data.parsed || {
          rawText: extractRes.data.text,
        };

        setSelectedResumeJson(resumePayload);
      }

      // CASE 2: ANALYZE
      const r = await api.post("/api/ats/analyze", {
        resume: selectedResumeJson,
        jobDescription: jobDesc || "",
      });
      setAnalysis(r.data);

      const map = {};
      r.data.suggestions.forEach((s) => {
        map[s.id] = false;
      });
      setAccepted(map);

      // animate ATS score
      let i = 0;
      const target = r.data.atsScore;
      const interval = setInterval(() => {
        i++;
        setScoreAnim(Math.min(i, target));
        if (i >= target) clearInterval(interval);
      }, 8);
    } catch (err) {
      alert("ATS analysis failed");
    } finally {
      setLoading(false);
    }
  };

  // APPLY ACCEPTED SUGGESTIONS
  const applyAccepted = () => {
    if (!analysis?.suggestions?.length) {
      alert("No suggestions available.");
      return;
    }

    if (!selectedResumeJson) {
      alert("No resume loaded.");
      return;
    }

    const payload = {
      resume: selectedResumeJson,
      suggestions: analysis.suggestions, // ✅ ALL suggestions
      analysisId: analysis.analysisId,

      resumeId: selectedResumeId || null,
      sourceType: uploadFile ? "upload" : "resume",
    };

    navigate(`/editor/ats?data=${encodeURIComponent(JSON.stringify(payload))}`);
  };

  // MAP IMPACT TO NUMBER
  const mapImpact = (impact) => {
    if (!impact) return 2;
    const i = impact.toLowerCase();
    if (i.includes("high") || i.includes("crit")) return 0;
    if (i.includes("medium") || i.includes("important")) return 1;
    return 2;
  };

  // EXPORT CHECKLIST PDF
  const exportChecklist = async () => {
    if (!analysis) return alert("Run analysis first.");

    const sorted = [...analysis.suggestions].sort(
      (a, b) => mapImpact(a.impact) - mapImpact(b.impact),
    );

    const html = `
      <html><body style="font-family:Arial;padding:20px;">
      <h1>ATS Improvement Checklist</h1>
      <p>Score: ${analysis.atsScore}</p>

      ${sorted
        .map(
          (s) => `
        <div style="margin:12px 0;padding:12px;border-left:4px solid ${
          mapImpact(s.impact) === 0
            ? "#d9534f"
            : mapImpact(s.impact) === 1
              ? "#f0ad4e"
              : "#5bc0de"
        };">
          <strong>${s.title}</strong> (${s.impact || ""})
          <p>${s.explanation}</p>
          <pre style="background:#f2f2f2;padding:10px;">${
            typeof s.proposedChange === "string"
              ? s.proposedChange
              : JSON.stringify(s.proposedChange, null, 2)
          }</pre>
        </div>`,
        )
        .join("")}
      </body></html>
    `;

    try {
      const r = await api.post(
        "/api/pdf/export",
        { html },
        { responseType: "blob" },
      );

      const blob = new Blob([r.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `ats-checklist-${analysis.analysisId}.pdf`;
      a.click();

      URL.revokeObjectURL(url);
    } catch {
      alert("Failed to export checklist.");
    }
  };

  // RADIUS FOR SCORE CIRCLE
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scoreAnim / 100) * circumference;

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8 p-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">ATS Analyzer</h1>
          <p className="text-gray-500 mt-2">
            Check if your resume is optimized for Applicant Tracking Systems
          </p>
        </div>

        {/* Info Card  text-gray-600*/}
        <Card className="bg-gradient-to-br from-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <FileCheck className="h-5 w-5 text-primary" />
              What is an ATS?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              Over 75% of companies use ATS to screen resumes before a human
              ever sees them.
            </p>
            <div className="grid md:grid-cols-3 gap-4 mt-4">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-white/50">
                <Zap className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium">Keyword Scanning</h4>
                  <p className="text-sm text-gray-500">
                    Searches specific keywords
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-white/50">
                <Layout className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium">Format Parsing</h4>
                  <p className="text-sm text-gray-500">
                    Complex layouts confuse ATS
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-white/50">
                <FileText className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium">Section Recognition</h4>
                  <p className="text-sm text-gray-500">
                    Looks for standard headers
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="text-gray-900">Run Analysis</CardTitle>
              <select
                className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm ${
                  hasUploadedFile ? "opacity-50 pointer-events-none" : ""
                }`}
                disabled={hasUploadedFile}
                value={selectedResumeId}
                onChange={(e) => setSelectedResumeId(e.target.value)}
              >
                <option value="">Select a resume...</option>
                {resumes.map((r) => {
                  let name = "Resume";
                  try {
                    name = JSON.parse(r.resumeJson)?.header?.name || "Resume";
                  } catch (e) {}
                  return (
                    <option key={r._id} value={r._id}>
                      {name}
                    </option>
                  );
                })}
              </select>
              <div className="my-4 text-center text-muted-foreground">OR</div>

              {/* Upload Resume */}
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`border-2 border-dashed rounded-lg p-6 text-center transition ${
                  isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
                } ${hasSelectedResume ? "opacity-50 pointer-events-none" : ""}`}
              >
                <input
                  type="file"
                  accept=".pdf,image/*"
                  disabled={hasSelectedResume}
                  onChange={(e) => setUploadFile(e.target.files[0])}
                  className="hidden"
                  id="resumeUploadInput"
                />

                <label
                  htmlFor="resumeUploadInput"
                  className="cursor-pointer block"
                >
                  {!uploadFile ? (
                    <>
                      <div className="text-2xl">📄</div>
                      <div className="mt-2 text-sm">
                        Upload resume PDF / Image
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        We auto-parse text using OCR
                      </div>
                    </>
                  ) : (
                    <div className="text-sm font-medium text-gray-800">
                      {uploadFile.name}
                      <div className="flex gap-2 justify-center mt-2">
                        <button
                          onClick={() => setUploadFile(null)}
                          className="px-3 py-1 border rounded"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  )}
                </label>
              </div>

              <CardDescription>
                Paste a job description for better accuracy
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <textarea
                className="w-full min-h-[120px] rounded-md border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Optional: Paste job description here to compare..."
                value={jobDesc}
                onChange={(e) => setJobDesc(e.target.value)}
              />
              <Button
                onClick={analyze}
                disabled={loading}
                className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium h-12 text-white hover:bg-primary/80 disabled:opacity-50"
              >
                {loading ? (
                  <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                {loading ? "Analyzing..." : "Analyze Resume"}
              </Button>
            </CardContent>
          </Card>

          {/* Score Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-gray-900">
                ATS Compatibility Score
              </CardTitle>
              <CardDescription>
                Based on formatting and keywords
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {analysis ? (
                <>
                  <div className="text-center py-6">
                    <div className="relative inline-flex items-center justify-center">
                      <svg className="w-32 h-32 transform -rotate-90">
                        <circle
                          cx="64"
                          cy="64"
                          r={radius}
                          stroke="currentColor"
                          strokeWidth="12"
                          fill="none"
                          className="text-gray-100"
                        />
                        <circle
                          cx="64"
                          cy="64"
                          r={radius}
                          stroke="currentColor"
                          strokeWidth="12"
                          fill="none"
                          strokeDasharray={circumference}
                          strokeDashoffset={strokeDashoffset}
                          className="text-primary transition-all duration-1000 ease-out"
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="absolute text-4xl font-bold text-gray-900">
                        {scoreAnim}%
                      </span>
                    </div>
                    <p className="text-gray-500 mt-4">Analysis Complete</p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Keyword Match</span>
                      <span className="font-medium">
                        {analysis.metrics.keywordMatch}%
                      </span>
                    </div>
                    <Progress value={analysis.metrics.keywordMatch} />
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Formatting Quality</span>
                      <span className="font-medium">
                        {100 - analysis.metrics.formattingIssuesScore}%
                      </span>
                    </div>
                    <Progress
                      value={100 - analysis.metrics.formattingIssuesScore}
                    />
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 min-h-[200px]">
                  <Zap className="h-10 w-10 mb-2 opacity-50" />
                  <p>Run analysis to see score</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        {/* ATS HISTORY */}
        {history.length > 0 && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Previous ATS Analyses
                </CardTitle>
                <CardDescription>
                  Click any previous analysis to view results
                </CardDescription>
              </div>
              <button
                onClick={() => setShowHistory((p) => !p)}
                className="text-sm text-blue-600 hover:underline"
              >
                {showHistory ? "Hide" : "Show"}
              </button>
            </CardHeader>

            {showHistory && (
              <CardContent>
                <div className="space-y-3">
                  {history.map((h) => (
                    <div
                      key={h.analysisId}
                      onClick={() => loadHistoryAnalysis(h)}
                      className={`cursor-pointer p-4 rounded-lg border transition ${
                        selectedHistory?.analysisId === h.analysisId
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">
                            ATS Score: {h.atsScore}%
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(h.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <Badge
                          variant={h.atsScore >= 80 ? "success" : "destructive"}
                        >
                          {h.suggestions?.length || 0} issues
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        )}

        {/* Detailed Results */}
        {analysis && (
          <Card>
            <CardHeader>
              <CardTitle className="text-gray-900">
                Detailed ATS Suggestions
              </CardTitle>
              <CardDescription>
                {analysis.suggestions.length} issues found. Select "Accept" to
                auto-fix.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysis.suggestions.map((s) => (
                  <div
                    key={s.id}
                    className={`flex items-start gap-4 p-4 rounded-lg border hover:bg-gray-50 transition-colors ${
                      accepted[s.id]
                        ? "border-green-200 bg-green-50"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="p-2 rounded-lg bg-gray-100">
                      <AlertTriangle className="h-5 w-5 text-orange-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900">{s.title}</h4>
                        <Badge
                          variant={accepted[s.id] ? "success" : "destructive"}
                        >
                          {accepted[s.id] ? "Accepted" : "Issue"}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-900">{s.explanation}</p>
                      <div className="mt-2 text-xs bg-gray-100 p-2 rounded font-mono text-gray-600">
                        <p className="text-sm text-gray-700">
                          {humanizeSuggestion(s)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={exportChecklist}
                  className="px-6 py-2 border border-primary text-primary rounded-md hover:bg-blue-50"
                >
                  Export Checklist (PDF)
                </button>

                <Button
                  onClick={applyAccepted}
                  className="px-6 py-2 text-white rounded-md hover:bg-primary/80"
                >
                  Apply Accepted Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}

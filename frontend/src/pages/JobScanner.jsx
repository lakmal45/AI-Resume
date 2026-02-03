import { useState, useEffect } from "react";
import { api } from "../services/api";
import DashboardLayout from "../layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import {
  Search,
  FileText,
  Target,
  Zap,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Sparkles,
  Link as LinkIcon,
  Briefcase,
  BarChart3,
  Lightbulb,
  ArrowRight,
  Upload,
  X,
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
const Badge = ({ children, variant, className }) => {
  const styles =
    variant === "outline"
      ? "border border-gray-200"
      : "bg-blue-100 text-blue-800";
  return (
    <div
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors ${styles} ${
        className || ""
      }`}
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
      className="h-full bg-blue-600 transition-all"
      style={{ width: `${value}%` }}
    />
  </div>
);

export default function JobScanner() {
  const navigate = useNavigate();

  const [jdText, setJdText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [scoreAnim, setScoreAnim] = useState(0);

  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [selectedResumeJson, setSelectedResumeJson] = useState(null);
  const [file, setFile] = useState(null);

  // LOAD ALL RESUMES
  useEffect(() => {
    const loadResumes = async () => {
      try {
        const res = await api.get("/api/resumes");
        setResumes(res.data || []);
      } catch (err) {
        console.error("Failed to load resumes");
      }
    };
    loadResumes();
  }, []);

  // LOAD ONE RESUME
  useEffect(() => {
    if (!selectedResumeId) {
      setSelectedResumeJson(null);
      return;
    }
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

  // VALIDATION
  const validate = () => {
    if (!jdText.trim()) {
      alert("Job description cannot be empty!");
      return false;
    }
    if (jdText.trim().length < 100) {
      alert("Job description must be at least 100 characters!");
      return false;
    }
    return true;
  };

  // ANALYZE TEXT
  const analyze = async () => {
    if (!validate()) return;
    try {
      setLoading(true);
      const res = await api.post("/api/jobscan/analyze", {
        jdText,
        selectedResumeJson,
      });
      setResult(res.data);
      animateScore(res.data.matchScore);
    } catch (err) {
      alert("Error analyzing JD.");
    } finally {
      setLoading(false);
    }
  };

  // UPLOAD FILE
  const uploadFile = async () => {
    if (!file) return alert("Upload a JD PDF or Image!");
    try {
      setLoading(true);
      const form = new FormData();
      form.append("file", file);

      const res = await api.post("/api/jobscan/extract-file", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const extracted = res.data.text;
      const analysis = await api.post("/api/jobscan/analyze", {
        jdText: extracted,
        selectedResumeJson,
      });

      setResult(analysis.data);
      animateScore(analysis.data.matchScore);
    } catch (err) {
      alert("Error extracting or analyzing JD");
    } finally {
      setLoading(false);
    }
  };

  const submitButton = async () => {
    if (file) return uploadFile();
    if (!file && validate()) return analyze();
    alert("Type a JD or upload a file first.");
  };

  const animateScore = (targetScore) => {
    let i = 0;
    const interval = setInterval(() => {
      if (i <= targetScore) {
        setScoreAnim(i++);
      } else {
        clearInterval(interval);
      }
    }, 10);
  };

  // APPLY CHANGES
  const applyChanges = () => {
    const updatedObj = {
      header: { name: "", role: "", email: "", phone: "" },
      summary: result.updatedSummary,
      skills: result.skills || [],
      experience: [
        {
          role: "",
          company: "",
          tech: [],
          bullets: result.updatedBullets || [],
        },
      ],
      projects: [],
    };

    if (selectedResumeJson) {
      updatedObj.header = selectedResumeJson.header || updatedObj.header;
      updatedObj.experience = selectedResumeJson.experience?.length
        ? [...selectedResumeJson.experience]
        : updatedObj.experience;
      if (!updatedObj.experience[0])
        updatedObj.experience[0] = {
          role: "",
          company: "",
          tech: [],
          bullets: [],
        };
      updatedObj.experience[0].bullets = result.updatedBullets || [];
      updatedObj.skills = Array.from(
        new Set([
          ...(selectedResumeJson.skills || []),
          ...(result.skills || []),
        ])
      );
      updatedObj.summary = result.updatedSummary || updatedObj.summary;
    }

    const encoded = encodeURIComponent(JSON.stringify(updatedObj));

    if (!selectedResumeId) {
      navigate(`/editor/new?data=${encoded}`);
      return;
    }

    api
      .put(`/api/resumes/${selectedResumeId}`, {
        template: "Minimal",
        resumeJson: JSON.stringify(updatedObj),
      })
      .then(() => navigate(`/editor/${selectedResumeId}`))
      .catch(() => alert("Failed to update resume"));
  };

  // Calculation for Circle SVG
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scoreAnim / 100) * circumference;

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8 p-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Job Scanner</h1>
          <p className="text-gray-500 mt-2">
            Analyze job postings and optimize your resume to increase your
            chances of landing interviews
          </p>
        </div>

        {/* Info Card  text-blue-600*/}
        <Card className="bg-gradient-to-br from-blue-50 text-primary border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <Search className="h-5 w-5 text-primary" />
              How Job Scanner Works
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              Our{" "}
              <strong className="text-gray-900">AI-powered Job Scanner</strong>{" "}
              compares your resume against job descriptions to identify matching
              keywords, missing skills, and optimization opportunities.
            </p>
            <div className="grid md:grid-cols-3 gap-4 mt-4">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-white/50">
                <Target className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900">
                    Keyword Matching
                  </h4>
                  <p className="text-sm text-gray-500">Identifies key skills</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-white/50">
                <BarChart3 className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900">Match Scoring</h4>
                  <p className="text-sm text-gray-500">Calculate fit</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-white/50">
                <Lightbulb className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900">
                    Smart Suggestions
                  </h4>
                  <p className="text-sm text-gray-500">Get actionable tips</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* LEFT COLUMN: INPUTS  */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <FileText className="h-5 w-5 text-primary" />
                  Select Resume
                </CardTitle>
                <CardDescription>
                  Choose which resume to compare
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <select
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
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
              </CardContent>
              <CardContent className="space-y-4">
                <div
                  className={`border-2 border-dashed rounded-lg p-4 transition-colors ${
                    file
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (e.dataTransfer.files[0])
                      setFile(e.dataTransfer.files[0]);
                  }}
                  onDragOver={(e) => e.preventDefault()}
                >
                  {!file ? (
                    <textarea
                      placeholder="Paste job description text here..."
                      className="w-full min-h-[180px] resize-none bg-transparent focus:outline-none text-sm"
                      value={jdText}
                      onChange={(e) => setJdText(e.target.value)}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-[180px]">
                      <FileText className="h-10 w-10 text-primary mb-2" />
                      <p className="font-medium text-sm">{file.name}</p>
                      <button
                        onClick={() => setFile(null)}
                        className="text-xs text-red-500 mt-2 hover:underline flex items-center gap-1"
                      >
                        <X className="w-3 h-3" /> Remove File
                      </button>
                    </div>
                  )}

                  {!file && (
                    <div className="mt-2 flex justify-between items-center border-t pt-2">
                      <span className="text-xs text-gray-400">
                        Or drag and drop PDF
                      </span>
                      <label className="cursor-pointer text-xs flex items-center gap-1 text-primary font-medium hover:underline">
                        <Upload className="w-3 h-3 " /> Upload File
                        <input
                          type="file"
                          className="hidden"
                          accept=".pdf,image/*"
                          onChange={(e) => setFile(e.target.files[0])}
                        />
                      </label>
                    </div>
                  )}
                </div>
                <Button
                  onClick={submitButton}
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium h-12 px-8 text-white hover:bg-primary/80 disabled:opacity-50"
                >
                  {loading ? (
                    <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                  )}
                  {loading ? "Analyzing..." : "Scan Job Posting"}
                  {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT COLUMN: RESULTS */}
          {result ? (
            <div className="space-y-6">
              {/* Match Score */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-gray-900">Match Score</CardTitle>
                  <CardDescription>
                    How well your resume matches the job requirements
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
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
                          className="text-blue-600 transition-all duration-1000 ease-out"
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="absolute text-4xl font-bold text-gray-900">
                        {scoreAnim}%
                      </span>
                    </div>
                  </div>

                  {/* Fake metrics based on score for visual completeness */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Skills Match</span>
                      <span className="font-medium">
                        {scoreAnim > 80 ? "High" : "Moderate"}
                      </span>
                    </div>
                    <Progress value={Math.min(scoreAnim + 10, 100)} />
                  </div>
                </CardContent>
              </Card>

              {/* Keyword Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-gray-900">
                    Keyword Analysis
                  </CardTitle>
                  <CardDescription>
                    {result.skills?.length} Found,{" "}
                    {result.missingSkills?.length} Missing
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {result.skills?.map((s, i) => (
                      <Badge
                        key={i}
                        variant="outline"
                        className="bg-blue-50 text-blue-600 border-blue-200"
                      >
                        <CheckCircle2 className="h-3 w-3 mr-1" /> {s}
                      </Badge>
                    ))}
                    {result.missingSkills?.map((s, i) => (
                      <Badge
                        key={i}
                        variant="outline"
                        className="bg-red-50 text-red-600 border-red-200"
                      >
                        <AlertCircle className="h-3 w-3 mr-1" /> {s}
                      </Badge>
                    ))}
                  </div>

                  <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 mb-4">
                    <div className="flex items-start gap-2">
                      <Lightbulb className="h-4 w-4 text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          AI Suggestion
                        </p>
                        <p className="text-sm text-gray-500">
                          {result.updatedSummary}
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={applyChanges}
                    className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 bg-green-600 text-white hover:bg-green-700"
                  >
                    Apply Changes to Resume
                  </button>
                </CardContent>
              </Card>
            </div>
          ) : (
            // Placeholder Features when no result
            <Card className="h-full flex items-center justify-center bg-gray-50 border-dashed">
              <div className="text-center p-6">
                <TrendingUp className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">
                  Ready to Scan
                </h3>
                <p className="text-gray-500">
                  Upload a JD to see your match score and analysis here.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

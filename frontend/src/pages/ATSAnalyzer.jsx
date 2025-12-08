import { useState, useEffect } from "react";
import axios from "axios";
import { api } from "../services/api";
import DashboardLayout from "../layouts/DashboardLayout";
import Button from "../components/ui/Button";

export default function ATSAnalyzer({ userResume, setUserResume }) {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [scoreAnim, setScoreAnim] = useState(0);
  const [accepted, setAccepted] = useState({}); // suggestionId -> boolean
  const [jobDesc, setJobDesc] = useState(""); // optional JD to compare against
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // load history from server
    (async () => {
      try {
        const res = await api.get("/api/ats/history");
        setHistory(res.data || []);
      } catch (e) {}
    })();
  }, []);

  const analyze = async () => {
    setLoading(true);
    setAnalysis(null);
    try {
      const res = await api.post("/api/ats/analyze", {
        resume: userResume,
        jobDescription: jobDesc || "",
      });
      setAnalysis(res.data);

      // prepare accepted map
      const map = {};
      res.data.suggestions.forEach((s) => {
        map[s.id] = false;
      });
      setAccepted(map);

      // animate score
      let i = 0;
      const target = res.data.atsScore;
      const id = setInterval(() => {
        i += 1;
        setScoreAnim(Math.min(i, target));
        if (i >= target) clearInterval(id);
      }, 8);
    } catch (err) {
      alert("ATS analysis failed");
    } finally {
      setLoading(false);
    }
  };

  const toggleAccept = (id) => {
    setAccepted((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const applyAccepted = async () => {
    if (!analysis) return;
    const toApply = analysis.suggestions.filter((s) => accepted[s.id]);

    try {
      const res = await axios.post("/api/ats/apply", {
        resume: userResume,
        suggestions: toApply,
        analysisId: analysis.analysisId,
      });
      setUserResume(res.data.updatedResume);
      // save history entry locally too
      setHistory((h) => [analysis, ...h]);
      alert("Applied accepted suggestions to resume.");
    } catch (err) {
      alert("Failed to apply suggestions");
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto p-6 space-y-5">
        <h1 className="text-3xl font-bold">ATS Compatibility Analyzer</h1>
        <p className="text-gray-500">
          Audit your resume for ATS and quality issues.
        </p>

        <textarea
          className="w-full h-36 p-3 border rounded-lg"
          placeholder="Optional: paste job description to compare..."
          value={jobDesc}
          onChange={(e) => setJobDesc(e.target.value)}
        />

        <div className="flex gap-3">
          <Button onClick={analyze}>
            {loading ? "Analyzing..." : "Run ATS Audit"}
          </Button>
          <button
            onClick={() => {
              setAnalysis(null);
              setScoreAnim(0);
            }}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-200/80 rounded-md"
          >
            Reset
          </button>
        </div>

        {analysis && (
          <div className="mt-6 space-y-6">
            <div className="flex items-center gap-6">
              <div className="w-36 h-36 flex items-center justify-center rounded-full bg-gray-100 shadow">
                <div className="text-center">
                  <div className="text-sm text-gray-500">ATS Score</div>
                  <div className="text-4xl font-bold text-green-600">
                    {scoreAnim}%
                  </div>
                </div>
              </div>

              <div className="flex-1">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-28 text-sm text-gray-600">
                      Keywords match
                    </div>
                    <div className="flex-1 bg-gray-200 rounded h-3">
                      <div
                        className="h-3 rounded"
                        style={{
                          width: `${analysis.metrics.keywordMatch}%`,
                          background: "linear-gradient(#16a34a,#60a5fa)",
                        }}
                      />
                    </div>
                    <div className="w-12 text-right text-sm font-semibold">
                      {analysis.metrics.keywordMatch}%
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-28 text-sm text-gray-600">Formatting</div>
                    <div className="flex-1 bg-gray-200 rounded h-3">
                      <div
                        className="h-3 rounded"
                        style={{
                          width: `${
                            100 - analysis.metrics.formattingIssuesScore
                          }%`,
                          background: "linear-gradient(#f97316,#f472b6)",
                        }}
                      />
                    </div>
                    <div className="w-12 text-right text-sm font-semibold">
                      {100 - analysis.metrics.formattingIssuesScore}%
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-28 text-sm text-gray-600">Grammar</div>
                    <div className="flex-1 bg-gray-200 rounded h-3">
                      <div
                        className="h-3 rounded"
                        style={{
                          width: `${
                            100 - analysis.metrics.grammarIssuesScore
                          }%`,
                          background: "linear-gradient(#ef4444,#f59e0b)",
                        }}
                      />
                    </div>
                    <div className="w-12 text-right text-sm font-semibold">
                      {100 - analysis.metrics.grammarIssuesScore}%
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Suggestions list */}
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-xl font-semibold mb-3">
                Suggestions ({analysis.suggestions.length})
              </h3>
              <ul className="space-y-3">
                {analysis.suggestions.map((s) => (
                  <li key={s.id} className="flex items-start gap-4">
                    <div className="flex-1">
                      <div className="font-medium">{s.title}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        {s.explanation}
                      </div>
                      <div className="mt-2 text-sm">
                        <div className="font-semibold">Proposed change:</div>
                        <pre className="bg-gray-50 p-2 rounded text-xs overflow-auto">
                          {s.proposedChange}
                        </pre>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 items-end">
                      <button
                        onClick={() => toggleAccept(s.id)}
                        className={`px-3 py-1 rounded ${
                          accepted[s.id]
                            ? "bg-green-600 text-white"
                            : "bg-gray-100"
                        }`}
                      >
                        {accepted[s.id] ? "Accepted" : "Accept"}
                      </button>

                      <div className="text-xs text-gray-500">{s.impact}</div>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex gap-3">
                <button
                  onClick={applyAccepted}
                  className="px-4 py-2 bg-green-600 text-white rounded-md"
                >
                  Apply Accepted
                </button>
                <button
                  onClick={async () => {
                    // save full analysis to history on server
                    try {
                      await axios.post("/api/ats/history", { analysis });
                      alert("Saved to history");
                    } catch {
                      alert("Failed to save history");
                    }
                  }}
                  className="px-4 py-2 bg-gray-200 rounded-md"
                >
                  Save Analysis
                </button>
              </div>
            </div>

            {/* History */}
            {history.length > 0 && (
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="text-lg font-semibold mb-2">Recent Analyses</h3>
                <ul className="text-sm text-gray-600">
                  {history.slice(0, 5).map((h, idx) => (
                    <li key={idx} className="py-1 border-b last:border-b-0">
                      {new Date(h.createdAt).toLocaleString()} — Score:{" "}
                      {h.atsScore}%
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

import { useState, useEffect } from "react";
import axios from "axios";
import { api } from "../services/api";
import DashboardLayout from "../layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";

export default function JobScanner() {
  const navigate = useNavigate();

  const [jdText, setJdText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [scoreAnim, setScoreAnim] = useState(0);

  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState("");

  const [selectedResumeJson, setSelectedResumeJson] = useState(null);

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

  // WHEN SELECTED RESUME CHANGES → LOAD JSON
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

  // ANALYZE JD
  const analyze = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      const res = await api.post("/api/jobscan/analyze", {
        jdText,
        selectedResumeJson,
      });

      setResult(res.data);

      // Animate score
      let i = 0;
      const interval = setInterval(() => {
        if (i <= res.data.matchScore) {
          setScoreAnim(i++);
        } else {
          clearInterval(interval);
        }
      }, 10);
    } catch (err) {
      alert("Error analyzing JD.");
    } finally {
      setLoading(false);
    }
  };

  const [file, setFile] = useState(null);

  const submitButton = async () => {
    // If FILE uploaded → auto OCR + analyze
    if (file) return uploadFile();

    // If TYPED text → analyze
    if (!file && validate()) return analyze();

    alert("Type a JD or upload a file first.");
  };

  const uploadFile = async () => {
    if (!file) return alert("Upload a JD PDF or Image!");

    try {
      setLoading(true);
      const form = new FormData();
      form.append("file", file);

      // Step 1: Extract text using hybrid OCR/PDF method
      const res = await api.post("/api/jobscan/extract-file", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const extracted = res.data.text;
      //setJdText(extracted); // Optional – shows text in textarea

      // Step 2: Immediately send to AI analysis prompt (auto-run analyze)
      const analysis = await api.post("/api/jobscan/analyze", {
        jdText: extracted,
        selectedResumeJson,
      });

      setResult(analysis.data);

      // Step 3 – Animate match score
      let i = 0;
      const interval = setInterval(() => {
        if (i <= analysis.data.matchScore) {
          setScoreAnim(i++);
        } else {
          clearInterval(interval);
        }
      }, 10);
    } catch (err) {
      alert("Error extracting or analyzing JD");
    } finally {
      setLoading(false);
    }
  };

  // APPLY CHANGES TO RESUME
  const applyChanges = () => {
    // Base resume structure
    const updatedObj = {
      header: {
        name: "",
        role: "",
        email: "",
        phone: "",
      },
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

    // If user selected an existing resume → merge into it
    if (selectedResumeJson) {
      updatedObj.header = selectedResumeJson.header || updatedObj.header;

      // Ensure experience exists
      updatedObj.experience =
        selectedResumeJson.experience && selectedResumeJson.experience.length
          ? [...selectedResumeJson.experience]
          : [
              {
                role: "",
                company: "",
                tech: [],
                bullets: [],
              },
            ];

      // Ensure experience[0] exists
      if (!updatedObj.experience[0]) {
        updatedObj.experience[0] = {
          role: "",
          company: "",
          tech: [],
          bullets: [],
        };
      }

      // → Apply AI improved bullets
      updatedObj.experience[0].bullets = result.updatedBullets || [];

      // Merge skills safely
      updatedObj.skills = Array.from(
        new Set([
          ...(selectedResumeJson.skills || []),
          ...(result.skills || []),
        ])
      );

      // Summary override
      updatedObj.summary = result.updatedSummary || updatedObj.summary;
    }

    const encoded = encodeURIComponent(JSON.stringify(updatedObj));

    // If NO resume selected → create new one and open editor
    if (!selectedResumeId) {
      navigate(`/editor/new?data=${encoded}`);
      return;
    }

    // Update existing resume in DB then open editor
    api
      .put(`/api/resumes/${selectedResumeId}`, {
        template: "Minimal",
        resumeJson: JSON.stringify(updatedObj),
      })
      .then(() => {
        navigate(`/editor/${selectedResumeId}`);
      })
      .catch(() => alert("Failed to update resume"));
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto p-6 space-y-5">
        <h2 className="text-3xl font-bold mb-2">AI Job Description Scanner</h2>

        <p className="text-gray-500">
          Tailor your resume automatically using AI
        </p>

        {/* SELECT RESUME DROPDOWN */}
        <div className="mt-2">
          <label className="font-semibold text-sm">Select Resume</label>
          <select
            className="w-full p-2 border rounded-xl mt-1"
            value={selectedResumeId}
            onChange={(e) => setSelectedResumeId(e.target.value)}
          >
            <option value="">Select Resume</option>
            {resumes.map((r) => {
              let displayName = `Resume ${r._id.slice(-4)}`;
              let displayRole = "";
              try {
                const resumeData = JSON.parse(r.resumeJson);
                if (resumeData?.header?.name) {
                  displayName = resumeData.header.name;
                  displayRole = resumeData.header.role || "";
                }
              } catch (error) {
                console.error("Error parsing resumeJson:", error);
              }

              return (
                <option key={r._id} value={r._id}>
                  {displayName} - {displayRole}
                </option>
              );
            })}
          </select>
        </div>

        {/* JD TEXT 
        <textarea
          className="w-full h-48 p-4 border rounded-xl shadow-sm"
          placeholder="Paste job description..."
          value={jdText}
          onChange={(e) => setJdText(e.target.value)}
        ></textarea>

        <input
          type="file"
          accept="application/pdf,image/*"
          className="border p-2 rounded-xl w-full"
          onChange={(e) => setFile(e.target.files[0])}
        /> */}

        {/* JD INPUT + FILE DROP ZONE (ONE AREA) */}
        <div
          className="relative border rounded-xl p-4 h-64 w-full bg-gray-50
  flex items-center justify-center text-center transition 
  hover:border-blue-500 hover:bg-gray-100"
          onDrop={(e) => {
            e.preventDefault();
            const dropped = e.dataTransfer.files[0];
            if (dropped) setFile(dropped);
          }}
          onDragOver={(e) => e.preventDefault()}
        >
          {/* If NO file uploaded → show textarea */}
          {!file && (
            <textarea
              disabled={file ? true : false}
              className="absolute inset-0 w-full h-full p-4 resize-none bg-transparent
      text-sm focus:outline-none"
              placeholder="Paste or drag & drop job description here..."
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
            ></textarea>
          )}

          {/* If file uploading or analyzing */}
          {loading && (
            <div className="flex flex-col items-center gap-3">
              <div className="text-gray-500 text-7xl">📄⬆</div>
              <p className="text-gray-500 text-sm">Processing document...</p>
            </div>
          )}

          {/* If file uploaded → Show preview icon + filename */}
          {file && !loading && (
            <div className="flex flex-col items-center gap-2">
              <div className="text-7xl">📄</div>
              <p className="text-sm text-gray-700 font-semibold truncate w-48">
                {file.name}
              </p>
              <button
                className="text-red-500 text-xs underline hover:text-red-700 mt-1"
                onClick={() => {
                  setFile(null);
                  setJdText("");
                }}
              >
                Remove File
              </button>
            </div>
          )}

          {/* Upload Button inside textarea (bottom-left) */}
          <label className="absolute bottom-3 left-3 cursor-pointer text-xs">
            ➕ Upload Job Description
            <input
              type="file"
              className="hidden"
              accept="application/pdf,image/*"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </label>
        </div>

        <Button
          onClick={() => {
            submitButton();
          }}
        >
          {loading ? "Analyzing..." : "Analyze JD"}
        </Button>

        {/* <Button onClick={uploadFile}>
          {loading ? "Analyzing..." : "Upload JD"}
        </Button>

        RESULTS */}
        {result && (
          <div className="space-y-10">
            {/* Score */}
            <div className="text-center">
              <p className="text-lg text-gray-500">Match Score</p>
              <h2 className="text-6xl font-bold text-green-600">
                {scoreAnim}%
              </h2>

              <div className="w-full bg-gray-200 h-3 rounded-full mt-4">
                <div
                  className="bg-green-600 h-3 rounded-full"
                  style={{ width: `${scoreAnim}%` }}
                ></div>
              </div>
            </div>

            {/* Skills */}
            <div>
              <h3 className="text-xl font-semibold">Extracted Skills</h3>
              <div className="flex flex-wrap gap-2 mt-3">
                {result.skills.map((s, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing */}
            <div>
              <h3 className="text-xl font-semibold">Missing Skills</h3>
              <div className="flex flex-wrap gap-2 mt-3">
                {result.missingSkills.map((s, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-red-100 text-red-700 rounded-full"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div>
              <h3 className="text-xl font-semibold">Updated Summary</h3>
              <p className="mt-2 p-4 bg-gray-100 rounded-xl shadow-sm">
                {result.updatedSummary}
              </p>
            </div>

            {/* Bullets */}
            <div>
              <h3 className="text-xl font-semibold">
                Improved Experience Bullets
              </h3>
              <ul className="list-disc pl-6 space-y-3 mt-2">
                {result.updatedBullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </div>

            <button
              onClick={applyChanges}
              className="px-6 py-3 bg-green-600 text-white rounded-lg shadow-md"
            >
              Apply Changes to Resume
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

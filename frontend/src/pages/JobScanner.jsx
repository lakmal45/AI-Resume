import { useState, useEffect } from "react";
import axios from "axios";
import { api } from "../services/api";
import DashboardLayout from "../layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";

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

  // APPLY CHANGES
  /*const applyChanges = () => {
    const updatedObj = {
      header: {
        name: "",
        role: "",
        email: "",
        phone: "",
      },
      summary: result.updatedSummary,
      skills: result.skills,
      experience: [
        {
          role: "",
          company: "",
          tech: [],
          bullets: result.updatedBullets,
        },
      ],
      projects: [],
    };

    // If resume is selected → merge into its JSON
    if (selectedResumeJson) {
      updatedObj.header = selectedResumeJson.header || updatedObj.header;
      updatedObj.experience =
        selectedResumeJson.experience || updatedObj.experience;
      updatedObj.experience[0].bullets = result.updatedBullets;
      updatedObj.skills = Array.from(
        new Set([...(selectedResumeJson.skills || []), ...result.skills])
      );
      updatedObj.summary = result.updatedSummary;
    }

    const encoded = encodeURIComponent(JSON.stringify(updatedObj));

    // If NO resume selected → open editor with new resume
    if (!selectedResumeId) {
      navigate(`/editor/new?data=${encoded}`);
    } else {
      // Update the selected resume in DB then open editor
      api
        .put(`/api/resumes/${selectedResumeId}`, {
          template: "Minimal",
          resumeJson: JSON.stringify(updatedObj),
        })
        .then(() => {
          navigate(`/editor/${selectedResumeId}`);
        });
    }
  };*/
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
      <div className="max-w-4xl mx-auto p-6 space-y-10">
        <h1 className="text-4xl font-bold mb-2">AI Job Description Scanner</h1>

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

        {/* JD TEXT */}
        <textarea
          className="w-full h-48 p-4 border rounded-xl shadow-sm"
          placeholder="Paste job description..."
          value={jdText}
          onChange={(e) => setJdText(e.target.value)}
        ></textarea>

        <button
          onClick={analyze}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg"
        >
          {loading ? "Analyzing..." : "Analyze JD"}
        </button>

        {/* RESULTS */}
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

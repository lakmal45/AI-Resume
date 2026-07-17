import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import { api } from "../services/api";
import { TemplateMinimal } from "../templates/Templates";
import { useToast } from "../context/ToastContext";

export default function ATSEditor() {
  const location = useLocation();
  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [resumeId, setResumeId] = useState(null);
  const [sourceType, setSourceType] = useState("manual");

  // 🔒 Immutable base
  const [baseResume, setBaseResume] = useState(null);

  // 👁️ Live preview (derived)
  const [previewResume, setPreviewResume] = useState(null);

  // ☑️ Checkbox state
  const [checked, setChecked] = useState({});

  // 📌 Suggestions from ATS
  const [suggestions, setSuggestions] = useState([]);

  /* -------------------------------------------
     LOAD DATA FROM ATS ANALYZER
  ------------------------------------------- */
  useEffect(() => {
    const raw = params.get("data");
    if (!raw) return;

    try {
      const parsed = JSON.parse(decodeURIComponent(raw));

      setBaseResume(parsed.resume);
      setPreviewResume(parsed.resume);
      setSuggestions(parsed.suggestions || []);
      setResumeId(parsed.resumeId || null);
      setSourceType(parsed.sourceType || "manual");

      // ✅ IMPORTANT: initialize checked map
      const map = {};
      (parsed.suggestions || []).forEach((s) => {
        map[s.id] = false;
      });
      setChecked(map);
    } catch (e) {
      console.error("Invalid ATS editor payload", e);
    }
  }, [params]);

  /* -------------------------------------------
     TOGGLE CHECKBOX
  ------------------------------------------- */
  const toggleSuggestion = (id) => {
    setChecked((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  /* -------------------------------------------
     RECOMPUTE PREVIEW WHEN CHECKED CHANGES
  ------------------------------------------- */
  useEffect(() => {
    if (!baseResume) return;

    const updated = structuredClone(baseResume);

    Object.entries(checked).forEach(([id, on]) => {
      if (!on) return;

      const s = suggestions.find((x) => x.id === id);
      if (!s) return;

      /* ===== 1. DIRECT SUMMARY ===== */
      if (typeof s.proposedChange === "string") {
        updated.summary = s.proposedChange;
        return;
      }

      /* ===== 2. SUMMARY AFTER ===== */
      if (s.proposedChange?.after) {
        updated.summary = s.proposedChange.after;
        return;
      }

      /* ===== 3. SKILL ADD ===== */
      if (s.proposedChange?.newSkill) {
        updated.skills = Array.from(
          new Set([...(updated.skills || []), s.proposedChange.newSkill])
        );
        return;
      }

      /* ===== 4. KEYWORD ARRAY ===== */
      if (Array.isArray(s.proposedChange)) {
        updated.skills = Array.from(
          new Set([...(updated.skills || []), ...s.proposedChange])
        );
        return;
      }

      /* ===== 5. FALLBACK — FORCE VISIBLE CHANGE ===== */
      updated.summary =
        (updated.summary || "") +
        "\n\n• ATS Improvement Applied: " +
        (s.title || "Resume enhancement");
    });

    setPreviewResume(updated);
  }, [checked, suggestions, baseResume]);

  useEffect(() => {
    console.log("Checked map:", checked);
    console.log("Preview resume:", previewResume);
    console.log("Suggestions:", suggestions);
  }, [checked, previewResume, suggestions]);

  /* -------------------------------------------
     SAVE TO DATABASE (REAL APPLY)
  ------------------------------------------- */
  const applyAllChanges = async () => {
    try {
      if (sourceType === "resume" && resumeId) {
        await api.put(`/api/resumes/${resumeId}`, {
          resumeJson: JSON.stringify(previewResume),
        });
      } else {
        await api.post("/api/resumes", {
          resumeJson: JSON.stringify(previewResume),
          source: "ats-editor",
        });
      }

      navigate("/atsanalyzer");
    } catch (e) {
      console.error(e);
      toast("Failed to save ATS updated resume", "error");
    }
  };

  /* -------------------------------------------
     GUARD
  ------------------------------------------- */
  if (!previewResume) {
    return (
      <div className="p-10 text-center text-gray-500">Loading ATS Editor…</div>
    );
  }

  /* -------------------------------------------
     UI
  ------------------------------------------- */
  return (
    <div className="min-h-screen flex bg-base-bg text-base-text">
      {/*<div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
       ---------------- LEFT: SUGGESTIONS ---------------- */}
      <div className="w-full md:w-1/3 border-r border-base-border bg-base-card/80 p-6 space-y-5">
        <h2 className="text-xl font-semibold">ATS Suggestions</h2>

        {suggestions.map((s) => (
          <div
            key={s.id}
            className="border rounded-lg p-4 flex gap-3 items-start"
          >
            <input
              type="checkbox"
              className="mt-1"
              checked={!!checked[s.id]}
              onChange={() => toggleSuggestion(s.id)}
            />

            <div>
              <h4 className="font-medium">{s.title}</h4>
              <p className="text-sm text-gray-600 mt-1">
                {s.explanation ||
                  "Improve this section to be more ATS friendly."}
              </p>
            </div>
          </div>
        ))}

        <Button
          onClick={applyAllChanges}
          className="w-full mt-6 flex justify-center items-center py-2 text-sm"
        >
          Save & Return
        </Button>
      </div>

      {/* ---------------- RIGHT: PREVIEW ---------------- */}
      <div className="w-full md:w-2/3 p-10 overflow-y-auto bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-[210mm] mx-auto bg-white dark:bg-black shadow-lg shadow-gray-200 dark:shadow-none min-h-[297mm]">
          <TemplateMinimal data={previewResume} />
        </div>
      </div>
    </div>
  );
}

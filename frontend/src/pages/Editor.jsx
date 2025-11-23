// src/pages/Editor.jsx

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../services/api";

/* ===========================
   Resume Templates (3 styles)
   =========================== */

function TemplateMinimal({ data }) {
  const header = data.header || {};
  const skills = data.skills || [];
  const experience = data.experience || [];
  const projects = data.projects || [];

  return (
    <div className="bg-white text-black p-8 shadow-xl max-w-[210mm] min-h-[297mm] mx-auto">
      {/* HEADER */}
      <div className="border-b border-gray-300 pb-3 mb-4">
        <h1 className="text-3xl font-bold">{header.name || "Your Name"}</h1>
        <p className="text-sm text-gray-600">
          {header.role || "Your Role / Target Position"}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {header.email && <span>{header.email}</span>}
          {header.email && header.phone && <span> · </span>}
          {header.phone && <span>{header.phone}</span>}
        </p>
      </div>

      {/* SUMMARY */}
      <section className="mb-4">
        <h2 className="text-sm font-semibold tracking-wide text-gray-700 uppercase">
          Summary
        </h2>
        <p className="text-sm mt-1 whitespace-pre-line">
          {data.summary || "Write a short, impactful summary here."}
        </p>
      </section>

      {/* SKILLS */}
      <section className="mb-4">
        <h2 className="text-sm font-semibold tracking-wide text-gray-700 uppercase">
          Skills
        </h2>
        <div className="mt-1 flex flex-wrap gap-2">
          {skills.length > 0 ? (
            skills.map((s, i) => (
              <span
                key={i}
                className="px-2 py-1 text-xs bg-gray-100 rounded border border-gray-200"
              >
                {s}
              </span>
            ))
          ) : (
            <p className="text-sm text-gray-500">
              Add skills like React, JavaScript, Node.js...
            </p>
          )}
        </div>
      </section>

      {/* EXPERIENCE */}
      {experience.length > 0 && (
        <section className="mb-4">
          <h2 className="text-sm font-semibold tracking-wide text-gray-700 uppercase">
            Experience
          </h2>
          {experience.map((exp, i) => (
            <div key={i} className="mt-2">
              <p className="font-semibold text-sm">
                {exp.role} — {exp.company}
              </p>
              <ul className="list-disc ml-5 text-sm text-gray-700">
                {(exp.bullets || []).map((b, j) => (
                  <li key={j}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      {/* PROJECTS */}
      {projects.length > 0 && (
        <section className="mb-4">
          <h2 className="text-sm font-semibold tracking-wide text-gray-700 uppercase">
            Projects
          </h2>
          {projects.map((p, i) => (
            <div key={i} className="mt-2">
              <p className="font-semibold text-sm">{p.name}</p>
              <p className="text-sm text-gray-700">{p.desc}</p>
              {p.tech && p.tech.length > 0 && (
                <p className="text-xs text-gray-500">
                  Tech: {p.tech.join(", ")}
                </p>
              )}
            </div>
          ))}
        </section>
      )}
    </div>
  );
}

function TemplateModern({ data }) {
  const header = data.header || {};
  const skills = data.skills || [];
  const experience = data.experience || [];
  const projects = data.projects || [];

  return (
    <div className="p-8 shadow-xl bg-white text-black max-w-[210mm] min-h-[297mm] mx-auto">
      {/* Header row */}
      <div className="flex justify-between items-center border-b border-gray-300 pb-3 mb-4">
        <div>
          <h1 className="text-3xl font-bold">{header.name || "Your Name"}</h1>
          <p className="text-sm text-gray-600">
            {header.role || "Your Role / Target Position"}
          </p>
        </div>
        <div className="text-xs text-gray-500 text-right">
          {header.email && <p>{header.email}</p>}
          {header.phone && <p>{header.phone}</p>}
        </div>
      </div>

      {/* SUMMARY */}
      <section className="mb-4">
        <h2 className="text-sm font-semibold text-primary-500 uppercase tracking-wide">
          Summary
        </h2>
        <p className="text-sm mt-1 whitespace-pre-line">{data.summary}</p>
      </section>

      {/* SKILLS */}
      <section className="mb-4">
        <h2 className="text-sm font-semibold text-primary-500 uppercase tracking-wide">
          Skills
        </h2>
        <ul className="list-disc ml-5 text-sm">
          {skills.length
            ? skills.map((s, i) => <li key={i}>{s}</li>)
            : "Add your skills"}
        </ul>
      </section>

      {/* EXPERIENCE */}
      {experience.length > 0 && (
        <section className="mb-4">
          <h2 className="text-sm font-semibold text-primary-500 uppercase tracking-wide">
            Experience
          </h2>
          {experience.map((exp, i) => (
            <div key={i} className="mt-2">
              <p className="font-semibold text-sm">
                {exp.role} — {exp.company}
              </p>
              <ul className="list-disc ml-5 text-sm text-gray-800">
                {(exp.bullets || []).map((b, j) => (
                  <li key={j}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      {/* PROJECTS */}
      {projects.length > 0 && (
        <section className="mb-4">
          <h2 className="text-sm font-semibold text-primary-500 uppercase tracking-wide">
            Projects
          </h2>
          {projects.map((p, i) => (
            <div key={i} className="mt-2">
              <p className="font-semibold text-sm">{p.name}</p>
              <p className="text-sm text-gray-800">{p.desc}</p>
              {p.tech && p.tech.length > 0 && (
                <p className="text-xs text-gray-500">
                  Tech: {p.tech.join(", ")}
                </p>
              )}
            </div>
          ))}
        </section>
      )}
    </div>
  );
}

function TemplateTwoColumn({ data }) {
  const header = data.header || {};
  const skills = data.skills || [];
  const experience = data.experience || [];
  const projects = data.projects || [];

  return (
    <div className="p-8 shadow-xl bg-white text-black max-w-[210mm] min-h-[297mm] mx-auto grid grid-cols-3 gap-6">
      {/* LEFT COLUMN */}
      <div className="col-span-1 border-r border-gray-300 pr-4">
        <h1 className="text-2xl font-bold">{header.name || "Your Name"}</h1>
        <p className="text-gray-600 text-sm">{header.role || "Your Role"}</p>
        <div className="mt-2 text-xs text-gray-500">
          {header.email && <p>{header.email}</p>}
          {header.phone && <p>{header.phone}</p>}
        </div>

        <h2 className="mt-6 text-sm font-semibold text-gray-700 uppercase tracking-wide">
          Skills
        </h2>
        <ul className="list-disc ml-5 text-xs mt-1">
          {skills.length
            ? skills.map((s, i) => <li key={i}>{s}</li>)
            : "Add your skills"}
        </ul>
      </div>

      {/* RIGHT COLUMN */}
      <div className="col-span-2">
        <section className="mb-4">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Summary
          </h2>
          <p className="text-sm mt-1 whitespace-pre-line">{data.summary}</p>
        </section>

        {experience.length > 0 && (
          <section className="mb-4">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Experience
            </h2>
            {experience.map((exp, i) => (
              <div key={i} className="mt-2">
                <p className="font-semibold text-sm">
                  {exp.role} — {exp.company}
                </p>
                <ul className="list-disc ml-5 text-sm text-gray-800">
                  {(exp.bullets || []).map((b, j) => (
                    <li key={j}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        )}

        {projects.length > 0 && (
          <section className="mb-4">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Projects
            </h2>
            {projects.map((p, i) => (
              <div key={i} className="mt-2">
                <p className="font-semibold text-sm">{p.name}</p>
                <p className="text-sm text-gray-800">{p.desc}</p>
                {p.tech && p.tech.length > 0 && (
                  <p className="text-xs text-gray-500">
                    Tech: {p.tech.join(", ")}
                  </p>
                )}
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}

/* ===========================
   AI Helper Components
   =========================== */

function AISkills({ onGenerated }) {
  const [keywords, setKeywords] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!keywords.trim()) return;
    setLoading(true);
    try {
      const res = await api.post("/api/ai/generate-skills", { keywords });
      onGenerated(res.data.skills || []);
    } catch (err) {
      alert("AI skills generation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-base-card border border-base-border rounded-xl p-4 space-y-2">
      <h3 className="font-semibold text-sm">AI Skill Generator</h3>
      <textarea
        className="w-full p-2 border border-base-border rounded-lg text-sm"
        rows={3}
        placeholder="Type your stack / keywords (React, Node.js, MongoDB, Tailwind...)"
        value={keywords}
        onChange={(e) => setKeywords(e.target.value)}
      />
      <button
        onClick={generate}
        disabled={loading}
        className="px-3 py-1.5 rounded-lg bg-primary-500 text-white text-xs font-semibold hover:bg-primary-hover disabled:opacity-60"
      >
        {loading ? "Generating..." : "Generate Skills"}
      </button>
    </div>
  );
}

function AIExperience({ experience, onUpdate }) {
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!experience.role && !experience.company) return;
    setLoading(true);
    try {
      const res = await api.post("/api/ai/generate-experience", {
        role: experience.role,
        company: experience.company,
        tech: experience.tech || "",
        notes: experience.notes || "",
      });
      const bullets = res.data.bullets || [];
      onUpdate({
        ...experience,
        bullets,
        bulletsText: bullets.join("\n"),
      });
    } catch (err) {
      alert("AI experience generation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={generate}
      disabled={loading}
      className="text-xs px-3 py-1 rounded-lg bg-primary-500 text-white hover:bg-primary-hover disabled:opacity-60"
    >
      {loading ? "AI..." : "AI Bullets"}
    </button>
  );
}

function AIProjects({ onGenerated }) {
  const [keywords, setKeywords] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!keywords.trim()) return;
    setLoading(true);
    try {
      const res = await api.post("/api/ai/generate-full", {
        keywords,
        targetRole: "Software Developer",
      });
      const projects = res.data.projects || res.data?.projects || [];
      onGenerated(projects);
    } catch (err) {
      alert("AI project generation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-base-card border border-base-border rounded-xl p-4 space-y-2 mt-3">
      <h3 className="font-semibold text-sm">AI Project Ideas</h3>
      <textarea
        className="w-full p-2 border border-base-border rounded-lg text-sm"
        rows={3}
        placeholder="Describe your interests / tech (e.g., React, MERN, movie apps, dashboards...)"
        value={keywords}
        onChange={(e) => setKeywords(e.target.value)}
      />
      <button
        onClick={generate}
        disabled={loading}
        className="px-3 py-1.5 rounded-lg bg-primary-500 text-white text-xs font-semibold hover:bg-primary-hover disabled:opacity-60"
      >
        {loading ? "Generating..." : "Generate Projects"}
      </button>
    </div>
  );
}

/* ===========================
   Main Editor Page
   =========================== */

export default function Editor() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [resumeDoc, setResumeDoc] = useState(null);
  const [template, setTemplate] = useState("minimal");

  const [form, setForm] = useState({
    name: "",
    role: "",
    email: "",
    phone: "",
    summary: "",
    skillsText: "",
  });

  const [experiences, setExperiences] = useState([]);
  const [projects, setProjects] = useState([]);

  const [saving, setSaving] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);

  // Load resume on mount
  useEffect(() => {
    // NEW RESUME LOGIC
    if (id === "new") {
      setResumeDoc({
        _id: null,
        template: "minimal",
        resumeJson: "{}",
      });

      setTemplate("minimal");

      setForm({
        name: "",
        role: "",
        email: "",
        phone: "",
        summary: "",
        skillsText: "",
      });

      setExperiences([]);
      setProjects([]);

      return; // ⛔ Do NOT fetch from backend
    }
    // EXISTING RESUME LOGIC
    const loadExisting = async () => {
      try {
        const res = await api.get(`/api/resumes/${id}`);
        const r = res.data;
        let data = {};
        try {
          data = r.resumeJson ? JSON.parse(r.resumeJson) : {};
        } catch {
          data = {};
        }

        setResumeDoc(r);
        setTemplate(r.template || "minimal");
        setForm({
          name: data.header?.name || "",
          role: data.header?.role || "",
          email: data.header?.email || "",
          phone: data.header?.phone || "",
          summary: data.summary || "",
          skillsText: (data.skills || []).join(", "),
        });
        setExperiences(
          (data.experience || []).map((exp) => ({
            role: exp.role || "",
            company: exp.company || "",
            tech: (exp.tech || []).join(", "),
            bullets: exp.bullets || [],
            bulletsText: (exp.bullets || []).join("\n"),
            notes: "",
          }))
        );
        setProjects(
          (data.projects || []).map((p) => ({
            name: p.name || "",
            desc: p.desc || "",
            techText: (p.tech || []).join(", "),
          }))
        );
      } catch (err) {
        alert("Resume not found");
        navigate("/dashboard");
      }
    };
    loadExisting();
  }, [id, navigate]);

  const updateForm = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateExperienceAt = (index, updated) => {
    setExperiences((prev) => {
      const arr = [...prev];
      arr[index] = updated;
      return arr;
    });
  };

  const updateProjectAt = (index, updated) => {
    setProjects((prev) => {
      const arr = [...prev];
      arr[index] = updated;
      return arr;
    });
  };

  const addExperience = () => {
    setExperiences((prev) => [
      ...prev,
      {
        role: "",
        company: "",
        tech: "",
        bullets: [],
        bulletsText: "",
        notes: "",
      },
    ]);
  };

  const removeExperience = (index) => {
    setExperiences((prev) => prev.filter((_, i) => i !== index));
  };

  const addProject = () => {
    setProjects((prev) => [...prev, { name: "", desc: "", techText: "" }]);
  };

  const removeProject = (index) => {
    setProjects((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAISummary = async () => {
    setSummaryLoading(true);
    try {
      const prompt = `
You are a professional resume writer.
Generate a 3–4 sentence summary.

Name: ${form.name || "N/A"}
Target role: ${form.role || "Software Developer / Intern"}
Skills: ${form.skillsText || "React, JavaScript, Node.js"}
`;
      const res = await api.post("/api/ai/generate-summary", { prompt });
      updateForm("summary", res.data.summary);
    } catch (err) {
      alert("AI summary failed");
    } finally {
      setSummaryLoading(false);
    }
  };

  const buildDataObject = () => {
    const skills = form.skillsText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const expData = experiences.map((e) => ({
      role: e.role,
      company: e.company,
      tech: e.tech
        ? e.tech
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [],
      bullets: e.bulletsText
        ? e.bulletsText
            .split("\n")
            .map((b) => b.trim())
            .filter(Boolean)
        : [],
    }));

    const projData = projects.map((p) => ({
      name: p.name,
      desc: p.desc,
      tech: p.techText
        ? p.techText
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [],
    }));

    return {
      header: {
        name: form.name,
        role: form.role,
        email: form.email,
        phone: form.phone,
      },
      summary: form.summary,
      skills,
      experience: expData,
      projects: projData,
    };
  };

  const handleSave = async () => {
    const dataObj = buildDataObject();

    // NEW RESUME — FIRST SAVE
    if (id === "new") {
      if (isFormEmpty()) {
        alert("Nothing to save");
        return;
      }

      try {
        setSaving(true);
        const res = await api.post("/api/resumes", {
          template,
          resumeJson: JSON.stringify(dataObj),
        });

        // Redirect to actual resume ID
        navigate(`/editor/${res.data._id}`);
      } catch (err) {
        alert("Save failed");
      } finally {
        setSaving(false);
      }
      return;
    }
    // EXISTING RESUME — UPDATE
    if (!resumeDoc) return;
    setSaving(true);
    try {
      const dataObj = buildDataObject();
      await api.put(`/api/resumes/${resumeDoc._id}`, {
        ...resumeDoc,
        template,
        resumeJson: JSON.stringify(dataObj),
      });
      alert("Saved!");
    } catch (err) {
      alert("Save failed");
    } finally {
      setSaving(false);
    }
  };

  const buildHtmlForPdf = (dataObj) => {
    // Generic HTML for printing – independent of preview template; simple, clean layout
    const skillsHtml = (dataObj.skills || [])
      .map(
        (s) =>
          `<span style="padding:2px 6px;border:1px solid #ddd;border-radius:4px;margin:2px;font-size:11px;">${s}</span>`
      )
      .join("");

    const expHtml = (dataObj.experience || [])
      .map(
        (e) => `
      <div style="margin-top:6px;">
        <p style="font-weight:600;font-size:13px;">${e.role || ""} — ${
          e.company || ""
        }</p>
        <ul style="margin:4px 0 0 18px;font-size:12px;">
          ${(e.bullets || []).map((b) => `<li>${b}</li>`).join("")}
        </ul>
      </div>`
      )
      .join("");

    const projHtml = (dataObj.projects || [])
      .map(
        (p) => `
      <div style="margin-top:6px;">
        <p style="font-weight:600;font-size:13px;">${p.name || ""}</p>
        <p style="font-size:12px;color:#444;">${p.desc || ""}</p>
        ${
          p.tech && p.tech.length
            ? `<p style="font-size:11px;color:#777;">Tech: ${p.tech.join(
                ", "
              )}</p>`
            : ""
        }
      </div>`
      )
      .join("");

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Resume</title>
  <style>
    body { font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; color:#111; }
    .page { width:210mm; min-height:297mm; padding:20mm; box-sizing:border-box; }
    h1 { font-size:28px; margin:0; }
    h2 { font-size:13px; text-transform:uppercase; letter-spacing:0.08em; margin-top:16px; margin-bottom:4px;}
    p { font-size:12px; margin:4px 0; }
    .muted { color:#666; font-size:11px; }
  </style>
</head>
<body>
  <div class="page">
    <div style="border-bottom:1px solid #ddd;padding-bottom:6px;margin-bottom:10px;">
      <h1>${dataObj.header.name || "Your Name"}</h1>
      <p class="muted">${dataObj.header.role || "Your Role"}</p>
      <p class="muted">
        ${dataObj.header.email || ""}${
      dataObj.header.email && dataObj.header.phone ? " · " : ""
    }${dataObj.header.phone || ""}
      </p>
    </div>

    <section>
      <h2>Summary</h2>
      <p>${(dataObj.summary || "").replace(/\n/g, "<br/>")}</p>
    </section>

    <section>
      <h2>Skills</h2>
      <div>${skillsHtml || "<p class='muted'>Add your skills</p>"}</div>
    </section>

    ${expHtml ? `<section><h2>Experience</h2>${expHtml}</section>` : ""}

    ${projHtml ? `<section><h2>Projects</h2>${projHtml}</section>` : ""}
  </div>
</body>
</html>
`;
  };

  const handleExportPdf = async () => {
    setPdfLoading(true);
    try {
      const dataObj = buildDataObject();
      const html = buildHtmlForPdf(dataObj);
      const res = await api.post(
        "/api/pdf/export",
        { html },
        { responseType: "blob" }
      );
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${form.name || "resume"}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("PDF export failed");
    } finally {
      setPdfLoading(false);
    }
  };

  if (!resumeDoc) {
    return <div className="p-10 text-base-subt">Loading...</div>;
  }

  const dataObj = buildDataObject();

  let PreviewComponent = TemplateMinimal;
  if (template === "modern") PreviewComponent = TemplateModern;
  if (template === "twocol") PreviewComponent = TemplateTwoColumn;

  return (
    <div className="min-h-screen flex bg-base-bg text-base-text">
      {/* LEFT PANEL: form + AI tools */}
      <div className="w-full md:w-1/3 border-r border-base-border bg-base-card/80 p-6 space-y-5">
        <button
          onClick={() => navigate("/dashboard")}
          className="text-xs text-base-subt hover:text-primary-500"
        >
          ← Back to dashboard
        </button>

        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold">Edit resume</h1>
          <select
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
            className="text-xs px-2 py-1 rounded-lg border border-base-border bg-base-bg"
          >
            <option value="minimal">Minimal</option>
            <option value="modern">Modern</option>
            <option value="twocol">Two-column</option>
          </select>
        </div>

        {/* HEADER */}
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-xs uppercase tracking-wide text-base-subt">
              Name
            </label>
            <input
              value={form.name}
              onChange={(e) => updateForm("name", e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-base-bg border border-base-border text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs uppercase tracking-wide text-base-subt">
              Role / Target position
            </label>
            <input
              value={form.role}
              onChange={(e) => updateForm("role", e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-base-bg border border-base-border text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs uppercase tracking-wide text-base-subt">
                Email
              </label>
              <input
                value={form.email}
                onChange={(e) => updateForm("email", e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-base-bg border border-base-border text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs uppercase tracking-wide text-base-subt">
                Phone
              </label>
              <input
                value={form.phone}
                onChange={(e) => updateForm("phone", e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-base-bg border border-base-border text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
              />
            </div>
          </div>
        </div>

        {/* SKILLS + AI */}
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-wide text-base-subt">
            Skills (comma separated)
          </label>
          <input
            value={form.skillsText}
            onChange={(e) => updateForm("skillsText", e.target.value)}
            placeholder="React, Node.js, MongoDB, Tailwind..."
            className="w-full px-3 py-2 rounded-lg bg-base-bg border border-base-border text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
          />
          <AISkills
            onGenerated={(skills) =>
              updateForm("skillsText", skills.join(", "))
            }
          />
        </div>

        {/* SUMMARY + AI */}
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-wide text-base-subt">
            Summary
          </label>
          <textarea
            value={form.summary}
            onChange={(e) => updateForm("summary", e.target.value)}
            rows={4}
            className="w-full px-3 py-2 rounded-lg bg-base-bg border border-base-border text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
          />
          <button
            type="button"
            onClick={handleAISummary}
            disabled={summaryLoading}
            className="text-xs px-3 py-1.5 rounded-lg bg-primary-500 text-white font-semibold hover:bg-primary-hover disabled:opacity-60"
          >
            {summaryLoading ? "AI..." : "AI Improve Summary"}
          </button>
        </div>

        {/* EXPERIENCE SECTION */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xs uppercase tracking-wide text-base-subt">
              Experience
            </h2>
            <button
              type="button"
              onClick={addExperience}
              className="text-xs px-2 py-1 rounded border border-base-border hover:bg-base-bg"
            >
              + Add
            </button>
          </div>
          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
            {experiences.map((exp, i) => (
              <div
                key={i}
                className="bg-base-card border border-base-border rounded-lg p-3 space-y-2"
              >
                <div className="flex justify-between items-center gap-2">
                  <input
                    className="flex-1 px-2 py-1 rounded border border-base-border text-xs bg-base-bg"
                    placeholder="Role"
                    value={exp.role}
                    onChange={(e) =>
                      updateExperienceAt(i, { ...exp, role: e.target.value })
                    }
                  />
                  <input
                    className="flex-1 px-2 py-1 rounded border border-base-border text-xs bg-base-bg"
                    placeholder="Company"
                    value={exp.company}
                    onChange={(e) =>
                      updateExperienceAt(i, {
                        ...exp,
                        company: e.target.value,
                      })
                    }
                  />
                </div>
                <input
                  className="w-full px-2 py-1 rounded border border-base-border text-xs bg-base-bg"
                  placeholder="Tech (React, Node.js...)"
                  value={exp.tech}
                  onChange={(e) =>
                    updateExperienceAt(i, { ...exp, tech: e.target.value })
                  }
                />
                <textarea
                  className="w-full px-2 py-1 rounded border border-base-border text-xs bg-base-bg"
                  rows={3}
                  placeholder="Bullets (one per line)"
                  value={exp.bulletsText || ""}
                  onChange={(e) =>
                    updateExperienceAt(i, {
                      ...exp,
                      bulletsText: e.target.value,
                    })
                  }
                />
                <div className="flex justify-between items-center">
                  <AIExperience
                    experience={exp}
                    onUpdate={(updated) => updateExperienceAt(i, updated)}
                  />
                  <button
                    type="button"
                    onClick={() => removeExperience(i)}
                    className="text-[11px] text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            {experiences.length === 0 && (
              <p className="text-xs text-base-subt">
                Add your first experience. Use AI to create bullet points.
              </p>
            )}
          </div>
        </div>

        {/* PROJECTS SECTION + AI */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xs uppercase tracking-wide text-base-subt">
              Projects
            </h2>
            <button
              type="button"
              onClick={addProject}
              className="text-xs px-2 py-1 rounded border border-base-border hover:bg-base-bg"
            >
              + Add
            </button>
          </div>
          <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
            {projects.map((p, i) => (
              <div
                key={i}
                className="bg-base-card border border-base-border rounded-lg p-3 space-y-2"
              >
                <input
                  className="w-full px-2 py-1 rounded border border-base-border text-xs bg-base-bg"
                  placeholder="Project name"
                  value={p.name}
                  onChange={(e) =>
                    updateProjectAt(i, { ...p, name: e.target.value })
                  }
                />
                <textarea
                  className="w-full px-2 py-1 rounded border border-base-border text-xs bg-base-bg"
                  rows={2}
                  placeholder="Short description"
                  value={p.desc}
                  onChange={(e) =>
                    updateProjectAt(i, { ...p, desc: e.target.value })
                  }
                />
                <input
                  className="w-full px-2 py-1 rounded border border-base-border text-xs bg-base-bg"
                  placeholder="Tech (React, Node.js...)"
                  value={p.techText}
                  onChange={(e) =>
                    updateProjectAt(i, { ...p, techText: e.target.value })
                  }
                />
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeProject(i)}
                    className="text-[11px] text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            {projects.length === 0 && (
              <p className="text-xs text-base-subt">
                Add some projects or generate with AI below.
              </p>
            )}
          </div>
          <AIProjects
            onGenerated={(aiProjects) =>
              setProjects(
                (aiProjects || []).map((p) => ({
                  name: p.name || "",
                  desc: p.desc || "",
                  techText: (p.tech || []).join(", "),
                }))
              )
            }
          />
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-2 rounded-lg bg-primary-500 text-white font-semibold text-sm hover:bg-primary-hover disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save"}
          </button>
          <button
            onClick={handleExportPdf}
            disabled={pdfLoading}
            className="flex-1 py-2 rounded-lg border border-base-border text-sm hover:bg-base-bg disabled:opacity-60"
          >
            {pdfLoading ? "Exporting..." : "Export PDF"}
          </button>
        </div>
      </div>

      {/* RIGHT PANEL: Preview */}
      <div className="hidden md:flex flex-1 items-center justify-center p-6">
        <PreviewComponent data={dataObj} />
      </div>
    </div>
  );
}

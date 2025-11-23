import React, { useState } from "react";
import { api } from "../services/api";

// ------------------ AI SKILLS ------------------
export function AISkills({ onGenerated }) {
  const [keywords, setKeywords] = useState("");

  const generate = async () => {
    const res = await api.post("/api/ai/generate-skills", { keywords });
    onGenerated(res.data.skills);
  };

  return (
    <div className="bg-base-card p-4 rounded-lg border">
      <h3 className="font-semibold mb-2">AI Skill Generator</h3>
      <textarea
        className="w-full p-2 border rounded bg-base-bg"
        placeholder="Enter keywords..."
        value={keywords}
        onChange={(e) => setKeywords(e.target.value)}
      />

      <button
        onClick={generate}
        className="mt-2 px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-hover"
      >
        Generate Skills
      </button>
    </div>
  );
}

// ------------------ AI EXPERIENCE ------------------
export function AIExperience({ onGenerated }) {
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [tech, setTech] = useState("");
  const [notes, setNotes] = useState("");

  const generate = async () => {
    const res = await api.post("/api/ai/generate-experience", {
      role,
      company,
      tech,
      notes,
    });

    onGenerated(res.data.bullets);
  };

  return (
    <div className="bg-base-card p-4 rounded border space-y-2">
      <h3 className="font-semibold">AI Experience</h3>

      <input
        className="input"
        placeholder="Role"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      />
      <input
        className="input"
        placeholder="Company"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
      />
      <input
        className="input"
        placeholder="Tech (React, Node…) "
        value={tech}
        onChange={(e) => setTech(e.target.value)}
      />
      <textarea
        className="textarea"
        placeholder="Notes..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      <button
        onClick={generate}
        className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-hover"
      >
        Generate Bullets
      </button>
    </div>
  );
}

// ------------------ AI PROJECTS ------------------
export function AIProjects({ onGenerated }) {
  const [keywords, setKeywords] = useState("");

  const generate = async () => {
    const res = await api.post("/api/ai/generate-full", {
      keywords,
      targetRole: "Developer",
    });

    onGenerated(res.data.projects);
  };

  return (
    <div className="bg-base-card p-4 rounded border">
      <h3 className="font-semibold">AI Project Generator</h3>

      <textarea
        className="textarea"
        placeholder="Keywords..."
        value={keywords}
        onChange={(e) => setKeywords(e.target.value)}
      />

      <button
        onClick={generate}
        className="mt-2 px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-hover"
      >
        Generate Projects
      </button>
    </div>
  );
}

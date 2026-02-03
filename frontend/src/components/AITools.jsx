import React, { useState } from "react";
import { api } from "../services/api";
import Button from "./ui/Button";

export function AISkills({ onGenerated }) {
  const [keywords, setKeywords] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!keywords.trim()) return;
    setLoading(true);
    try {
      const res = await api.post("/api/ai/generate-skills", { keywords });
      onGenerated(res.data.skills || []);
    } catch {
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
        placeholder="Type your stack / keywords..."
        value={keywords}
        onChange={(e) => setKeywords(e.target.value)}
      />
      <Button size="sm" onClick={generate} disabled={loading}>
        {loading ? "Generating..." : "Generate Skills"}
      </Button>
    </div>
  );
}

export function AIExperience({ experience, onUpdate }) {
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
    } catch {
      alert("AI experience generation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button size="sm" type="button" onClick={generate} disabled={loading}>
      {loading ? "AI..." : "AI Bullets"}
    </Button>
  );
}

export function AIProjects({ onGenerated }) {
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

      const projects = res.data.projects || [];

      onGenerated(projects);
    } catch {
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
        placeholder="Describe your interests / tech..."
        value={keywords}
        onChange={(e) => setKeywords(e.target.value)}
      />
      <Button size="sm" onClick={generate} disabled={loading}>
        {loading ? "Generating..." : "Generate Projects"}
      </Button>
    </div>
  );
}

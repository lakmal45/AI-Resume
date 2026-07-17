import { FileText, Trash2, Clock, Layout } from "lucide-react";

export default function ResumeCard({ resume, onClick, onDelete }) {
  let data = {};

  try {
    data = resume.resumeJson ? JSON.parse(resume.resumeJson) : {};
  } catch (e) {
    data = {};
  }

  const name = data.header?.name || "Untitled Resume";
  const role = data.header?.role || "";
  //const summary = data.summary || "";
  const template = resume.template || "TemplateMinimal";
  const updated = resume.updatedAt?.slice(0, 10) || "N/A";

  return (
    <div
      onClick={onClick}
      style={{
        background: "var(--c-card)",
        border: "1px solid var(--c-border)",
        borderRadius: 16,
        padding: 0,
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        transition: "transform 0.2s, box-shadow 0.2s",
        boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)";
        const del = e.currentTarget.querySelector(".rc-delete");
        if (del) del.style.opacity = "1";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.03)";
        const del = e.currentTarget.querySelector(".rc-delete");
        if (del) del.style.opacity = "0";
      }}
    >
      {/* Top accent */}
      <div style={{
        height: 4,
        background: "linear-gradient(to right, #6366f1, #06b6d4)",
        borderRadius: "16px 16px 0 0",
      }} />

      <div style={{ padding: "18px 20px 16px" }}>
        {/* Icon + Name */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 10 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10, background: "var(--c-primaryLt)",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <FileText size={18} color="#6366f1" />
          </div>
          <div style={{ overflow: "hidden", flex: 1 }}>
            <div style={{
              fontSize: 15, fontWeight: 600, color: "var(--c-dark)",
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>
              {name}
            </div>
            <div style={{
              fontSize: 12, color: "var(--c-mutedTxt)", marginTop: 2,
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>
              {role || "No role specified"}
            </div>
          </div>
        </div>

        {/* Meta */}
        <div style={{
          display: "flex", alignItems: "center", gap: 14,
          fontSize: 11, color: "var(--c-mutedTxt)", marginTop: 8,
        }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Layout size={11} /> {template.replace("Template", "")}
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Clock size={11} /> {updated}
          </span>
        </div>
      </div>

      {/* Delete button */}
      {onDelete && (
        <button
          className="rc-delete"
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            width: 30,
            height: 30,
            borderRadius: 8,
            background: "#fef2f2",
            border: "1px solid #fecaca",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#ef4444",
            opacity: 0,
            transition: "opacity 0.2s, background 0.15s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#fee2e2"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "#fef2f2"; }}
        >
          <Trash2 size={13} />
        </button>
      )}
    </div>
  );
}

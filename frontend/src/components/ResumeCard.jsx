import { motion } from "framer-motion";

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

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: "0 12px 30px rgba(15,23,42,0.12)" }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="border border-base-border rounded-xl p-4 bg-base-card cursor-pointer group relative"
      onClick={onClick}
    >
      {/* TITLE */}
      <h3 className="font-semibold mb-1 group-hover:text-primary-500 truncate">
        {name}
      </h3>

      {/* ROLE */}
      <p className="text-[11px] text-base-subt mt-2 line-clamp-2">
        {role || "No summary written yet."}
      </p>

      {/* TEMPLATE */}
      <p className="text-xs text-base-subt truncate">{template}</p>

      {/* LAST UPDATED */}
      <p className="text-[10px] text-gray-400 mt-2">
        Updated: {resume.updatedAt?.slice(0, 10) || "N/A"}
      </p>

      {/* DELETE BUTTON */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="absolute top-2 right-2 text-[11px] px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200 opacity-0 group-hover:opacity-100 transition"
      >
        Delete
      </button>
    </motion.div>
  );
}

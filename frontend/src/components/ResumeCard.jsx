import { motion } from "framer-motion";

export default function ResumeCard({ resume, onClick, onDelete }) {
  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: "0 12px 30px rgba(15,23,42,0.12)" }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="border border-base-border rounded-xl p-4 bg-base-card cursor-pointer group relative"
      onClick={onClick}
    >
      <h3 className="font-semibold mb-1 group-hover:text-primary-500">
        {resume.header?.name || "Untitled Resume"}
      </h3>
      <p className="text-xs text-base-subt">
        Template: {resume.template || "minimal"}
      </p>
      <p className="text-xs text-base-subt mt-1">
        Last updated: {resume.updatedAt?.slice(0, 10) || "N/A"}
      </p>
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

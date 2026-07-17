import React from "react";
import { X, CheckCircle2 } from "lucide-react";
import {
  TemplateMinimal,
  TemplateModern,
  TemplateTwoColumn,
  TemplateCorporate,
  TemplateCreative,
  TemplateElegant,
  TemplateTechMatrix,
  TemplateCompact,
  TemplateProfessional,
} from "../templates/Templates";

const TEMPLATES = [
  { id: "Minimal", name: "Minimal", component: TemplateMinimal, desc: "Clean and straightforward." },
  { id: "Modern", name: "Modern", component: TemplateModern, desc: "A sleek, contemporary look." },
  { id: "Two-column", name: "Two-column", component: TemplateTwoColumn, desc: "Space-efficient side panel." },
  { id: "Corporate", name: "Corporate", component: TemplateCorporate, desc: "Professional and polished." },
  { id: "Creative", name: "Creative", component: TemplateCreative, desc: "High contrast and bold." },
  { id: "Elegant", name: "Elegant", component: TemplateElegant, desc: "Sophisticated serif typography." },
  { id: "TechMatrix", name: "TechMatrix", component: TemplateTechMatrix, desc: "Detailed grid layout." },
  { id: "Compact", name: "Compact", component: TemplateCompact, desc: "Information-dense design." },
  { id: "Professional", name: "Professional", component: TemplateProfessional, desc: "Bold header for management." },
];

const dummyData = {
  header: { name: "John Doe", role: "Software Engineer", email: "john@example.com", phone: "+1 234 567 890" },
  summary: "A passionate engineer with a knack for building scalable web applications.",
  skills: ["React", "Node.js", "MongoDB", "AWS"],
  experience: [
    { role: "Senior Developer", company: "Tech Corp", startDate: "2020", endDate: "Present", bullets: ["Led a team of 5", "Improved performance by 40%"] }
  ],
  education: [
    { degree: "B.S. Computer Science", school: "University", year: "2019" }
  ],
  projects: [
    { name: "Portfolio App", desc: "A personal portfolio built with React and Tailwind.", tech: ["React", "Tailwind"] }
  ]
};

export default function TemplateGallery({ isOpen, onClose, selectedTemplate, onSelect }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div 
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl dark:shadow-black/50 w-full max-w-5xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200"
        style={{ maxHeight: "90vh" }}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-gray-50/50 dark:bg-slate-900/50">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Template Gallery</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Choose a layout that fits your style</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-200 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-slate-950">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {TEMPLATES.map((tpl) => {
              const isSelected = selectedTemplate === tpl.id;
              const Comp = tpl.component;

              return (
                <div 
                  key={tpl.id}
                  onClick={() => {
                    onSelect(tpl.id);
                    onClose();
                  }}
                  className={`
                    group relative cursor-pointer rounded-xl bg-white dark:bg-slate-900 border-2 overflow-hidden transition-all duration-300
                    ${isSelected ? "border-[var(--c-primary)] shadow-lg shadow-[var(--c-primary)]/20" : "border-gray-200 dark:border-slate-700 hover:border-[var(--c-primary)]/50 hover:shadow-xl"}
                  `}
                >
                  {/* Miniature Preview Container */}
                  <div className="h-48 w-full overflow-hidden bg-gray-100 dark:bg-slate-800 flex items-start justify-center pt-4 relative">
                    {isSelected && (
                      <div className="absolute top-2 right-2 z-10 bg-[var(--c-primary)] text-white rounded-full p-1 shadow-md">
                        <CheckCircle2 size={16} />
                      </div>
                    )}
                    {/* Scale down the A4 template */}
                    <div 
                      className="origin-top pointer-events-none shadow-sm bg-white"
                      style={{ 
                        width: "210mm", 
                        minHeight: "297mm", 
                        transform: "scale(0.18)",
                        marginBottom: "-250mm" // Adjust layout flow for the heavy scaling
                      }}
                    >
                      <Comp data={dummyData} />
                    </div>
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                  </div>

                  {/* Template Info */}
                  <div className="p-4 border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 relative z-10">
                    <h3 className="font-bold text-gray-900 dark:text-gray-100 flex items-center justify-between">
                      {tpl.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-1">{tpl.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}

import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-120px)] flex items-center justify-center px-4">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Ship resumes
            <span className="text-primary-500"> faster</span> with AI.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="text-base-subt mb-6"
          >
            Generate summaries, skills, experience bullets, and full resumes in
            seconds. Preview in multiple templates and export clean PDFs.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="flex flex-wrap items-center gap-3"
          >
            <Link
              to="/dashboard"
              className="px-5 py-2.5 rounded-lg bg-primary-500 text-white font-semibold text-sm hover:bg-primary-hover"
            >
              Go to dashboard
            </Link>
            <Link
              to="/login"
              className="text-sm text-base-subt hover:text-primary-500"
            >
              or login to continue →
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="mt-6 grid grid-cols-3 gap-3 text-xs text-base-subt"
          >
            <div className="bg-base-card border border-base-border rounded-lg p-3">
              <p className="font-semibold text-base-text mb-1">AI sections</p>
              <p>Summary, skills, bullets, projects generated for you.</p>
            </div>
            <div className="bg-base-card border border-base-border rounded-lg p-3">
              <p className="font-semibold text-base-text mb-1">Templates</p>
              <p>Switch between minimal, modern, and two-column layouts.</p>
            </div>
            <div className="bg-base-card border border-base-border rounded-lg p-3">
              <p className="font-semibold text-base-text mb-1">PDF export</p>
              <p>One click to export clean A4 PDFs for applying.</p>
            </div>
          </motion.div>
        </div>
        {/* Right side mock preview card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="relative"
        >
          <div className="bg-base-card border border-base-border rounded-2xl p-4 shadow-lg">
            <div className="h-4 w-24 bg-primary-100 rounded mb-4" />
            <div className="space-y-2 mb-4">
              <div className="h-3 w-3/4 bg-base-bg rounded" />
              <div className="h-3 w-2/3 bg-base-bg rounded" />
            </div>
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="h-6 bg-base-bg rounded" />
              <div className="h-6 bg-base-bg rounded" />
              <div className="h-6 bg-base-bg rounded" />
            </div>
            <div className="space-y-2">
              <div className="h-3 w-full bg-base-bg rounded" />
              <div className="h-3 w-5/6 bg-base-bg rounded" />
              <div className="h-3 w-4/6 bg-base-bg rounded" />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

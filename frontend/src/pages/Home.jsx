import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* HERO SECTION */}
      <div className="w-full flex flex-col md:flex-row items-center justify-between px-10 md:px-20 py-20">
        {/* LEFT */}
        <div className="w-full md:w-1/2 space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            Ship resumes <span className="text-purple-500">faster</span>
            <br />
            with AI.
          </h1>

          <p className="text-gray-600 text-lg leading-relaxed">
            Generate summaries, skills, experience bullets, and full resumes in
            seconds. Preview in multiple templates and export clean PDFs.
          </p>

          <div className="flex items-center gap-4 pt-4">
            <Link
              to="/register"
              className="px-6 py-3 rounded-md bg-purple-500 text-white hover:bg-purple-600 shadow-md"
            >
              Get Started &rarr;
            </Link>

            <Link to="/login" className="text-gray-700 hover:text-black">
              or login to continue →
            </Link>
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="w-full md:w-1/2 flex justify-center mt-10 md:mt-0">
          <div className="p-6 rounded-2xl shadow-xl bg-white relative">
            <img
              src="/home-image.png"
              alt="Resume Preview"
              className="rounded-xl w-[420px] h-auto shadow-md"
            />
            <div className="absolute inset-0 rounded-2xl bg-purple-300 opacity-20 blur-3xl -z-10"></div>
          </div>
        </div>
      </div>

      {/* FEATURES SECTION */}
      <div className="px-10 md:px-20 py-20 bg-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-white p-8 rounded-xl shadow-md">
            <div className="w-12 h-12 bg-purple-100 flex items-center justify-center rounded-lg mb-4 text-purple-500 text-xl">
              ⚙️
            </div>
            <h3 className="text-xl font-semibold mb-2">AI sections</h3>
            <p className="text-gray-600">
              Summary, skills, bullets, projects generated for you.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-8 rounded-xl shadow-md">
            <div className="w-12 h-12 bg-purple-100 flex items-center justify-center rounded-lg mb-4 text-purple-500 text-xl">
              🗂️
            </div>
            <h3 className="text-xl font-semibold mb-2">Templates</h3>
            <p className="text-gray-600">
              Switch between minimal, modern, and two-column layouts.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-8 rounded-xl shadow-md">
            <div className="w-12 h-12 bg-purple-100 flex items-center justify-center rounded-lg mb-4 text-purple-500 text-xl">
              📄
            </div>
            <h3 className="text-xl font-semibold mb-2">PDF export</h3>
            <p className="text-gray-600">
              One click to export clean A4 PDFs for applying.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

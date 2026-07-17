import React from "react";
import { Link } from "react-router-dom";
import { Search, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 p-8 text-center relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-primary-100 dark:bg-primary-900/30 blur-2xl opacity-50"></div>
        <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 rounded-full bg-blue-100 dark:bg-blue-900/30 blur-2xl opacity-50"></div>
        
        <div className="relative z-10">
          <div className="w-20 h-20 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-3">
            <Search className="text-primary-500 w-10 h-10 transform -rotate-3" />
          </div>
          
          <h1 className="text-8xl font-black text-slate-200 dark:text-slate-700 tracking-tighter mb-2">404</h1>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-3">Page Not Found</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
            Oops! The page you're looking for doesn't exist, has been moved, or is temporarily unavailable.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button 
              onClick={() => window.history.back()}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              <ArrowLeft size={18} /> Go Back
            </button>
            <Link 
              to="/dashboard"
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-primary-600 hover:bg-primary-700 transition-colors shadow-sm shadow-primary-500/20"
            >
              <Home size={18} /> Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

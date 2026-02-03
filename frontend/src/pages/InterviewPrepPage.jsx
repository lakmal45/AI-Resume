import React, { useState, useEffect } from "react";
import axios from "axios";
import DashboardLayout from "../layouts/DashboardLayout";
import {
  MessageSquare,
  Lightbulb,
  Target,
  BookOpen,
  Mic,
  Clock,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import Button from "../components/ui/Button";

// --- Static Data ---
const mockResumes = [
  { id: "1", name: "Software Engineer Resume" },
  { id: "2", name: "Product Manager Resume" },
  { id: "3", name: "Data Analyst Resume" },
];

const interviewTips = [
  {
    category: "Behavioral Questions",
    icon: MessageSquare,
    tips: [
      "Use the STAR method (Situation, Task, Action, Result)",
      "Prepare 5-7 stories that showcase different skills",
      "Keep answers between 1-2 minutes",
    ],
  },
  {
    category: "Technical Preparation",
    icon: Target,
    tips: [
      "Review fundamentals related to your role",
      "Practice coding problems or case studies",
      "Be ready to explain your past projects in depth",
    ],
  },
  {
    category: "Research & Preparation",
    icon: BookOpen,
    tips: [
      "Research the company's mission and recent news",
      "Understand the role requirements thoroughly",
      "Prepare thoughtful questions for the interviewer",
    ],
  },
];

const practiceQuestions = [
  "Tell me about yourself and your background.",
  "Why are you interested in this position?",
  "Describe a challenging project you worked on.",
  "How do you handle conflict with team members?",
  "Where do you see yourself in 5 years?",
  "What are your greatest strengths and weaknesses?",
];

export default function InterviewGenerator({ userId }) {
  const [resumes, setResumes] = useState([]);
  const [resumeId, setResumeId] = useState("");
  const [role, setRole] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [selectedResumeJson, setSelectedResumeJson] = useState(null);

  useEffect(() => {
    const loadResumes = async () => {
      try {
        const res = await api.get("/api/resumes");
        setResumes(res.data || []);
      } catch (err) {
        console.error("Failed to load resumes");
      }
    };
    loadResumes();
  }, []);

  useEffect(() => {
    if (!selectedResumeId) {
      setSelectedResumeJson(null);
      return;
    }
    const loadResumes = async () => {
      try {
        const res = await api.get(`/api/resumes/${selectedResumeId}`);
        const json = res.data.resumeJson ? JSON.parse(res.data.resumeJson) : {};
        setSelectedResumeJson(json);
      } catch (err) {
        console.error("Failed to load resume");
      }
    };
    loadResumes();
  }, [selectedResumeId]);

  const generate = async () => {
    if (!resumeId) return alert("Select a resume!");
    setLoading(true);

    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(
        "/api/interview/generate",
        { userId, resumeId, role },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResult(res.data.saved.questions);
    } catch (err) {
      alert("Error generating interview questions!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Interview Guide
            </h1>
            <p className="text-muted-foreground mt-2">
              Prepare for your interviews with personalized tips based on your
              resume
            </p>
          </div>

          {/* Resume Selector Section (Card Recreated with Divs) */}
          <div className="rounded-lg border bg-white dark:bg-slate-950 shadow-sm text-card-foreground">
            <div className="flex flex-col space-y-1.5 p-6">
              <h3 className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2">
                <Mic className="h-5 w-5 text-primary" />
                Select Your Resume
              </h3>
              <p className="text-sm text-muted-foreground">
                Choose a resume to generate personalized interview preparation
                tips
              </p>
            </div>
            <div className="p-6 pt-0 space-y-4">
              {/* Standard HTML Select with Tailwind Styling */}
              <div className="relative w-full md:w-[400px]">
                <select
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={selectedResumeId}
                  onChange={(e) => setSelectedResumeId(e.target.value)}
                >
                  <option value="">Select a resume...</option>
                  {resumes.map((r) => {
                    let name = "Resume";
                    try {
                      name = JSON.parse(r.resumeJson)?.header?.name || "Resume";
                    } catch (e) {}
                    return (
                      <option key={r._id} value={r._id}>
                        {name}
                      </option>
                    );
                  })}
                </select>
                <ChevronDown className="absolute right-3 top-3 h-4 w-4 opacity-50 pointer-events-none" />
              </div>

              <div onClick={generate} className="inline-block">
                <Button disabled={loading} className="mt-2">
                  {loading ? "Generating..." : "Generate Interview Guide"}
                  {!loading && <ChevronRight className="ml-2 h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>

          {/* Interview Tips Grid */}
          <div className="grid gap-6 md:grid-cols-3">
            {interviewTips.map((section) => (
              <div
                key={section.category}
                className="rounded-lg border bg-white dark:bg-slate-950 shadow-sm text-card-foreground hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col space-y-1.5 p-6">
                  <h3 className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2 text-lg">
                    <section.icon className="h-5 w-5 text-primary" />
                    {section.category}
                  </h3>
                </div>
                <div className="p-6 pt-0">
                  <ul className="space-y-3">
                    {section.tips.map((tip, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Practice Questions Section */}
          <div className="rounded-lg border bg-white dark:bg-slate-950 shadow-sm text-card-foreground">
            <div className="flex flex-col space-y-1.5 p-6">
              <h3 className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-primary" />
                Common Interview Questions
              </h3>
              <p className="text-sm text-muted-foreground">
                Practice answering these frequently asked questions
              </p>
            </div>
            <div className="p-6 pt-0">
              <div className="grid gap-3 md:grid-cols-2">
                {practiceQuestions.map((question, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-4 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary font-medium text-sm">
                      {index + 1}
                    </div>
                    <p className="text-sm text-foreground">{question}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Features Overview Section */}
          <div className="rounded-lg border text-card-foreground shadow-sm bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <div className="flex flex-col space-y-1.5 p-6">
              <h3 className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Interview Guide Features
              </h3>
            </div>
            <div className="p-6 pt-0">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center p-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <MessageSquare className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium text-foreground">
                    Personalized Questions
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    AI-generated questions based on your resume and target role
                  </p>
                </div>
                <div className="text-center p-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium text-foreground">
                    Answer Frameworks
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Structured templates to craft compelling responses
                  </p>
                </div>
                <div className="text-center p-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <Mic className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium text-foreground">
                    Mock Interviews
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Practice with AI-powered interview simulations
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
}

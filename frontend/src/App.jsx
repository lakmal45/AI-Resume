import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import MyResume from "./pages/MyResume.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Editor from "./pages/Editor.jsx";
import Home from "./pages/Home.jsx";
import Profile from "./pages/Profile.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import LinkedIn from "./pages/LinkedIn.jsx";
import JobScanner from "./pages/JobScanner.jsx";
import ATSAnalyzer from "./pages/ATSAnalyzer.jsx";
import ATSEditor from "./pages/ATSEditor.jsx";
import InterviewPrepPage from "./pages/InterviewPrepPage.jsx";
import CoverLetter from "./pages/CoverLetter.jsx";
import Settings from "./pages/Settings.jsx";
import JobTracker from "./pages/JobTracker.jsx";
import NotFound from "./pages/NotFound.jsx";
import DashboardLayout from "./layouts/DashboardLayout.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("accessToken");
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

function DashboardRouteWrapper() {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}

/*function Layout({ children }) {
  //const hideChrome = ["/editor/:id"].includes(location.pathname);
  const location = useLocation();

  const staticHiddenPaths = ["/linkedin-import", "/dashboard"];

  const hideChrome =
    matchPath({ path: "/editor/:id", end: false }, location.pathname) ||
    staticHiddenPaths.includes(location.pathname);

  if (hideChrome) return children;

  return (
    <div className="min-h-screen flex flex-col bg-base-bg text-base-text">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}*/
function Layout({ children }) {
  return <div className="layout">{children}</div>;
}

export default function App() {
  return (
    <Layout>
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* Dashboard Routes wrapped in DashboardLayout */}
          <Route element={<DashboardRouteWrapper />}>
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-resumes"
              element={
                <ProtectedRoute>
                  <MyResume />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/linkedin-import"
              element={
                <ProtectedRoute>
                  <LinkedIn />
                </ProtectedRoute>
              }
            />
            <Route
              path="/jobscanner"
              element={
                <ProtectedRoute>
                  <JobScanner />
                </ProtectedRoute>
              }
            />
            <Route
              path="/atsanalyzer"
              element={
                <ProtectedRoute>
                  <ATSAnalyzer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/interview-guide"
              element={
                <ProtectedRoute>
                  <InterviewPrepPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cover-letter"
              element={
                <ProtectedRoute>
                  <CoverLetter />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/job-tracker"
              element={
                <ProtectedRoute>
                  <JobTracker />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Standalone Protected Routes without Dashboard Layout */}
          <Route
            path="/editor/ats/"
            element={
              <ProtectedRoute>
                <ATSEditor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/editor/:id"
            element={
              <ProtectedRoute>
                <Editor />
              </ProtectedRoute>
            }
          />

          {/* Catch-all 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ErrorBoundary>
    </Layout>
  );
}

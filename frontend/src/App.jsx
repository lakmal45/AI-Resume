import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Editor from "./pages/Editor.jsx";
import Home from "./pages/Home.jsx";
import Profile from "./pages/Profile.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import LinkedIn from "./pages/LinkedIn.jsx";
import JobScanner from "./pages/JobScanner.jsx";
import ATSAnalyzer from "./pages/ATSAnalyzer.jsx";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("accessToken");
  if (!token) return <Navigate to="/login" replace />;
  return children;
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
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
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
      </Routes>
    </Layout>
  );
}

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-bg">
      <div className="w-full max-w-md bg-base-card border border-base-border rounded-2xl p-8 shadow-sm">
        <h1 className="text-2xl font-bold mb-6 text-center text-base-text">
          AI Resume Builder
        </h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm mb-1 text-base-subt">Email</label>
            <input
              type="email"
              className="w-full px-3 py-2 rounded-lg bg-base-bg border border-base-border focus:ring-2 focus:ring-primary-300"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-base-subt">
              Password
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 rounded-lg bg-base-bg border border-base-border focus:ring-2 focus:ring-primary-300"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            disabled={loading}
            className="bg-purple-500 w-full py-2 rounded-lg bg-primary-500 hover:bg-purple-600 font-semibold text-white transition disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-sm text-center mt-4 text-base-subt">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="text-primary-500 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

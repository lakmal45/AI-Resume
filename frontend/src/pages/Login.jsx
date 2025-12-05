import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault(); // 🔥 Prevent page reload
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      // Save only Access Token
      localStorage.setItem("accessToken", res.data.accessToken);

      // Redirect to dashboard
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);

      if (err.response?.data?.message) {
        setErrorMsg(err.response.data.message);
      } else {
        setErrorMsg("Login failed. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-5">
      <form
        onSubmit={handleLogin}
        className="space-y-4 w-full max-w-sm bg-white p-8 rounded-lg shadow-md"
      >
        <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>

        {errorMsg && (
          <div className="bg-red-100 text-red-700 px-3 py-2 rounded">
            {errorMsg}
          </div>
        )}

        <div>
          <label className="block text-gray-700 mb-1 font-medium">Email</label>
          <input
            type="email"
            className="border px-3 py-2 rounded w-full"
            placeholder="example@gmail.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1 font-medium">
            Password
          </label>
          <input
            type="password"
            className="border px-3 py-2 rounded w-full"
            placeholder="•••••••••"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          type="submit" // 🔥 REQUIRED to trigger onSubmit properly
          disabled={loading}
          className="bg-purple-600 w-full py-2 rounded-lg text-white font-semibold hover:bg-purple-700 transition disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

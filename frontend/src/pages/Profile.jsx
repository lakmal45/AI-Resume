import { useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";

export default function Profile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    // For now, frontend-only. Later you can connect to a /auth/me update endpoint.
    setTimeout(() => {
      setSaving(false);
      alert("Profile saved (demo only)");
    }, 600);
  };

  return (
    <DashboardLayout>
      <div className="max-w-xl mx-auto px-4 py-8">
        <h1 className="text-xl font-semibold mb-4">Profile settings</h1>
        <p className="text-sm text-base-subt mb-6">
          Update your basic profile details. In a future version, you can
          connect this to real backend endpoints.
        </p>

        <form
          onSubmit={handleSave}
          className="space-y-4 bg-base-card border border-base-border rounded-xl p-5"
        >
          <div>
            <label className="block text-sm mb-1 text-base-subt">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-base-bg border border-base-border text-sm focus:ring-2 focus:ring-primary-300"
            />
          </div>
          <div>
            <label className="block text-sm mb-1 text-base-subt">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-base-bg border border-base-border text-sm focus:ring-2 focus:ring-primary-300"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 rounded-lg bg-primary-500 text-white text-sm font-semibold hover:bg-primary-hover disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}

import { useState, useRef, useEffect } from "react";
import { api } from "../services/api";
import { useToast } from "../context/ToastContext";
import { useNavigate } from "react-router-dom";
import {
  User, Mail, Phone, MapPin, Briefcase, Camera, Save,
  FileText, SquareKanban, MessageCircleQuestion, Star,
  Edit3, CheckCircle, AlertCircle, Linkedin, Github,
  Globe, Shield, Award, TrendingUp,
} from "lucide-react";

const AVATAR_COLORS = [
  "linear-gradient(135deg,#6366f1,#8b5cf6)",
  "linear-gradient(135deg,#06b6d4,#3b82f6)",
  "linear-gradient(135deg,#10b981,#06b6d4)",
  "linear-gradient(135deg,#f59e0b,#ef4444)",
];

export default function Profile() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState(null);
  const [avatarColor] = useState(AVATAR_COLORS[0]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [stats] = useState({ resumes: 0, ats: 0, jobs: 0, prep: 0 });
  const fileRef = useRef();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    title: "",
    bio: "",
    linkedin: "",
    github: "",
    website: "",
  });

  useEffect(() => {
    api.get("/api/profile")
      .then(res => {
        const u = res.data;
        const [firstName = "", lastName = ""] = (u.name || "").split(" ");
        setForm({
          firstName,
          lastName,
          email: u.email || "",
          phone: u.phone || "",
          location: u.location || "",
          title: u.title || "",
          bio: u.bio || "",
          linkedin: u.socialLinks?.linkedin || "",
          github: u.socialLinks?.github || "",
          website: u.socialLinks?.website || "",
        });
      })
      .catch(() => toast("Failed to load profile", "error"));
  }, [toast]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put("/api/profile", {
        name: `${form.firstName} ${form.lastName}`.trim(),
        phone: form.phone,
        location: form.location,
        title: form.title,
        bio: form.bio,
        socialLinks: {
          linkedin: form.linkedin,
          github: form.github,
          website: form.website,
        }
      });
      setSaved(true);
      toast("Profile updated successfully", "success");
      setTimeout(() => setSaved(false), 3000);
    } catch {
      toast("Failed to update profile", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to permanently delete your account? This cannot be undone.")) return;
    try {
      await api.delete("/api/settings/account");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      navigate("/");
    } catch {
      toast("Failed to delete account", "error");
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) setAvatar(URL.createObjectURL(file));
  };

  const statsCards = [
    { label: "Resumes Created", value: stats.resumes, icon: FileText, color: "#6366f1", bg: "#ede9fe" },
    { label: "ATS Score (avg)", value: `${stats.ats}%`, icon: TrendingUp, color: "#10b981", bg: "#d1fae5" },
    { label: "Jobs Scanned", value: stats.jobs, icon: SquareKanban, color: "#06b6d4", bg: "#cffafe" },
    { label: "Interviews Prepped", value: stats.prep, icon: MessageCircleQuestion, color: "#f59e0b", bg: "#fef3c7" },
  ];

  const tabs = [
    { id: "personal", label: "Personal Info" },
    { id: "social", label: "Social Links" },
    { id: "security", label: "Security" },
  ];

  return (
    <>
      <style>{`
        .pr-root { max-width: 900px; margin: 0 auto; }

        /* Header card */
        .pr-header-card {
          background: var(--c-card);
          border: 1px solid var(--c-border);
          border-radius: 20px;
          padding: 32px;
          display: flex;
          gap: 28px;
          align-items: flex-start;
          margin-bottom: 24px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.04);
        }
        @media(max-width:600px){
          .pr-header-card { flex-direction: column; align-items: center; text-align: center; padding: 24px 16px; }
        }

        /* Avatar */
        .pr-avatar-wrap {
          position: relative;
          flex-shrink: 0;
        }
        .pr-avatar {
          width: 96px;
          height: 96px;
          border-radius: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 36px;
          font-weight: 700;
          color: white;
          overflow: hidden;
          border: 3px solid var(--c-border);
        }
        .pr-avatar img { width: 100%; height: 100%; object-fit: cover; }
        .pr-avatar-edit {
          position: absolute;
          bottom: -6px;
          right: -6px;
          width: 30px;
          height: 30px;
          border-radius: 8px;
          background: #6366f1;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          border: 2px solid #fff;
          transition: background 0.2s;
        }
        .pr-avatar-edit:hover { background: #4f46e5; }

        .pr-header-info { flex: 1; }
        .pr-name { font-size: 22px; font-weight: 700; color: var(--c-dark); margin-bottom: 4px; }
        .pr-title-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #ede9fe;
          color: #6366f1;
          font-size: 13px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 20px;
          margin-bottom: 10px;
        }
        .pr-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
          font-size: 13px;
          color: var(--c-mutedTxt);
          margin-bottom: 12px;
        }
        .pr-meta span { display: flex; align-items: center; gap: 5px; }
        .pr-bio { font-size: 14px; color: var(--c-mutedTxt); line-height: 1.6; max-width: 500px; }
        .pr-plan-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: linear-gradient(135deg, #fef3c7, #fde68a);
          color: #b45309;
          font-size: 12px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 20px;
          border: 1px solid #fcd34d;
          margin-top: 10px;
        }

        /* Stats */
        .pr-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
          margin-bottom: 24px;
        }
        @media(max-width:700px){ .pr-stats { grid-template-columns: repeat(2,1fr); } }
        @media(max-width:380px){ .pr-stats { grid-template-columns: 1fr; } }
        .pr-stat-card {
          background: var(--c-card);
          border: 1px solid var(--c-border);
          border-radius: 14px;
          padding: 16px 18px;
          display: flex;
          align-items: center;
          gap: 14px;
          box-shadow: 0 1px 6px rgba(0,0,0,0.04);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .pr-stat-card:hover { transform: translateY(-2px); box-shadow: 0 4px 16px rgba(0,0,0,0.08); }
        .pr-stat-icon {
          width: 42px;
          height: 42px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .pr-stat-val { font-size: 20px; font-weight: 700; color: var(--c-dark); line-height: 1; }
        .pr-stat-lbl { font-size: 12px; color: var(--c-mutedTxt); margin-top: 3px; }

        /* Main form card */
        .pr-card {
          background: var(--c-card);
          border: 1px solid var(--c-border);
          border-radius: 20px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.04);
          overflow: hidden;
        }

        /* Tabs */
        .pr-tabs {
          display: flex;
          border-bottom: 1px solid var(--c-border);
          padding: 0 24px;
          gap: 4px;
        }
        .pr-tab {
          padding: 16px 18px;
          font-size: 14px;
          font-weight: 500;
          color: var(--c-mutedTxt);
          cursor: pointer;
          border: none;
          background: none;
          border-bottom: 2px solid transparent;
          transition: all 0.2s;
          margin-bottom: -1px;
        }
        .pr-tab.active { color: var(--c-primary); border-bottom-color: var(--c-primary); }
        .pr-tab:hover:not(.active) { color: var(--c-dark); }

        /* Form body */
        .pr-form-body { padding: 28px 24px; }

        .pr-section-title {
          font-size: 13px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          color: var(--c-mutedTxt);
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .pr-section-title::after {
          content: '';
          flex: 1;
          height: 1px;
          background: var(--c-border);
        }

        .pr-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
        @media(max-width:540px){ .pr-grid-2 { grid-template-columns: 1fr; } }
        .pr-field { margin-bottom: 16px; }

        .pr-label {
          display: block;
          font-size: 13px;
          font-weight: 500;
          color: var(--c-mutedTxt);
          margin-bottom: 6px;
        }
        .pr-input {
          width: 100%;
          padding: 10px 14px;
          border: 1.5px solid var(--c-border);
          border-radius: 10px;
          font-size: 14px;
          color: var(--c-dark);
          background: var(--c-bg);
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          outline: none;
          box-sizing: border-box;
        }
        .pr-input:focus {
          border-color: var(--c-primary);
          background: var(--c-card);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.10);
        }
        .pr-input-icon {
          position: relative;
        }
        .pr-input-icon .pr-input { padding-left: 38px; }
        .pr-input-icon svg {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
        }
        textarea.pr-input { resize: vertical; min-height: 90px; line-height: 1.5; }

        /* Actions */
        .pr-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          padding: 20px 24px;
          border-top: 1px solid var(--c-border);
          background: var(--c-bg);
        }
        .pr-btn-secondary {
          padding: 9px 18px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 500;
          color: var(--c-mutedTxt);
          background: var(--c-bg);
          border: 1px solid var(--c-border);
          cursor: pointer;
          transition: all 0.2s;
        }
        .pr-btn-secondary:hover { background: var(--c-border); color: var(--c-dark); }
        .pr-btn-primary {
          padding: 9px 22px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          color: #fff;
          background: linear-gradient(135deg, #6366f1, #4f46e5);
          border: none;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 7px;
          box-shadow: 0 2px 8px rgba(99,102,241,0.3);
        }
        .pr-btn-primary:hover { opacity: 0.9; transform: translateY(-1px); box-shadow: 0 4px 14px rgba(99,102,241,0.35); }
        .pr-btn-primary:disabled { opacity: 0.65; transform: none; }

        /* Save toast */
        .pr-saved-toast {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 13px;
          font-weight: 500;
          color: #10b981;
          padding: 8px 14px;
          background: #d1fae5;
          border-radius: 10px;
          border: 1px solid #a7f3d0;
        }

        /* Security tab */
        .pr-security-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 0;
          border-bottom: 1px solid var(--c-border);
        }
        .pr-security-item:last-child { border-bottom: none; }
        .pr-security-label { font-size: 14px; font-weight: 500; color: var(--c-dark); }
        .pr-security-desc { font-size: 12px; color: var(--c-mutedTxt); margin-top: 2px; }
        .pr-toggle {
          width: 44px;
          height: 24px;
          border-radius: 12px;
          background: #e2e8f0;
          position: relative;
          cursor: pointer;
          transition: background 0.2s;
          border: none;
          flex-shrink: 0;
        }
        .pr-toggle.on { background: #6366f1; }
        .pr-toggle::after {
          content: '';
          position: absolute;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: var(--c-card);
          top: 3px;
          left: 3px;
          transition: left 0.2s;
          box-shadow: 0 1px 4px rgba(0,0,0,0.15);
        }
        .pr-toggle.on::after { left: 23px; }
        .pr-change-pw-btn {
          padding: 7px 14px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          color: #6366f1;
          background: #ede9fe;
          border: 1px solid #c7d2fe;
          cursor: pointer;
          transition: all 0.2s;
        }
        .pr-change-pw-btn:hover { background: #ddd6fe; }

        /* Spinner */
        @keyframes pr-spin { to { transform: rotate(360deg); } }
        .pr-spinner {
          width: 15px;
          height: 15px;
          border: 2px solid rgba(255,255,255,0.4);
          border-top-color: #fff;
          border-radius: 50%;
          animation: pr-spin 0.7s linear infinite;
        }
      `}</style>

      <div className="pr-root">
        {/* ── Header Card ─────────────────────────────── */}
        <div className="pr-header-card">
          <div className="pr-avatar-wrap">
            <div className="pr-avatar" style={{ background: avatarColor }}>
              {avatar ? <img src={avatar} alt="avatar" /> : ((form.firstName?.[0] || "") + (form.lastName?.[0] || ""))}
            </div>
            <div className="pr-avatar-edit" onClick={() => fileRef.current.click()} title="Change photo">
              <Camera size={14} color="white" />
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleAvatarChange} />
          </div>

          <div className="pr-header-info">
            <div className="pr-name">{form.firstName} {form.lastName}</div>
            <div className="pr-title-badge"><Briefcase size={12} />{form.title}</div>
            <div className="pr-meta">
              <span><Mail size={13} />{form.email}</span>
              <span><MapPin size={13} />{form.location}</span>
            </div>
            <div className="pr-bio">{form.bio}</div>
            <div className="pr-plan-badge"><Award size={12} />Free Plan · 3 / 3 resumes</div>
          </div>
        </div>

        {/* ── Stats ───────────────────────────────────── */}
        <div className="pr-stats">
          {statsCards.map((s) => {
            const Icon = s.icon;
            return (
              <div className="pr-stat-card" key={s.label}>
                <div className="pr-stat-icon" style={{ background: s.bg }}>
                  <Icon size={18} color={s.color} />
                </div>
                <div>
                  <div className="pr-stat-val">{s.value}</div>
                  <div className="pr-stat-lbl">{s.label}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Main Card ───────────────────────────────── */}
        <div className="pr-card">
          {/* Tabs */}
          <div className="pr-tabs">
            {tabs.map((t) => (
              <button
                key={t.id}
                className={`pr-tab ${activeTab === t.id ? "active" : ""}`}
                onClick={() => setActiveTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSave}>
            <div className="pr-form-body">
              {/* Personal Info Tab */}
              {activeTab === "personal" && (
                <>
                  <div className="pr-section-title"><User size={13} />Basic Details</div>
                  <div className="pr-grid-2">
                    <div className="pr-field">
                      <label className="pr-label">First Name</label>
                      <input className="pr-input" value={form.firstName} onChange={set("firstName")} />
                    </div>
                    <div className="pr-field">
                      <label className="pr-label">Last Name</label>
                      <input className="pr-input" value={form.lastName} onChange={set("lastName")} />
                    </div>
                  </div>
                  <div className="pr-field pr-input-icon">
                    <label className="pr-label">Email Address</label>
                    <div style={{ position: "relative" }}>
                      <Mail size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                      <input type="email" className="pr-input" style={{ paddingLeft: 38 }} value={form.email} onChange={set("email")} />
                    </div>
                  </div>
                  <div className="pr-grid-2">
                    <div className="pr-field">
                      <label className="pr-label">Phone Number</label>
                      <div style={{ position: "relative" }}>
                        <Phone size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                        <input className="pr-input" style={{ paddingLeft: 38 }} value={form.phone} onChange={set("phone")} />
                      </div>
                    </div>
                    <div className="pr-field">
                      <label className="pr-label">Location</label>
                      <div style={{ position: "relative" }}>
                        <MapPin size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                        <input className="pr-input" style={{ paddingLeft: 38 }} value={form.location} onChange={set("location")} />
                      </div>
                    </div>
                  </div>
                  <div className="pr-field">
                    <label className="pr-label">Job Title</label>
                    <div style={{ position: "relative" }}>
                      <Briefcase size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                      <input className="pr-input" style={{ paddingLeft: 38 }} value={form.title} onChange={set("title")} />
                    </div>
                  </div>
                  <div className="pr-section-title" style={{ marginTop: 24 }}><Edit3 size={13} />About</div>
                  <div className="pr-field">
                    <label className="pr-label">Bio / Summary</label>
                    <textarea className="pr-input" value={form.bio} onChange={set("bio")} rows={4} />
                  </div>
                </>
              )}

              {/* Social Links Tab */}
              {activeTab === "social" && (
                <>
                  <div className="pr-section-title"><Globe size={13} />Online Presence</div>
                  <div className="pr-field">
                    <label className="pr-label">LinkedIn Profile</label>
                    <div style={{ position: "relative" }}>
                      <Linkedin size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#0a66c2" }} />
                      <input className="pr-input" style={{ paddingLeft: 38 }} value={form.linkedin} onChange={set("linkedin")} placeholder="linkedin.com/in/username" />
                    </div>
                  </div>
                  <div className="pr-field">
                    <label className="pr-label">GitHub Profile</label>
                    <div style={{ position: "relative" }}>
                      <Github size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#1e293b" }} />
                      <input className="pr-input" style={{ paddingLeft: 38 }} value={form.github} onChange={set("github")} placeholder="github.com/username" />
                    </div>
                  </div>
                  <div className="pr-field">
                    <label className="pr-label">Personal Website</label>
                    <div style={{ position: "relative" }}>
                      <Globe size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                      <input className="pr-input" style={{ paddingLeft: 38 }} value={form.website} onChange={set("website")} placeholder="yourwebsite.com" />
                    </div>
                  </div>
                  <div style={{ background: "var(--c-bg)", border: "1px solid var(--c-border)", borderRadius: 12, padding: 16, marginTop: 8 }}>
                    <div style={{ fontSize: 13, color: "var(--c-mutedTxt)", display: "flex", alignItems: "center", gap: 7 }}>
                      <Star size={14} color="#f59e0b" />
                      Linking your profiles helps ResumeAI auto-fill resume sections and personalize suggestions.
                    </div>
                  </div>
                </>
              )}

              {/* Security Tab */}
              {activeTab === "security" && (
                <>
                  <div className="pr-section-title"><Shield size={13} />Account Security</div>
                  <SecurityToggle label="Two-Factor Authentication" desc="Add an extra layer of security to your account" defaultOn={false} />
                  <SecurityToggle label="Login Notifications" desc="Get emailed when a new device logs into your account" defaultOn={true} />
                  <SecurityToggle label="Session Timeout" desc="Auto-logout after 30 minutes of inactivity" defaultOn={false} />
                  <div className="pr-security-item">
                    <div>
                      <div className="pr-security-label">Password</div>
                      <div className="pr-security-desc">Last changed 3 months ago</div>
                    </div>
                    <button type="button" className="pr-change-pw-btn">Change Password</button>
                  </div>
                  <div className="pr-security-item">
                    <div>
                      <div className="pr-security-label" style={{ color: "#ef4444" }}>Delete Account</div>
                      <div className="pr-security-desc">Permanently delete your account and all data</div>
                    </div>
                    <button type="button" onClick={handleDeleteAccount} style={{ padding: "7px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500, color: "#ef4444", background: "#fef2f2", border: "1px solid #fecaca", cursor: "pointer" }}>Delete</button>
                  </div>
                </>
              )}
            </div>

            {activeTab !== "security" && (
              <div className="pr-actions">
                {saved && (
                  <div className="pr-saved-toast">
                    <CheckCircle size={15} /> Changes saved!
                  </div>
                )}
                <button type="button" className="pr-btn-secondary" onClick={() => setSaved(false)}>Cancel</button>
                <button type="submit" className="pr-btn-primary" disabled={saving}>
                  {saving ? <span className="pr-spinner" /> : <Save size={14} />}
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </>
  );
}

function SecurityToggle({ label, desc, defaultOn }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="pr-security-item">
      <div>
        <div className="pr-security-label">{label}</div>
        <div className="pr-security-desc">{desc}</div>
      </div>
      <button type="button" className={`pr-toggle ${on ? "on" : ""}`} onClick={() => setOn(!on)} />
    </div>
  );
}

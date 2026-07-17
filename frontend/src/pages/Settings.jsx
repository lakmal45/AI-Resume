import { createElement, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { useToast } from "../context/ToastContext";
import { useTheme } from "../context/ThemeContext";
import {
  Bell, Moon, Globe, Shield, Palette, Download,
  Mail, Smartphone, Volume2, Eye, Zap, RefreshCw,
  CheckCircle, ChevronRight, Monitor, Sun, Laptop,
  Trash2, FileText, AlertTriangle,
} from "lucide-react";

// ── Reusable Toggle ──────────────────────────────────────────────────────────
function Toggle({ value, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      style={{
        width: 44, height: 24, borderRadius: 12, flexShrink: 0,
        background: value ? "#6366f1" : "#e2e8f0",
        position: "relative", border: "none", cursor: "pointer",
        transition: "background 0.2s",
      }}
    >
      <span style={{
        position: "absolute", width: 18, height: 18, borderRadius: "50%",
        background: "#fff", top: 3, left: value ? 23 : 3,
        transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
      }} />
    </button>
  );
}

// ── Section wrapper ──────────────────────────────────────────────────────────
function Section({ icon, iconColor, iconBg, title, desc, children }) {
  return (
    <div style={{
      background: "var(--c-card)", border: "1px solid var(--c-border)", borderRadius: 18,
      marginBottom: 20, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
    }}>
      <div style={{
        padding: "20px 24px 16px", borderBottom: "1px solid var(--c-border)",
        display: "flex", alignItems: "center", gap: 14,
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: 11, background: iconBg,
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          {createElement(icon, { size: 18, color: iconColor })}
        </div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 600, color: "var(--c-dark)" }}>{title}</div>
          {desc && <div style={{ fontSize: 13, color: "var(--c-mutedTxt)", marginTop: 2 }}>{desc}</div>}
        </div>
      </div>
      <div style={{ padding: "8px 0" }}>{children}</div>
    </div>
  );
}

// ── Row ──────────────────────────────────────────────────────────────────────
function Row({ label, desc, children, last }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "13px 24px", borderBottom: last ? "none" : "1px solid var(--c-border)",
      gap: 16,
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: "var(--c-dark)" }}>{label}</div>
        {desc && <div style={{ fontSize: 12, color: "var(--c-mutedTxt)", marginTop: 2 }}>{desc}</div>}
      </div>
      <div style={{ flexShrink: 0 }}>{children}</div>
    </div>
  );
}

// ── Select ───────────────────────────────────────────────────────────────────
function Select({ value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        padding: "7px 12px", borderRadius: 9, border: "1.5px solid var(--c-border)",
        background: "var(--c-bg)", color: "var(--c-dark)", fontSize: 13,
        fontWeight: 500, cursor: "pointer", outline: "none",
        transition: "border-color 0.2s",
      }}
      onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
      onBlur={(e) => (e.target.style.borderColor = "var(--c-border)")}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

// ── Theme Picker ─────────────────────────────────────────────────────────────
function ThemePicker({ value, onChange }) {
  const themes = [
    { id: "light", label: "Light", Icon: Sun },
    { id: "dark", label: "Dark", Icon: Moon },
    { id: "system", label: "System", Icon: Laptop },
  ];
  return (
    <div style={{ display: "flex", gap: 8 }}>
      {themes.map(({ id, label, Icon: ThemeIcon }) => (
        <button
          key={id}
          type="button"
          onClick={() => onChange(id)}
          style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            gap: 5, padding: "9px 16px", borderRadius: 10,
            border: value === id ? "2px solid #6366f1" : "2px solid var(--c-border)",
            background: value === id ? "var(--c-primaryLt)" : "var(--c-bg)",
            color: value === id ? "#6366f1" : "var(--c-mutedTxt)",
            cursor: "pointer", fontSize: 12, fontWeight: 500,
            transition: "all 0.15s",
          }}
        >
          {createElement(ThemeIcon, { size: 16 })}
          {label}
        </button>
      ))}
    </div>
  );
}

// ── Danger Button ────────────────────────────────────────────────────────────
function DangerBtn({ children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: "7px 14px", borderRadius: 9, fontSize: 13, fontWeight: 500,
        color: "#ef4444", background: "#fef2f2", border: "1px solid #fecaca",
        cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
        transition: "all 0.15s",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = "#fee2e2"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "#fef2f2"; }}
    >
      {children}
    </button>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────
export default function Settings() {
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  // Notification state
  const [notif, setNotif] = useState({
    emailJobAlerts: true,
    emailResumeTips: false,
    emailNewsletter: false,
    pushBrowser: true,
    pushMobile: false,
    soundAlerts: true,
  });

  // Appearance
  const [language, setLanguage] = useState("en");
  const [density, setDensity] = useState("comfortable");
  const [font, setFont] = useState("inter");

  // Privacy
  const [privacy, setPrivacy] = useState({
    analyticsTracking: true,
    personalizedAds: false,
    dataSharing: false,
    publicProfile: true,
  });

  // Resume defaults
  const [defaults, setDefaults] = useState({
    autoSave: true,
    spellCheck: true,
    autoFormat: false,
    defaultFormat: "pdf",
    dateFormat: "mm/dd/yyyy",
  });

  useEffect(() => {
    api.get("/api/settings")
      .then(res => {
        const p = res.data || {};
        if (p.language) setLanguage(p.language);
        if (p.theme) setTheme(p.theme);
      })
      .catch(() => toast("Failed to load settings", "error"));
  }, [toast, setTheme]);

  const setN = (key) => (v) => setNotif((s) => ({ ...s, [key]: v }));
  const setP = (key) => (v) => setPrivacy((s) => ({ ...s, [key]: v }));
  const setD = (key) => (v) => setDefaults((s) => ({ ...s, [key]: v }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put("/api/settings", { language, theme });
      setSaved(true);
      toast("Settings saved successfully!", "success");
      setTimeout(() => setSaved(false), 3000);
    } catch {
      toast("Failed to save settings", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure? This CANNOT be undone.")) return;
    try {
      await api.delete("/api/settings/account");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      navigate("/");
    } catch {
      toast("Failed to delete account", "error");
    }
  };

  return (
    <div style={{ maxWidth: 780, margin: "0 auto", fontFamily: "'Inter','Segoe UI',sans-serif" }}>
      {/* Page header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "var(--c-dark)", margin: 0 }}>Settings</h1>
        <p style={{ fontSize: 14, color: "var(--c-mutedTxt)", marginTop: 6 }}>
          Manage your account preferences, notifications, and privacy settings.
        </p>
      </div>

      {/* ── Appearance ───────────────────────────────── */}
      <Section icon={Palette} iconColor="#6366f1" iconBg="#ede9fe" title="Appearance" desc="Customize how ResumeAI looks and feels">
        <Row label="Theme" desc="Choose your preferred color scheme">
          <ThemePicker value={theme} onChange={setTheme} />
        </Row>
        <Row label="Language" desc="Interface language">
          <Select value={language} onChange={setLanguage} options={[
            { value: "en", label: "English" },
            { value: "es", label: "Español" },
            { value: "fr", label: "Français" },
            { value: "de", label: "Deutsch" },
          ]} />
        </Row>
        <Row label="Layout Density" desc="Control spacing throughout the UI">
          <Select value={density} onChange={setDensity} options={[
            { value: "compact", label: "Compact" },
            { value: "comfortable", label: "Comfortable" },
            { value: "spacious", label: "Spacious" },
          ]} />
        </Row>
        <Row label="Font Style" desc="Choose your preferred font" last>
          <Select value={font} onChange={setFont} options={[
            { value: "inter", label: "Inter (default)" },
            { value: "roboto", label: "Roboto" },
            { value: "georgia", label: "Georgia" },
            { value: "mono", label: "Monospace" },
          ]} />
        </Row>
      </Section>

      {/* ── Notifications ────────────────────────────── */}
      <Section icon={Bell} iconColor="#f59e0b" iconBg="#fef3c7" title="Notifications" desc="Control when and how you get notified">
        <Row label="Job match alerts" desc="Get emailed when new jobs match your profile">
          <Toggle value={notif.emailJobAlerts} onChange={setN("emailJobAlerts")} />
        </Row>
        <Row label="Resume improvement tips" desc="Weekly tips to improve your resume">
          <Toggle value={notif.emailResumeTips} onChange={setN("emailResumeTips")} />
        </Row>
        <Row label="Newsletter & product updates" desc="Stay up to date with new features">
          <Toggle value={notif.emailNewsletter} onChange={setN("emailNewsletter")} />
        </Row>
        <Row label="Browser push notifications" desc="Receive alerts in your browser">
          <Toggle value={notif.pushBrowser} onChange={setN("pushBrowser")} />
        </Row>
        <Row label="Mobile push notifications" desc="Alerts via the mobile app">
          <Toggle value={notif.pushMobile} onChange={setN("pushMobile")} />
        </Row>
        <Row label="Sound alerts" desc="Play a sound for important notifications" last>
          <Toggle value={notif.soundAlerts} onChange={setN("soundAlerts")} />
        </Row>
      </Section>

      {/* ── Resume Defaults ───────────────────────────── */}
      <Section icon={FileText} iconColor="#10b981" iconBg="#d1fae5" title="Resume Defaults" desc="Set default behaviour for the resume editor">
        <Row label="Auto-save" desc="Automatically save changes every 30 seconds">
          <Toggle value={defaults.autoSave} onChange={setD("autoSave")} />
        </Row>
        <Row label="Spell check" desc="Highlight spelling errors while editing">
          <Toggle value={defaults.spellCheck} onChange={setD("spellCheck")} />
        </Row>
        <Row label="Auto-format" desc="Automatically adjust formatting for ATS">
          <Toggle value={defaults.autoFormat} onChange={setD("autoFormat")} />
        </Row>
        <Row label="Default export format" desc="Choose the default download format">
          <Select value={defaults.defaultFormat} onChange={setD("defaultFormat")} options={[
            { value: "pdf", label: "PDF" },
            { value: "docx", label: "Word (.docx)" },
            { value: "txt", label: "Plain Text (.txt)" },
          ]} />
        </Row>
        <Row label="Date format" desc="Format used in dates on your resume" last>
          <Select value={defaults.dateFormat} onChange={setD("dateFormat")} options={[
            { value: "mm/dd/yyyy", label: "MM/DD/YYYY" },
            { value: "dd/mm/yyyy", label: "DD/MM/YYYY" },
            { value: "yyyy-mm-dd", label: "YYYY-MM-DD" },
            { value: "mon-yyyy", label: "Jan 2025" },
          ]} />
        </Row>
      </Section>

      {/* ── Privacy ──────────────────────────────────── */}
      <Section icon={Shield} iconColor="#06b6d4" iconBg="#cffafe" title="Privacy & Data" desc="Control your data and visibility settings">
        <Row label="Analytics tracking" desc="Help us improve by sharing anonymous usage data">
          <Toggle value={privacy.analyticsTracking} onChange={setP("analyticsTracking")} />
        </Row>
        <Row label="Personalized recommendations" desc="Use my data to personalize job and resume suggestions">
          <Toggle value={privacy.personalizedAds} onChange={setP("personalizedAds")} />
        </Row>
        <Row label="Share data with partners" desc="Allow trusted partners to access anonymized data">
          <Toggle value={privacy.dataSharing} onChange={setP("dataSharing")} />
        </Row>
        <Row label="Public profile" desc="Allow recruiters to discover your profile" last>
          <Toggle value={privacy.publicProfile} onChange={setP("publicProfile")} />
        </Row>
      </Section>

      {/* ── Data & Account ───────────────────────────── */}
      <Section icon={Download} iconColor="#8b5cf6" iconBg="#f3f4ff" title="Data & Account" desc="Manage your data and account lifecycle">
        <Row label="Export all data" desc="Download a copy of all your resumes and account data">
          <button
            type="button"
            onClick={() => toast("Export started – you'll receive an email shortly.", "info")}
            style={{
              padding: "7px 14px", borderRadius: 9, fontSize: 13, fontWeight: 500,
              color: "#6366f1", background: "#ede9fe", border: "1px solid #c7d2fe",
              cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
            }}
          >
            <Download size={13} /> Export
          </button>
        </Row>
        <Row label="Clear resume cache" desc="Remove temporarily stored resume data">
          <button
            type="button"
            onClick={() => toast("Cache cleared.", "success")}
            style={{
              padding: "7px 14px", borderRadius: 9, fontSize: 13, fontWeight: 500,
              color: "#64748b", background: "#f1f5f9", border: "1px solid #e2e8f0",
              cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
            }}
          >
            <RefreshCw size={13} /> Clear Cache
          </button>
        </Row>
        <Row label="Delete all resumes" desc="Permanently delete all your saved resumes" last>
          <DangerBtn onClick={() => { if (window.confirm("Delete all resumes? This cannot be undone.")) toast("All resumes deleted.", "success"); }}>
            <Trash2 size={13} /> Delete All
          </DangerBtn>
        </Row>
      </Section>

      {/* ── Danger Zone ──────────────────────────────── */}
      <div style={{
        background: "var(--c-card)", border: "1.5px solid #fecaca", borderRadius: 18,
        overflow: "hidden", marginBottom: 28, boxShadow: "0 2px 8px rgba(239,68,68,0.06)",
      }}>
        <div style={{ padding: "18px 24px 14px", borderBottom: "1px solid #fef2f2", display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 40, height: 40, borderRadius: 11, background: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <AlertTriangle size={18} color="#ef4444" />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#ef4444" }}>Danger Zone</div>
            <div style={{ fontSize: 13, color: "var(--c-mutedTxt)", marginTop: 2 }}>Irreversible actions — proceed with caution</div>
          </div>
        </div>
        <Row label="Delete Account" desc="Permanently remove your account and all associated data" last>
          <DangerBtn onClick={handleDeleteAccount}>
            <Trash2 size={13} /> Delete Account
          </DangerBtn>
        </Row>
      </div>

      {/* ── Save Bar ─────────────────────────────────── */}
      <div style={{
        position: "sticky", bottom: 24, display: "flex", justifyContent: "flex-end",
        alignItems: "center", gap: 12,
      }}>
        {saved && (
          <div style={{
            display: "flex", alignItems: "center", gap: 7,
            background: "#d1fae5", color: "#059669", border: "1px solid #a7f3d0",
            borderRadius: 10, padding: "9px 16px", fontSize: 13, fontWeight: 500,
          }}>
            <CheckCircle size={15} /> Settings saved!
          </div>
        )}
        <button
          onClick={handleSave}
          style={{
            padding: "10px 24px", borderRadius: 12, fontSize: 14, fontWeight: 600,
            color: "#fff", background: "linear-gradient(135deg,#6366f1,#4f46e5)",
            border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
            boxShadow: "0 4px 14px rgba(99,102,241,0.35)",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
        >
          <CheckCircle size={15} /> {saving ? "Saving..." : "Save All Settings"}
        </button>
      </div>
    </div>
  );
}

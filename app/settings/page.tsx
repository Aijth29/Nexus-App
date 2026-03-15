"use client";

import { useState, useRef } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Section = "profile" | "password" | "notifications" | "appearance" | "workspace" | "danger";

interface NavItem {
  id: Section;
  label: string;
  icon: string;
  danger?: boolean;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const NAV_ITEMS: NavItem[] = [
  { id: "profile",       label: "Profile",                icon: "👤" },
  { id: "password",      label: "Password & Security",    icon: "🔒" },
  { id: "notifications", label: "Notifications",          icon: "🔔" },
  { id: "appearance",    label: "Appearance",             icon: "🎨" },
  { id: "workspace",     label: "Workspace",              icon: "🏢" },
  { id: "danger",        label: "Danger Zone",            icon: "⚠️", danger: true },
];

const NOTIF_SETTINGS = [
  { id: "task_assigned",  label: "Task assigned to you",    desc: "When someone assigns you a task",         enabled: true  },
  { id: "task_completed", label: "Task completed",          desc: "When a task you created is completed",    enabled: true  },
  { id: "comment",        label: "Comments on your tasks",  desc: "When someone comments on your task",      enabled: true  },
  { id: "due_date",       label: "Due date reminders",      desc: "24 hours before a task is due",           enabled: false },
  { id: "project_update", label: "Project updates",         desc: "When a project milestone is reached",     enabled: true  },
  { id: "team_joined",    label: "Team member joined",      desc: "When someone joins your workspace",       enabled: false },
];

const THEMES = [
  { id: "light",  label: "Light",  preview: ["#fff", "#f8f6ff", "#6c5ce7"] },
  { id: "dark",   label: "Dark",   preview: ["#1a1040", "#2d1b69", "#a78bfa"] },
  { id: "system", label: "System", preview: ["#f0f0f0", "#e0e0e0", "#6c5ce7"] },
];

const ACCENT_COLORS = [
  { id: "purple", color: "#6c5ce7", label: "Purple" },
  { id: "pink",   color: "#e84393", label: "Pink"   },
  { id: "cyan",   color: "#0099cc", label: "Cyan"   },
  { id: "green",  color: "#00b894", label: "Green"  },
  { id: "orange", color: "#e17055", label: "Orange" },
];

// ─── Toggle ───────────────────────────────────────────────────────────────────

const Toggle = ({ enabled, onChange }: { enabled: boolean; onChange: () => void }) => (
  <div
    onClick={onChange}
    style={{
      width: 42, height: 24, borderRadius: 100, cursor: "pointer",
      background: enabled ? "linear-gradient(135deg,#6c5ce7,#e84393)" : "#e0e0e0",
      position: "relative", transition: "background .25s", flexShrink: 0,
    }}
  >
    <div style={{
      position: "absolute", top: 3, left: enabled ? 21 : 3,
      width: 18, height: 18, borderRadius: "50%", background: "#fff",
      boxShadow: "0 1px 4px rgba(0,0,0,0.2)", transition: "left .25s",
    }} />
  </div>
);

// ─── Section Card ─────────────────────────────────────────────────────────────

const Card = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <div style={{ background: "#fff", borderRadius: 18, padding: "1.5rem", boxShadow: "0 2px 12px rgba(0,0,0,0.04)", border: "1.5px solid rgba(108,92,231,0.07)", marginBottom: "1rem", ...style }}>
    {children}
  </div>
);

const SectionTitle = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <div style={{ marginBottom: "1.25rem" }}>
    <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 800, color: "#0a0814" }}>{title}</div>
    {subtitle && <div style={{ fontSize: 12, color: "#aaa", marginTop: 3, fontWeight: 300 }}>{subtitle}</div>}
  </div>
);

const InputField = ({ label, value, onChange, type = "text", placeholder }: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string;
}) => (
  <div style={{ marginBottom: "1rem" }}>
    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#6b6b8a", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{ width: "100%", padding: "10px 14px", border: "1.5px solid rgba(108,92,231,0.15)", borderRadius: 10, fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: "none", background: "#fafbff", color: "#0a0814", transition: "border-color .2s" }}
      onFocus={(e) => (e.target.style.borderColor = "#6c5ce7")}
      onBlur={(e)  => (e.target.style.borderColor = "rgba(108,92,231,0.15)")}
    />
  </div>
);

const SaveBtn = ({ onClick, loading }: { onClick: () => void; loading?: boolean }) => (
  <button
    onClick={onClick}
    style={{ padding: "10px 24px", background: "linear-gradient(135deg,#6c5ce7,#e84393)", color: "#fff", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", boxShadow: "0 4px 14px rgba(108,92,231,0.3)", transition: "all .2s" }}
    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)"; }}
    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"; }}
  >
    {loading ? "Saving..." : "Save Changes"}
  </button>
);

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<Section>("profile");
  const [saved, setSaved]                 = useState(false);

  // Profile state
  const [name, setName]         = useState("Ajith M.");
  const [email, setEmail]       = useState("ajith@nexus.app");
  const [bio, setBio]           = useState("Building Nexus — the all-in-one workspace for modern teams.");
  const [role, setRole]         = useState("Owner");
  const [avatarUrl, setAvatarUrl] = useState("");
  const fileRef                 = useRef<HTMLInputElement>(null);

  // Password state
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw]         = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwError, setPwError]     = useState("");

  // Notifications state
  const [notifSettings, setNotifSettings] = useState(NOTIF_SETTINGS);
  const [emailNotifs, setEmailNotifs]     = useState(true);
  const [pushNotifs, setPushNotifs]       = useState(false);

  // Appearance state
  const [theme, setTheme]       = useState("light");
  const [accent, setAccent]     = useState("purple");
  const [compact, setCompact]   = useState(false);
  const [animations, setAnimations] = useState(true);

  // Workspace state
  const [wsName, setWsName]   = useState("Nexus App");
  const [wsUrl, setWsUrl]     = useState("nexus-app");
  const [wsDesc, setWsDesc]   = useState("Building the future of team collaboration.");

  const showSaved = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const handleSaveProfile = () => showSaved();

  const handleSavePassword = () => {
    if (!currentPw || !newPw || !confirmPw) { setPwError("Please fill in all fields."); return; }
    if (newPw !== confirmPw) { setPwError("New passwords do not match."); return; }
    if (newPw.length < 8)    { setPwError("Password must be at least 8 characters."); return; }
    setPwError("");
    showSaved();
    setCurrentPw(""); setNewPw(""); setConfirmPw("");
  };

  const toggleNotif = (id: string) =>
    setNotifSettings((prev) => prev.map((n) => n.id === id ? { ...n, enabled: !n.enabled } : n));

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setAvatarUrl(URL.createObjectURL(file));
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; background: #f8f6ff; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(108,92,231,0.2); border-radius: 4px; }
        textarea { resize: vertical; }
      `}</style>

      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", minHeight: "100vh" }}>

        {/* ── App Sidebar ─────────────────────────────────────────────────── */}
        <div style={{ background: "linear-gradient(180deg,#6c5ce7 0%,#e84393 60%,#0099cc 100%)", padding: "1.5rem 1rem", display: "flex", flexDirection: "column", gap: 4, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -60, right: -60, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: "1.5rem", padding: "0 0.5rem", position: "relative", zIndex: 1 }}>Nexus</div>
          {[
            { icon: "🏠", label: "Home",      href: "/"          },
            { icon: "☰",  label: "Tasks",     href: "/dashboard" },
            { icon: "💬", label: "Chat",      href: "/chat"      },
            { icon: "📊", label: "Analytics", href: "/analytics" },
          ].map(({ icon, label, href }) => (
            <a key={label} href={href} style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 10, fontSize: 13, color: "rgba(255,255,255,0.7)", cursor: "pointer", position: "relative", zIndex: 1 }}>
              <span>{icon}</span>{label}
            </a>
          ))}
          <div style={{ marginTop: "auto", padding: "10px 12px", borderRadius: 10, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", gap: 8, position: "relative", zIndex: 1 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: avatarUrl ? "transparent" : "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, color: "#fff", border: "2px solid rgba(255,255,255,0.3)", overflow: "hidden" }}>
              {avatarUrl ? <img src={avatarUrl} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : "AJ"}
            </div>
            <div><div style={{ fontSize: 12, fontWeight: 500, color: "#fff" }}>{name}</div><div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)" }}>⚙️ Settings</div></div>
          </div>
        </div>

        {/* ── Main ────────────────────────────────────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", background: "#f8f6ff", overflow: "hidden" }}>

          {/* Settings sidebar nav */}
          <div style={{ background: "#fff", borderRight: "1px solid rgba(108,92,231,0.07)", padding: "1.5rem 0.75rem", display: "flex", flexDirection: "column", gap: 2 }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 800, color: "#0a0814", padding: "0 0.75rem", marginBottom: "1rem" }}>Settings</div>
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                style={{
                  display: "flex", alignItems: "center", gap: 9, padding: "9px 12px",
                  borderRadius: 10, fontSize: 13, cursor: "pointer", border: "none",
                  fontFamily: "'DM Sans', sans-serif", textAlign: "left", transition: "all .15s",
                  background: activeSection === item.id
                    ? item.danger ? "linear-gradient(135deg,#fff0eb,#ffeaf5)" : "linear-gradient(135deg,#f0eeff,#ffeaf5)"
                    : "transparent",
                  color: activeSection === item.id
                    ? item.danger ? "#e17055" : "#6c5ce7"
                    : item.danger ? "#e17055" : "#6b6b8a",
                  fontWeight: activeSection === item.id ? 600 : 400,
                  borderLeft: activeSection === item.id ? `3px solid ${item.danger ? "#e17055" : "#6c5ce7"}` : "3px solid transparent",
                }}
              >
                <span style={{ fontSize: 15 }}>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>

          {/* Settings content */}
          <div style={{ overflowY: "auto", padding: "1.5rem" }}>

            {/* Saved toast */}
            {saved && (
              <div style={{ position: "fixed", top: 20, right: 20, background: "linear-gradient(135deg,#6c5ce7,#e84393)", color: "#fff", padding: "10px 20px", borderRadius: 12, fontSize: 13, fontWeight: 600, boxShadow: "0 8px 24px rgba(108,92,231,0.3)", zIndex: 999, animation: "fadeUp .3s ease" }}>
                ✅ Changes saved!
              </div>
            )}

            {/* ── PROFILE ── */}
            {activeSection === "profile" && (
              <>
                <Card>
                  <SectionTitle title="Profile Information" subtitle="Update your personal details and public profile" />

                  {/* Avatar */}
                  <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: "1.5rem" }}>
                    <div style={{ position: "relative" }}>
                      <div style={{ width: 72, height: 72, borderRadius: "50%", background: avatarUrl ? "transparent" : "linear-gradient(135deg,#6c5ce7,#e84393)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 800, color: "#fff", overflow: "hidden", border: "3px solid rgba(108,92,231,0.2)" }}>
                        {avatarUrl ? <img src={avatarUrl} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : "AJ"}
                      </div>
                      <button
                        onClick={() => fileRef.current?.click()}
                        style={{ position: "absolute", bottom: 0, right: 0, width: 24, height: 24, borderRadius: "50%", background: "#6c5ce7", border: "2px solid #fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#fff" }}
                      >✏️</button>
                    </div>
                    <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleAvatarChange} />
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "#0a0814" }}>{name}</div>
                      <div style={{ fontSize: 12, color: "#aaa", marginBottom: 8 }}>{email}</div>
                      <button onClick={() => fileRef.current?.click()} style={{ fontSize: 12, color: "#6c5ce7", background: "#f0eeff", border: "1.5px solid rgba(108,92,231,0.15)", borderRadius: 8, padding: "5px 12px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>
                        Upload photo
                      </button>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <InputField label="Full Name"   value={name}  onChange={setName}  placeholder="Your name" />
                    <InputField label="Role"        value={role}  onChange={setRole}  placeholder="e.g. Designer" />
                  </div>
                  <InputField label="Email Address" value={email} onChange={setEmail} type="email" placeholder="you@company.com" />
                  <div style={{ marginBottom: "1rem" }}>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#6b6b8a", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Bio</label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={3}
                      placeholder="Tell your team a bit about yourself..."
                      style={{ width: "100%", padding: "10px 14px", border: "1.5px solid rgba(108,92,231,0.15)", borderRadius: 10, fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: "none", background: "#fafbff", color: "#0a0814" }}
                    />
                  </div>
                  <SaveBtn onClick={handleSaveProfile} />
                </Card>
              </>
            )}

            {/* ── PASSWORD ── */}
            {activeSection === "password" && (
              <Card>
                <SectionTitle title="Password & Security" subtitle="Keep your account secure with a strong password" />
                <InputField label="Current Password" value={currentPw} onChange={setCurrentPw} type="password" placeholder="••••••••" />
                <InputField label="New Password"     value={newPw}     onChange={setNewPw}     type="password" placeholder="Min. 8 characters" />
                <InputField label="Confirm Password" value={confirmPw} onChange={setConfirmPw} type="password" placeholder="Repeat new password" />
                {pwError && <div style={{ fontSize: 12, color: "#e84393", background: "#ffeaf5", padding: "8px 12px", borderRadius: 8, marginBottom: "1rem" }}>⚠️ {pwError}</div>}

                {/* Password strength */}
                {newPw.length > 0 && (
                  <div style={{ marginBottom: "1rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 11, color: "#aaa" }}>Password strength</span>
                      <span style={{ fontSize: 11, fontWeight: 600, color: newPw.length < 6 ? "#e84393" : newPw.length < 10 ? "#e17055" : "#00b894" }}>
                        {newPw.length < 6 ? "Weak" : newPw.length < 10 ? "Medium" : "Strong"}
                      </span>
                    </div>
                    <div style={{ background: "#f0eeff", borderRadius: 4, height: 5, overflow: "hidden" }}>
                      <div style={{ height: "100%", borderRadius: 4, transition: "width .3s", width: `${Math.min((newPw.length / 14) * 100, 100)}%`, background: newPw.length < 6 ? "#e84393" : newPw.length < 10 ? "#e17055" : "#00b894" }} />
                    </div>
                  </div>
                )}

                <SaveBtn onClick={handleSavePassword} />

                {/* 2FA section */}
                <div style={{ marginTop: "1.5rem", paddingTop: "1.5rem", borderTop: "1px solid rgba(108,92,231,0.07)" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "#0a0814" }}>Two-Factor Authentication</div>
                      <div style={{ fontSize: 12, color: "#aaa", marginTop: 2 }}>Add an extra layer of security to your account</div>
                    </div>
                    <button style={{ padding: "8px 16px", borderRadius: 8, background: "#f0eeff", color: "#6c5ce7", border: "1.5px solid rgba(108,92,231,0.2)", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                      Enable 2FA
                    </button>
                  </div>
                </div>
              </Card>
            )}

            {/* ── NOTIFICATIONS ── */}
            {activeSection === "notifications" && (
              <>
                <Card>
                  <SectionTitle title="Notification Preferences" subtitle="Choose what you want to be notified about" />
                  {/* Global toggles */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: "1.5rem" }}>
                    {[
                      { label: "📧 Email Notifications", desc: "Receive notifications via email", val: emailNotifs, set: () => setEmailNotifs(!emailNotifs) },
                      { label: "📱 Push Notifications",  desc: "Browser push notifications",       val: pushNotifs,  set: () => setPushNotifs(!pushNotifs)  },
                    ].map(({ label, desc, val, set }) => (
                      <div key={label} style={{ background: "#f8f6ff", borderRadius: 12, padding: "12px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", border: "1.5px solid rgba(108,92,231,0.08)" }}>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 500, color: "#0a0814" }}>{label}</div>
                          <div style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>{desc}</div>
                        </div>
                        <Toggle enabled={val} onChange={set} />
                      </div>
                    ))}
                  </div>

                  {/* Per-type toggles */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                    {notifSettings.map((n, i) => (
                      <div key={n.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: i < notifSettings.length - 1 ? "1px solid rgba(108,92,231,0.05)" : "none" }}>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 500, color: "#0a0814" }}>{n.label}</div>
                          <div style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>{n.desc}</div>
                        </div>
                        <Toggle enabled={n.enabled} onChange={() => toggleNotif(n.id)} />
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: "1.25rem" }}><SaveBtn onClick={showSaved} /></div>
                </Card>
              </>
            )}

            {/* ── APPEARANCE ── */}
            {activeSection === "appearance" && (
              <>
                <Card>
                  <SectionTitle title="Theme" subtitle="Choose your preferred color scheme" />
                  <div style={{ display: "flex", gap: 10 }}>
                    {THEMES.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setTheme(t.id)}
                        style={{ flex: 1, padding: "12px", borderRadius: 12, border: theme === t.id ? "2px solid #6c5ce7" : "2px solid rgba(108,92,231,0.1)", background: theme === t.id ? "#f0eeff" : "#fafbff", cursor: "pointer", transition: "all .2s" }}
                      >
                        <div style={{ display: "flex", gap: 4, marginBottom: 8, justifyContent: "center" }}>
                          {t.preview.map((c, i) => (
                            <div key={i} style={{ width: 16, height: 16, borderRadius: 4, background: c, border: "1px solid rgba(0,0,0,0.08)" }} />
                          ))}
                        </div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: theme === t.id ? "#6c5ce7" : "#6b6b8a" }}>{t.label}</div>
                      </button>
                    ))}
                  </div>
                </Card>

                <Card>
                  <SectionTitle title="Accent Color" subtitle="Pick your primary accent color" />
                  <div style={{ display: "flex", gap: 10 }}>
                    {ACCENT_COLORS.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => setAccent(c.id)}
                        style={{ flex: 1, padding: "10px 6px", borderRadius: 10, border: accent === c.id ? `2px solid ${c.color}` : "2px solid rgba(108,92,231,0.1)", background: accent === c.id ? `${c.color}15` : "#fafbff", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, transition: "all .2s" }}
                      >
                        <div style={{ width: 24, height: 24, borderRadius: "50%", background: c.color, boxShadow: accent === c.id ? `0 4px 12px ${c.color}44` : "none", transition: "box-shadow .2s" }} />
                        <span style={{ fontSize: 11, fontWeight: 600, color: accent === c.id ? c.color : "#aaa" }}>{c.label}</span>
                      </button>
                    ))}
                  </div>
                </Card>

                <Card>
                  <SectionTitle title="Display Options" />
                  {[
                    { label: "Compact mode",   desc: "Reduce spacing for a denser layout",  val: compact,    set: () => setCompact(!compact)       },
                    { label: "Animations",     desc: "Enable smooth transitions & effects",  val: animations, set: () => setAnimations(!animations) },
                  ].map(({ label, desc, val, set }) => (
                    <div key={label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid rgba(108,92,231,0.05)" }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500, color: "#0a0814" }}>{label}</div>
                        <div style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>{desc}</div>
                      </div>
                      <Toggle enabled={val} onChange={set} />
                    </div>
                  ))}
                  <div style={{ marginTop: "1.25rem" }}><SaveBtn onClick={showSaved} /></div>
                </Card>
              </>
            )}

            {/* ── WORKSPACE ── */}
            {activeSection === "workspace" && (
              <Card>
                <SectionTitle title="Workspace Settings" subtitle="Manage your workspace details and preferences" />

                {/* Workspace avatar */}
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: "1.5rem" }}>
                  <div style={{ width: 56, height: 56, borderRadius: 14, background: "linear-gradient(135deg,#6c5ce7,#e84393)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🚀</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#0a0814" }}>{wsName}</div>
                    <div style={{ fontSize: 12, color: "#aaa" }}>nexus-app.vercel.app</div>
                  </div>
                </div>

                <InputField label="Workspace Name" value={wsName} onChange={setWsName} placeholder="My Team" />
                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#6b6b8a", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Workspace URL</label>
                  <div style={{ display: "flex", alignItems: "center", border: "1.5px solid rgba(108,92,231,0.15)", borderRadius: 10, overflow: "hidden", background: "#fafbff" }}>
                    <span style={{ padding: "10px 12px", fontSize: 13, color: "#aaa", background: "#f0eeff", borderRight: "1px solid rgba(108,92,231,0.1)", whiteSpace: "nowrap" }}>nexus.app/</span>
                    <input value={wsUrl} onChange={(e) => setWsUrl(e.target.value)} style={{ flex: 1, padding: "10px 14px", border: "none", outline: "none", fontSize: 13, background: "transparent", fontFamily: "'DM Sans', sans-serif" }} />
                  </div>
                </div>
                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#6b6b8a", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Description</label>
                  <textarea value={wsDesc} onChange={(e) => setWsDesc(e.target.value)} rows={3} style={{ width: "100%", padding: "10px 14px", border: "1.5px solid rgba(108,92,231,0.15)", borderRadius: 10, fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: "none", background: "#fafbff" }} />
                </div>

                {/* Plan */}
                <div style={{ background: "linear-gradient(135deg,#f0eeff,#ffeaf5)", borderRadius: 12, padding: "14px 16px", marginBottom: "1.25rem", border: "1.5px solid rgba(108,92,231,0.12)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#6c5ce7" }}>🎉 Free Plan</div>
                    <div style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>Up to 5 members · 3 projects</div>
                  </div>
                  <button style={{ padding: "7px 16px", background: "linear-gradient(135deg,#6c5ce7,#e84393)", color: "#fff", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                    Upgrade to Pro ✨
                  </button>
                </div>
                <SaveBtn onClick={showSaved} />
              </Card>
            )}

            {/* ── DANGER ZONE ── */}
            {activeSection === "danger" && (
              <>
                <Card style={{ border: "1.5px solid rgba(225,112,85,0.2)" }}>
                  <SectionTitle title="⚠️ Danger Zone" subtitle="These actions are permanent and cannot be undone" />
                  {[
                    { title: "Export your data",    desc: "Download all your tasks, messages and documents",    btn: "Export",         btnColor: "#0099cc", btnBg: "#e0f5ff" },
                    { title: "Leave workspace",     desc: "You will lose access to all workspace data",         btn: "Leave",          btnColor: "#e17055", btnBg: "#fff0eb" },
                    { title: "Delete account",      desc: "Permanently delete your account and all data",       btn: "Delete Account", btnColor: "#e84393", btnBg: "#ffeaf5" },
                  ].map(({ title, desc, btn, btnColor, btnBg }) => (
                    <div key={title} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: "1px solid rgba(225,112,85,0.08)" }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#0a0814" }}>{title}</div>
                        <div style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>{desc}</div>
                      </div>
                      <button style={{ padding: "7px 16px", background: btnBg, color: btnColor, border: `1.5px solid ${btnColor}33`, borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap" }}>
                        {btn}
                      </button>
                    </div>
                  ))}
                </Card>
              </>
            )}

          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}

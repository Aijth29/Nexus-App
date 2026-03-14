"use client";

import { useState, useEffect } from "react";

type Role = "Owner" | "Admin" | "Member" | "Viewer";

interface Member {
  initials: string;
  name: string;
  email: string;
  role: Role;
  isYou?: boolean;
}

export default function WorkspacePage() {
  const [step, setStep] = useState(2);
  const [selectedPlan, setSelectedPlan] = useState("Pro");
  const [members, setMembers] = useState<Member[]>([
    { initials: "JD", name: "John Doe", email: "john@company.com", role: "Owner", isYou: true },
    { initials: "SR", name: "Sarah R.", email: "sarah@company.com", role: "Admin" },
    { initials: "JM", name: "James M.", email: "james@company.com", role: "Member" },
  ]);
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState<Role>("Member");

  const addMember = () => {
    if (!newEmail) return;
    setMembers([...members, {
      initials: "NM",
      name: "New Member",
      email: newEmail,
      role: newRole,
    }]);
    setNewEmail("");
  };

  const removeMember = (index: number) => {
    setMembers(members.filter((_, i) => i !== index));
  };

  const goStep = (s: number) => setStep(s);

  const stepTitles: Record<number, [string, string]> = {
    2: ["Setup your workspace", "Tell us about your organization so we can set things up perfectly."],
    3: ["Invite your team", "Add members and assign their roles."],
    4: ["Workspace ready!", "Everything is set up and good to go."],
  };

  const roleStyles: Record<Role, string> = {
    Owner: "rgba(108,92,231,0.2);color:#a89cf7;border:1px solid rgba(108,92,231,0.3)",
    Admin: "rgba(0,153,204,0.15);color:#5bc8f5;border:1px solid rgba(0,153,204,0.3)",
    Member: "rgba(0,184,148,0.15);color:#00e5a0;border:1px solid rgba(0,184,148,0.3)",
    Viewer: "rgba(225,112,85,0.15);color:#ff9f80;border:1px solid rgba(225,112,85,0.3)",
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", position: "relative", overflow: "hidden", background: "#020817" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        :root { --purple: #6c5ce7; --pink: #e84393; --cyan: #0099cc; --green: #00b894; }

        .space-bg { position: fixed; inset: 0; z-index: 0; overflow: hidden; }
        .space-bg::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse at 20% 50%, rgba(108,92,231,0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(232,67,147,0.1) 0%, transparent 50%), radial-gradient(ellipse at 60% 80%, rgba(0,153,204,0.1) 0%, transparent 50%); }

        .star { position: absolute; border-radius: 50%; background: #fff; animation: twinkle var(--d) ease-in-out infinite; }
        @keyframes twinkle { 0%, 100% { opacity: var(--min-o); transform: scale(1); } 50% { opacity: 1; transform: scale(1.2); } }

        .page { width: 100%; max-width: 960px; position: relative; z-index: 1; font-family: 'DM Sans', sans-serif; }

        /* STEPS */
        .steps { display: flex; align-items: center; justify-content: center; margin-bottom: 2rem; }
        .step { display: flex; align-items: center; gap: 10px; }
        .step-num { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 600; transition: all .3s; }
        .step-num-done { background: linear-gradient(135deg, var(--purple), var(--pink)); color: #fff; }
        .step-num-active { background: linear-gradient(135deg, var(--purple), var(--pink)); color: #fff; box-shadow: 0 4px 14px rgba(108,92,231,0.5); }
        .step-num-inactive { background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.3); border: 1px solid rgba(255,255,255,0.1); }
        .step-label { font-size: 13px; font-weight: 500; }
        .step-label-active { color: rgba(255,255,255,0.9); }
        .step-label-inactive { color: rgba(255,255,255,0.4); }
        .step-line { width: 60px; height: 1px; margin: 0 8px; }
        .step-line-done { background: linear-gradient(90deg, var(--purple), var(--pink)); }
        .step-line-inactive { background: rgba(255,255,255,0.1); }

        /* CARD */
        .card { background: rgba(255,255,255,0.04); backdrop-filter: blur(20px); border-radius: 20px; border: 1px solid rgba(255,255,255,0.08); box-shadow: 0 24px 64px rgba(0,0,0,0.4); overflow: hidden; }
        .card-header { background: linear-gradient(135deg, rgba(108,92,231,0.8), rgba(232,67,147,0.7) 60%, rgba(0,153,204,0.6)); padding: 2rem 2.5rem; position: relative; overflow: hidden; }
        .card-header::before { content: ''; position: absolute; top: -60px; right: -60px; width: 200px; height: 200px; border-radius: 50%; background: rgba(255,255,255,0.07); }
        .card-header h1 { font-family: 'Syne', sans-serif; font-size: 26px; font-weight: 800; color: #fff; position: relative; z-index: 1; }
        .card-header p { font-size: 14px; color: rgba(255,255,255,0.75); margin-top: 6px; font-weight: 300; position: relative; z-index: 1; }
        .card-body { padding: 2.5rem; }

        /* SECTION */
        .section-title { font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 1.25rem; display: flex; align-items: center; gap: 8px; }
        .section-badge { font-size: 10px; background: rgba(108,92,231,0.2); color: #a89cf7; padding: 3px 10px; border-radius: 100px; font-weight: 600; letter-spacing: .5px; border: 1px solid rgba(108,92,231,0.3); }

        /* FORM */
        .ws-row { display: grid; grid-template-columns: 80px 1fr; gap: 1.25rem; align-items: start; margin-bottom: 1.5rem; }
        .ws-avatar { width: 80px; height: 80px; border-radius: 16px; background: linear-gradient(135deg, #6c5ce7, #e84393); display: flex; align-items: center; justify-content: center; font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 800; color: #fff; cursor: pointer; position: relative; overflow: hidden; border: 2px solid rgba(255,255,255,0.1); }
        .ws-avatar-edit { position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.6); font-size: 10px; color: #fff; text-align: center; padding: 4px; }
        .fg { margin-bottom: 1rem; }
        .fl { display: block; font-size: 12px; font-weight: 500; color: rgba(255,255,255,0.5); margin-bottom: 5px; }
        .fi { width: 100%; padding: 11px 14px; border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; font-size: 14px; font-family: 'DM Sans', sans-serif; color: #fff; background: rgba(255,255,255,0.06); outline: none; transition: border-color .2s; }
        .fi:focus { border-color: rgba(108,92,231,0.6); background: rgba(255,255,255,0.08); box-shadow: 0 0 0 3px rgba(108,92,231,0.15); }
        .fi::placeholder { color: rgba(255,255,255,0.2); }
        .fi-hint { font-size: 11px; color: rgba(255,255,255,0.3); margin-top: 4px; font-weight: 300; }
        select.fi option { background: #1a1a2e; color: #fff; }
        .frow { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }

        /* PLAN */
        .plan-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1.5rem; }
        .plan-card { border: 1px solid rgba(255,255,255,0.1); border-radius: 14px; padding: 1.25rem; cursor: pointer; transition: all .2s; position: relative; background: rgba(255,255,255,0.03); }
        .plan-card:hover { border-color: rgba(108,92,231,0.4); background: rgba(108,92,231,0.08); }
        .plan-card-selected { border-color: var(--purple) !important; background: rgba(108,92,231,0.12) !important; box-shadow: 0 0 20px rgba(108,92,231,0.2); }
        .plan-popular { position: absolute; top: -10px; left: 50%; transform: translateX(-50%); background: linear-gradient(135deg, var(--purple), var(--pink)); color: #fff; font-size: 10px; padding: 3px 12px; border-radius: 100px; font-weight: 600; white-space: nowrap; }
        .plan-name { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700; color: #fff; margin-bottom: 4px; }
        .plan-price { font-size: 20px; font-weight: 700; color: #a89cf7; margin-bottom: 8px; }
        .plan-price span { font-size: 12px; font-weight: 400; color: rgba(255,255,255,0.4); }
        .plan-feat { font-size: 12px; color: rgba(255,255,255,0.4); line-height: 1.6; font-weight: 300; }

        /* DIVIDER */
        .divider { height: 1px; background: rgba(255,255,255,0.07); margin: 1.5rem 0; }

        /* INVITE */
        .invite-row { display: grid; grid-template-columns: 1fr auto auto; gap: 10px; align-items: center; margin-bottom: 1rem; }
        .role-select { padding: 10px 14px; border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; font-size: 13px; font-family: 'DM Sans', sans-serif; color: #fff; background: rgba(255,255,255,0.06); outline: none; cursor: pointer; min-width: 120px; }
        .role-select option { background: #1a1a2e; }
        .invite-btn { padding: 10px 16px; background: rgba(108,92,231,0.2); color: #a89cf7; border: 1px solid rgba(108,92,231,0.3); border-radius: 10px; font-size: 13px; font-weight: 500; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all .2s; white-space: nowrap; }
        .invite-btn:hover { background: var(--purple); color: #fff; border-color: var(--purple); }

        /* MEMBERS */
        .member-row { display: flex; align-items: center; gap: 12px; padding: 10px 14px; background: rgba(255,255,255,0.04); border-radius: 10px; border: 1px solid rgba(255,255,255,0.07); margin-bottom: 10px; }
        .member-av { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 600; flex-shrink: 0; }
        .member-info { flex: 1; }
        .member-name { font-size: 13px; font-weight: 500; color: #fff; }
        .member-email { font-size: 11px; color: rgba(255,255,255,0.4); font-weight: 300; }
        .member-role { font-size: 11px; padding: 3px 10px; border-radius: 100px; font-weight: 600; }
        .member-remove { font-size: 16px; color: rgba(255,255,255,0.2); cursor: pointer; background: none; border: none; padding: 0 4px; line-height: 1; }
        .member-remove:hover { color: #e84393; }

        /* ROLES GRID */
        .roles-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 1.5rem; }
        .role-card { border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 1rem; background: rgba(255,255,255,0.03); }
        .role-card-desc { font-size: 12px; color: rgba(255,255,255,0.4); line-height: 1.6; font-weight: 300; margin-top: 6px; }

        /* ACTIONS */
        .actions { display: flex; justify-content: space-between; align-items: center; margin-top: 1.5rem; }
        .btn-back { padding: 12px 24px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; font-size: 14px; font-weight: 500; cursor: pointer; font-family: 'DM Sans', sans-serif; color: rgba(255,255,255,0.5); transition: all .2s; }
        .btn-back:hover { border-color: rgba(108,92,231,0.5); color: #a89cf7; }
        .btn-next { padding: 12px 28px; background: linear-gradient(135deg, var(--purple), var(--pink)); color: #fff; border: none; border-radius: 10px; font-size: 14px; font-weight: 500; cursor: pointer; font-family: 'DM Sans', sans-serif; box-shadow: 0 4px 20px rgba(108,92,231,0.4); transition: opacity .2s; display: flex; align-items: center; gap: 8px; }
        .btn-next:hover { opacity: .88; }
      `}</style>

      {/* SPACE BACKGROUND */}
      <div className="space-bg">
        <Stars />
      </div>

      <div className="page">

        {/* STEPS */}
        <div className="steps">
          {[1, 2, 3, 4].map((s, i) => (
            <div key={s} style={{ display: "flex", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div className={`step-num ${s < step ? "step-num-done" : s === step ? "step-num-active" : "step-num-inactive"}`}>
                  {s < step ? "✓" : s}
                </div>
                <div className={`step-label ${s <= step ? "step-label-active" : "step-label-inactive"}`}>
                  {["Create account", "Setup workspace", "Invite team", "You're ready!"][i]}
                </div>
              </div>
              {s < 4 && <div className={`step-line ${s < step ? "step-line-done" : "step-line-inactive"}`} style={{ width: 60, margin: "0 8px" }} />}
            </div>
          ))}
        </div>

        <div className="card">
          <div className="card-header">
            <h1>{stepTitles[step][0]}</h1>
            <p>{stepTitles[step][1]}</p>
          </div>
          <div className="card-body">

            {/* STEP 2 — Workspace Setup */}
            {step === 2 && (
              <>
                <div className="section-title">Workspace details <span className="section-badge">STEP 2</span></div>
                <div className="ws-row">
                  <div className="ws-avatar">N<div className="ws-avatar-edit">Edit</div></div>
                  <div>
                    <div className="fg">
                      <label className="fl">Workspace name</label>
                      <input type="text" className="fi" placeholder="e.g. Acme Inc" defaultValue="My Team" />
                      <div className="fi-hint">This is how your team will identify the workspace</div>
                    </div>
                    <div className="fg">
                      <label className="fl">Workspace URL</label>
                      <input type="text" className="fi" placeholder="my-team" defaultValue="my-team" />
                      <div className="fi-hint">nexus.io/my-team</div>
                    </div>
                  </div>
                </div>
                <div className="fg">
                  <label className="fl">Industry</label>
                  <select className="fi" style={{ padding: "11px 14px" }}>
                    <option>Technology / Software</option>
                    <option>Marketing / Agency</option>
                    <option>Design / Creative</option>
                    <option>Finance</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="fg">
                  <label className="fl">Team size</label>
                  <select className="fi" style={{ padding: "11px 14px" }}>
                    <option>Just me</option>
                    <option>2-10 people</option>
                    <option>11-50 people</option>
                    <option>51-200 people</option>
                    <option>200+ people</option>
                  </select>
                </div>
                <div className="divider" />
                <div className="section-title">Choose your plan</div>
                <div className="plan-grid">
                  {[
                    { name: "Free", price: "$0", unit: "/ mo", features: "Up to 5 members\n3 projects\n1GB storage" },
                    { name: "Pro", price: "$12", unit: "/ user / mo", features: "Unlimited members\nUnlimited projects\n50GB storage", popular: true },
                    { name: "Enterprise", price: "Custom", unit: "", features: "Everything in Pro\nSSO / SAML\nDedicated SLA" },
                  ].map((plan) => (
                    <div key={plan.name} className={`plan-card ${selectedPlan === plan.name ? "plan-card-selected" : ""}`} onClick={() => setSelectedPlan(plan.name)} style={{ position: "relative" }}>
                      {plan.popular && <div className="plan-popular">Most popular</div>}
                      <div className="plan-name">{plan.name}</div>
                      <div className="plan-price">{plan.price} <span>{plan.unit}</span></div>
                      <div className="plan-feat">{plan.features.split("\n").map((f, i) => <div key={i}>{f}</div>)}</div>
                    </div>
                  ))}
                </div>
                <div className="actions">
                  <button className="btn-back">← Back</button>
                  <button className="btn-next" onClick={() => goStep(3)}>Continue → Invite Team</button>
                </div>
              </>
            )}

            {/* STEP 3 — Invite Team */}
            {step === 3 && (
              <>
                <div className="section-title">Invite your team <span className="section-badge">STEP 3</span></div>
                <div className="roles-grid">
                  {[
                    { role: "Owner" as Role, desc: "Full access. Can delete workspace, manage billing and all settings." },
                    { role: "Admin" as Role, desc: "Can manage members, create projects and change workspace settings." },
                    { role: "Member" as Role, desc: "Can create tasks, send messages and collaborate on documents." },
                    { role: "Viewer" as Role, desc: "Read-only access. Can view content but cannot make any changes." },
                  ].map(({ role, desc }) => (
                    <div key={role} className="role-card">
                      <span className="member-role" style={{ background: roleStyles[role].split(";")[0], color: roleStyles[role].split(";")[1].replace("color:", ""), border: roleStyles[role].split(";")[2].replace("border:", "") }}>{role}</span>
                      <div className="role-card-desc">{desc}</div>
                    </div>
                  ))}
                </div>
                <div className="divider" />
                <div className="section-title">Add members</div>
                <div className="invite-row">
                  <input type="email" className="fi" placeholder="colleague@company.com" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
                  <select className="role-select" value={newRole} onChange={(e) => setNewRole(e.target.value as Role)}>
                    <option>Admin</option>
                    <option>Member</option>
                    <option>Viewer</option>
                  </select>
                  <button className="invite-btn" onClick={addMember}>+ Add</button>
                </div>
                <div>
                  {members.map((m, i) => (
                    <div key={i} className="member-row">
                      <div className="member-av" style={{ background: "rgba(108,92,231,0.2)", color: "#a89cf7" }}>{m.initials}</div>
                      <div className="member-info">
                        <div className="member-name">{m.name}{m.isYou ? " (You)" : ""}</div>
                        <div className="member-email">{m.email}</div>
                      </div>
                      <span className="member-role">{m.role}</span>
                      {!m.isYou && <button className="member-remove" onClick={() => removeMember(i)}>×</button>}
                    </div>
                  ))}
                </div>
                <div className="actions">
                  <button className="btn-back" onClick={() => goStep(2)}>← Back</button>
                  <button className="btn-next" onClick={() => goStep(4)}>Launch Workspace 🚀</button>
                </div>
              </>
            )}

            {/* STEP 4 — Success */}
            {step === 4 && (
              <div style={{ textAlign: "center", padding: "2rem 0" }}>
                <div style={{ width: 80, height: 80, background: "linear-gradient(135deg,#6c5ce7,#e84393)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem", fontSize: 36 }}>🎉</div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 28, fontWeight: 800, color: "#fff", marginBottom: 8 }}>You're all set!</div>
                <div style={{ fontSize: 15, color: "rgba(255,255,255,0.5)", marginBottom: "2rem", fontWeight: 300 }}>Your workspace is ready. Let's get to work!</div>
                <button className="btn-next" style={{ margin: "0 auto" }}>Go to Dashboard →</button>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

function Stars() {
  useEffect(() => {
    const bg = document.querySelector(".space-bg") as HTMLElement;
    if (!bg) return;
    for (let i = 0; i < 150; i++) {
      const star = document.createElement("div");
      const size = Math.random() * 2.5 + 0.5;
      const dur = Math.random() * 4 + 2;
      const minO = Math.random() * 0.3 + 0.1;
      star.className = "star";
      star.style.cssText = `width:${size}px;height:${size}px;top:${Math.random() * 100}%;left:${Math.random() * 100}%;--d:${dur}s;--min-o:${minO};opacity:${minO}`;
      bg.appendChild(star);
    }
  }, []);
  return null;
}
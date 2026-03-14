"use client";
import Link from "next/link";
export default function LandingPage() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="landing">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --bg: #ffffff; --surface: #f8f7ff; --card: #ffffff;
          --border: rgba(100,80,220,0.1); --text: #0a0814; --muted: #6b6b8a;
          --purple: #6c5ce7; --pink: #e84393; --cyan: #0099cc;
          --green: #00b894; --orange: #e17055; --yellow: #fdcb6e;
          --purple-light: #f0eeff; --pink-light: #ffeaf5;
          --cyan-light: #e0f5ff; --green-light: #e0fff6;
        }
        .landing { font-family: 'DM Sans', sans-serif; background: var(--bg); color: var(--text); overflow-x: hidden; }
        .nav { display: flex; align-items: center; justify-content: space-between; padding: 1rem 2.5rem; position: sticky; top: 0; z-index: 100; background: rgba(255,255,255,0.92); backdrop-filter: blur(16px); border-bottom: 1px solid var(--border); }
        .logo { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800; background: linear-gradient(135deg, var(--purple), var(--pink)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .nav-links { display: flex; gap: 2rem; align-items: center; }
        .nav-links a { font-size: 14px; color: var(--muted); text-decoration: none; cursor: pointer; transition: color .2s; }
        .nav-links a:hover { color: var(--text); }
        .btn-grad { background: linear-gradient(135deg, var(--purple), var(--pink)); color: #fff; border: none; padding: 10px 22px; border-radius: 100px; font-size: 14px; cursor: pointer; font-weight: 500; transition: opacity .2s; box-shadow: 0 4px 20px rgba(108,92,231,0.25); }
        .btn-grad:hover { opacity: .88; }
        .btn-ghost { background: #fff; border: 1.5px solid rgba(108,92,231,0.25); color: var(--purple); padding: 9px 22px; border-radius: 100px; font-size: 14px; cursor: pointer; font-weight: 500; transition: all .2s; }
        .btn-ghost:hover { border-color: var(--purple); background: var(--purple-light); }
        .hero { text-align: center; padding: 5.5rem 2rem 3rem; position: relative; overflow: hidden; background: linear-gradient(180deg, #f8f6ff 0%, #ffffff 100%); }
        .hero::before { content: ''; position: absolute; top: -80px; left: 50%; transform: translateX(-50%); width: 800px; height: 500px; background: radial-gradient(ellipse, rgba(108,92,231,0.1) 0%, transparent 65%); pointer-events: none; }
        .badge { display: inline-flex; align-items: center; gap: 8px; background: #fff; border: 1.5px solid rgba(108,92,231,0.2); border-radius: 100px; padding: 6px 16px; font-size: 12px; color: var(--purple); margin-bottom: 2rem; font-weight: 500; box-shadow: 0 2px 12px rgba(108,92,231,0.1); }
        .badge-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--green); animation: pulse 2s infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: .6; transform: scale(1.4); } }
        .hero h1 { font-family: 'Syne', sans-serif; font-size: 56px; font-weight: 800; line-height: 1.1; margin-bottom: 1.5rem; letter-spacing: -1.5px; color: var(--text); }
        .grad-text { background: linear-gradient(135deg, var(--purple) 0%, var(--pink) 60%, var(--cyan) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .hero p { font-size: 18px; color: var(--muted); line-height: 1.75; max-width: 500px; margin: 0 auto 2.5rem; font-weight: 300; }
        .hero-btns { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; margin-bottom: 4rem; }
        .preview-wrap { max-width: 880px; margin: 0 auto; padding: 0 2rem; }
        .preview-frame { background: #fff; border: 1.5px solid rgba(108,92,231,0.15); border-radius: 20px; overflow: hidden; box-shadow: 0 20px 80px rgba(108,92,231,0.12), 0 4px 20px rgba(0,0,0,0.06); }
        .preview-topbar { background: #f8f7ff; padding: 11px 16px; display: flex; align-items: center; gap: 8px; border-bottom: 1px solid rgba(108,92,231,0.08); }
        .dot { width: 10px; height: 10px; border-radius: 50%; }
        .preview-body { display: grid; grid-template-columns: 170px 1fr 1fr; }
        .p-sidebar { padding: 1.25rem; border-right: 1px solid rgba(108,92,231,0.08); background: #faf9ff; }
        .p-logo { font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700; background: linear-gradient(135deg, var(--purple), var(--pink)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 1rem; }
        .p-item { display: flex; align-items: center; gap: 8px; padding: 7px 10px; border-radius: 8px; font-size: 11px; color: var(--muted); margin-bottom: 3px; cursor: pointer; }
        .p-item.active { background: var(--purple-light); color: var(--purple); font-weight: 500; }
        .p-icon { width: 14px; height: 14px; border-radius: 3px; flex-shrink: 0; }
        .p-board { padding: 1.25rem; border-right: 1px solid rgba(108,92,231,0.08); }
        .p-col-title { font-size: 10px; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: .8px; margin-bottom: 10px; }
        .p-card { background: #f8f7ff; border: 1px solid rgba(108,92,231,0.08); border-radius: 8px; padding: 9px 11px; font-size: 11px; color: var(--text); margin-bottom: 6px; }
        .p-tag { display: inline-block; font-size: 9px; padding: 2px 8px; border-radius: 100px; margin-top: 5px; font-weight: 600; }
        .p-chat { padding: 1.25rem; display: flex; flex-direction: column; gap: 9px; }
        .p-ch-title { font-size: 10px; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: .8px; margin-bottom: 4px; }
        .p-msg { display: flex; gap: 8px; align-items: flex-start; }
        .av { width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: 700; flex-shrink: 0; }
        .p-bubble { border-radius: 10px; padding: 6px 10px; font-size: 11px; color: var(--text); }
        .stats-row { display: grid; grid-template-columns: repeat(3,1fr); max-width: 680px; margin: 4rem auto; border: 1.5px solid rgba(108,92,231,0.12); border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(108,92,231,0.07); }
        .stat { background: #fff; padding: 2rem; text-align: center; }
        .stat + .stat { border-left: 1px solid rgba(108,92,231,0.1); }
        .stat-num { font-family: 'Syne', sans-serif; font-size: 38px; font-weight: 800; margin-bottom: 6px; }
        .stat-label { font-size: 13px; color: var(--muted); font-weight: 300; }
        .features { padding: 5rem 2rem; max-width: 1050px; margin: 0 auto; }
        .section-tag { display: inline-block; font-size: 11px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: var(--purple); margin-bottom: .75rem; background: var(--purple-light); padding: 4px 12px; border-radius: 100px; }
        .section-h { font-family: 'Syne', sans-serif; font-size: 36px; font-weight: 800; margin-bottom: .75rem; letter-spacing: -.5px; color: var(--text); }
        .section-p { font-size: 16px; color: var(--muted); max-width: 460px; margin-bottom: 3rem; line-height: 1.75; font-weight: 300; }
        .feat-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 1.5rem; }
        .feat-card { background: #fff; border: 1.5px solid rgba(108,92,231,0.1); border-radius: 18px; padding: 1.75rem; transition: all .25s; box-shadow: 0 2px 12px rgba(0,0,0,0.04); }
        .feat-card:hover { transform: translateY(-5px); box-shadow: 0 12px 40px rgba(108,92,231,0.12); }
        .feat-ico { width: 46px; height: 46px; border-radius: 14px; display: flex; align-items: center; justify-content: center; margin-bottom: 1.25rem; }
        .feat-card h3 { font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 700; margin-bottom: 8px; color: var(--text); }
        .feat-card p { font-size: 13px; color: var(--muted); line-height: 1.65; font-weight: 300; }
        .pricing { padding: 5rem 2rem; background: var(--surface); }
        .pricing-inner { max-width: 950px; margin: 0 auto; }
        .price-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 1.5rem; }
        .price-card { background: #fff; border: 1.5px solid rgba(108,92,231,0.1); border-radius: 20px; padding: 2rem; position: relative; transition: all .25s; box-shadow: 0 2px 12px rgba(0,0,0,0.04); }
        .price-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(108,92,231,0.1); }
        .price-card.hot { border-color: var(--purple); box-shadow: 0 8px 40px rgba(108,92,231,0.18); }
        .hot-badge { position: absolute; top: -13px; left: 50%; transform: translateX(-50%); background: linear-gradient(135deg, var(--purple), var(--pink)); color: #fff; font-size: 11px; padding: 4px 16px; border-radius: 100px; font-weight: 600; white-space: nowrap; }
        .price-name { font-size: 13px; color: var(--muted); margin-bottom: 8px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }
        .price-num { font-family: 'Syne', sans-serif; font-size: 42px; font-weight: 800; margin-bottom: 4px; color: var(--text); }
        .price-num sub { font-size: 14px; font-weight: 400; color: var(--muted); }
        .price-note { font-size: 13px; color: var(--muted); margin-bottom: 1.5rem; font-weight: 300; }
        .price-sep { height: 1px; background: rgba(108,92,231,0.08); margin-bottom: 1.5rem; }
        .price-feat { list-style: none; display: flex; flex-direction: column; gap: 10px; margin-bottom: 1.75rem; }
        .price-feat li { font-size: 13px; color: var(--text); display: flex; align-items: center; gap: 9px; font-weight: 300; }
        .pf-check { width: 18px; height: 18px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 9px; flex-shrink: 0; font-weight: 700; }
        .testi { padding: 5rem 2rem; max-width: 1050px; margin: 0 auto; }
        .t-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 1.5rem; }
        .t-card { background: #fff; border: 1.5px solid rgba(108,92,231,0.1); border-radius: 18px; padding: 1.75rem; box-shadow: 0 2px 12px rgba(0,0,0,0.04); position: relative; overflow: hidden; }
        .t-card::before { content: '"'; position: absolute; top: 8px; right: 16px; font-family: 'Syne', sans-serif; font-size: 60px; font-weight: 800; line-height: 1; opacity: .06; color: var(--purple); }
        .stars { font-size: 13px; color: var(--yellow); margin-bottom: 1rem; }
        .t-text { font-size: 14px; color: var(--text); line-height: 1.75; margin-bottom: 1.5rem; font-weight: 300; font-style: italic; }
        .t-author { display: flex; align-items: center; gap: 10px; }
        .t-av { width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; }
        .t-name { font-size: 13px; font-weight: 600; color: var(--text); }
        .t-role { font-size: 11px; color: var(--muted); }
        .cta-section { padding: 5.5rem 2rem; text-align: center; background: linear-gradient(135deg, #f0eeff 0%, #ffeaf5 50%, #e0f5ff 100%); }
        .cta-section h2 { font-family: 'Syne', sans-serif; font-size: 44px; font-weight: 800; margin-bottom: 1rem; letter-spacing: -.5px; color: var(--text); }
        .cta-section p { font-size: 16px; color: var(--muted); margin-bottom: 2.5rem; font-weight: 300; }
        .cta-btns { display: flex; gap: 14px; justify-content: center; }
        .footer-wrap { max-width: 1050px; margin: 0 auto; padding: 3.5rem 2rem 2rem; display: grid; grid-template-columns: 1.4fr 1fr 1fr 1fr; gap: 2rem; border-top: 1px solid rgba(108,92,231,0.1); }
        .f-brand p { font-size: 13px; color: var(--muted); margin-top: 10px; line-height: 1.7; font-weight: 300; max-width: 200px; }
        .f-col h4 { font-size: 11px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: var(--muted); margin-bottom: 14px; }
        .f-col a { display: block; font-size: 13px; color: var(--muted); text-decoration: none; margin-bottom: 10px; cursor: pointer; transition: color .2s; font-weight: 300; }
        .f-col a:hover { color: var(--purple); }
        .footer-bottom { padding: 1.5rem 2rem; border-top: 1px solid rgba(108,92,231,0.08); text-align: center; font-size: 12px; color: var(--muted); }
      `}</style>

      {/* NAV */}
      <nav className="nav">
        <div className="logo">Nexus</div>
        <div className="nav-links">
          <a onClick={() => scrollTo("features")}>Features</a>
          <a onClick={() => scrollTo("pricing")}>Pricing</a>
          <a onClick={() => scrollTo("testi")}>Testimonials</a>
          

<Link href="/auth">
  <button className="btn-ghost">Log in</button>
</Link>
          <Link href="/auth">
  <button className="btn-grad">Get started free</button>
</Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="badge">
          <span className="badge-dot" />
          Now in public beta — try it free
        </div>
        <h1>Your team&apos;s<br /><span className="grad-text">everything, connected.</span></h1>
        <p>Tasks, docs, and real-time chat in one beautiful place. Stop switching apps. Start actually working.</p>
        <div className="hero-btns">
          <button className="btn-grad" style={{ padding: "14px 32px", fontSize: 16 }}>Start for free</button>
          <button className="btn-ghost" style={{ padding: "13px 32px", fontSize: 16 }}>Watch demo</button>
        </div>
      </section>

      {/* APP PREVIEW */}
      <div className="preview-wrap">
        <div className="preview-frame">
          <div className="preview-topbar">
            <div className="dot" style={{ background: "#ff5f57" }} />
            <div className="dot" style={{ background: "#febc2e" }} />
            <div className="dot" style={{ background: "#28c840" }} />
            <span style={{ fontSize: 11, color: "var(--muted)", marginLeft: 10 }}>app.nexus.io — Dashboard</span>
          </div>
          <div className="preview-body">
            <div className="p-sidebar">
              <div className="p-logo">Nexus</div>
              {[
                { label: "Dashboard", bg: "rgba(108,92,231,0.2)", active: true },
                { label: "Tasks", bg: "rgba(232,67,147,0.15)" },
                { label: "Docs", bg: "rgba(0,153,204,0.15)" },
                { label: "Chat", bg: "rgba(0,184,148,0.15)" },
                { label: "Team", bg: "rgba(225,112,85,0.15)" },
              ].map((item) => (
                <div key={item.label} className={`p-item${item.active ? " active" : ""}`}>
                  <div className="p-icon" style={{ background: item.bg }} />
                  {item.label}
                </div>
              ))}
            </div>
            <div className="p-board">
              <div className="p-col-title">Active tasks</div>
              {[
                { title: "Design landing page", tag: "Design", tagBg: "#f0eeff", tagColor: "#6c5ce7" },
                { title: "Set up database", tag: "Backend", tagBg: "#e0fff6", tagColor: "#00b894" },
                { title: "Write API docs", tag: "Docs", tagBg: "#e0f5ff", tagColor: "#0099cc" },
                { title: "Review PR #42", tag: "Review", tagBg: "#ffeaf5", tagColor: "#e84393" },
              ].map((card) => (
                <div key={card.title} className="p-card">
                  {card.title}
                  <div><span className="p-tag" style={{ background: card.tagBg, color: card.tagColor }}>{card.tag}</span></div>
                </div>
              ))}
            </div>
            <div className="p-chat">
              <div className="p-ch-title"># general</div>
              {[
                { init: "A", avBg: "#f0eeff", avColor: "#6c5ce7", msg: "Nexus looks amazing!", bubbleBg: "#f8f7ff" },
                { init: "B", avBg: "#e0fff6", avColor: "#00b894", msg: "Pushing update now 🚀", bubbleBg: "#f0fff9" },
                { init: "C", avBg: "#ffeaf5", avColor: "#e84393", msg: "Review at 3pm?", bubbleBg: "#fff6fa" },
                { init: "D", avBg: "#e0f5ff", avColor: "#0099cc", msg: "Works for me!", bubbleBg: "#f0faff" },
              ].map((m) => (
                <div key={m.msg} className="p-msg">
                  <div className="av" style={{ background: m.avBg, color: m.avColor }}>{m.init}</div>
                  <div className="p-bubble" style={{ background: m.bubbleBg }}>{m.msg}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div style={{ padding: "0 2rem" }}>
        <div className="stats-row">
          {[
            { num: "12k+", label: "Teams using Nexus", grad: "linear-gradient(135deg,#6c5ce7,#e84393)" },
            { num: "98%", label: "Customer satisfaction", grad: "linear-gradient(135deg,#0099cc,#00b894)" },
            { num: "4.9★", label: "Average rating", grad: "linear-gradient(135deg,#e17055,#fdcb6e)" },
          ].map((s) => (
            <div key={s.label} className="stat">
              <div className="stat-num" style={{ background: s.grad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{s.num}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      <section className="features" id="features">
        <div className="section-tag">Features</div>
        <div className="section-h">Built for how teams<br />actually work</div>
        <div className="section-p">No more tab juggling. Everything your team needs lives in one beautiful place.</div>
        <div className="feat-grid">
          {[
            { bg: "#f0eeff", title: "Task boards", desc: "Drag-and-drop Kanban with labels, due dates, and priorities.", icon: (<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><rect x="2" y="2" width="8" height="8" rx="2" fill="#6c5ce7"/><rect x="12" y="2" width="8" height="8" rx="2" fill="#6c5ce7" opacity="0.35"/><rect x="2" y="12" width="8" height="8" rx="2" fill="#6c5ce7" opacity="0.35"/><rect x="12" y="12" width="8" height="8" rx="2" fill="#6c5ce7" opacity="0.15"/></svg>) },
            { bg: "#ffeaf5", title: "Collaborative docs", desc: "Live co-editing, inline comments, and version history.", icon: (<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><rect x="3" y="3" width="16" height="16" rx="3" stroke="#e84393" strokeWidth="1.5" fill="none"/><line x1="6" y1="8" x2="16" y2="8" stroke="#e84393" strokeWidth="1.5" strokeLinecap="round"/><line x1="6" y1="11" x2="16" y2="11" stroke="#e84393" strokeWidth="1.5" strokeLinecap="round"/><line x1="6" y1="14" x2="11" y2="14" stroke="#e84393" strokeWidth="1.5" strokeLinecap="round"/></svg>) },
            { bg: "#e0f5ff", title: "Real-time chat", desc: "Channels, DMs, threads, and file sharing.", icon: (<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M3 5.5h16a1 1 0 011 1v9a1 1 0 01-1 1H5.5l-3.5 2.5V6.5a1 1 0 011-1z" stroke="#0099cc" strokeWidth="1.5" fill="none"/></svg>) },
            { bg: "#e0fff6", title: "Smart workspaces", desc: "Separate spaces per team with custom roles and permissions.", icon: (<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="11" r="7.5" stroke="#00b894" strokeWidth="1.5" fill="none"/><circle cx="11" cy="11" r="3" fill="#00b894" opacity="0.5"/></svg>) },
            { bg: "#fff0eb", title: "Smart notifications", desc: "AI-filtered alerts that surface only what matters.", icon: (<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M11 4v2.5M11 15.5V18M4 11h2.5M15.5 11H18" stroke="#e17055" strokeWidth="1.5" strokeLinecap="round"/><circle cx="11" cy="11" r="3.5" stroke="#e17055" strokeWidth="1.5" fill="none"/></svg>) },
            { bg: "#fffbe0", title: "Integrations", desc: "GitHub, Figma, Google Drive, Slack and more.", icon: (<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><rect x="2" y="8" width="6" height="6" rx="1.5" stroke="#d4a000" strokeWidth="1.5" fill="none"/><rect x="14" y="3" width="6" height="6" rx="1.5" stroke="#d4a000" strokeWidth="1.5" fill="none"/><rect x="14" y="13" width="6" height="6" rx="1.5" stroke="#d4a000" strokeWidth="1.5" fill="none"/><line x1="8" y1="11" x2="14" y2="6" stroke="#d4a000" strokeWidth="1.5"/><line x1="8" y1="11" x2="14" y2="16" stroke="#d4a000" strokeWidth="1.5"/></svg>) },
          ].map((f) => (
            <div key={f.title} className="feat-card">
              <div className="feat-ico" style={{ background: f.bg }}>{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section className="pricing" id="pricing">
        <div className="pricing-inner">
          <div className="section-tag">Pricing</div>
          <div className="section-h">Start free, grow fearlessly</div>
          <div className="section-p" style={{ marginBottom: "3rem" }}>No hidden fees. Cancel any time.</div>
          <div className="price-grid">
            <div className="price-card">
              <div className="price-name">Free</div>
              <div className="price-num">$0<sub> / mo</sub></div>
              <div className="price-note">For small teams getting started</div>
              <div className="price-sep" />
              <ul className="price-feat">
                {["Up to 5 members","3 projects","Basic chat","1 GB storage"].map((f) => (
                  <li key={f}><div className="pf-check" style={{ background: "#e0fff6", color: "#00b894" }}>✓</div>{f}</li>
                ))}
              </ul>
              <button className="btn-ghost" style={{ width: "100%", padding: "12px" }}>Get started</button>
            </div>
            <div className="price-card hot">
              <div className="hot-badge">Most popular</div>
              <div className="price-name">Pro</div>
              <div className="price-num">$12<sub> / user / mo</sub></div>
              <div className="price-note">For growing teams that mean business</div>
              <div className="price-sep" />
              <ul className="price-feat">
                {["Unlimited members","Unlimited projects","Real-time collaboration","50 GB storage","Priority support"].map((f) => (
                  <li key={f}><div className="pf-check" style={{ background: "#f0eeff", color: "#6c5ce7" }}>✓</div>{f}</li>
                ))}
              </ul>
              <button className="btn-grad" style={{ width: "100%", padding: "12px" }}>Start free trial</button>
            </div>
            <div className="price-card">
              <div className="price-name">Enterprise</div>
              <div className="price-num" style={{ fontSize: 30 }}>Custom</div>
              <div className="price-note">For large orgs with advanced needs</div>
              <div className="price-sep" />
              <ul className="price-feat">
                {["Everything in Pro","SSO / SAML","Custom integrations","Dedicated SLA"].map((f) => (
                  <li key={f}><div className="pf-check" style={{ background: "#e0f5ff", color: "#0099cc" }}>✓</div>{f}</li>
                ))}
              </ul>
              <button className="btn-ghost" style={{ width: "100%", padding: "12px" }}>Contact sales</button>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testi" id="testi">
        <div className="section-tag">Testimonials</div>
        <div className="section-h">Teams love Nexus</div>
        <div className="section-p" style={{ marginBottom: "3rem" }}>Don&apos;t take our word for it.</div>
        <div className="t-grid">
          {[
            { init: "SR", avBg: "#f0eeff", avColor: "#6c5ce7", text: '"We replaced Notion, Trello, and Slack with Nexus. Our team has never been more in sync."', name: "Sarah R.", role: "Head of Product, Acme Inc." },
            { init: "JM", avBg: "#e0fff6", avColor: "#00b894", text: '"The real-time features are buttery smooth. Our remote team of 40 uses it every day."', name: "James M.", role: "Engineering Lead, TechCo" },
            { init: "LP", avBg: "#ffeaf5", avColor: "#e84393", text: '"We were up and running in 10 minutes. Nexus feels built for how our startup works."', name: "Lisa P.", role: "CEO, StartupXYZ" },
          ].map((t) => (
            <div key={t.name} className="t-card">
              <div className="stars">★★★★★</div>
              <div className="t-text">{t.text}</div>
              <div className="t-author">
                <div className="t-av" style={{ background: t.avBg, color: t.avColor }}>{t.init}</div>
                <div><div className="t-name">{t.name}</div><div className="t-role">{t.role}</div></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <h2>Ready to <span className="grad-text">connect</span> your team?</h2>
        <p>Free forever. No credit card needed. Set up in minutes.</p>
        <div className="cta-btns">
          <button className="btn-grad" style={{ padding: "14px 36px", fontSize: 16 }}>Get started free</button>
          <button className="btn-ghost" style={{ padding: "13px 36px", fontSize: 16 }}>Schedule a demo</button>
        </div>
      </section>

      {/* FOOTER */}
      <div className="footer-wrap">
        <div className="f-brand">
          <div className="logo">Nexus</div>
          <p>The all-in-one platform for modern teams.</p>
        </div>
        <div className="f-col"><h4>Product</h4><a>Features</a><a>Pricing</a><a>Changelog</a><a>Roadmap</a></div>
        <div className="f-col"><h4>Company</h4><a>About</a><a>Blog</a><a>Careers</a><a>Contact</a></div>
        <div className="f-col"><h4>Legal</h4><a>Privacy</a><a>Terms</a><a>Security</a></div>
      </div>
      <div className="footer-bottom">&copy; 2026 Nexus. All rights reserved.</div>
    </div>
  );
}
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export default function AuthPage() {
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [workspaceName, setWorkspaceName] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSignup = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: firstName + " " + lastName,
          email: signupEmail,
          password: signupPassword,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess("Account created! Please login.");
        setTab("login");
        setFirstName("");
        setLastName("");
        setSignupEmail("");
        setSignupPassword("");
        setWorkspaceName("");
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  const handleLogin = async () => {
    if (!loginEmail || !loginPassword) {
      setError("Please enter your email and password.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await signIn("credentials", {
        email: loginEmail.trim().toLowerCase(),
        password: loginPassword,
        redirect: false,
      });
      if (res?.ok) {
        window.location.href = "/dashboard";
      } else {
        setError(res?.error === "CredentialsSignin"
          ? "Incorrect email or password. Please try again."
          : res?.error || "Sign in failed. Please try again.");
      }
    } catch (err: unknown) {
      setError("Connection error. Is the server running?");
      console.error("Login error:", err);
    }
    setLoading(false);
  };

  return (
    <div style={{
      padding: "2rem",
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      overflow: "hidden",
      background: "url('https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80') center/cover no-repeat"
    }}>

      {/* Dark overlay */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "rgba(10, 8, 20, 0.6)",
        zIndex: 0
      }} />

      <div className="auth-wrap">

        {/* LEFT */}
        <div className="auth-left">
          <div className="l-logo">Nexus</div>
          <div className="l-mid">
            <h2>Everything your team needs, connected.</h2>
            <div className="l-feat">
              <div className="l-feat-item">
                <div className="l-feat-ico">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" rx="1.5" fill="white"/><rect x="9" y="1" width="6" height="6" rx="1.5" fill="white" opacity="0.5"/><rect x="1" y="9" width="6" height="6" rx="1.5" fill="white" opacity="0.5"/><rect x="9" y="9" width="6" height="6" rx="1.5" fill="white" opacity="0.2"/></svg>
                </div>
                Drag-and-drop task boards
              </div>
              <div className="l-feat-item">
                <div className="l-feat-ico">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="12" height="12" rx="2" stroke="white" strokeWidth="1.2" fill="none"/><line x1="4" y1="6" x2="12" y2="6" stroke="white" strokeWidth="1.2" strokeLinecap="round"/><line x1="4" y1="9" x2="10" y2="9" stroke="white" strokeWidth="1.2" strokeLinecap="round"/></svg>
                </div>
                Real-time collaborative docs
              </div>
              <div className="l-feat-item">
                <div className="l-feat-ico">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M2 4h12a.75.75 0 01.75.75v6a.75.75 0 01-.75.75H4.5L2 13V4.75A.75.75 0 012 4z" stroke="white" strokeWidth="1.2" fill="none"/></svg>
                </div>
                Instant team messaging
              </div>
              <div className="l-feat-item">
                <div className="l-feat-ico">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="5.5" stroke="white" strokeWidth="1.2" fill="none"/><circle cx="8" cy="8" r="2" fill="white" opacity="0.6"/></svg>
                </div>
                Smart workspaces
              </div>
            </div>
          </div>
          <div className="l-bottom">&copy; 2026 Nexus. All rights reserved.</div>
        </div>

        {/* RIGHT */}
        <div className="auth-right">
          <div className="r-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6c5ce7" strokeWidth="1.5" strokeLinecap="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          </div>
          <div className="r-title">{tab === "login" ? "Welcome" : "Register"}</div>
          <div className="r-sub">{tab === "login" ? "Login with Email" : "Sign up with Email"}</div>

          {/* TOGGLE */}
          <div className="tog">
            <button className={`tog-btn ${tab === "login" ? "act-login" : ""}`} onClick={() => { setTab("login"); setError(""); setSuccess(""); }}>Log in</button>
            <button className={`tog-btn ${tab === "signup" ? "act-signup" : ""}`} onClick={() => { setTab("signup"); setError(""); setSuccess(""); }}>Sign up</button>
          </div>

          {/* ERROR / SUCCESS */}
          {error && <div className="error-msg">{error}</div>}
          {success && <div className="success-msg">{success}</div>}

          {/* LOGIN FORM */}
          {tab === "login" && (
            <>
              <div className="fg">
                <label className="fl">Email address</label>
                <div className="iw">
                  <span className="ii"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 7 10-7"/></svg></span>
                  <input type="email" className="fi" placeholder="you@company.com" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
                </div>
              </div>
              <div className="fg">
                <label className="fl">Password</label>
                <div className="iw">
                  <span className="ii"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg></span>
                  <input type="password" className="fi" placeholder="••••••••••••" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
                </div>
              </div>
              <a className="forgot">Forgot your password?</a>
              <button className="sub-btn" onClick={handleLogin} disabled={loading}>
                {loading ? "Signing in..." : "Sign in to Nexus"}
              </button>
              <div className="or" style={{marginTop: "1rem"}}>OR</div>
              <div className="soc-row">
                <div className="soc-btn">
                  <svg width="17" height="17" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                </div>
                <div className="soc-btn">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="#0a0814"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                </div>
              </div>
              <div className="sw">Don&apos;t have an account? <a onClick={() => { setTab("signup"); setError(""); }}>Register Now</a></div>
            </>
          )}

          {/* SIGNUP FORM */}
          {tab === "signup" && (
            <>
              <div className="frow">
                <div className="fg">
                  <label className="fl">First name</label>
                  <div className="iw">
                    <span className="ii"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg></span>
                    <input type="text" className="fi" placeholder="John" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                  </div>
                </div>
                <div className="fg">
                  <label className="fl">Last name</label>
                  <div className="iw">
                    <span className="ii"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg></span>
                    <input type="text" className="fi" placeholder="Doe" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                  </div>
                </div>
              </div>
              <div className="fg">
                <label className="fl">Email address</label>
                <div className="iw">
                  <span className="ii"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 7 10-7"/></svg></span>
                  <input type="email" className="fi" placeholder="you@company.com" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} />
                </div>
              </div>
              <div className="fg">
                <label className="fl">Password</label>
                <div className="iw">
                  <span className="ii"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg></span>
                  <input type="password" className="fi" placeholder="Min. 6 characters" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} />
                </div>
              </div>
              <div className="fg">
                <label className="fl">Workspace name</label>
                <div className="iw">
                  <span className="ii"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg></span>
                  <input type="text" className="fi" placeholder="My Team" value={workspaceName} onChange={(e) => setWorkspaceName(e.target.value)} />
                </div>
              </div>
              <button className="sub-btn s2" onClick={handleSignup} disabled={loading}>
                {loading ? "Creating account..." : "Create your account"}
              </button>
              <div className="or" style={{marginTop: "1rem"}}>OR</div>
              <div className="soc-row">
                <div className="soc-btn">
                  <svg width="17" height="17" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                </div>
                <div className="soc-btn">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="#0a0814"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                </div>
              </div>
              <div className="sw">Already have an account? <a onClick={() => { setTab("login"); setError(""); }}>Login Now</a></div>
              <div className="terms">By signing up you agree to our <a>Terms</a> and <a>Privacy Policy</a></div>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
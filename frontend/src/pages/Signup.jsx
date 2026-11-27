// src/pages/Signup.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Gem, ShieldCheck, TrendingUp, Users } from "lucide-react";
import GoogleAuthButton from "../components/GoogleAuthButton";
import API_URL from "../api";

export default function Signup() {
  const navigate = useNavigate();
  const [name, setName]                     = useState("");
  const [email, setEmail]                   = useState("");
  const [password, setPassword]             = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError]                   = useState("");
  const [loading, setLoading]               = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const res  = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Registration failed"); return; }
      navigate("/login");
    } catch {
      setError("Could not connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* ── Left Story ── */}
      <section className="auth-story">
        <Link to="/" className="auth-story-logo">
          <span className="brand-mark" style={{ width: 42, height: 42, borderRadius: 10 }}>
            <Gem size={20} color="#0d0d0d" />
          </span>
          <span className="brand-text">
            <span className="brand-name" style={{ fontSize: 18 }}>Kriyeta</span>
            <span className="brand-tagline">Jewellery Finance</span>
          </span>
        </Link>

        <div className="auth-story-content">
          <div className="auth-story-eyebrow">
            Start Your Journey
          </div>
          <h1>
            A clearer way to<br />
            <em>manage every pledge.</em>
          </h1>
          <p>
            Create your workspace for customers, jewellery loans
            and repayments — beautifully organised.
          </p>
          <div className="auth-story-badges">
            <span className="auth-badge"><ShieldCheck size={13} /> Secure &amp; Private</span>
            <span className="auth-badge"><TrendingUp size={13} /> Interest Tracking</span>
            <span className="auth-badge"><Users size={13} /> Client Directory</span>
          </div>
        </div>
      </section>

      {/* ── Right Form ── */}
      <main className="auth-panel">
        <section className="auth-card">
          <p className="auth-card-eyebrow">Create account</p>
          <h2>Join Kriyeta</h2>
          <p className="auth-subtitle">Set up your jewellery finance workspace in seconds.</p>

          <form onSubmit={handleSubmit}>
            <label className="field-label">
              Full name
              <input className="form-input" type="text" value={name}
                onChange={(e) => setName(e.target.value)} placeholder="Ramesh Kumar" required />
            </label>
            <label className="field-label">
              Email address
              <input className="form-input" type="email" value={email}
                onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
            </label>
            <label className="field-label">
              Password
              <input className="form-input" type="password" value={password}
                onChange={(e) => setPassword(e.target.value)} placeholder="Min. 6 characters" minLength={6} required />
            </label>
            <label className="field-label">
              Confirm password
              <input className="form-input" type="password" value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repeat password" minLength={6} required />
            </label>
            {error && <p className="error-message">{error}</p>}
            <button className="primary-button" type="submit" disabled={loading}>
              {loading ? "Creating account…" : "Create Account"}
            </button>
          </form>

          <div className="auth-divider">or continue with</div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <GoogleAuthButton onError={setError} />
          </div>
          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </section>
      </main>
    </div>
  );
}

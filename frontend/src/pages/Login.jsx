// src/pages/Login.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Gem, ShieldCheck, TrendingUp, Users } from "lucide-react";
import GoogleAuthButton from "../components/GoogleAuthButton";
import Success3DModal from "../components/Success3DModal";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res  = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Login failed"); return; }
      localStorage.setItem("token", data.token);
      setShowSuccess(true);
    } catch {
      setError("Could not connect to server.");
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    navigate("/");
  };

  return (
    <div className="auth-page">
      {/* 3D Success Popup Animation */}
      <Success3DModal
        isOpen={showSuccess}
        onClose={handleSuccessClose}
        title="Welcome Back!"
        subtitle="You have successfully signed in to Kriyeta."
      />

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
            Trusted Finance Management
          </div>
          <h1>
            Every pledge,<br />
            <em>clearly accounted.</em>
          </h1>
          <p>
            Manage customers, jewellery loans and repayments
            from one focused, beautifully designed workspace.
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
          <p className="auth-card-eyebrow">Welcome back</p>
          <h2>Sign in to Kriyeta</h2>
          <p className="auth-subtitle">Enter your credentials to continue managing your portfolio.</p>

          <form onSubmit={handleSubmit}>
            <label className="field-label">
              Email address
              <input
                className="form-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </label>
            <label className="field-label">
              Password
              <input
                className="form-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </label>
            {error && <p className="error-message">{error}</p>}
            <button className="primary-button" type="submit" disabled={loading}>
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <div className="auth-divider">or continue with</div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <GoogleAuthButton onError={setError} />
          </div>
          <p className="auth-switch">
            New to Kriyeta? <Link to="/signup">Create an account</Link>
          </p>
        </section>
      </main>
    </div>
  );
}

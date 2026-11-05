import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Gem } from "lucide-react";
import GoogleAuthButton from "../components/GoogleAuthButton";

function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Password aur confirm password same nahi hain.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Signup failed");
        return;
      }

      navigate("/login");
    } catch {
      setError("Server se connect nahi ho paya.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <section className="auth-story">
        <Link to="/" className="brand" style={{ color: "white" }}><span className="brand-mark"><Gem size={19} /></span>KRIYETA</Link>
        <div>
          <h1>A clearer way to manage every pledge.</h1>
          <p>Create your workspace for customers, jewellery loans and repayments.</p>
        </div>
        <small>Jewellery finance, thoughtfully managed.</small>
      </section>
      <main className="auth-panel">
        <section className="auth-card">
          <h2>Create your account</h2>
          <p className="auth-subtitle">Start managing your KRIYETA workspace.</p>
          <form onSubmit={handleSubmit}>
            <label className="field-label">Full name
              <input className="form-input" type="text" value={name} onChange={(event) => setName(event.target.value)} required />
            </label>
            <label className="field-label">Email address
              <input className="form-input" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
            </label>
            <label className="field-label">Password
              <input className="form-input" type="password" value={password} onChange={(event) => setPassword(event.target.value)} minLength={6} required />
            </label>
            <label className="field-label">Confirm password
              <input className="form-input" type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} minLength={6} required />
            </label>
            {error && <p className="error-message">{error}</p>}
            <button className="primary-button" type="submit" disabled={loading}>{loading ? "Creating account..." : "Create account"}</button>
          </form>
          <div className="auth-divider">or continue with</div>
          <div style={{ display: "flex", justifyContent: "center" }}><GoogleAuthButton onError={setError} /></div>
          <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
        </section>
      </main>
    </div>
  );
}

export default Signup;

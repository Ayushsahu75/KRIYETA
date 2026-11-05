import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Gem } from "lucide-react";
import GoogleAuthButton from "../components/GoogleAuthButton";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.message || "Login failed");
        return;
      }
      localStorage.setItem("token", data.token);
      navigate("/");
    } catch {
      setError("Server se connect nahi ho paya.");
    }
  };

  return (
    <div className="auth-page">
      <section className="auth-story">
        <Link to="/" className="brand" style={{ color: "white" }}><span className="brand-mark"><Gem size={19} /></span>KRIYETA</Link>
        <div>
          <h1>Every pledge, clearly accounted.</h1>
          <p>Manage customers, loans and repayments from one focused workspace.</p>
        </div>
        <small>Jewellery finance, thoughtfully managed.</small>
      </section>
      <main className="auth-panel">
        <section className="auth-card">
          <h2>Welcome back</h2>
          <p className="auth-subtitle">Sign in to continue to KRIYETA.</p>
          <form onSubmit={handleSubmit}>
            <label className="field-label">Email address
              <input className="form-input" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
            </label>
            <label className="field-label">Password
              <input className="form-input" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
            </label>
            {error && <p className="error-message">{error}</p>}
            <button className="primary-button" type="submit">Sign in</button>
          </form>
          <div className="auth-divider">or continue with</div>
          <div style={{ display: "flex", justifyContent: "center" }}><GoogleAuthButton onError={setError} /></div>
          <p className="auth-switch">New to KRIYETA? <Link to="/signup">Create an account</Link></p>
        </section>
      </main>
    </div>
  );
}

export default Login;

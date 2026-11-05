import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
    <div style={{ padding: "40px", maxWidth: "440px", margin: "60px auto", background: "white", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>KRIYETA Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          style={{ width: "100%", padding: "12px", marginBottom: "12px", boxSizing: "border-box" }}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          style={{ width: "100%", padding: "12px", marginBottom: "12px", boxSizing: "border-box" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          minLength={6}
          required
          style={{ width: "100%", padding: "12px", marginBottom: "12px", boxSizing: "border-box" }}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          minLength={6}
          required
          style={{ width: "100%", padding: "12px", marginBottom: "12px", boxSizing: "border-box" }}
        />
        {error && <p style={{ color: "#c62828" }}>{error}</p>}
        <button type="submit" disabled={loading} style={{ width: "100%", padding: "12px", background: "#333", color: "white", border: 0, cursor: loading ? "not-allowed" : "pointer" }}>
          {loading ? "Creating account..." : "Sign Up"}
        </button>
      </form>
      <div style={{ display: "flex", justifyContent: "center", marginTop: "16px" }}>
        <GoogleAuthButton onError={setError} />
      </div>
      <p style={{ textAlign: "center", marginTop: "16px" }}>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}

export default Signup;

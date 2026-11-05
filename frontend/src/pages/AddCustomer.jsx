// src/pages/AddCustomer.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddCustomer() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (formData.phone.length !== 10) {
      setMessage("❌ Phone number exactly 10 digits ka hona chahiye");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/customers", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      if (response.status === 401) {
        
        window.location.href = "/login";
        return;
      }

      const result = await response.json();

      if (response.ok) {
        setMessage(`✅ Customer "${result.name}" registered successfully!`);
        setTimeout(() => navigate("/add-loan"), 1500);
      } else {
        setMessage(`❌ ${result.message}`);
      }
    } catch (error) {
      setMessage("❌ Connection error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "40px auto", padding: "30px", background: "white", borderRadius: "15px", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
      <h2 style={{ color: "#2c3e50", textAlign: "center", marginBottom: "30px" }}>👤 Register New Customer</h2>

      {message && (
        <p style={{ 
          padding: "12px", borderRadius: "8px", textAlign: "center", fontWeight: "bold",
          backgroundColor: message.startsWith("✅") ? "#e8f5e9" : "#ffebee",
          color: message.startsWith("✅") ? "#2e7d32" : "#c62828"
        }}>
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div>
          <label style={{ fontWeight: "600", display: "block", marginBottom: "8px" }}>Full Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Ramesh Kumar"
            required
            style={{ width: "100%", padding: "12px", border: "1px solid #ddd", borderRadius: "8px" }}
          />
        </div>

        <div>
          <label style={{ fontWeight: "600", display: "block", marginBottom: "8px" }}>Mobile Number:</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="10-digit number"
            maxLength={10}
            required
            style={{ width: "100%", padding: "12px", border: "1px solid #ddd", borderRadius: "8px" }}
          />
        </div>

        <div>
          <label style={{ fontWeight: "600", display: "block", marginBottom: "8px" }}>Home Address:</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Vill/Town/City"
            rows={3}
            style={{ width: "100%", padding: "12px", border: "1px solid #ddd", borderRadius: "8px", resize: "none" }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "15px",
            background: loading ? "#ccc" : "#3498db",
            color: "white", border: "none", borderRadius: "8px",
            cursor: loading ? "not-allowed" : "pointer",
            fontWeight: "bold", fontSize: "1rem"
          }}
        >
          {loading ? "⌛ Saving..." : "Register Customer"}
        </button>
      </form>
    </div>
  );
}

export default AddCustomer;

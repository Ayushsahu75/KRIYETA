// src/pages/AddCustomer.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus, ArrowRight } from "lucide-react";
import Success3DModal from "../components/Success3DModal";
import API_URL from "../api";

export default function AddCustomer() {
  const [formData, setFormData] = useState({ name: "", phone: "", address: "" });
  const [msg, setMsg]           = useState({ text: "", type: "" });
  const [loading, setLoading]   = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [createdClient, setCreatedClient] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ text: "", type: "" });

    if (formData.phone.length !== 10) {
      setMsg({ text: "Phone number must be exactly 10 digits.", type: "error" });
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/customers`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData),
      });
      if (res.status === 401) { window.location.href = "/login"; return; }
      const result = await res.json();
      if (res.ok) {
        setCreatedClient(result.name);
        setShowSuccess(true);
      } else {
        setMsg({ text: result.message || "Registration failed.", type: "error" });
      }
    } catch {
      setMsg({ text: "Connection error. Please try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    navigate("/add-loan");
  };

  return (
    <div className="form-page page-enter">
      {/* 3D Success Popup Animation */}
      <Success3DModal
        isOpen={showSuccess}
        onClose={handleSuccessClose}
        title="Client Registered!"
        subtitle={`"${createdClient}" has been successfully added to your client directory.`}
      />

      <div className="page-heading" style={{ marginBottom: 32 }}>
        <div>
          <h1>Register <span>Client</span></h1>
          <p>Add a new customer to your directory</p>
        </div>
      </div>

      <div className="form-card">
        {msg.text && <div className={`alert ${msg.type}`}>{msg.text}</div>}

        <div style={{ marginBottom: 28 }}>
          <p className="form-section-title">Client Information</p>
          <form onSubmit={handleSubmit}>
            <div className="form-grid" style={{ gap: 20 }}>
              <div className="field-wrapper">
                <label htmlFor="name">Full Name</label>
                <input
                  id="name" type="text" name="name"
                  value={formData.name} onChange={handleChange}
                  placeholder="e.g. Ramesh Kumar" required
                />
              </div>

              <div className="field-wrapper">
                <label htmlFor="phone">Mobile Number</label>
                <input
                  id="phone" type="tel" name="phone"
                  value={formData.phone} onChange={handleChange}
                  placeholder="10-digit number" maxLength={10} required
                />
                <span className="field-hint">Must be exactly 10 digits</span>
              </div>

              <div className="field-wrapper">
                <label htmlFor="address">
                  Home Address
                  <span style={{ fontWeight: 400, letterSpacing: 0, textTransform: "none", fontSize: 11, marginLeft: 6, color: "var(--ink-subtle)" }}>(optional)</span>
                </label>
                <textarea
                  id="address" name="address"
                  value={formData.address} onChange={handleChange}
                  placeholder="Village / Town / City" rows={3}
                />
              </div>

              <button
                className="primary-button" type="submit" disabled={loading}
                style={{ width: "100%", height: 50, fontSize: 12, letterSpacing: "0.14em" }}
              >
                {loading ? (
                  <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Saving…</>
                ) : (
                  <><UserPlus size={15} /> Register Client <ArrowRight size={14} /></>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

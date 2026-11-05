// src/pages/AddLoan.jsx
import { useState, useEffect } from "react";

function AddLoan() {
  const [formData, setFormData] = useState({
    customerId: "",
    jewelleryType: "",
    weight: "",
    carat: "",
    amount: "",
    interestRate: "",
    startDate: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/customers", {
          headers: { "Authorization": `Bearer ${token}` }
        });

        if (res.status === 401) {
          window.location.href = "/login";
          return;
        }

        const data = await res.json();
        setCustomers(data);
      } catch (err) {
        console.error("Customers fetch failed");
      }
    };
    fetchCustomers();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => data.append(key, formData[key]));
      if (selectedFile) data.append("image", selectedFile);

      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/loans", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: data,
      });

      if (response.status === 401) {
        window.location.href = "/login";
        return;
      }

      const result = await response.json();

      if (response.ok) {
        setMessage("✅ Loan entry created successfully!");
        setFormData({
          customerId: "", jewelleryType: "", weight: "", carat: "",
          amount: "", interestRate: "", startDate: ""
        });
        setSelectedFile(null);
      } else {
        setMessage(`❌ Error: ${result.message}`);
      }
    } catch (error) {
      setMessage("❌ Failed to reach server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto", background: "white", borderRadius: "15px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
      <h2 style={{ color: "#2c3e50", textAlign: "center", marginBottom: "30px" }}>➕ New Girvi Registration</h2>

      {message && (
        <div style={{ 
          padding: "15px", borderRadius: "8px", marginBottom: "20px", 
          textAlign: "center", backgroundColor: message.startsWith("✅") ? "#e8f5e9" : "#ffebee",
          color: message.startsWith("✅") ? "#2e7d32" : "#c62828",
          fontWeight: "bold"
        }}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        {/* Customer Select */}
        <div style={{ gridColumn: "span 2" }}>
          <label style={{ fontWeight: "600", display: "block", marginBottom: "8px" }}>👤 Select Customer:</label>
          <select
            name="customerId"
            value={formData.customerId}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ddd" }}
          >
            <option value="">-- Choose Customer --</option>
            {customers.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name} ({c.phone})
              </option>
            ))}
          </select>
        </div>

        {/* Jewellery Details */}
        <div>
          <label style={{ fontWeight: "600", display: "block", marginBottom: "8px" }}>💍 Item Type:</label>
          <input type="text" name="jewelleryType" value={formData.jewelleryType}
            onChange={handleChange} placeholder="e.g. Ring" required
            style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ddd" }} />
        </div>

        <div>
          <label style={{ fontWeight: "600", display: "block", marginBottom: "8px" }}>⚖️ Weight (g):</label>
          <input type="number" name="weight" value={formData.weight}
            onChange={handleChange} placeholder="0.00" required
            style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ddd" }} />
        </div>

        <div>
          <label style={{ fontWeight: "600", display: "block", marginBottom: "8px" }}>🥇 Purity (Carat):</label>
          <input type="number" name="carat" value={formData.carat}
            onChange={handleChange} placeholder="22" required
            style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ddd" }} />
        </div>

        <div>
          <label style={{ fontWeight: "600", display: "block", marginBottom: "8px" }}>📅 Start Date:</label>
          <input type="date" name="startDate" value={formData.startDate}
            onChange={handleChange} required
            style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ddd" }} />
        </div>

        {/* Financials */}
        <div>
          <label style={{ fontWeight: "600", display: "block", marginBottom: "8px" }}>💰 Principal Amount (₹):</label>
          <input type="number" name="amount" value={formData.amount}
            onChange={handleChange} placeholder="10000" required
            style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ddd" }} />
        </div>

        <div>
          <label style={{ fontWeight: "600", display: "block", marginBottom: "8px" }}>📈 Interest Rate (%):</label>
          <input type="number" name="interestRate" value={formData.interestRate}
            onChange={handleChange} placeholder="2" required
            style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ddd" }} />
        </div>

        {/* Upload */}
        <div style={{ gridColumn: "span 2" }}>
          <label style={{ fontWeight: "600", display: "block", marginBottom: "8px" }}>📸 Photo Attachment:</label>
          <div style={{ 
            border: "2px dashed #ddd", padding: "20px", borderRadius: "10px", 
            textAlign: "center", position: "relative", cursor: "pointer",
            backgroundColor: "#fafafa"
          }}>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setSelectedFile(e.target.files[0])}
              style={{ opacity: 0, position: "absolute", top: 0, left: 0, width: "100%", height: "100%", cursor: "pointer" }}
            />
            {selectedFile ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                <span>📎 {selectedFile.name}</span>
                <img src={URL.createObjectURL(selectedFile)} alt="preview" style={{ width: "50px", borderRadius: "4px" }} />
              </div>
            ) : (
              <span style={{ color: "#888" }}>📁 Click or drag image to upload</span>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            gridColumn: "span 2",
            padding: "16px",
            backgroundColor: loading ? "#bdbcbc" : "#4CAF50",
            color: "white", border: "none", borderRadius: "10px",
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: "1.1rem", fontWeight: "bold",
            marginTop: "10px", boxShadow: "0 4px 10px rgba(76, 175, 80, 0.3)"
          }}
        >
          {loading ? "⌛ Saving Entry..." : "Submit Loan Record"}
        </button>
      </form>
    </div>
  );
}

export default AddLoan;

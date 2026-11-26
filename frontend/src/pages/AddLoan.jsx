// src/pages/AddLoan.jsx
import { useState, useEffect } from "react";
import { HandCoins, Upload, CheckCircle2 } from "lucide-react";
import Success3DModal from "../components/Success3DModal";

export default function AddLoan() {
  const [formData, setFormData] = useState({
    customerId: "", jewelleryType: "", weight: "",
    carat: "", amount: "", interestRate: "", startDate: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview]           = useState(null);
  const [customers, setCustomers]       = useState([]);
  const [msg, setMsg]                   = useState({ text: "", type: "" });
  const [loading, setLoading]           = useState(false);
  const [showSuccess, setShowSuccess]   = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/customers", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 401) { window.location.href = "/login"; return; }
        setCustomers(await res.json());
      } catch { /* silent */ }
    })();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFile = (e) => {
    const f = e.target.files[0];
    setSelectedFile(f);
    setPreview(f ? URL.createObjectURL(f) : null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ text: "", type: "" });

    try {
      const data = new FormData();
      Object.keys(formData).forEach((k) => data.append(k, formData[k]));
      if (selectedFile) data.append("image", selectedFile);

      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/loans", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });
      if (res.status === 401) { window.location.href = "/login"; return; }
      const result = await res.json();

      if (res.ok) {
        setShowSuccess(true);
        setFormData({ customerId: "", jewelleryType: "", weight: "", carat: "", amount: "", interestRate: "", startDate: "" });
        setSelectedFile(null);
        setPreview(null);
      } else {
        setMsg({ text: result.message || "Failed to create entry.", type: "error" });
      }
    } catch {
      setMsg({ text: "Could not reach server.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page page-enter">
      {/* 3D Success Popup Animation */}
      <Success3DModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        title="Loan Record Created!"
        subtitle="The jewellery pledge record has been securely saved to the ledger."
      />

      <div className="page-heading" style={{ marginBottom: 32 }}>
        <div>
          <h1>New Loan <span>Entry</span></h1>
          <p>Register a new girvi or pledge record</p>
        </div>
      </div>

      <div className="form-card">
        {msg.text && (
          <div className={`alert ${msg.type}`}>
            {msg.type === "success" && <CheckCircle2 size={16} />}
            {msg.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* ── Client ── */}
          <p className="form-section-title" style={{ marginBottom: 16 }}>Client</p>
          <div className="form-grid" style={{ marginBottom: 32 }}>
            <div className="field-wrapper">
              <label htmlFor="customerId">Select Client</label>
              <select id="customerId" name="customerId" value={formData.customerId} onChange={handleChange} required>
                <option value="">— Choose a registered client —</option>
                {customers.map((c) => (
                  <option key={c._id} value={c._id}>{c.name} ({c.phone})</option>
                ))}
              </select>
            </div>
          </div>

          {/* ── Jewellery ── */}
          <p className="form-section-title" style={{ marginBottom: 16 }}>Jewellery Details</p>
          <div className="form-grid form-grid-2" style={{ marginBottom: 32 }}>
            <div className="field-wrapper">
              <label htmlFor="jewelleryType">Item Type</label>
              <input id="jewelleryType" type="text" name="jewelleryType"
                value={formData.jewelleryType} onChange={handleChange}
                placeholder="e.g. Ring, Necklace, Bangle" required />
            </div>
            <div className="field-wrapper">
              <label htmlFor="carat">Purity (Carat)</label>
              <input id="carat" type="number" name="carat"
                value={formData.carat} onChange={handleChange} placeholder="22" required />
            </div>
            <div className="field-wrapper">
              <label htmlFor="weight">Weight (grams)</label>
              <input id="weight" type="number" name="weight" step="0.01"
                value={formData.weight} onChange={handleChange} placeholder="0.00" required />
            </div>
            <div className="field-wrapper">
              <label htmlFor="startDate">Start Date</label>
              <input id="startDate" type="date" name="startDate"
                value={formData.startDate} onChange={handleChange} required />
            </div>
          </div>

          {/* ── Financials ── */}
          <p className="form-section-title" style={{ marginBottom: 16 }}>Financial Terms</p>
          <div className="form-grid form-grid-2" style={{ marginBottom: 32 }}>
            <div className="field-wrapper">
              <label htmlFor="amount">Principal Amount (₹)</label>
              <input id="amount" type="number" name="amount"
                value={formData.amount} onChange={handleChange} placeholder="10,000" required />
            </div>
            <div className="field-wrapper">
              <label htmlFor="interestRate">Interest Rate</label>
              <input id="interestRate" type="number" name="interestRate" step="0.1"
                value={formData.interestRate} onChange={handleChange} placeholder="2" required />
              <span className="field-hint">% per month</span>
            </div>
          </div>

          {/* ── Photo ── */}
          <p className="form-section-title" style={{ marginBottom: 16 }}>
            Photo Attachment
            <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0, fontSize: 11, color: "var(--ink-subtle)", marginLeft: 8 }}>optional</span>
          </p>
          <div style={{ marginBottom: 32 }}>
            <label className="upload-zone" htmlFor="imgUpload">
              <input id="imgUpload" type="file" accept="image/*" onChange={handleFile} />
              {preview ? (
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <img src={preview} alt="preview" style={{
                    width: 64, height: 64, objectFit: "cover",
                    borderRadius: 8, border: "1px solid rgba(201,168,76,.4)"
                  }} />
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--gold-dark)" }}>{selectedFile?.name}</div>
                    <div style={{ fontSize: 11.5, color: "var(--ink-subtle)", marginTop: 2 }}>Click to change</div>
                  </div>
                </div>
              ) : (
                <div className="upload-label">
                  <Upload size={24} strokeWidth={1.3} />
                  <span><strong>Click to upload</strong> or drag &amp; drop</span>
                  <span>JPG, PNG, WEBP — max 5 MB</span>
                </div>
              )}
            </label>
          </div>

          <button
            className="primary-button"
            type="submit"
            disabled={loading}
            style={{ width: "100%", height: 52, fontSize: 12, letterSpacing: "0.16em" }}
          >
            {loading ? (
              <><span className="spinner" style={{ width: 17, height: 17, borderWidth: 2 }} /> Saving entry…</>
            ) : (
              <><HandCoins size={16} /> Submit Loan Record</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

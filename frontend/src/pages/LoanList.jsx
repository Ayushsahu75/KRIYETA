// src/pages/LoanList.jsx — with Auth Loop Fix
import { useState, useEffect } from "react";

function LoanList() {
  const [loans, setLoans]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");
  const [search, setSearch]   = useState("");
  const [filter, setFilter]   = useState("all"); 

  useEffect(() => { fetchLoans(); }, []);

  const fetchLoans = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const res  = await fetch("http://localhost:5000/api/loans", {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (res.status === 401) {
        
        window.location.href = "/login";
        return;
      }

      const data = await res.json();
      if (res.ok) setLoans(data);
      else setError("Loans load nahi hue.");
    } catch {
      setError("Server se connect nahi ho paya.");
    } finally {
      setLoading(false);
    }
  };

  const closeLoan = async (id) => {
    if (!window.confirm("Kya aap is loan ko close karna chahte ho?")) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:5000/api/loans/${id}/close`, { 
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (res.status === 401) {
        window.location.href = "/login";
        return;
      }

      if (res.ok) fetchLoans();
      else alert("❌ Loan close nahi hua.");
    } catch {
      alert("❌ Server error.");
    }
  };

  const filtered = loans.filter((loan) => {
    const name = loan.customerId?.name?.toLowerCase() || "";
    const matchesSearch = name.includes(search.toLowerCase());
    const matchesFilter = filter === "all" || loan.status === filter;
    return matchesSearch && matchesFilter;
  });

  if (loading) return <p style={{ padding: "40px" }}>🔍 Searching records...</p>;

  return (
    <div style={{ padding: "10px" }}>
      <h2 style={{ color: "#2c3e50", marginBottom: "20px" }}>📋 All Girvi Records</h2>

      {/* Control Bar */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "25px", flexWrap: "wrap", background: "#fff", padding: "15px", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
        <input
          type="text"
          placeholder="🔍 Search by customer name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, padding: "10px", borderRadius: "6px", border: "1px solid #ddd", minWidth: "250px" }}
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ddd", cursor: "pointer" }}
        >
          <option value="all">📁 All Status</option>
          <option value="active">🟢 Active Only</option>
          <option value="closed">⚪ Closed Only</option>
        </select>
        <span style={{ alignSelf: "center", fontWeight: "bold", color: "#3498db" }}>
          Count: {filtered.length}
        </span>
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "50px", background: "#fff", borderRadius: "10px" }}>
          <p style={{ fontSize: "1.2rem", color: "#95a5a6" }}>No records found matching your criteria.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
          {filtered.map((loan) => (
            <div key={loan._id} style={{
              border: "1px solid #eee",
              borderRadius: "12px",
              padding: "20px",
              background: loan.status === "closed" ? "#fdfdfd" : "white",
              boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
              position: "relative",
              overflow: "hidden"
            }}>
              {/* Status Banner */}
              <div style={{
                position: "absolute", top: "15px", right: "-35px",
                padding: "5px 40px", transform: "rotate(45deg)",
                background: loan.status === "active" ? "#4CAF50" : "#95a5a6",
                color: "white", fontSize: "10px", fontWeight: "bold"
              }}>
                {loan.status.toUpperCase()}
              </div>

              {loan.imageUrl ? (
                <img
                  src={`http://localhost:5000${loan.imageUrl}`}
                  alt="Jewellery"
                  style={{ width: "100%", height: "180px", objectFit: "cover", borderRadius: "8px", marginBottom: "15px", border: "1px solid #eee" }}
                />
              ) : (
                <div style={{ width: "100%", height: "140px", background: "#f8f9fa", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", color: "#bdc3c7", marginBottom: "15px" }}>
                  📷 No Image Available
                </div>
              )}

              <h3 style={{ margin: "0 0 8px 0", color: "#2c3e50" }}>👤 {loan.customerId?.name || "Unknown"}</h3>
              <p style={{ margin: "4px 0", color: "#7f8c8d" }}>📞 {loan.customerId?.phone}</p>
              <p style={{ margin: "4px 0", fontStyle: "italic" }}>💍 {loan.jewelleryType} | {loan.weight}g | {loan.carat}K</p>

              <div style={{ borderTop: "1px solid #eee", margin: "15px 0", paddingTop: "15px" }}>
                <p style={{ margin: "4px 0", display: "flex", justifyContent: "space-between" }}>
                  <span>Principal:</span> <strong>₹{loan.amount}</strong>
                </p>
                <p style={{ margin: "4px 0", display: "flex", justifyContent: "space-between" }}>
                  <span>Rate:</span> <span>{loan.interestRate}% / month</span>
                </p>
                <p style={{ margin: "4px 0", display: "flex", justifyContent: "space-between", color: "#e67e22" }}>
                  <span>Interest:</span> <span>₹{loan.interest}</span>
                </p>
                <p style={{ margin: "8px 0 0", display: "flex", justifyContent: "space-between", fontSize: "1.1rem", borderTop: "2px solid #3498db", paddingTop: "8px" }}>
                  <span>Total Payable:</span> <strong style={{ color: "#2c3e50" }}>₹{loan.total}</strong>
                </p>
              </div>

              {loan.status === "active" && (
                <button
                  onClick={() => closeLoan(loan._id)}
                  style={{
                    width: "100%", padding: "12px",
                    backgroundColor: "#f44336",
                    color: "white", border: "none", borderRadius: "8px",
                    cursor: "pointer", fontWeight: "bold", marginTop: "10px",
                    transition: "background 0.2s"
                  }}
                  onMouseOver={(e) => e.target.style.background = "#d32f2f"}
                  onMouseOut={(e) => e.target.style.background = "#f44336"}
                >
                  ✅ Mark as Closed
                </button>
              )}

              {loan.status === "closed" && (
                <p style={{ fontSize: "12px", color: "#7f8c8d", textAlign: "center", marginTop: "15px", background: "#f1f2f6", padding: "8px", borderRadius: "5px" }}>
                  🔒 Settled on: {new Date(loan.closeDate).toLocaleDateString("en-IN")}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default LoanList;

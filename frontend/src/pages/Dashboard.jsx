// src/pages/Dashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("token");
      if (!token) return; // 🛡️ Safety: Don't even try without a token
      try {
        const res = await fetch("http://localhost:5000/api/loans/stats", {
          headers: { "Authorization": `Bearer ${token}` }
        });

        if (res.status === 401) {
          
          window.location.href = "/login";
          return;
        }

        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const cardStyle = {
    background: "white",
    borderRadius: "12px",
    padding: "24px",
    textAlign: "center",
    boxShadow: "0 4px 15px rgba(0,0,0,0.06)",
    minWidth: "200px",
    flex: 1,
    transition: "transform 0.2s",
  };

  if (loading) return <p style={{ padding: "40px", fontSize: "1.2rem" }}>📊 Loading dashboard stats...</p>;
  if (!stats)  return <p style={{ padding: "40px", color:"red" }}>Failed to load dashboard data.</p>;

  return (
    <div style={{ animation: "fadeIn 0.5s" }}>
      <h2 style={{ marginBottom: "25px", fontSize: "1.8rem", color: "#2c3e50" }}>📊 Dashboard Overview</h2>

      {/* Stat Cards */}
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginBottom: "40px" }}>
        <div style={{ ...cardStyle, borderTop: "6px solid #4CAF50" }}>
          <div style={{ fontSize: "40px", marginBottom: "10px" }}>🟢</div>
          <div style={{ fontSize: "36px", fontWeight: "bold", color: "#333" }}>{stats.activeLoans}</div>
          <div style={{ color: "#7f8c8d", fontWeight: "500", textTransform: "uppercase", fontSize: "0.85rem" }}>Active Loans</div>
        </div>

        <div style={{ ...cardStyle, borderTop: "6px solid #95a5a6" }}>
          <div style={{ fontSize: "40px", marginBottom: "10px" }}>⚪</div>
          <div style={{ fontSize: "36px", fontWeight: "bold", color: "#333" }}>{stats.closedLoans}</div>
          <div style={{ color: "#7f8c8d", fontWeight: "500", textTransform: "uppercase", fontSize: "0.85rem" }}>Closed Loans</div>
        </div>

        <div style={{ ...cardStyle, borderTop: "6px solid #3498db" }}>
          <div style={{ fontSize: "40px", marginBottom: "10px" }}>💰</div>
          <div style={{ fontSize: "36px", fontWeight: "bold", color: "#3498db" }}>₹{stats.totalAmount.toLocaleString("en-IN")}</div>
          <div style={{ color: "#7f8c8d", fontWeight: "500", textTransform: "uppercase", fontSize: "0.85rem" }}>Total Capital Lent</div>
        </div>

        <div style={{ ...cardStyle, borderTop: "6px solid #f39c12" }}>
          <div style={{ fontSize: "40px", marginBottom: "10px" }}>📈</div>
          <div style={{ fontSize: "36px", fontWeight: "bold", color: "#f39c12" }}>₹{stats.totalInterest.toLocaleString("en-IN")}</div>
          <div style={{ color: "#7f8c8d", fontWeight: "500", textTransform: "uppercase", fontSize: "0.85rem" }}>Anticipated Interest</div>
        </div>

        <div style={{ ...cardStyle, borderTop: "6px solid #9b59b6" }}>
          <div style={{ fontSize: "40px", marginBottom: "10px" }}>🏷️</div>
          <div style={{ fontSize: "36px", fontWeight: "bold", color: "#9b59b6" }}>₹{stats.totalRecoverable.toLocaleString("en-IN")}</div>
          <div style={{ color: "#7f8c8d", fontWeight: "500", textTransform: "uppercase", fontSize: "0.85rem" }}>Total Recoverable</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ background: "white", padding: "30px", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
        <h3 style={{ marginBottom: "20px", color: "#34495e" }}>⚡ Quick Actions</h3>
        <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
          <button onClick={() => navigate("/add-loan")}
            style={{ padding: "14px 28px", background: "#4CAF50", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", fontSize: "1rem" }}>
            ➕ Add New Loan
          </button>
          <button onClick={() => navigate("/add-customer")}
            style={{ padding: "14px 28px", background: "#3498db", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", fontSize: "1rem" }}>
            👤 Add Customer
          </button>
          <button onClick={() => navigate("/loans")}
            style={{ padding: "14px 28px", background: "#f39c12", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", fontSize: "1rem" }}>
            📋 View All Loans
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

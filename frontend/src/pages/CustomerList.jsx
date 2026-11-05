// src/pages/CustomerList.jsx
import { useState, useEffect } from "react";

function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");

  useEffect(() => { fetchCustomers(); }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res  = await fetch("http://localhost:5000/api/customers", {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (res.status === 401) {
        
        window.location.href = "/login";
        return;
      }

      const data = await res.json();
      if (res.ok) setCustomers(data);
      else setError("Customers load nahi hue.");
    } catch {
      setError("Server se connect nahi ho paya.");
    } finally {
      setLoading(false);
    }
  };

  const deleteCustomer = async (id) => {
    if (!window.confirm("⚠️ Kya aap is customer ko delete karna chahte ho? Isse inke saare loans pe asar pad sakta hai!")) return;
    
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/customers/${id}`, { 
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (res.status === 401) {
        window.location.href = "/login";
        return;
      }

      if (res.ok) fetchCustomers();
      else alert("❌ Error deleting customer.");
    } catch {
      alert("❌ Server error.");
    }
  };

  if (loading) return <p style={{ padding: "40px" }}>👥 Loading customer database...</p>;
  if (error)   return <p style={{ padding: "40px", color: "red" }}>{error}</p>;

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
      <h2 style={{ color: "#2c3e50", marginBottom: "25px" }}>👥 Customer Directory</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
        {customers.length === 0 ? (
          <p>No customers registered yet.</p>
        ) : (
          customers.map((c) => (
            <div key={c._id} style={{
              background: "white", padding: "20px", borderRadius: "12px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.05)", border: "1px solid #eee",
              display: "flex", flexDirection: "column"
            }}>
              <div style={{ fontSize: "40px", marginBottom: "15px", textAlign: "center" }}>👤</div>
              <h3 style={{ margin: "0 0 10px 0", textAlign: "center", color: "#333" }}>{c.name}</h3>
              <p style={{ margin: "5px 0", color: "#666" }}>📞 <strong>Phone:</strong> {c.phone}</p>
              <p style={{ margin: "5px 0", color: "#666", flexGrow: 1 }}>🏠 <strong>Address:</strong> {c.address || "N/A"}</p>
              
              <div style={{ display: "flex", gap: "8px", marginTop: "20px" }}>
                <button 
                  onClick={() => deleteCustomer(c._id)}
                  style={{ flex: 1, padding: "10px", background: "#fee", color: "#e74c3c", border: "1px solid #fcc", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default CustomerList;

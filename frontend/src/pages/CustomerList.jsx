// src/pages/CustomerList.jsx
import { useState, useEffect } from "react";
import { Phone, MapPin, Trash2, Users } from "lucide-react";

const initials = (name = "") =>
  name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase() || "?";

export default function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const [search, setSearch]       = useState("");

  useEffect(() => { fetchCustomers(); }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://kriyeta.onrender.com/api/customers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) { window.location.href = "/login"; return; }
      const data = await res.json();
      if (res.ok) setCustomers(data);
      else setError("Failed to load clients.");
    } catch {
      setError("Could not connect to server.");
    } finally {
      setLoading(false);
    }
  };

  const deleteCustomer = async (id) => {
    if (!window.confirm("Remove this client? Associated loan records may be affected.")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://kriyeta.onrender.com/api/customers/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) { window.location.href = "/login"; return; }
      if (res.ok) fetchCustomers();
      else alert("Error removing client.");
    } catch { alert("Server error."); }
  };

  const filtered = customers.filter((c) =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.phone?.includes(search)
  );

  if (loading) return <div className="loading-wrap"><div className="spinner" />Loading clients…</div>;

  return (
    <div className="page-enter">
      <div className="page-heading">
        <div>
          <h1>Client <span>Directory</span></h1>
          <p>{customers.length} registered client{customers.length !== 1 ? "s" : ""}</p>
        </div>
      </div>

      <div className="control-bar">
        <input
          className="search-input"
          type="text"
          placeholder="Search by name or phone…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span className="count-badge">
          {filtered.length} {filtered.length === 1 ? "client" : "clients"}
        </span>
      </div>

      {error && <div className="alert error">{error}</div>}

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><Users size={28} strokeWidth={1.2} /></div>
          <h3>{search ? "No matches found" : "No clients yet"}</h3>
          <p>{search ? "Try a different search term." : "Register your first client to begin."}</p>
        </div>
      ) : (
        <div className="cards-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}>
          {filtered.map((c) => (
            <div key={c._id} className="customer-card">
              <div className="customer-avatar">{initials(c.name)}</div>
              <h3 className="customer-name">{c.name}</h3>
              <div className="customer-detail">
                <Phone size={13} strokeWidth={2} />
                {c.phone}
              </div>
              {c.address && (
                <div className="customer-detail">
                  <MapPin size={13} strokeWidth={2} />
                  {c.address}
                </div>
              )}
              <div className="customer-actions">
                <button className="btn-delete" onClick={() => deleteCustomer(c._id)}>
                  <Trash2 size={13} /> Remove Client
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

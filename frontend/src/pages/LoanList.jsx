// src/pages/LoanList.jsx
import { useState, useEffect } from "react";
import { CheckCircle2, Camera, Gem, ArrowUpDown } from "lucide-react";
import Success3DModal from "../components/Success3DModal";
import SettleLoanModal from "../components/SettleLoanModal";

export default function LoanList() {
  const [loans, setLoans]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const [search, setSearch]       = useState("");
  const [filter, setFilter]       = useState("all");
  
  // Settle modal state
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [settleLoading, setSettleLoading] = useState(false);

  // Success 3D modal state
  const [showSuccess, setShowSuccess] = useState(false);
  const [settledCustomer, setSettledCustomer] = useState("");

  useEffect(() => { fetchLoans(); }, []);

  const fetchLoans = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:5000/api/loans", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) { window.location.href = "/login"; return; }
      const data = await res.json();
      if (res.ok) setLoans(data);
      else setError("Failed to load records.");
    } catch {
      setError("Could not connect to server.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenSettle = (loan) => {
    setSelectedLoan(loan);
  };

  const handleConfirmSettle = async (id, customerName, paidAmount) => {
    setSettleLoading(true);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:5000/api/loans/${id}/close`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ paidAmount }),
      });

      if (res.status === 401) {
        window.location.href = "/login";
        return;
      }

      if (res.ok) {
        setSelectedLoan(null);
        setSettledCustomer(customerName || "Customer");
        setShowSuccess(true);
        fetchLoans();
      } else {
        const data = await res.json();
        alert(data.message || "Failed to settle loan.");
      }
    } catch {
      alert("Server connection error.");
    } finally {
      setSettleLoading(false);
    }
  };

  const filtered = loans.filter((l) => {
    const name = l.customerId?.name?.toLowerCase() || "";
    return name.includes(search.toLowerCase()) && (filter === "all" || l.status === filter);
  });

  if (loading) return <div className="loading-wrap"><div className="spinner" />Loading records…</div>;

  return (
    <div className="page-enter">
      {/* 3D Custom Settlement Confirmation Modal */}
      <SettleLoanModal
        isOpen={Boolean(selectedLoan)}
        onClose={() => !settleLoading && setSelectedLoan(null)}
        loan={selectedLoan}
        onConfirm={handleConfirmSettle}
        loading={settleLoading}
      />

      {/* 3D Success Popup Animation */}
      <Success3DModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        title="Loan Settled!"
        subtitle={`The loan for "${settledCustomer}" has been marked as fully paid and closed.`}
      />

      <div className="page-heading">
        <div>
          <h1>Loan <span>Records</span></h1>
          <p>All girvi &amp; pledge entries — your complete ledger</p>
        </div>
      </div>

      {/* Control bar */}
      <div className="control-bar">
        <input
          className="search-input"
          type="text"
          placeholder="Search by client name…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="filter-select"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Records</option>
          <option value="active">Active Only</option>
          <option value="closed">Settled Only</option>
        </select>
        <span className="count-badge">
          {filtered.length} {filtered.length === 1 ? "record" : "records"}
        </span>
      </div>

      {error && <div className="alert error">{error}</div>}

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><Gem size={28} strokeWidth={1.2} /></div>
          <h3>No records found</h3>
          <p>{search ? "Try a different search term." : "No loan entries match the current filter."}</p>
        </div>
      ) : (
        <div className="cards-grid">
          {filtered.map((loan) => (
            <article key={loan._id} className={`loan-card${loan.status === "closed" ? " closed" : ""}`}>
              {/* Jewellery image */}
              {loan.imageUrl ? (
                <img
                  className="loan-card-image"
                  src={`http://localhost:5000${loan.imageUrl}`}
                  alt={`${loan.jewelleryType} belonging to ${loan.customerId?.name}`}
                />
              ) : (
                <div className="loan-card-image-placeholder">
                  <Camera size={26} strokeWidth={1.2} />
                  <span>No photograph</span>
                </div>
              )}

              <div className="loan-card-body">
                {/* Header */}
                <div className="loan-card-header">
                  <div>
                    <h3 className="loan-card-name">{loan.customerId?.name || "Unknown"}</h3>
                    <p className="loan-card-phone">{loan.customerId?.phone}</p>
                  </div>
                  <span className={`chip ${loan.status}`}>
                    <span style={{
                      width: 5, height: 5, borderRadius: "50%",
                      background: loan.status === "active" ? "var(--active-text)" : "var(--closed-text)",
                      display: "inline-block", flexShrink: 0,
                    }} />
                    {loan.status === "active" ? "Active" : "Settled"}
                  </span>
                </div>

                {/* Jewellery meta pill row */}
                <div className="loan-card-meta">
                  <div className="loan-meta-item">
                    <div className="loan-meta-label">Item</div>
                    <div className="loan-meta-value">{loan.jewelleryType}</div>
                  </div>
                  <div className="loan-meta-item">
                    <div className="loan-meta-label">Weight</div>
                    <div className="loan-meta-value">{loan.weight}g</div>
                  </div>
                  <div className="loan-meta-item">
                    <div className="loan-meta-label">Purity</div>
                    <div className="loan-meta-value">{loan.carat}K</div>
                  </div>
                </div>

                {/* Financials */}
                <div className="loan-financials">
                  <div className="loan-row">
                    <span className="loan-row-label">Principal</span>
                    <span className="loan-row-value">₹{Number(loan.amount).toLocaleString("en-IN")}</span>
                  </div>
                  <div className="loan-row">
                    <span className="loan-row-label">Rate</span>
                    <span className="loan-row-value">{loan.interestRate}% / month</span>
                  </div>
                  <div className="loan-row">
                    <span className="loan-row-label">Interest</span>
                    <span className="loan-row-value" style={{ color: "var(--gold-dark)" }}>
                      ₹{Number(loan.interest).toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="loan-total-row">
                    <span className="loan-total-label">Total Payable</span>
                    <span className="loan-total-value">₹{Number(loan.total).toLocaleString("en-IN")}</span>
                  </div>
                </div>

                {/* CTA / Settled status */}
                {loan.status === "active" && (
                  <button className="close-loan-btn" onClick={() => handleOpenSettle(loan)}>
                    <CheckCircle2 size={16} strokeWidth={2.2} />
                    Mark as Settled
                  </button>
                )}
                {loan.status === "closed" && (
                  <div className="settled-tag">
                    ✓ Settled on {new Date(loan.closeDate).toLocaleDateString("en-IN", {
                      day: "numeric", month: "short", year: "numeric",
                    })}
                    {loan.paidAmount ? ` • Paid: ₹${Number(loan.paidAmount).toLocaleString("en-IN")}` : ""}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

// src/pages/LoanList.jsx
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Camera,
  CheckCircle2,
  ChevronRight,
  Gem,
  UsersRound,
} from "lucide-react";
import Success3DModal from "../components/Success3DModal";
import SettleLoanModal from "../components/SettleLoanModal";

const normalizeName = (value) => String(value || "").trim().replace(/\s+/g, " ").toLowerCase();
const normalizePhone = (value) => String(value || "").replace(/\D/g, "");

function groupLoansByCustomer(loans) {
  const parents = loans.map((_, index) => index);
  const find = (index) => {
    if (parents[index] !== index) parents[index] = find(parents[index]);
    return parents[index];
  };
  const merge = (first, second) => {
    const firstRoot = find(first);
    const secondRoot = find(second);
    if (firstRoot !== secondRoot) parents[secondRoot] = firstRoot;
  };

  const identities = new Map();
  loans.forEach((loan, index) => {
    const customer = loan.customerId && typeof loan.customerId === "object" ? loan.customerId : {};
    const name = normalizeName(customer.name);
    const phone = normalizePhone(customer.phone);
    [name && `name:${name}`, phone && `phone:${phone}`].filter(Boolean).forEach((identity) => {
      if (identities.has(identity)) merge(index, identities.get(identity));
      else identities.set(identity, index);
    });
  });

  const groups = new Map();
  loans.forEach((loan, index) => {
    const root = find(index);
    if (!groups.has(root)) groups.set(root, { loans: [], names: new Set(), phones: new Set() });

    const customer = loan.customerId && typeof loan.customerId === "object" ? loan.customerId : {};
    const group = groups.get(root);
    group.loans.push(loan);
    if (customer.name) group.names.add(String(customer.name));
    if (customer.phone) group.phones.add(String(customer.phone));
  });

  return Array.from(groups.values()).map((group) => {
    const nameCounts = new Map();
    group.loans.forEach((loan) => {
      const name = String(loan.customerId?.name || "").trim();
      if (name) nameCounts.set(name, (nameCounts.get(name) || 0) + 1);
    });
    const displayName = Array.from(nameCounts.entries())
      .sort((first, second) => second[1] - first[1])[0]?.[0] || "Unknown client";
    const loanIds = group.loans.map((loan) => loan._id).filter(Boolean).sort();

    return {
      ...group,
      displayName,
      phone: Array.from(group.phones)[0] || "",
      key: loanIds[0] || displayName,
    };
  });
}

const formatDate = (value) => {
  if (!value) return "Date unavailable";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date unavailable";
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

function LoanCard({ loan, customerName, customerPhone, onSettle }) {
  return (
    <article className={`loan-card${loan.status === "closed" ? " closed" : ""}`}>
      {loan.imageUrl ? (
        <img
          className="loan-card-image"
          src={`http://localhost:5000${loan.imageUrl}`}
          alt={`${loan.jewelleryType} belonging to ${loan.customerId?.name || customerName}`}
        />
      ) : (
        <div className="loan-card-image-placeholder">
          <Camera size={26} strokeWidth={1.2} />
          <span>No photograph</span>
        </div>
      )}

      <div className="loan-card-body">
        <div className="loan-card-header">
          <div>
            <h3 className="loan-card-name">{loan.customerId?.name || customerName}</h3>
            <p className="loan-card-phone">{loan.customerId?.phone || customerPhone}</p>
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

        <div className="loan-date-row">
          <CalendarDays size={14} />
          <span>Loan date</span>
          <strong>{formatDate(loan.startDate)}</strong>
        </div>

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

        {loan.status === "active" && (
          <button className="close-loan-btn" onClick={() => onSettle(loan)}>
            <CheckCircle2 size={16} strokeWidth={2.2} />
            Mark as Settled
          </button>
        )}
        {loan.status === "closed" && (
          <div className="settled-tag">
            ✓ Settled on {formatDate(loan.closeDate)}
            {loan.paidAmount ? ` • Paid: ₹${Number(loan.paidAmount).toLocaleString("en-IN")}` : ""}
          </div>
        )}
      </div>
    </article>
  );
}

export default function LoanList() {
  const [loans, setLoans]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const [search, setSearch]       = useState("");
  const [filter, setFilter]       = useState("all");
  const [selectedCustomerKey, setSelectedCustomerKey] = useState("");
  
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

  const customerGroups = groupLoansByCustomer(loans);
  const query = search.trim().toLowerCase();
  const visibleCustomers = customerGroups.filter((group) => {
    const hasMatchingLoan = group.loans.some((loan) => filter === "all" || loan.status === filter);
    const matchesSearch = !query || [...group.names, ...group.phones]
      .some((value) => String(value).toLowerCase().includes(query));
    return hasMatchingLoan && matchesSearch;
  });
  const selectedCustomer = customerGroups.find((group) => group.key === selectedCustomerKey);
  const selectedLoans = selectedCustomer?.loans
    .filter((loan) => filter === "all" || loan.status === filter)
    .sort((first, second) => new Date(second.startDate) - new Date(first.startDate)) || [];

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
          <p>{selectedCustomer
            ? `Pledged items and loan details for ${selectedCustomer.displayName}`
            : "Select a client to view their girvi and pledge entries"}</p>
        </div>
      </div>

      {/* Control bar */}
      <div className="control-bar">
        <input
          className="search-input"
          type="text"
          placeholder="Search by client name or phone…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setSelectedCustomerKey("");
          }}
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
          {selectedCustomer
            ? `${selectedLoans.length} ${selectedLoans.length === 1 ? "record" : "records"}`
            : `${visibleCustomers.length} ${visibleCustomers.length === 1 ? "client" : "clients"}`}
        </span>
      </div>

      {error && <div className="alert error">{error}</div>}

      {selectedCustomer ? (
        <>
          <div className="selected-customer-heading">
            <button
              type="button"
              className="back-to-customers"
              onClick={() => setSelectedCustomerKey("")}
            >
              <ArrowLeft size={15} />
              All clients
            </button>
            <div className="selected-customer-title">
              <UsersRound size={17} />
              <span>{selectedCustomer.displayName}</span>
            </div>
          </div>

          {selectedLoans.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon"><Gem size={28} strokeWidth={1.2} /></div>
              <h3>No matching loan records</h3>
              <p>Try changing the status filter to see this client’s other records.</p>
            </div>
          ) : (
            <div className="cards-grid">
              {selectedLoans.map((loan) => (
                <LoanCard
                  key={loan._id}
                  loan={loan}
                  customerName={selectedCustomer.displayName}
                  customerPhone={selectedCustomer.phone}
                  onSettle={handleOpenSettle}
                />
              ))}
            </div>
          )}
        </>
      ) : visibleCustomers.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><Gem size={28} strokeWidth={1.2} /></div>
          <h3>No clients found</h3>
          <p>{search ? "Try a different name or phone number." : "No clients have loan records matching this filter."}</p>
        </div>
      ) : (
        <div className="customer-record-list">
          {visibleCustomers.map((group) => {
            const matchingLoans = group.loans.filter((loan) => filter === "all" || loan.status === filter);
            return (
              <button
                type="button"
                key={group.key}
                className="customer-record-row"
                onClick={() => setSelectedCustomerKey(group.key)}
              >
                <span className="customer-record-icon"><UsersRound size={17} /></span>
                <span className="customer-record-info">
                  <span className="customer-record-name">{group.displayName}</span>
                  <span className="customer-record-count">
                    {matchingLoans.length} {matchingLoans.length === 1 ? "loan record" : "loan records"}
                  </span>
                </span>
                <ChevronRight className="customer-record-chevron" size={18} />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

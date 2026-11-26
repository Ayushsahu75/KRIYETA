import React, { useState } from "react";
import { CheckCircle2, X, AlertTriangle, ShieldCheck, IndianRupee } from "lucide-react";

export default function SettleLoanModal({ isOpen, onClose, loan, onConfirm, loading }) {
  const [customPaidAmount, setCustomPaidAmount] = useState("");

  if (!isOpen || !loan) return null;

  const totalPayable = loan.total || (Number(loan.amount) + Number(loan.interest || 0));
  const finalAmount = customPaidAmount !== "" ? customPaidAmount : totalPayable;

  const handleConfirm = () => {
    onConfirm(loan._id, loan.customerId?.name, Number(finalAmount));
  };

  return (
    <div className="modal-3d-backdrop" onClick={!loading ? onClose : undefined}>
      <div className="settle-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Close icon */}
        <button className="settle-modal-close" onClick={onClose} disabled={loading}>
          <X size={18} />
        </button>

        <div className="settle-modal-icon-wrap">
          <div className="settle-modal-orb">
            <CheckCircle2 size={38} strokeWidth={2.2} />
          </div>
        </div>

        <h3 className="settle-modal-title">Settle &amp; Close Loan</h3>
        <p className="settle-modal-subtitle">
          Confirm loan settlement for <strong style={{ color: "var(--ink-on-dark)" }}>{loan.customerId?.name || "Customer"}</strong>.
        </p>

        {/* Loan summary box */}
        <div className="settle-summary-box">
          <div className="settle-row">
            <span>Jewellery Item</span>
            <strong>{loan.jewelleryType} ({loan.carat}K / {loan.weight}g)</strong>
          </div>
          <div className="settle-row">
            <span>Principal Amount</span>
            <strong>₹{Number(loan.amount).toLocaleString("en-IN")}</strong>
          </div>
          <div className="settle-row">
            <span>Accrued Interest ({loan.interestRate}%/mo)</span>
            <strong style={{ color: "var(--gold-light)" }}>₹{Number(loan.interest || 0).toLocaleString("en-IN")}</strong>
          </div>
          <div className="settle-row settle-highlight">
            <span>Total Calculated</span>
            <strong style={{ color: "var(--gold-light)", fontSize: "16px" }}>₹{Number(totalPayable).toLocaleString("en-IN")}</strong>
          </div>
        </div>

        {/* Optional final received amount input */}
        <div className="settle-input-group">
          <label>Received Amount (₹)</label>
          <div className="settle-input-wrap">
            <IndianRupee size={16} />
            <input
              type="number"
              placeholder={totalPayable}
              value={customPaidAmount}
              onChange={(e) => setCustomPaidAmount(e.target.value)}
              disabled={loading}
            />
          </div>
          <span className="settle-hint">Default is the calculated total (₹{Number(totalPayable).toLocaleString("en-IN")})</span>
        </div>

        <div className="settle-actions">
          <button className="settle-cancel-btn" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button className="settle-confirm-btn" onClick={handleConfirm} disabled={loading}>
            {loading ? (
              <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> Settling...
              </span>
            ) : (
              "Confirm Settlement"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

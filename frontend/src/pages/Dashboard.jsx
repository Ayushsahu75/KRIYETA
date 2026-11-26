// src/pages/Dashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  HandCoins, CheckCircle2, IndianRupee, TrendingUp,
  Plus, UserPlus, List, ArrowRight, Users
} from "lucide-react";

/* ── 3D Interactive Tilt Stat Card ── */
const StatCard = ({ label, value, icon: Icon, isCurrency }) => {
  const [style, setStyle] = useState({});

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;

    setStyle({
      transform: `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.03, 1.03, 1.03)`,
      "--mx": `${x}px`,
      "--my": `${y}px`,
    });
  };

  const handleMouseLeave = () => {
    setStyle({
      transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
      transition: "transform 0.5s ease",
    });
  };

  return (
    <div
      className="stat-card"
      style={style}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="stat-card-glow"></div>
      <div className="stat-icon"><Icon size={18} strokeWidth={1.5} /></div>
      <div className={`stat-value${isCurrency ? " currency" : ""}`}>{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
};

export default function Dashboard() {
  const [stats, setStats]   = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await fetch("http://localhost:5000/api/loans/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 401) { window.location.href = "/login"; return; }
        setStats(await res.json());
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const fmt = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

  if (loading)
    return (
      <div className="loading-wrap">
        <div className="spinner" />
        Loading portfolio…
      </div>
    );
  if (!stats)
    return <div className="alert error" style={{ marginTop: 32 }}>Failed to load dashboard. Please try again.</div>;

  const yieldPct =
    stats.totalAmount > 0
      ? (((stats.totalRecoverable - stats.totalAmount) / stats.totalAmount) * 100).toFixed(1)
      : null;

  return (
    <div className="page-enter">
      {/* Page heading */}
      <div className="page-heading">
        <div>
          <h1>Portfolio <span>Overview</span></h1>
          <p>Your jewellery finance dashboard — live summary</p>
        </div>
        <button className="quick-action primary" onClick={() => navigate("/add-loan")}>
          <Plus size={15} /> New Loan Entry
        </button>
      </div>

      {/* ── 3D Stat cards ── */}
      <div className="stat-grid">
        <StatCard label="Active Loans"         value={stats.activeLoans}             icon={HandCoins} />
        <StatCard label="Closed Loans"         value={stats.closedLoans}             icon={CheckCircle2} />
        <StatCard label="Total Capital Lent"   value={fmt(stats.totalAmount)}        icon={IndianRupee} isCurrency />
        <StatCard label="Anticipated Interest" value={fmt(stats.totalInterest)}      icon={TrendingUp}  isCurrency />
        <StatCard label="Total Recoverable"    value={fmt(stats.totalRecoverable)}   icon={IndianRupee} isCurrency />
      </div>

      {/* ── Recovery progress ── */}
      {stats.totalRecoverable > 0 && (
        <div className="panel" style={{ padding: "26px 32px", marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold-dark)", marginBottom: 4 }}>
                Portfolio Recovery Rate
              </div>
              <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 28, fontWeight: 600, color: "var(--ink)", lineHeight: 1 }}>
                {yieldPct ? `${yieldPct}%` : "—"} <span style={{ fontSize: 14, fontFamily: "Inter, sans-serif", fontWeight: 400, color: "var(--ink-muted)" }}>interest yield</span>
              </div>
            </div>
            <div style={{ textAlign: "right", fontSize: 12.5, color: "var(--ink-muted)", lineHeight: 1.7 }}>
              <div>Lent: <strong style={{ color: "var(--ink)" }}>{fmt(stats.totalAmount)}</strong></div>
              <div>Recoverable: <strong style={{ color: "var(--gold-dark)" }}>{fmt(stats.totalRecoverable)}</strong></div>
            </div>
          </div>
          {/* track */}
          <div style={{ background: "var(--cream-2)", borderRadius: 100, height: 6, overflow: "hidden" }}>
            <div style={{
              height: "100%",
              borderRadius: 100,
              background: "linear-gradient(90deg, var(--gold-dark), var(--gold-light))",
              width: `${Math.min(100, Math.round((stats.totalAmount / stats.totalRecoverable) * 100))}%`,
              transition: "width .8s ease",
              boxShadow: "0 0 8px rgba(201,168,76,.5)"
            }} />
          </div>
        </div>
      )}

      {/* ── Quick actions ── */}
      <div className="panel" style={{ padding: "28px 32px" }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold-dark)", marginBottom: 20 }}>
          Quick Actions
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button className="quick-action primary" onClick={() => navigate("/add-loan")}>
            <Plus size={14} /> Add New Loan
          </button>
          <button className="quick-action secondary" onClick={() => navigate("/add-customer")}>
            <UserPlus size={14} /> Register Client
          </button>
          <button className="quick-action secondary" onClick={() => navigate("/loans")}>
            <List size={14} /> All Loans <ArrowRight size={13} />
          </button>
          <button className="quick-action secondary" onClick={() => navigate("/customers")}>
            <Users size={14} /> Client Directory <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

// src/App.jsx

import { BrowserRouter, Routes, Route, Link, useLocation, Navigate, useNavigate } from "react-router-dom";
import AddLoan      from "./pages/AddLoan";
import LoanList     from "./pages/LoanList";
import AddCustomer  from "./pages/AddCustomer";
import CustomerList from "./pages/CustomerList";
import Dashboard    from "./pages/Dashboard";
import Login        from "./pages/Login";
import Signup       from "./pages/Signup";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ProtectedRoute from "./components/ProtectedRoute";

const NavBtn = ({ to, label, icon }) => {
  const location = useLocation();
  const active = location.pathname === to;
  
  return (
    <Link
      to={to}
      style={{
        padding: "8px 16px",
        background: active ? "#333" : "transparent",
        color: active ? "white" : "#333",
        border: "1px solid #ccc",
        borderRadius: "6px",
        cursor: "pointer",
        textDecoration: "none",
        fontSize: "14px",
        fontWeight: active ? "bold" : "normal",
        display: "flex",
        alignItems: "center",
        gap: "6px",
        transition: "all 0.2s"
      }}
    >
      {icon} {label}
    </Link>
  );
};

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";

  if (isAuthPage) return null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav style={{
      padding: "12px 20px",
      background: "#fff",
      borderBottom: "1px solid #eee",
      display: "flex",
      gap: "10px",
      alignItems: "center",
      flexWrap: "wrap",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      position: "sticky",
      top: 0,
      zIndex: 100
    }}>
      <strong style={{ marginRight: "15px", fontSize: "1.2rem", color: "#333" }}>💎 KRIYETA</strong>
      <NavBtn to="/" label="Dashboard" icon="📊" />
      <NavBtn to="/loans" label="Loan List" icon="📋" />
      <NavBtn to="/add-loan" label="Add Loan" icon="➕" />
      <NavBtn to="/customers" label="Customers" icon="👥" />
      <NavBtn to="/add-customer" label="Add Customer" icon="👤" />
      
      <button 
        onClick={handleLogout}
        style={{
          marginLeft: "auto",
          padding: "8px 16px",
          background: "#f44336",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontWeight: "bold"
        }}
      >
        🚪 Logout
      </button>
    </nav>
  );
};

function App() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  if (!googleClientId) {
    throw new Error("VITE_GOOGLE_CLIENT_ID is missing from frontend/.env");
  }

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <BrowserRouter>
        <div style={{ minHeight: "100vh", background: "#f5f7fa" }}>
        <Navbar />
        
        <div style={{ padding: "20px" }}>
          <Routes>
            {/* 🔓 PUBLIC */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* 🔒 PROTECTED */}
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/loans" element={<ProtectedRoute><LoanList /></ProtectedRoute>} />
            <Route path="/add-loan" element={<ProtectedRoute><AddLoan /></ProtectedRoute>} />
            <Route path="/customers" element={<ProtectedRoute><CustomerList /></ProtectedRoute>} />
            <Route path="/add-customer" element={<ProtectedRoute><AddCustomer /></ProtectedRoute>} />

            {/* Redirect any other route to home */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;

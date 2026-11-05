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
import { Gem, LayoutDashboard, Users, UserPlus, HandCoins, Plus, LogOut } from "lucide-react";
import ProtectedRoute from "./components/ProtectedRoute";

const NavBtn = ({ to, label, icon: Icon }) => {
  const location = useLocation();
  const active = location.pathname === to;

  return (
    <Link to={to} className={`nav-link${active ? " active" : ""}`}>
      <Icon size={17} strokeWidth={2} />
      {label}
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
    <header className="app-header">
      <Link to="/" className="brand">
        <span className="brand-mark"><Gem size={19} /></span>
        KRIYETA
      </Link>
      <nav className="app-nav" aria-label="Primary navigation">
        <NavBtn to="/" label="Dashboard" icon={LayoutDashboard} />
        <NavBtn to="/loans" label="Loans" icon={HandCoins} />
        <NavBtn to="/add-loan" label="New loan" icon={Plus} />
        <NavBtn to="/customers" label="Customers" icon={Users} />
        <NavBtn to="/add-customer" label="Add customer" icon={UserPlus} />
      </nav>
      <button className="logout-button" onClick={handleLogout}>
        <LogOut size={17} /> Logout
      </button>
    </header>
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
        <div className="app-shell">
          <Navbar />
          <main className="app-main">
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
          </main>
        </div>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;

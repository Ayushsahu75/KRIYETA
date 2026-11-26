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
  const { pathname } = useLocation();
  const active = pathname === to;
  return (
    <Link to={to} className={`nav-link${active ? " active" : ""}`}>
      <Icon size={14} strokeWidth={2} />
      {label}
    </Link>
  );
};

const Navbar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  if (pathname === "/login" || pathname === "/signup") return null;

  return (
    <header className="app-header">
      <Link to="/" className="brand">
        <span className="brand-mark"><Gem size={18} /></span>
        <span className="brand-text">
          <span className="brand-name">Kriyeta</span>
          <span className="brand-tagline">Jewellery Finance</span>
        </span>
      </Link>

      <nav className="app-nav" aria-label="Primary navigation">
        <NavBtn to="/"             label="Dashboard"    icon={LayoutDashboard} />
        <div className="nav-sep" />
        <NavBtn to="/loans"        label="Loans"        icon={HandCoins} />
        <NavBtn to="/add-loan"     label="New Loan"     icon={Plus} />
        <div className="nav-sep" />
        <NavBtn to="/customers"    label="Clients"      icon={Users} />
        <NavBtn to="/add-customer" label="Add Client"   icon={UserPlus} />
      </nav>

      <button className="logout-button" onClick={() => { localStorage.removeItem("token"); navigate("/login"); }}>
        <LogOut size={13} /> Sign out
      </button>
    </header>
  );
};

function App() {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  if (!clientId) throw new Error("VITE_GOOGLE_CLIENT_ID is missing from frontend/.env");

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <BrowserRouter>
        <div className="app-shell">
          <Navbar />
          <main className="app-main">
            <Routes>
              <Route path="/login"        element={<Login />} />
              <Route path="/signup"       element={<Signup />} />
              <Route path="/"             element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/loans"        element={<ProtectedRoute><LoanList /></ProtectedRoute>} />
              <Route path="/add-loan"     element={<ProtectedRoute><AddLoan /></ProtectedRoute>} />
              <Route path="/customers"    element={<ProtectedRoute><CustomerList /></ProtectedRoute>} />
              <Route path="/add-customer" element={<ProtectedRoute><AddCustomer /></ProtectedRoute>} />
              <Route path="*"             element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;

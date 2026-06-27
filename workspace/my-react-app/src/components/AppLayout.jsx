import { useNavigate, useLocation } from "react-router";
import "../styles/AppLayout.css";

export default function AppLayout({ children, user }) {
  const navigate = useNavigate();
  const location = useLocation();

  function handleLogout() {
    fetch("http://localhost:30040/logout", {
      method: "POST",
      credentials: "include",
    }).then(() => {
      window.location.href = "/login";
    });
  }

  function isActive(path) {
    return location.pathname === path ? "nav-btn-active" : "";
  }

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <p className="sidebar-app-name">FinanceApp</p>
          <p className="sidebar-user">
            {user?.first_name} {user?.last_name}
          </p>
        </div>

        <p className="nav-label">MAIN</p>

        <button className={`nav-btn ${isActive("/")}`} onClick={() => navigate("/")}>
          Home
        </button>

        <button className={`nav-btn ${isActive("/transactions")}`} onClick={() => navigate("/transactions")}>
          Transactions
        </button>

        <button className={`nav-btn ${isActive("/budgets")}`} onClick={() => navigate("/budgets")}>
          Budgets
        </button>

        <button className={`nav-btn ${isActive("/goals")}`} onClick={() => navigate("/goals")}>
          Goals
        </button>

        <button className={`nav-btn ${isActive("/simulator")}`} onClick={() => navigate("/simulator")}>
          Simulator
        </button>

        <p className="nav-label">OTHER</p>

        <button className={`nav-btn ${isActive("/notifications")}`} onClick={() => navigate("/notifications")}>
          Notifications
        </button>

        <button className={`nav-btn ${isActive("/settings")}`} onClick={() => navigate("/settings")}>
          Settings
        </button>

        <button className="logout-btn" onClick={handleLogout}>
          Log out
        </button>
      </aside>

      <main className="main-content">
        {children}
      </main>
    </div>
  );
}
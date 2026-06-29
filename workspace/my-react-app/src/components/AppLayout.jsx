import { useNavigate, useLocation } from "react-router";
import "../styles/AppLayout.css";

export default function AppLayout({ user, children }) {
  const navigate = useNavigate();
  const location = useLocation();

  async function handleLogout() {
    const res = await fetch("http://88.200.63.148:30040/api/logout", {
      method: "POST",
      credentials: "include",
    })
    
    const data = await res.json();

    if (res.ok) {
      navigate("/login");
      window.location.reload(); 
    } else {
      setMessage(data.message || "Logout failed.");
    }
  }

  function isActive(path) {
    return location.pathname === path ? "active" : "";
  }

  return (
    <div className="layout">
      <div className="sidebar">
        <h3>Budget Tracker</h3>

        <p>
          {user.first_name} {user.last_name}
        </p>

        <br/>

        <button className={isActive("/")} onClick={() => navigate("/")}>
          Home
        </button>

        <button className={isActive("/transactions")} onClick={() => navigate("/transactions")}>
          Transactions
        </button>

        <button className={isActive("/budgets")} onClick={() => navigate("/budgets")}>
          Budgets
        </button>

        <button className={isActive("/goals")} onClick={() => navigate("/goals")}>
          Goals
        </button>

        <button className={isActive("/simulator")} onClick={() => navigate("/simulator")}>
          Simulator
        </button>

        <hr />

        <button className={isActive("/notifications")} onClick={() => navigate("/notifications") }>
          Notifications
        </button>

        <button className={isActive("/settings")} onClick={() => navigate("/settings")}>
          Settings
        </button>

        <button onClick={handleLogout}>Logout</button>
      </div>

      <div className="main-content">
        {children}
      </div>
    </div>
  );
}
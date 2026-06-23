import { useNavigate, useLocation } from "react-router";
import "../styles/AppLayout.css";

export default function AppLayout({ children, user, setUser }) {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Transactions", path: "/transactions" },
    { label: "Budgets", path: "/budgets" },
    { label: "Goals", path: "/goals" },
    { label: "Simulator", path: "/simulator" },
  ];

  const bottomItems = [
    { label: "Notifications", path: "/notifications" },
    { label: "Settings", path: "/settings" },
  ];

  function handleLogout() {
    fetch("http://localhost:30040/logout", { method: "POST", credentials: "include" })
      .then(() => window.location.href = "/login");
  }

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <p className="sidebar-app-name">FinanceApp</p>
          <p className="sidebar-user">{user?.first_name} {user?.last_name}</p>
        </div>

        <div className="sidebar-nav">
          <p className="nav-label">MAIN</p>
          {navItems.map(item => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`nav-btn ${location.pathname === item.path ? "nav-btn-active" : ""}`}
            >
              {item.label}
            </button>
          ))}

          <p className="nav-label" style={{ marginTop: "8px" }}>OTHER</p>
          {bottomItems.map(item => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`nav-btn ${location.pathname === item.path ? "nav-btn-active" : ""}`}
            >
              {item.label}
            </button>
          ))}
        </div>

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
export default function LandingPage({ onNavigate }) {
  return (
    <div>
      <h1>Budget Tracker</h1>
      <p>Welcome to the application.</p>

      <button onClick={() => onNavigate("login")}>
        Login
      </button>

      <button onClick={() => onNavigate("register")}>
        Register
      </button>
    </div>
  );
}
import { useNavigate } from "react-router";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Budget Tracker</h1>
      <p>Welcome to the application.</p>

      <button onClick={() => navigate("/login")}>
        Login
      </button>

      <button onClick={() => navigate("/register")}>
        Register
      </button>
    </div>
  );
}
import { useState } from "react";
import { useNavigate, Link } from "react-router";

const API_URL = "http://localhost:30040";

export default function Login({ setUser }) {
  const [email, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setMessage("");

    try {
      const res = await fetch(`${API_URL}/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          password,
        })
      });

      const data = await res.json();
      console.log("Login response:", data);

      if (res.ok) {
        setUser(data.user);
        navigate("/");
      } else {
        setMessage(data.message || "Login failed.");
      }
    } catch (err) {
      console.log("Login error:", err);
      setMessage("Login error. Please try again.");
    }
  };

  return (
    <div>
      <h1>Login</h1>

      {message && <p>{message}</p>}

      <input
        name="email"
        type="email"
        placeholder="Email"
        onChange={(event) => setUsername(event.target.value)}
      />
      <br />

      <input
        name="password"
        type="password"
        placeholder="Password"
        onChange={(event) => setPassword(event.target.value)}
      />
      <br />

      <button onClick={handleLogin}>Login</button>

      <p>
        Register account{" "}
        <button onClick={() => navigate("/register")}>Register</button>
      </p>
    </div>
  );
}
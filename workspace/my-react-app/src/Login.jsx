import { useState } from "react";
import { useNavigate, Link } from "react-router";

export default function Login({ setUser }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    fetch("http://localhost:30040/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          setUser(data.user);
          navigate("/app"); // go to dashboard
        } else {
          setMessage(data.error);
        }
      })
      .catch((err) => setMessage(err.message));
  };

  return (
    <div>
      <h1>Login</h1>

      {message && <p>{message}</p>}

      <input
        name="email"
        type="email"
        placeholder="Email"
        onChange={handleChange}
      />
      <br />

      <input
        name="password"
        type="password"
        placeholder="Password"
        onChange={handleChange}
      />
      <br />

      <button onClick={handleSubmit}>Login</button>

      <p>
        Don't have an account?{" "}
        <Link to="/register">
          <button>Register</button>
        </Link>
      </p>
    </div>
  );
}
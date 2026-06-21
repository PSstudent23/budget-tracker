import { useState } from "react";

export default function Login({ onLogin }) {
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
      credentials: "include", // ✅ THIS IS REQUIRED
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) onLogin(data.user);
        else setMessage(data.error);
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
        <button onClick={() => onLogin(null, "register")}>Register</button>
      </p>
    </div>
  );
}
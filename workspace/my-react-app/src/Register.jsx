import { useState } from "react";

export default function Register({ onNavigate }) {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    fetch("http://localhost:30040/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) onNavigate("login");
        else setMessage(data.error);
      })
      .catch((err) => setMessage(err.message));
  };

  return (
    <div>
      <h1>Register</h1>

      {message && <p>{message}</p>}

      <input
        name="first_name"
        placeholder="First Name"
        onChange={handleChange}
      />
      <br />

      <input
        name="last_name"
        placeholder="Last Name"
        onChange={handleChange}
      />
      <br />

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

      <button onClick={handleSubmit}>Register</button>

      <p>
        Already have an account?{" "}
        <button onClick={() => onNavigate("login")}>Login</button>
      </p>
    </div>
  );
}
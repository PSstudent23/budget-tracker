import { useState } from "react";
import { useNavigate, Link } from "react-router";

export default function Register({ setUser }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    monthly_income: "", 
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    fetch("http://localhost:30040/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          navigate("/login"); 
        } else {
          setMessage(data.error);
        }
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

      <input
        name="monthly_income"
        type="number"
        placeholder="Monthly Income"
        onChange={handleChange}
      />
      <br />

      <button onClick={handleSubmit}>Register</button>

      <p>
        Already have an account?{" "}
        <Link to="/login">
          <button>Login</button>
        </Link>
      </p>
    </div>
  );
}
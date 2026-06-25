import { useState } from "react";
import { useNavigate, Link } from "react-router";

export default function Register({ setUser }) {
  const navigate = useNavigate();

  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [monthly_income, setMonthlyIncome] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    try {
      const res = await fetch("http://localhost:30040/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          first_name,
          last_name,
          email,
          password,
          monthly_income
        }),
      });

      const data = await res.json();

      console.log("Register response:", data);

      if (res.ok) {
        setMessage("Registration successful.");
        navigate("/login");
      } else {
        setMessage(data.message || "Registration failed.");
      }
    } catch (err) {
      console.error("Register error:", err);
      setMessage("Registration error. Please try again.");
    }
  };

  return (
    <div>
      <h1>Register</h1>

      {message && <p>{message}</p>}

      <input
        name="first_name"
        placeholder="First Name"
        onChange={(event) => setFirstName(event.target.value)}
      />
      <br />

      <input
        name="last_name"
        placeholder="Last Name"
        onChange={(event) => setLastName(event.target.value)}
      />
      <br />

      <input
        name="email"
        type="email"
        placeholder="Email"
        onChange={(event) => setEmail(event.target.value)}
      />
      <br />

      <input
        name="password"
        type="password"
        placeholder="Password"
        onChange={(event) => setPassword(event.target.value)}
      />
      <br />

      <input
        name="monthly_income"
        type="number"
        placeholder="Monthly Income"
        onChange={(event) => setMonthlyIncome(event.target.value)}
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
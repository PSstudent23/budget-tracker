import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import "../styles/Settings.css"


export default function Settings({ user }) {
  const [first_name, setFirstName] = useState(user.first_name);
  const [last_name, setLastName] = useState(user.last_name);
  const [email, setEmail] = useState(user.email);
  const [monthly_income, setMonthlyIncome] = useState(user.monthly_income);
  
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("")

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    try {
      const res = await fetch("http://localhost:30040/api/users/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          first_name,
          last_name,
          email,
          monthly_income,
          current_password: password,
          new_password: newPassword
        })
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || "success.");
        handleLogout()
      } else {
        setMessage(data.message || "Change Failed.");
      }

    } catch (err) {
      console.error("Pass error:", err);
      setMessage("Error with password");
    }
  };

  async function handleLogout() {
    const res = await fetch("http://localhost:30040/api/logout", {
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
    
  
return (
  <div className="profile">
    <h2>Profile</h2>

    <p>{message}</p>

    <div className="profile-card">
      <input
        type="text"
        placeholder="first_name"
        value={first_name}
        onChange={(e) => setFirstName(e.target.value)}
      />

      <input
        type="text"
        placeholder="last_name"
        value={last_name}
        onChange={(e) => setLastName(e.target.value )}
      />

      <input
        type="email"
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="number"
        placeholder="monthly_income"
        value={monthly_income}
        onChange={(e) => setMonthlyIncome(e.target.value)}
      />

      <hr />

      <input
        type="password"
        placeholder="current_password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <input
        type="password"
        placeholder="new_password"
        onChange={(e) => setNewPassword(e.target.value)}
      />

      <div className="submit-button">
        <button onClick={handleSubmit}>Submit changes</button>
      </div>
    </div>
  </div>
);
}
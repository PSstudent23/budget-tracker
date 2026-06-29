import { useState } from "react";
import { useNavigate, Link } from "react-router";
import "../styles/Transactions.css"



export default function AddGoal() {
  const navigate = useNavigate();


  const [name, setName] = useState("");
  const [target_amount, setTargetAmount] = useState("");
  const [target_date, setTargetDate] = useState("");
  const [status, setStatus] = useState("not_started");
  const [priority, setPriority] = useState(5);
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    try {
      const res = await fetch("http://localhost:30040/api/goals/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
            name,
            target_amount,
            target_date,
            status,
            priority,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        navigate("/goals");
      } else {
        setMessage(data.message || "Adding goal failed.");
      }
    } catch (err) {
      console.error("Goals error:", err);
      setMessage("Error adding goal");
    }
  };

  return (
    
    <div>
      <div className="add-transactions">
        <h1>Add Goal</h1>

        {message}

        <div className="add-transactions-card">
          <p>Goal Name</p>
          <input
            type="string"
            placeholder="Goal name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <p>Target amount</p>
          <input
            type="number"
            step="0.01"
            placeholder="Target amount"
            value={target_amount}
            onChange={(e) => setTargetAmount(e.target.value)}
          />

          <p>Target date</p>
          <input
            type="date"
            value={target_date}
            onChange={(e) => setTargetDate(e.target.value)}
          />

          <p>Goal priority</p>
          <input
            type="text"
            placeholder="Priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          />

          <div className="submit-button">
            <button onClick={handleSubmit}>Add Goal</button>
          </div>
        </div>
      </div>
    </div>
  );
}

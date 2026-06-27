import { useState } from "react";
import { useNavigate, Link } from "react-router";


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
      const res = await fetch("http://localhost:30040/goals/add", {
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
      <h1>Add Transaction</h1>

      {message}

      <input
        type="text"
        placeholder="Goal name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <br />

      <input
        type="number"
        step="0.01"
        placeholder="Target amount"
        value={target_amount}
        onChange={(e) => setTargetAmount(e.target.value)}
      />
      <br />

      <input
        type="date"
        value={target_date}
        onChange={(e) => setTargetDate(e.target.value)}
      />
      <br />

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option value="not_started">Not Started</option>
        <option value="in_progress">In Progress</option>
        <option value="behind">Behind</option>
        <option value="completed">Completed</option>
      </select>
      <br />

      <input
        type="number"
        placeholder="Priority"
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
      />
      <br />

      <button onClick={handleSubmit}>Add Goal</button>
    </div>
  );
}

import { useState } from "react";
import { useNavigate, Link } from "react-router";


export default function AddTransaction() {
  const navigate = useNavigate();


  const [category_id, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [goal_id, setGoal] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    try {
      const res = await fetch("http://localhost:30040/transactions/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          category_id,
          amount,
          date,
          description,
          goal_id: goal_id ? Number(goal_id) : null
        }),
      });

      const data = await res.json();

      if (res.ok) {
        navigate("/transactions");
      } else {
        setMessage(data.message || "Adding transaction failed.");
      }
    } catch (err) {
      console.error("Transaction error:", err);
      setMessage("Error adding transaction");
    }
  };

  return (
    <div>
      <h1>Add Transaction</h1>

      {message}

      <input
        type="number"
        placeholder="Category ID"
        value={category_id}
        onChange={(e) => setCategory(e.target.value)}
      />
      <br />

      <input
        type="number"
        step="0.01"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <br />

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <br />

      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <br />

      <input
        type="number"
        placeholder="Goal ID (optional)"
        value={goal_id}
        onChange={(e) => setGoal(e.target.value)}
      />
      <br />

      <button onClick={handleSubmit}>Add Transaction</button>
    </div>
  );
}

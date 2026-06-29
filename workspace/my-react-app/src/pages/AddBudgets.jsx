import { useState } from "react";
import { useNavigate, Link } from "react-router";
import "../styles/AddBudgets.css"


export default function AddBudgets() {
  const navigate = useNavigate();

  const [category_id, setCategory] = useState("");
  const [start_date, setStartDate] = useState("");
  const [end_date, setEndDate] = useState("");
  const [budget_limit, setBudgetLimit] = useState("");
  const [is_active, setActive] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    try {
      const res = await fetch("http://localhost:30040/budgets/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          category_id,
          start_date,
          end_date,
          budget_limit,
          is_active: is_active ? Number(is_active) : Number(0)
        }),
      });

      const data = await res.json();

      if (res.ok) {
        navigate("/budgets");
      } else {
        setMessage(data.message || "Adding budget failed.");
      }
    } catch (err) {
      console.error("Budget error:", err);
      setMessage("Error adding budget");
    }
  };

  return (
  <div className="add-budgets">
    <h1>Add Budget</h1>

    {message && <p className="message">{message}</p>}

    <div className="add-budgets-card">
      <p>Select Category</p>
      <input
        type="number"
        placeholder="Category ID"
        value={category_id}
        onChange={(e) => setCategory(e.target.value)}
      />

      <p>Start date for budget</p>
      <input
        type="date"
        value={start_date}
        onChange={(e) => setStartDate(e.target.value)}
      />

      <p>End date for budget</p>
      <input
        type="date"
        value={end_date}
        onChange={(e) => setEndDate(e.target.value)}
      />

      <p>Budget limit</p>
      <input
        type="number"
        placeholder="Budget limit"
        value={budget_limit}
        onChange={(e) => setBudgetLimit(e.target.value)}
      />

      <p>Is active (0 / 1)</p>
      <input
        type="number"
        placeholder="Is active (0 / 1)"
        value={is_active}
        onChange={(e) => setActive(e.target.value)}
      />

      <div className="submit-button">
        <button onClick={handleSubmit}>Add Budget</button>
      </div>
    </div>
  </div>
);
}

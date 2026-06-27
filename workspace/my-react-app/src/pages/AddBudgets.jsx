import { useState } from "react";
import { useNavigate, Link } from "react-router";

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
    <div>
      <h1>Add Budget</h1>

      {message }

      <input
        type="number"
        placeholder="Category ID"
        value={category_id}
        onChange={(e) => setCategory(e.target.value)}
      />
      <br />

      <input
        type="date"
        placeholder="Start_date"
        value={start_date}
        onChange={(e) => setStartDate(e.target.value)}
      />
      <br />

      <input
        type="date"
        placeholder="End_Date"
        value={end_date}
        onChange={(e) => setEndDate(e.target.value)}
      />
      <br />

      <input
        type="number"
        placeholder="budget_limit"
        value={budget_limit}
        onChange={(e) => setBudgetLimit(e.target.value)}
      />
      <br />

      <input
        type="number"
        placeholder="is_active"
        value={is_active}
        onChange={(e) => setActive(e.target.value)}
      />
      <br />

      <button onClick={handleSubmit}>Add Budget</button>
    </div>
  );
}

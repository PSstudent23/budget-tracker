import { useEffect, useState } from "react";
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
  const [categories, setCategories] = useState([]);

    useEffect (() => {
        async function getCategories() {
          const res2 = await fetch("http://88.200.63.148:30040/api/categories", {
          credentials: "include"
          });
  
          const data2 = await res2.json();
          setCategories(data2);
  
          
        }
        getCategories();
   
      }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    try {
      const res = await fetch("http://88.200.63.148:30040/api/budgets/add", {
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
      <p>Category</p>
      <select
        value={category_id}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="">Select category</option>

        {categories.map(({ category_id, name, type }) => (
          <option key={category_id} value={category_id}>
            {name} ({type})
          </option>
        ))}
      </select>

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

      <div className="checkbox">
        <p>Active?</p>
        <input
          type="checkbox"
          checked={is_active}
          onChange={(e) => setActive(e.target.checked)}
        />
      </div>

      <div className="submit-button">
        <button onClick={handleSubmit}>Add Budget</button>
      </div>
    </div>
  </div>
);
}

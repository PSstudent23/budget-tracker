import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";

const API_URL = "http://localhost:30040";

export default function Budgets({ user }) {
  const [budgets, setBudgets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadBudgets() {
      try {
        const res = await fetch(`${API_URL}/budgets/show`, {
          credentials: "include",
        }); 

        const data = await res.json();

        setBudgets(data);
      } catch (err) {
        console.log("Error loading budgets:", err);
      }
    }

    loadBudgets();
  }, []);
  return (
    <div>
      <h2>Budgets</h2>
      <button className="addButton" onClick={() => navigate("/budgets/add")}>add Budget</button>
     {budgets.map((item) => (
      <div key={item.budget_id}>
        <p>Start: {item.start_date}</p>
        <p>End: {item.end_date}</p>
        <p>Limit: {item.budget_limit}</p>
        <p>IsActive: {item.is_active}</p>
        <hr />
      </div>
  ))}
    </div>
  );
}
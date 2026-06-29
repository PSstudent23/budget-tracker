import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import "../styles/Budgets.css"


const API_URL = "http://localhost:30040";

export default function Budgets({ user }) {
  const [budgets, setBudgets] = useState([]);
  const navigate = useNavigate();

  const [message, setMessage] = useState("")

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


  const deleteBudget = async (budget_id) => {
    try {
      const res = await fetch(`${API_URL}/budgets/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ budget_id })
      });
      

      const data = await res.json();

      if (res.ok) {
        setMessage("Budget Deleted");
        window.location.reload(); 
      } else {
        setMessage(data.message || "Adding transaction failed.");
      }
    } catch (err) {
      console.error("Transaction error:", err);
      setMessage("Error adding transaction");
    }
  };

return (
  <div className="budgets">
    <h2>Budgets</h2>

    <button
      className="addButton"
      onClick={() => navigate("/budgets/add")}
    >
      add Budget
    </button>

    {budgets.map((item) => (
      <div className="budget-card" key={item.budget_id}>
        <p>Budget ID: {item.budget_id}</p>
        <p>Start: {item.start_date}</p>
        <p>End: {item.end_date}</p>
        <p>Limit: {item.budget_limit}</p>
        <p>Is Active: {item.is_active}</p>
        <p>Category: {item.category_id}</p>
        <p>Category Name: {item.category_name}</p>
        <p>Current Spent: {item.total_amount}</p>

        <div className="budget-card2">
          <button onClick={() => deleteBudget(item.budget_id)}>X</button>
        </div>
      </div>
    ))}
  </div>
);
} 
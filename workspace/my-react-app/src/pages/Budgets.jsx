import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import "../styles/Budgets.css"


const API_URL = "http://88.200.63.148:30040";

export default function Budgets({ user }) {
  const [budgets, setBudgets] = useState([]);
  const navigate = useNavigate();

  const [message, setMessage] = useState("")

  useEffect(() => {
    async function loadBudgets() {
      try {
        const res = await fetch(`${API_URL}/api/budgets/show`, {
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
      const res = await fetch(`${API_URL}/api/budgets/delete`, {
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
        <p style={{fontWeight: "bold"}}>{item.category_name}</p>
        <p style={{fontWeight: "bold",  fontSize: "20px", color:  Number(item.total_amount) > Number(item.budget_limit) ? "#e74c3c" : ""}}>{item.total_amount}€/{item.budget_limit}€</p>
        <p> {new Date(item.start_date).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
          })} - {new Date(item.end_date).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
          })} </p>
        <p>{((item.total_amount / item.budget_limit) * 100).toFixed(2)}% Used</p>
        <p>{item.is_active ? "Active" : "Inactive"}</p>

        <div className="budget-card2">
          <button onClick={() => deleteBudget(item.budget_id)}>X</button>
        </div>
      </div>
    ))}
  </div>
);
} 
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import "../styles/Goals.css"


const API_URL = "http://localhost:30040";

export default function Goals({ user }) {
  const [goals, setGoals] = useState([]);
  const navigate = useNavigate();

  const [message, setMessage] = useState("")

  useEffect(() => {
    async function loadGoals() {
      try {
        const res = await fetch(`${API_URL}/goals/show`, {
          credentials: "include",
        }); 

        const data = await res.json();

        setGoals(data);
      } catch (err) {
        console.log("Error loading goals:", err);
      }
    }
    
    loadGoals();

  }, []);

  const deleteGoal = async (goal_id) => {
    try {
      const res = await fetch("http://localhost:30040/goals/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ goal_id })
      });
      

      const data = await res.json();

      if (res.ok) {
        setMessage("Goal Deleted");
        window.location.reload(); 
      } else {
        setMessage(data.message || "Deleting goal failed.");
      }
    } catch (err) {
      console.error("Goal error:", err);
      setMessage("Error deleting goal");
    }
  };


  const AddToGoal = async (goal_id) => {
    navigate("/transactions/add", {
      state: {
        goal_id: goal_id,
        category_id: 16
      }
    })
  }  

  
  const updateStatus = async (goal_id, name, status) => {
    try {
      const res = await fetch("http://localhost:30040/goals/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ 
          goal_id,
          name,
          status
        })
      });
      
      const data = await res.json();

      if (res.ok) {
        setMessage("Status updated");
        window.location.reload(); 
      } else {
        setMessage(data.message || "Failed.");
      }
    } catch (err) {
      console.error("Goal error:", err);
    }
  }




  return (
    <div className="goals">
      <h2>Goals</h2>

      <button className="addButton" onClick={() => navigate("/goals/add")}>add Goal</button>

      {goals.map((item) => {
        const today = new Date();
        const target = new Date(item.target_date);

        const dif =
          (target.getFullYear() - today.getFullYear()) * 12 +
          (target.getMonth() - today.getMonth());

        const perMonth = item.target_amount / dif;

        return (
          <div className="goal-card" key={item.goal_id}>
            <p style={{fontWeight: "bold" }}>{item.name}</p>
            <p>Saved: {item.current_amount}€ / {item.target_amount}€</p>
            <p> {(item.current_amount / item.target_amount).toFixed(2) * 100}% complete</p>
            <p>
              Deadline:{" "}
              {new Date(item.created_at).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </p>

            <p>
              Required pace: €{perMonth}/month over {dif} months remaining
            </p>
            
            <select
              value={item.status}
              onChange={(e) =>
                updateStatus(item.goal_id, item.name, e.target.value)
              }
            >
              <option value="not_started">Not Started</option>
              <option value="in_progress">In Progress</option>
              <option value="behind">Behind</option>
              <option value="completed">Completed</option>
            </select>

            <div className="submit-buttons">
              <button onClick={() => AddToGoal(item.goal_id)} disabled={item.status === "completed"}>Add money to goal</button>
              <button onClick={() => deleteGoal(item.goal_id)}>X</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
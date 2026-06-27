import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";

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

  return (
    <div>
      <h2>Goals</h2>
      <button className="addButton" onClick={() => navigate("/goals/add")}>add Goal</button>
     {goals.map((item) => (
      <div key={item.goal_id}>
        <p>Name: {item.name}</p>
        <p>Target: {item.target_amount}</p>
        <button onClick={() => deleteGoal(item.goal_id)}>X</button>
        <hr />
      </div>
  ))}
    </div>
  );
}
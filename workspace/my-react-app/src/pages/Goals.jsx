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


  const AddToGoal = async (goal_id) => {
    navigate("/transactions/add", {
      state: {
        goal_id: goal_id,
        category_id: 16
      }
    })
  }  


  return (
    <div>
      <h2>Goals</h2>
      <button className="addButton" onClick={() => navigate("/goals/add")}>add Goal</button>
     {goals.map((item) => {
        const today = new Date()
        const target = new Date(item.target_date);

        const dif =  (target.getFullYear() - today.getFullYear()) * 12 + (target.getMonth() - today.getMonth())
        const perMonth = item.target_amount / dif;


        return (
          <div key={item.goal_id}>
            <p>ID: {item.goal_id}</p>
            <p>Name: {item.name}</p>
            <p>Target: {item.target_amount}</p>
            <p>Current: {item.current_amount}</p>
            <p>Target Date: {item.target_date}</p>

            <p>Months left: {dif}</p>
            <p>Per month to reach: {perMonth}</p>

            <button onClick={() => AddToGoal(item.goal_id)}>
              Add money to goal
            </button>

            <button onClick={() => deleteGoal(item.goal_id)}>X</button>
            <hr />
          </div>
        );
      })}
    </div>
  );
}
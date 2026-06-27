import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";

const API_URL = "http://localhost:30040";

export default function Goals({ user }) {
  const [goals, setGoals] = useState([]);
  const navigate = useNavigate();

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
  return (
    <div>
      <h2>Goals</h2>
      <button className="addButton" onClick={() => navigate("/goals/add")}>add Goal</button>
     {goals.map((item) => (
      <div key={item.goal_id}>
        <p>Name: {item.name}</p>
        <p>Target: {item.target_amount}</p>
        <hr />
      </div>
  ))}
    </div>
  );
}
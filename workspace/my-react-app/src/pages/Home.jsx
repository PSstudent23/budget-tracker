import { useState, useEffect } from "react";
import "../styles/Home.css";

const API_URL = "http://localhost:30040";

export default function Home({ user }) {
  const [sum, setSum] = useState(0);
  const [goalsNum, setGoalsNum] = useState(0);

  useEffect(() => {
      async function getUserData() {
        try {
          const res = await fetch(`${API_URL}/transactions/total`, {
            credentials: "include",
          }); 
  
          const data = await res.json();
  
          setSum(data.total);


          const res2 = await fetch(`${API_URL}/goals/numGoals`, {
            credentials: "include",
          });

          const data2 = await res2.json();
          setGoalsNum(data2.total);


        } catch (err) {
          console.log("Error loading budgets:", err);
        }
      }
  
      getUserData();
    }, []);

  return (
    <div>
      <h2>User: {user.first_name} {user.last_name}</h2>

      <div className="cards">
        <div className="card">
          <p>Monthly income</p>
          <h3>{user.monthly_income}</h3>
        </div>

        <div className="card">
          <p>Total spent</p>
          <h3>{sum}</h3>
        </div>

         <div className="card">
          <p>Remaining</p>
          <h3>€{user ? user.monthly_income - sum : 0}</h3>
        </div>

        <div className="card">
          <p>Active goals</p>
          <h3>{goalsNum}</h3>
        </div>
      </div>
    </div>
  );
}
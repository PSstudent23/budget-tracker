import { useState, useEffect } from "react";
import "../styles/Home.css";

const API_URL = "http://localhost:30040";

export default function Home({ user }) {
  const [sum, setSum] = useState(0);
  const [goalsNum, setGoalsNum] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [spentByCategory, setSpent] = useState([]);

  useEffect(() => {
      async function getUserData() {
        try {
          const res = await fetch(`${API_URL}/api/transactions/total`, {
            credentials: "include",
          }); 
  
          const data = await res.json();
  
          setSum(data.total);


          const res2 = await fetch(`${API_URL}/api/goals/numGoals`, {
            credentials: "include",
          });

          const data2 = await res2.json();
          setGoalsNum(data2.total);

          const res3 = await fetch(`${API_URL}/api/transactions/recent`, {
            credentials: "include",
          });

          const data3 = await res3.json();
          setRecentTransactions(data3);

          const res4 = await fetch(`${API_URL}/api/transactions/spent`, {
            credentials: "include",
          });

          const data4 = await res4.json();
          setSpent(data4);


        } catch (err) {
          console.log("Error loading budgets:", err);
        }
      }
  
      getUserData();
    }, []);

  return (
  <div className="home">
    <h2>
      User: {user.first_name} {user.last_name}
    </h2>

    <div className="home-cards">
      <div className="home-card">
        <p>Monthly income</p>
        <h3>{user.monthly_income}</h3>
      </div>

      <div className="home-card">
        <p>Total spent</p>
        <h3>{sum}</h3>
      </div>

      <div className="home-card">
        <p>Remaining</p>
        <h3>€{user ? user.monthly_income - sum : 0}</h3>
      </div>

      <div className="home-card">
        <p>Active goals</p>
        <h3>{goalsNum}</h3>
      </div>
    </div>

    <div className="home-bottom">
      <div className="home-recent">
        <h3>Recent Transactions</h3>

        <div className="recent-list">
          {recentTransactions.map((item) => (
            <div className="recent-item" key={item.transaction_id}>
              <p>{item.description}</p>
              <p>€{item.amount}</p>

              <p className="date">
                {new Date(item.date).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                })}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="spent-by-category">
        <h3>Spent by category</h3>

        <div className="recent-list">
          {spentByCategory.map((item) => (
            <div className="recent-item" key={item.category}>
              <p>{item.category}</p>
              <p>€{item.total}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
  );
}
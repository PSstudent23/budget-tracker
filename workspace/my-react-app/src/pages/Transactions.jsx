import { useEffect, useState } from "react";

const API_URL = "http://localhost:30040";

export default function Transactions({ user }) {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    async function loadTransactions() {
      try {
        const res = await fetch(`${API_URL}/transactions/show`, {
          credentials: "include",
        }); 
        const data = await res.json();

        setTransactions(data);
      } catch (err) {
        console.log("Error loading news:", err);
      }
    }

    loadTransactions();
  }, []);
  return (
    <div>
      <h2>Transactions</h2>
     {transactions.map((item) => (
      <div key={item.transaction_id}>
        <p>Amount: {item.amount}</p>
        <p>Description: {item.description}</p>
        <p>Date: {item.date}</p>
        <hr />
      </div>
  ))}
    </div>
  );
}
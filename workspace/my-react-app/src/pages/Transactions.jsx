import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";

const API_URL = "http://localhost:30040";

export default function Transactions({ user }) {
  const [transactions, setTransactions] = useState([]);
  const navigate = useNavigate();

  const [message, setMessage] = useState("")

  useEffect(() => {
    async function loadTransactions() {
      try {
        const res = await fetch(`${API_URL}/transactions/show`, {
          credentials: "include",
        }); 

        const data = await res.json();

        //console.log(data)

        setTransactions(data);
      } catch (err) {
        console.log("Error loading transactions:", err);
      }
    }

    

    loadTransactions();
  }, []);

  const deleteTransaction = async (transaction_id) => {
    try {
      const res = await fetch("http://localhost:30040/transactions/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ transaction_id })
      });
      

      const data = await res.json();


      if (res.ok) {
        setMessage("Transaction Deleted");
        window.location.reload(); 
      } else {
        setMessage(data.message || "Deleting transaction failed.");
      }
    } catch (err) {
      console.error("Transaction error:", err);
      setMessage("Error deleting transaction");
    }
  };

  const uploadFile = async (transaction_id, file) => {
    if (!file) return;

    const formData = new FormData();

    formData.append("file", file);
    formData.append("transaction_id", transaction_id);

  try {
    const res = await fetch("http://localhost:30040/transactions/upload", {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    const data = await res.json();

    if (res.ok) {
      console.log("File uploaded!");
      window.location.reload(); 
    } else {
      setMessage(data.message)
      console.error(data.message);
    }
  } catch (error) {
    console.error(error);
  }


  }

  return (
    <div>
      <h2>Transactions</h2>
      <button className="addButton" onClick={() => navigate("/transactions/add")}>add Transaction</button>

      {message}

     {transactions.map((item) => (
      <div key={item.transaction_id}>
        <p>Amount: {item.amount}</p>
        <p>Description: {item.description}</p>
        <p>Date: {item.date}</p>
        <p>Created: {item.created_at}</p>
        <p>Goal: {item.goal_name}</p>
        <p>Category: {item.category_name}</p>
        <p>Category type: {item.category_type}</p>
        <p>FileName: {item.filename}</p>


        <input
          type="file"
          onChange={(e) => uploadFile(item.transaction_id, e.target.files[0])}
        />
        <button onClick={() => deleteTransaction(item.transaction_id)}>X</button>
        <hr />
      </div>
  ))}
    </div>
  );
}
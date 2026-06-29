import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import "../styles/Transactions.css"

const API_URL = "http://localhost:30040";

export default function Transactions({ user }) {
  const [transactions, setTransactions] = useState([]);
  const navigate = useNavigate();

  const [message, setMessage] = useState("")

  useEffect(() => {
    async function loadTransactions() {
      try {
        const res = await fetch(`${API_URL}/api/transactions/show`, {
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
      const res = await fetch("http://localhost:30040/api/transactions/delete", {
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
      const res = await fetch("http://localhost:30040/api/transactions/upload", {
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

  const deleteFile = async (attachment_id) => {
    try {
      const res = await fetch("http://localhost:30040/api/transactions/deleteFile", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ attachment_id })
      });

      console.log(attachment_id)

      const data = await res.json();

      console.log(data)

      if (res.ok) {
        setMessage("File Deleted");
        window.location.reload(); 
      } else {
        setMessage(data.message || "Deleting File failed.");
      }

    } catch (err) {
      console.error("File error:", err);
    }
  }

  const downloadFile = async (attachment_id, filename) => {
    const res = await fetch(`${API_URL}/api/transactions/download`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ attachment_id }),
    });

    const blob = await res.blob();

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = filename;
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="transactions">
      <h2>Transactions</h2>

      <button
        className="addButton"
        onClick={() => navigate("/transactions/add")}
      >
        Add Transaction
      </button>

      <p>{message}</p>

      {transactions.map((item) => (
        <div className="transaction" key={item.transaction_id}>
          <div className="transaction-card" >
            <p style={{fontWeight: "bold", color: item.category_type === "income" ? "#73ff00" : "#ff1500"}}>{item.category_name}</p>
            <p> {item.category_type === "income" ? "+" : "-"}{item.amount}€ </p>
            <p>Description: {item.description}</p>
            <p>Transaction made on: {new Date(item.created_at).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "numeric",
                  year: "numeric"
                })}, 
              at: {new Date(item.created_at).toLocaleTimeString("en-GB", {
                  minute: "numeric",
                  hour: "numeric"
                  })} </p>
            <p>{!item.goal_name ? "" : "Added for a goal: " + item.goal_name}</p>
            {item.attachment_id && (<button onClick={() => downloadFile(item.attachment_id, item.filename)}>File name: {item.filename}</button>)}
          </div>

          <div className="submit-area">
            <input
              type="file"
              onChange={(e) => uploadFile(item.transaction_id, e.target.files[0])}
            />
            

            {item.attachment_id && (<button onClick={() => deleteFile(item.attachment_id)}>Delete Attachment</button>)}
            <button onClick={() => deleteTransaction(item.transaction_id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}
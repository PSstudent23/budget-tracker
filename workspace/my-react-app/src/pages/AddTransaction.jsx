import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router";
import "../styles/AddTransactions.css"



export default function AddTransaction() {
  const navigate = useNavigate();
  const location = useLocation();

  const [category_id, setCategory] = useState(location.state?.category_id ? location.state.category_id : "");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [goal_id, setGoalId] = useState(location.state?.goal_id ? location.state.goal_id : "");
  const [message, setMessage] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect (() => {
      async function getCategories() {
        const res2 = await fetch("http://88.200.63.148:30040/api/categories", {
        credentials: "include"
        });

        const data2 = await res2.json();
        setCategories(data2);

        console.log("Categories" + categories)
      }
      getCategories();
 
    }, [])

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    try {
      const res = await fetch("http://88.200.63.148:30040/api/transactions/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          category_id,
          amount,
          date,
          description,
          goal_id: goal_id ? Number(goal_id) : undefined
        }),
      });

      const data = await res.json();

      if (res.ok) {
        navigate("/transactions");
      } else {
        setMessage(data.message || "Adding transaction failed.");
      }
    } catch (err) {
      console.error("Transaction error:", err);
      setMessage("Error adding transaction");
    }
  };

  const isGoalTransaction = location.state?.goal_id != null;

  return (
    <div className="add-transactions">
      <h1>Add Transaction</h1>

      {message && <p className="message">{message}</p>}

      <div className="add-transactions-card">
        <p>Category ID</p>
        <input
          type="number"
          placeholder="Category ID"
          value={category_id}
          onChange={(e) => setCategory(e.target.value)}
        />

        <p>Amount</p>
        <input
          type="number"
          step="0.01"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <p>Transaction Date</p>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <p>Description</p>
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <p>Goal ID (optional)</p>
        {!isGoalTransaction && (
          <input
            type="number"
            placeholder="Goal ID (optional)"
            value={goal_id}
            onChange={(e) => setGoalId(e.target.value)}
          />
        )}

        <div className="submit-button">
          <button onClick={handleSubmit}>Add Transaction</button>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";

const API_URL = "http://localhost:30040";

export default function Notifications({ user }) {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  const [message, setMessage] = useState("")

  useEffect(() => {
    async function loadNotifications() {
      try {
        const res = await fetch(`${API_URL}/notifications/show`, {
          credentials: "include",
        }); 

        const data = await res.json();

        setNotifications(data);

      } catch (err) {
        console.log("Error loading notifications:", err);
      }
    }

    loadNotifications();
  }, []);


  const readAll = async () => {
     try {
      const res = await fetch("http://localhost:30040/notifications/readAll", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      

      const data = await res.json();


      if (res.ok) {
        setMessage("Notifications Read");
        window.location.reload(); 
      } else {
        setMessage(data.message || "Failed.");
      }
    } catch (err) {
      console.error("Notification error:", err);
    }
  }

  return (
    <div>
      <h2>Notifications</h2>
      <button onClick={readAll}>READ ALL</button>
     {notifications.map((item) => (
      <div key={item.notification_id }>
        <p>Notification ID: {item.notification_id }</p>
        <p>type: {item.type}</p>
        <p>title: {item.title}</p>
        <p>message: {item.message}</p>
        <p>is_read: {item.is_read}</p>
        <p>Category: {item.category_id}</p>
        <p>created_at: {item.created_at}</p>
        <hr />
      </div>
  ))}
    </div>
  );
}
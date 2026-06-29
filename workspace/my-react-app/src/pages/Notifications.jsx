import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import "../styles/Notifications.css"


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
    <div className="notifications">
      <h2>Notifications</h2>

      <button className="addButton" onClick={readAll}>READ ALL</button>

      {notifications.map((item) => (
        <div className={`notification-card ${item.is_read ? "read" : ""}`} key={item.notification_id}>
          <p>Notification ID: {item.notification_id}</p>
          <p>Type: {item.type}</p>
          <p>Title: {item.title}</p>
          <p>Message: {item.message}</p>
          <p>Is Read: {item.is_read}</p>
          <p>Category: {item.category_id}</p>
          <p>Created At: {item.created_at}</p>
        </div>
      ))}
    </div>
  );
}
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import "../styles/Notifications.css"


const API_URL = "http://88.200.63.148:30040";

export default function Notifications({ user }) {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  const [message, setMessage] = useState("")

  useEffect(() => {
    async function loadNotifications() {
      try {
        const res = await fetch(`${API_URL}/api/notifications/show`, {
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
      const res = await fetch("http://88.200.63.148:30040/api/notifications/readAll", {
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
          <p style={{ fontWeight: "bold" }}>{item.title}</p>
          <p>{item.message}</p>
          <p>Category: {item.name}</p>
          <p>SENT: {new Date(item.created_at).toLocaleDateString("en-GB", {
                  minute: "numeric",
                  hour: "numeric",
                  day: "numeric",
                  month: "numeric",
                  year: "numeric"
                })}</p>
          <p style={{ fontWeight: "lighter" }}>{item.is_read ? "You have read this notification" : "New notification"}</p>
        </div>
      ))}
    </div>
  );
}
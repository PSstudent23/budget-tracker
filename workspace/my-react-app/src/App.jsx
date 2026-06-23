import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { useState, useEffect } from "react";
import LandingPage from "./LandingPage";
import Login from "./Login";
import Register from "./Register";
import AppLayout from "./components/AppLayout";
import Home from "./pages/Home";
import Transactions from "./pages/Transactions";

/*
import Budgets from "./pages/Budgets";
import Goals from "./pages/Goals";
import Simulator from "./pages/Simulator";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
*/

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:30040/me", { credentials: "include" })
      .then(res => res.json())
      .then(data => setUser(data.ok ? data.user : null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;

  // If not logged in, send to login
  if (!user) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    );
  }

  // If logged in, every page gets the layout
  return (
    <BrowserRouter>
      <AppLayout user={user} setUser={setUser}>
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/transactions" element={<Transactions user={user} />} />
          
         
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}
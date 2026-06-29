import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { useState, useEffect } from "react";

//  import "../styles/App.css"

import LandingPage from "../LandingPage";
import Login from "../pages/Login";
import Register from "../pages/Register";

import AppLayout from "../components/AppLayout";

import Home from "../pages/Home";
import Transactions from "../pages/Transactions";
import AddTransaction from "../pages/AddTransaction";
import Budgets from "../pages/Budgets";
import Goals from "../pages/Goals";
import Simulator from "../pages/Simulator";
import Notifications from "../pages/Notifications";
import Settings from "../pages/Settings";
import AddBudgets from "../pages/AddBudgets";
import AddGoal from "../pages/AddGoal";

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("http://localhost:30040/api/me", {
          credentials: "include",
        });
        
        const data = await res.json();
        if (data.ok) {
          setUser(data.user)
        };
      } catch (error) {
        console.error("Auth check failed:", error);
      }
    };
    
    fetchUser();
  }, []);
  return (
    <BrowserRouter>
      {!user ? (
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<LandingPage />} />
        </Routes>
      ) : (
        <AppLayout user={user} setUser={setUser}>
          <Routes>
            <Route path="/" element={<Home user={user} />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/transactions/add" element={<AddTransaction />} />
            <Route path="/budgets" element={<Budgets />} />
            <Route path="/budgets/add" element={<AddBudgets />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="/goals/add" element={<AddGoal />} />
            <Route path="/simulator" element={<Simulator />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/settings" element={<Settings user={user} />} />
          </Routes>
        </AppLayout>
      )}
    </BrowserRouter>
  );
}
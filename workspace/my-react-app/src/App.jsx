import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { useState, useEffect } from "react";

import LandingPage from "./LandingPage";
import Login from "./Login";
import Register from "./Register";

import AppLayout from "./components/AppLayout";

import Home from "./pages/Home";
import Transactions from "./pages/Transactions";
import Budgets from "./pages/Budgets";
import Goals from "./pages/Goals";
import Simulator from "./pages/Simulator";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:30040/me", {
          credentials: "include",
        });
        const data = await res.json();
        if (data.ok) setUser(data.user);
      } catch (error) {
        console.error("Failed to fetch user:", error);
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
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      ) : (
        <AppLayout user={user} setUser={setUser}>
          <Routes>
            <Route path="/" element={<Home user={user} />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/budgets" element={<Budgets />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="/simulator" element={<Simulator />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </AppLayout>
      )}
    </BrowserRouter>
  );
}
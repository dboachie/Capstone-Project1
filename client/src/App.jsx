import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { HomePage } from "./components/HomePage";
import { Dashboard } from "./components/Dashboard.jsx";
import { AdminDashboard } from "./components/AdminDashboard";
import { Navigation } from "./components/Navigation";
import { useAuth } from "./hooks/useAuth.js";
import { useNavigate } from "react-router-dom";

const App = () => {
  const { auth, login, register, logout, isAdmin, error } = useAuth();
  const navigate = useNavigate();
  //const token = window.localStorage.getItem("token");
  console.log(isAdmin);

  useEffect(() => {
    if (isAdmin) {
      navigate("/admin");
    }
  }, [isAdmin, navigate]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation auth={auth} isAdmin={isAdmin} logout={logout} />
      <main className="pt-16">
        <Routes>
          <Route
            path="/login"
            element={<Login login={login} isAdmin={isAdmin} error={error} />}
          />
          <Route path="/signup" element={<Register register={register} />} />
          <Route
            path="/dashboard"
            element={auth.user ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/admin"
            element={
              isAdmin ? (
                <AdminDashboard isAdmin={isAdmin} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route path="/" element={<HomePage />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;

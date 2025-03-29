import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import LoginButton from "./components/LoginButton";
import WelcomePage from "./components/WelcomePage";
import ChatPage from "./components/ChatPage";

const BACKEND_URL = "http://localhost:3001";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);
  const [initialPrompt, setInitialPrompt] = useState("");
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    // ตรวจสอบสถานะล็อกอินด้วย backend endpoint /auth/status
    axios
      .get(`${BACKEND_URL}/auth/status`, { withCredentials: true })
      .then((res) => {
        console.log("Auth status response:", res.data);
        if (res.status === 200 && res.data.user) {
          setIsAuthenticated(true);
          setUserData(res.data.user);
        } else {
          setIsAuthenticated(false);
        }
      })
      .catch((err) => {
        console.error("Auth status error:", err);
        setIsAuthenticated(false);
      })
      .finally(() => {
        setLoadingAuth(false);
      });
  }, []);

  if (loadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* หน้า Login */}
        <Route
          path="/login"
          element={
            !isAuthenticated ? (
              <div className="flex flex-col items-center justify-center h-screen bg-[#0f0f0f] text-white">
                <LoginButton />
              </div>
            ) : (
              <Navigate to="/welcome" replace />
            )
          }
        />

        {/* หน้า Welcome เมื่อผู้ใช้ล็อกอินแล้วแต่ยังไม่เริ่มแชต */}
        <Route
          path="/welcome"
          element={
            isAuthenticated && !initialPrompt ? (
              <WelcomePage onStartChat={(prompt) => setInitialPrompt(prompt)} user={userData} />
            ) : (
              <Navigate to={isAuthenticated ? "/chat" : "/login"} replace />
            )
          }
        />

        {/* หน้า Chat เมื่อผู้ใช้ล็อกอินแล้วและมี initialPrompt */}
        <Route
          path="/chat"
          element={
            isAuthenticated && initialPrompt ? (
              <ChatPage initialPrompt={initialPrompt} user={userData} />
            ) : (
              <Navigate to="/welcome" replace />
            )
          }
        />

        {/* Default Route */}
        <Route
          path="/"
          element={
            isAuthenticated
              ? initialPrompt
                ? <Navigate to="/chat" replace />
                : <Navigate to="/welcome" replace />
              : <Navigate to="/login" replace />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

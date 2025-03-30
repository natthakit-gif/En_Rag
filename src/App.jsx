import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import ChatPage from './components/ChatPage';
import MemberPage from './components/MemberPage';
import WelcomePage from './components/WelcomePage'; // นำเข้าคอมโพเนนต์ WelcomePage

function App() {
  const [user, setUser] = useState({
    name: "Guest User",
    email: "guest@example.com",
    recentActivity: [
      {
        description: "เริ่มการสนทนาใหม่",
        timestamp: new Date(2025, 2, 29, 15, 30)
      },
      {
        description: "อัปเดตข้อมูลส่วนตัว",
        timestamp: new Date(2025, 2, 28, 10, 45)
      }
    ]
  });

  return (
    <Router>
      <Routes>
        <Route path="/welcome" element={<WelcomePage user={user} />} />
        <Route path="/chat" element={<ChatPage user={user} initialPrompt="" />} />
        <Route path="/member" element={<MemberPage user={user} />} />
        <Route path="/" element={<Navigate to="/welcome" />} /> {/* เปลี่ยนเส้นทางเริ่มต้นเป็น /welcome */}
      </Routes>
    </Router>
  );
}

export default App;
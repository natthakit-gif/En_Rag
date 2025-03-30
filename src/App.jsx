import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import ChatPage from './components/ChatPage';

function App() {
  const [user, setUser] = useState({
    name: "Guest User",
    email: "guest@example.com",
  });

  return (
    <Router>
      <Routes>
        <Route path="/chat" element={<ChatPage user={user} initialPrompt="" />} />
        <Route path="/" element={<Navigate to="/chat" />} />
      </Routes>
    </Router>
  );
}

export default App;
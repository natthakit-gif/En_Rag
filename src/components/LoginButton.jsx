// frontend/src/components/LoginButton.jsx
import React from "react";
import "./LoginButton.css";
const BACKEND_URL = "http://localhost:3001";
function LoginButton() {
    const handleLogin = () => {
        window.location.href = `${BACKEND_URL}/auth/google`;
    };
    return (
        <div className="flex flex-col items-center justify-center w-screen h-screen bg-gradient-to-r from-blue-500 to-purple-500 text-white">
            <div className="text-center">
                <h1 className="typewriter text-4xl font-bold mb-4">
                Welcome to RagChatbot
                </h1>
                <p className="text-xl mb-8">
                Please sign in with your Google account to start chatting.
                </p>
                <button
                    onClick={handleLogin}
                    className="bg-white text-blue-700 text-xl px-8 py-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                    >
                <i className="fab fa-google mr-2"></i>
                Sign in with Google
                </button>
            </div>
            <footer className="absolute bottom-0 mb-4">
                © 2025 RagChatbot. All rights reserved.
            </footer>
        </div>
        );
    }
export default LoginButton;
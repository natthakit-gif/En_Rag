import React, { useState } from "react";
import SideBar from "./SideBar";
import { FaRobot } from "react-icons/fa";

function WelcomePage({ user, onStartChat }) {
    const [prompt, setPrompt] = useState("");
    
    const handleStart = () => {
        onStartChat(prompt);
    };

    return (
        <SideBar user={user}>
        <div className="relative w-full flex flex-col min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-red-900">
            <div className="flex-grow flex flex-col items-center justify-center text-center px-4">
            <FaRobot className="text-6xl md:text-8xl text-red-500 mb-8 animate-pulse" />
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">
                Welcome to <span className="text-red-500">RAGChatBot</span>
            </h1>
            <p className="text-xl text-gray-400 mb-12">
                Unleash the power of AI - Tame the knowledge!
            </p>
            </div>
            
            <div className="absolute bottom-0 left-0 w-full">
            <div className="w-full bg-gray-800 rounded-t-xl shadow-xl">
                <div className="flex items-center p-4">
                <input
                    type="text"
                    placeholder="Ask me anything..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={(e) => {
                    if (e.key === "Enter") handleStart();
                    }}
                    className="flex-grow px-4 py-3 text-lg bg-gray-700 text-white rounded-l-full focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <button
                    onClick={handleStart}
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-3 rounded-r-full shadow-lg transition duration-200"
                >
                    Start Chat
                </button>
                </div>
            </div>
            </div>
        </div>
        </SideBar>
    );
}

export default WelcomePage;
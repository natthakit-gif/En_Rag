import React, { useState, useEffect } from "react";
import SideBar from "./SideBar";

const BACKEND_URL = "http://localhost:3001";

function ChatPage({ user, initialPrompt }) {
    const [messages, setMessages] = useState(() => {
        if (initialPrompt) {
        return [{ role: "user", content: initialPrompt }];
        }
        return [];
    });
    const [inputValue, setInputValue] = useState("");

    useEffect(() => {
        // Fetch chat history
        fetch(`${BACKEND_URL}/api/chat/history`, {
        credentials: "include",
        })
        .then((res) => {
        if (!res.ok) throw new Error("Not authenticated");
        return res.json();
        })
        .then((data) => {
        setMessages(data);
        })
        .catch((err) => {
        console.error("Error fetching chat history:", err);
        });
    }, []);

    const handleSend = async () => {
        if (!inputValue.trim()) return;

        // Send user message
        const newMessage = { role: "user", content: inputValue.trim() };
        const response = await fetch(`${BACKEND_URL}/api/chat/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(newMessage),
        });
        const savedMessage = await response.json();
        setMessages((prev) => [...prev, savedMessage]);
        setInputValue("");

        // Simulate assistant response
        const assistantMessage = {
        role: "assistant",
        content: "This is a simulated response from the model...",
        };
        const response2 = await fetch(`${BACKEND_URL}/api/chat/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(assistantMessage),
        });
        const savedAssistant = await response2.json();
        setMessages((prev) => [...prev, savedAssistant]);
    };

    return (
        <SideBar user={user}>
        <div className="relative w-full flex flex-col min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-red-900">
            <div className="flex-1 overflow-y-auto p-4">
            {messages.map((msg, i) => (
                <div
                key={i}
                className={`mb-2 flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                }`}
                >
                <div
                    className={`p-2 rounded max-w-xs md:max-w-md ${
                    msg.role === "user" ? "bg-red-500" : "bg-gray-700"
                    }`}
                >
                    {msg.content}
                </div>
                </div>
            ))}
            </div>
            
            <div className="absolute bottom-0 left-0 w-full">
            <div className="w-full bg-gray-800 rounded-t-xl shadow-xl">
                <div className="flex items-center p-4">
                <input
                    type="text"
                    placeholder="Type your message..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    className="flex-grow px-4 py-3 text-lg bg-gray-700 text-white rounded-l-full focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <button
                    onClick={handleSend}
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-3 rounded-r-full shadow-lg transition duration-200"
                >
                    Send
                </button>
                </div>
            </div>
            </div>
        </div>
        </SideBar>
    );
}

export default ChatPage;
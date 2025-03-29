// frontend/src/components/SideBar.jsx
import React from "react";

function SideBar({ user, children }) {

    console.log('Full User Object:', user);
    const userName = user?.name || 'User';
    const userEmail = user?.email || 'No email';
    return (
        <div className="flex h-screen bg-gradient-to-b from-[#0f0f0f] to-[#1a1a1a] text-white">
        {/* ส่วน Sidebar */}
        <div className="w-[280px] bg-[#222222] p-6"> 
            <div className="mb-8">
            <h2 className="text-2xl font-bold">My Chatbot</h2>
            <br />
            {user && (
                <div className="mt-2">
                    <div className="flex justify-center items-center">
                        {/* Wrapper สำหรับ animated border */}
                        <div className="p-1 rounded-lg bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 animate-gradient-x bg-[length:200%_200%] w-fit">
                        {/* เนื้อหาภายในที่มีพื้นหลังแบบเข้ม */}
                            <div className="p-2 bg-[#222222] rounded">
                                <p className="text-sm text-gray-300">{userName}</p>
                                <p className="text-sm text-gray-300">{userEmail}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <br />
            <nav>
                <ul>
                <li className="mb-4">
                    <a href="/welcome" className="hover:text-red-500">
                    Home
                    </a>
                </li>
                <li className="mb-4">
                    <a href="#" className="hover:text-red-500">
                    Profile
                    </a>
                </li>
                <li className="mb-4">
                    <a href="#" className="hover:text-red-500">
                    Settings
                    </a>
                </li>
                <li className="mb-4">
                    {/* ลิงก์ Logout: Redirect ไปที่ backend logout endpoint */}
                    <a
                    href="http://localhost:3001/auth/logout"
                    className="hover:text-red-500 block mb-4"
                    >
                    Logout
                    </a>
                </li>
                </ul>
            </nav>
            </div>
        </div>

        {/* ส่วน children (Main Content) */}
        {children}
        </div>
    );
    }

export default SideBar;

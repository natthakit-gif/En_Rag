import React from "react";
import { Link } from "react-router-dom";

function SideBar({ user, activePage = "", children }) {
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
    
    const navItems = [
        { id: "home", label: "หน้าหลัก", path: "/welcome", icon: "🏠" },
        { id: "chat", label: "สนทนา", path: "/chat", icon: "💬" },
        { id: "member", label: "สมาชิก", path: "/member", icon: "👤" },
        { id: "settings", label: "ตั้งค่า", path: "/settings", icon: "⚙️" }
    ];
    
    const formatUserName = (name) => {
        return name ? name.split(' ').map(part => 
            part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
        ).join(' ') : 'ผู้ใช้ทั่วไป';
    };

    return (
        <div className="flex h-screen w-screen overflow-hidden">
            {/* Sidebar */}
            <div className="w-[280px] min-w-[280px] bg-[#043c74] p-6 flex flex-col shadow-lg">
                <div className="mb-6 flex items-center">
                    {/* KKU Logo - Replace with actual logo */}
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mr-3">
                        <span className="text-[#043c74] font-bold text-lg">KKU</span>
                    </div>
                    <h2 className="text-xl font-bold text-white">KKU Assistant</h2>
                </div>
                
                {/* User information */}
                {user && (
                    <div className="mb-6 p-4 bg-[#032c56] rounded-lg">
                        <div className="flex items-center mb-3">
                            {user.picture ? (
                                <img 
                                    src={user.picture} 
                                    alt={user.name} 
                                    className="w-10 h-10 rounded-full mr-3" 
                                />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-[#f1c40f] flex items-center justify-center mr-3">
                                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                                </div>
                            )}
                            <div className="flex-1 overflow-hidden">
                                <p className="font-medium text-white truncate">{formatUserName(user.name)}</p>
                                <p className="text-sm text-gray-300 truncate">{user.email}</p>
                            </div>
                        </div>
                        <div className="text-xs text-gray-300 bg-[#021f3d] p-2 rounded">
                            <p>เข้าสู่ระบบล่าสุด: {new Date().toLocaleDateString('th-TH')}</p>
                        </div>
                    </div>
                )}
                
                {/* Navigation */}
                <nav className="flex-1">
                    <ul>
                        {navItems.map(item => (
                            <li key={item.id} className="mb-2">
                                <Link 
                                    to={item.path} 
                                    className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                                        activePage === item.id 
                                            ? "bg-[#f1c40f] text-[#043c74] font-medium" 
                                            : "text-white hover:bg-[#032c56]"
                                    }`}
                                >
                                    <span className="mr-3">{item.icon}</span>
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
                
                {/* Footer */}
                <div className="mt-auto pt-4 border-t border-[#032c56]">
                    <a
                        href={`${BACKEND_URL}/auth/logout`}
                        className="flex items-center px-4 py-3 text-white hover:bg-[#032c56] rounded-lg transition-colors"
                    >
                        <span className="mr-3">🚪</span>
                        ออกจากระบบ
                    </a>
                    <div className="mt-4 text-xs text-gray-300 text-center">
                        &copy; 2025 มหาวิทยาลัยขอนแก่น<br/>
                        KKU Chatbot v1.0.0
                    </div>
                </div>
            </div>
            
            {/* Main content */}
            <div className="flex-1 w-full overflow-hidden">
                {children}
            </div>
        </div>
    );
}

export default SideBar;
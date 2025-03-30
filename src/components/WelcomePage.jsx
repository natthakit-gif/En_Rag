import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SideBar from "./SideBar";
import axios from "axios";

function WelcomePage() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalMessages: 0,
        activeSessions: 0,
        userCount: 0,
        lastUpdated: new Date()
    });
    
    // ฟังก์ชันสำหรับเริ่มการสนทนาใหม่
    const handleNewChat = () => {
        // นำทางไปยังหน้า ChatPage พร้อมส่งค่า initialPrompt เป็นสตริงว่าง
        // เพื่อล้างข้อมูลการสนทนาเก่า
        navigate('/chat', { state: { clearHistory: true } });
    };
    
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
    
    // Fetch user data
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`${BACKEND_URL}/api/user/profile`);
                setUser(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching user data:", error);
                setLoading(false);
            }
        };
        
        fetchUserData();
    }, [BACKEND_URL]);
    
    // Mock function to fetch statistics - replace with actual API call
    useEffect(() => {
        // This would typically be an API call
        const fetchStats = async () => {
            // Mocked data for demonstration
            setStats({
                totalMessages: 1250,
                activeSessions: 24,
                userCount: 156,
                lastUpdated: new Date()
            });
        };
        
        fetchStats();
        
        // Set up interval to refresh stats every 5 minutes
        const interval = setInterval(fetchStats, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);
    
    // Format date for Thai locale
    const formatThaiDate = (date) => {
        return date.toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    
    // Quick action links
    const quickActions = [
        {
            id: "new-chat",
            title: "เริ่มการสนทนาใหม่",
            description: "สร้างการสนทนาใหม่กับผู้ช่วย KKU",
            icon: "💬",
            path: "/chat",
            color: "bg-blue-500"
        },
        {
            id: "browse-faqs",
            title: "คำถามที่พบบ่อย",
            description: "ค้นหาคำตอบสำหรับคำถามทั่วไป",
            icon: "❓",
            path: "/faqs",
            color: "bg-green-500"
        },
        {
            id: "update-profile",
            title: "แก้ไขข้อมูลส่วนตัว",
            description: "อัปเดตข้อมูลและการตั้งค่าส่วนตัวของคุณ",
            icon: "👤",
            path: "/settings/profile",
            color: "bg-purple-500"
        },
        {
            id: "tutorial",
            title: "วิธีใช้งาน",
            description: "เรียนรู้วิธีใช้งานระบบ KKU Assistant",
            icon: "📚",
            path: "/tutorial",
            color: "bg-yellow-500"
        }
    ];
    
    // Recent announcements
    const announcements = [
        {
            id: 1,
            title: "ปรับปรุงระบบแชท",
            date: new Date(2025, 2, 28),
            content: "เราได้ปรับปรุงระบบแชทให้รองรับการแนบไฟล์รูปภาพและเอกสาร PDF"
        },
        {
            id: 2,
            title: "การบำรุงรักษาระบบ",
            date: new Date(2025, 2, 25),
            content: "ระบบจะปิดให้บริการชั่วคราวเพื่อการบำรุงรักษาในวันที่ 5 เมษายน 2568 เวลา 22:00-24:00 น."
        }
    ];

    if (loading) {
        return (
            <SideBar activePage="home">
                <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#043c74]"></div>
                </div>
            </SideBar>
        );
    }

    return (
        <SideBar user={user} activePage="home">
            <div className="h-full overflow-y-auto bg-gray-50">
                {/* Header */}
                <div className="bg-white p-6 shadow-sm">
                    <h1 className="text-2xl font-bold text-[#043c74]">ยินดีต้อนรับสู่ KKU Assistant</h1>
                    <p className="text-gray-600 mt-2">
                        ระบบผู้ช่วยอัจฉริยะสำหรับนักศึกษาและบุคลากรมหาวิทยาลัยขอนแก่น
                    </p>
                </div>
                
                {/* Main content */}
                <div className="p-6 max-w-7xl mx-auto">
                    {/* Statistics row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="bg-blue-100 p-3 rounded-full mr-4">
                                    <span className="text-blue-600 text-xl">💬</span>
                                </div>
                                <div>
                                    <h3 className="text-gray-500 text-sm font-medium">การสนทนาทั้งหมด</h3>
                                    <p className="text-2xl font-bold text-gray-800">{stats.totalMessages.toLocaleString('th-TH')}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="bg-green-100 p-3 rounded-full mr-4">
                                    <span className="text-green-600 text-xl">👥</span>
                                </div>
                                <div>
                                    <h3 className="text-gray-500 text-sm font-medium">จำนวนผู้ใช้งาน</h3>
                                    <p className="text-2xl font-bold text-gray-800">{stats.userCount.toLocaleString('th-TH')}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="bg-yellow-100 p-3 rounded-full mr-4">
                                    <span className="text-yellow-600 text-xl">⚡</span>
                                </div>
                                <div>
                                    <h3 className="text-gray-500 text-sm font-medium">เซสชันที่กำลังใช้งาน</h3>
                                    <p className="text-2xl font-bold text-gray-800">{stats.activeSessions.toLocaleString('th-TH')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Two-column layout for desktop */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Quick actions */}
                        <div className="lg:col-span-2">
                            <h2 className="text-xl font-bold mb-4 text-[#043c74]">ทางลัด</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {quickActions.map(action => (
                                    <div 
                                        key={action.id}
                                        onClick={action.id === "new-chat" ? handleNewChat : () => navigate(action.path)}
                                        className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow p-5 border-l-4 border-[#043c74] cursor-pointer"
                                    >
                                        <div className="flex items-center">
                                            <div className={`${action.color} text-white p-3 rounded-full mr-4`}>
                                                <span className="text-xl">{action.icon}</span>
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-gray-800">{action.title}</h3>
                                                <p className="text-gray-500 text-sm mt-1">{action.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            {/* User activity section */}
                            <h2 className="text-xl font-bold mb-4 mt-8 text-[#043c74]">กิจกรรมล่าสุดของคุณ</h2>
                            <div className="bg-white rounded-lg shadow p-6">
                                {user && user.recentActivity && user.recentActivity.length > 0 ? (
                                    <div className="space-y-4">
                                        {user.recentActivity.map((activity, index) => (
                                            <div key={index} className="border-b pb-4 last:border-0 last:pb-0">
                                                <p className="font-medium">{activity.description}</p>
                                                <p className="text-sm text-gray-500">{formatThaiDate(new Date(activity.timestamp))}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-6">
                                        <p className="text-gray-500">ยังไม่มีกิจกรรมล่าสุด</p>
                                        <button 
                                            onClick={handleNewChat}
                                            className="mt-4 bg-[#043c74] text-white px-4 py-2 rounded hover:bg-[#032c56] transition-colors"
                                        >
                                            เริ่มการสนทนาใหม่
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        {/* Announcements and help section */}
                        <div className="lg:col-span-1">
                            <h2 className="text-xl font-bold mb-4 text-[#043c74]">ประกาศล่าสุด</h2>
                            <div className="bg-white rounded-lg shadow mb-6">
                                {announcements.map(announcement => (
                                    <div key={announcement.id} className="p-5 border-b last:border-0">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-medium text-gray-800">{announcement.title}</h3>
                                            <span className="text-xs text-gray-500 whitespace-nowrap">
                                                {formatThaiDate(announcement.date)}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 mt-2 text-sm">{announcement.content}</p>
                                    </div>
                                ))}
                                <div className="p-4 text-center">
                                    <a href="/announcements" className="text-[#043c74] text-sm font-medium hover:underline">
                                        ดูประกาศทั้งหมด
                                    </a>
                                </div>
                            </div>
                            
                            <h2 className="text-xl font-bold mb-4 text-[#043c74]">ต้องการความช่วยเหลือ?</h2>
                            <div className="bg-white rounded-lg shadow p-6">
                                <p className="text-gray-600 mb-4">
                                    หากต้องการความช่วยเหลือเพิ่มเติม สามารถติดต่อทีมสนับสนุนของเราได้
                                </p>
                                <a href="/support" className="block w-full bg-[#f1c40f] text-[#043c74] text-center py-3 rounded-lg font-medium hover:bg-[#f39c12] transition-colors">
                                    ติดต่อทีมสนับสนุน
                                </a>
                            </div>
                        </div>
                    </div>
                    
                    {/* Footer */}
                    <div className="mt-8 text-center text-gray-500 text-sm border-t pt-6">
                        <p>
                            ข้อมูลล่าสุดเมื่อ: {formatThaiDate(stats.lastUpdated)}
                        </p>
                    </div>
                </div>
            </div>
        </SideBar>
    );
}

export default WelcomePage;
import React from 'react';
import SideBar from "./SideBar";

const MemberPage = ({ user }) => {
    const teamMembers = [
        {
        id: 1,
        name: "นายศิรัสพล แสงนาค",
        studentId: "653040462-9",
        role: "",
        skills: [],
        imgUrl: "./image/17nim.jpg"
        },
        {
        id: 2,
        name: "นางสาวญาณศรณ์ วงศ์ภักดี",
        studentId: "653040619-2",
        role: "",
        skills: [],
        imgUrl: "./image/17nim.jpg"
        },
        {
        id: 3,
        name: "นายณัฐกิตติ์ จิรเศรษฐานนท์",
        studentId: "653040620-7",
        role: "",
        skills: [],
        imgUrl: "./image/earth.jpg"
        },
        {
        id: 4,
        name: "นายโพธิ์สุพงศ์ จงอนุรักษ์",
        studentId: "653040629-9",
        role: "",
        skills: [],
        imgUrl: "./image/ken.jpg"
        },
        {
        id: 5,
        name: "นายกรภัทร์ สีดามาตร์",
        studentId: "653040699-7",
        role: "",
        skills: [],
        imgUrl: "./image/guy.jpg"
        }
    ];

    return (
        <SideBar user={user} activePage="member">
        <div className="w-full h-screen bg-gradient-to-b from-white to-[#e6f0f9] py-8 px-4 overflow-y-auto member-container">
            {/* Header */}
            <div className="p-3 bg-[#043c74] text-white rounded-lg shadow-md mb-8 top-0 z-10">
            <div className="flex items-center">
                <img 
                src="/kku-logo.png" 
                alt="KKU Logo" 
                className="h-8 w-auto mr-3 hidden sm:block"
                onError={(e) => {
                    e.target.style.display = 'none';
                }}
                />
                <h1 className="text-xl font-semibold">คณะผู้จัดทำ KKU Chatbot</h1>
            </div>
            </div>
            
            <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
                <div className="w-20 h-20 rounded-full bg-[#043c74] flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-2xl">KKU</span>
                </div>
                <h2 className="text-3xl font-bold text-[#043c74] mb-2">ทีมพัฒนา</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                ทีมนักศึกษาภาควิชาวิศวกรรมคอมพิวเตอร์ คณะวิศวกรรมศาสตร์ มหาวิทยาลัยขอนแก่น 
                ผู้พัฒนาระบบ RAG Chatbot สำหรับให้บริการข้อมูลการศึกษาแก่นักเรียนและนักศึกษา
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {teamMembers.map(member => (
                <div 
                    key={member.id} 
                    className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                    <div className="bg-[#043c74] h-24 flex items-center justify-center relative">
                        <div className="absolute -bottom-12 w-24 h-24 rounded-full border-4 border-white overflow-hidden bg-[#f1c40f] flex items-center justify-center text-xl font-bold text-[#043c74]">
                            <img 
                            src={member.imgUrl} 
                            alt={member.name} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.parentElement.textContent = member.name.charAt(0);
                            }}
                            />
                        </div>
                    </div>
                    
                    <div className="pt-14 px-4 pb-6 text-center">
                    <h3 className="font-bold text-xl text-[#043c74] mb-1">{member.name}</h3>
                    <p className="text-gray-500 mb-3">รหัสนักศึกษา: {member.studentId}</p>
                    <div className="bg-[#f8fafc] rounded-md p-3 mb-3">
                        <p className="font-medium text-[#043c74]">{member.role}</p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-2">
                        {member.skills.map((skill, index) => (
                        <span 
                            key={index} 
                            className="bg-[#e6f0f9] text-[#043c74] text-sm py-1 px-3 rounded-full"
                        >
                            {skill}
                        </span>
                        ))}
                    </div>
                    </div>
                </div>
                ))}
            </div>

            <div className="mt-12 text-center bg-white rounded-lg p-6 shadow-md">
                <h2 className="text-2xl font-bold text-[#043c74] mb-4">เกี่ยวกับโครงการ</h2>
                <p className="text-gray-600 mb-4">
                โครงการนี้เป็นส่วนหนึ่งของรายวิชา EN813002 : ทฤษฎีการคำนวณ 
                ภาควิชาวิศวกรรมคอมพิวเตอร์ คณะวิศวกรรมศาสตร์ มหาวิทยาลัยขอนแก่น 
                ประจำปีการศึกษา 2567
                </p>
                <div className="border-t border-gray-200 pt-4 mt-4">
                <p className="text-gray-500 text-sm">
                    &copy; 2025 KKU Chatbot Team - คณะวิศวกรรมศาสตร์ มหาวิทยาลัยขอนแก่น
                </p>
                <p className="text-gray-400 text-xs mt-1">
                    ระบบนี้พัฒนาด้วย React, Node.js และ Azure AI Services
                </p>
                </div>
            </div>
            </div>
        </div>
        
        {/* Scrollbar styling */}
        <style jsx>{`
            .member-container::-webkit-scrollbar {
            width: 10px;
            }
            
            .member-container::-webkit-scrollbar-track {
            background: #f8fafc;
            border-radius: 8px;
            }
            
            .member-container::-webkit-scrollbar-thumb {
            background-color: #043c74;
            border-radius: 10px;
            border: 2px solid #f8fafc;
            }
            
            .member-container::-webkit-scrollbar-thumb:hover {
            background-color: #032c56;
            }
            
            .member-container {
            scrollbar-width: thin;
            scrollbar-color: #043c74 #f8fafc;
            }
        `}</style>
        </SideBar>
    );
};

export default MemberPage;
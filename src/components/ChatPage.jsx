import React, { useState, useEffect, useRef } from "react";
import SideBar from "./SideBar"; // นำเข้า SideBar
import QAService from "../services/qaService";
import { handleUserMessage } from "../utils/faq-chatbot";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const ALLOWED_FILE_TYPES = [
    "application/pdf", 
    "application/msword", 
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", 
    "text/plain",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ];

    const faqData = [
    {
        id: 1,
        question: "ข้อมูลหลักสูตรการศึกษา",
        answer:
        "คณะวิศวกรรมศาสตร์เปิดสอนจำนวน 14 หลักสูตร ได้แก่ หลักสูตรปกติ 10 หลักสูตร และหลักสูตรนานาชาติ 4 หลักสูตร ดูรายละเอียดที่ https://www.en.kku.ac.th/web/หลักสูตร"
    },
    {
        id: 2,
        question: "ปฏิทินการศึกษา",
        answer:
        "การเรียนการสอนแบ่งเป็น 2 ภาค (ต้นและปลาย) แต่ละภาคไม่น้อยกว่า 15 สัปดาห์ (ต้น: มิ.ย. - ต.ค., ปลาย: พ.ย. - มี.ค.)"
    }
    // เพิ่ม FAQ อื่นๆ ตามต้องการ...
    ];

    function ChatPage({ user, initialPrompt }) {
    const [messages, setMessages] = useState(() =>
        initialPrompt
        ? [{ role: "user", content: initialPrompt, createdAt: new Date() }]
        : []
    );
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [streamingResponse, setStreamingResponse] = useState("");
    const [isStreaming, setIsStreaming] = useState(false);
    const [systemStatus, setSystemStatus] = useState({ status: "unknown" });
    const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
    const [attachments, setAttachments] = useState([]);

    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);
    const streamTimeoutRef = useRef(null);
    const inputRef = useRef(null);
    const fileInputRef = useRef(null);
    const imageInputRef = useRef(null);

    useEffect(() => {
        fetchChatHistory();
        checkSystemStatus();
    }, []);

    useEffect(() => {
        const statusInterval = setInterval(checkSystemStatus, 60000);
        return () => clearInterval(statusInterval);
    }, []);

    useEffect(() => {
        if (shouldAutoScroll) {
        scrollToBottom();
        }
    }, [messages, streamingResponse, shouldAutoScroll]);

    useEffect(() => {
        const container = messagesContainerRef.current;
        if (!container) return;
        const handleScroll = () => {
        const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 200;
        setShouldAutoScroll(isAtBottom);
        };
        container.addEventListener("scroll", handleScroll);
        return () => container.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
        const handleResize = () => scrollToBottom();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        return () => {
        if (streamTimeoutRef.current) {
            clearTimeout(streamTimeoutRef.current);
        }
        };
    }, []);

    const fetchChatHistory = async () => {
        try {
        const savedMessages = localStorage.getItem("chatHistory");
        if (savedMessages) setMessages(JSON.parse(savedMessages));
        } catch (err) {
        console.error("Error fetching chat history:", err);
        }
    };

    const checkSystemStatus = async () => {
        try {
        const status = await QAService.checkBackendHealth();
        setSystemStatus(status);
        } catch (error) {
        setSystemStatus({ status: "error", message: error.message });
        }
    };

    const scrollToBottom = () => {
        setTimeout(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "auto" });
        } else if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
        }, 100);
    };

    const handleFileClick = (type) => {
        if (type === "image") imageInputRef.current.click();
        else fileInputRef.current.click();
    };

    const handleFileChange = (e, type) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;
        e.target.value = "";
        files.forEach((file) => {
        if (file.size > MAX_FILE_SIZE) {
            alert(`ไฟล์ "${file.name}" มีขนาดใหญ่เกิน 5MB`);
            return;
        }
        if (type === "image" && !ALLOWED_IMAGE_TYPES.includes(file.type)) {
            alert(`ไม่รองรับไฟล์ภาพ "${file.name}"`);
            return;
        } else if (type === "file" && !ALLOWED_FILE_TYPES.includes(file.type)) {
            alert(`ไม่รองรับไฟล์ "${file.name}"`);
            return;
        }
        const reader = new FileReader();
        if (type === "image") {
            reader.onload = (event) => {
            setAttachments((prev) => [
                ...prev,
                {
                file,
                preview: event.target.result,
                type,
                name: file.name,
                id: Date.now() + Math.random().toString(36).substr(2, 9),
                },
            ]);
            };
            reader.readAsDataURL(file);
        } else {
            reader.onload = () => {
            setAttachments((prev) => [
                ...prev,
                {
                file,
                type,
                name: file.name,
                id: Date.now() + Math.random().toString(36).substr(2, 9),
                },
            ]);
            };
            reader.readAsArrayBuffer(file);
        }
        });
    };

    const removeAttachment = (id) => {
        setAttachments((prev) => prev.filter((att) => att.id !== id));
    };

    const handleFaqClick = async (faqItem) => {
        const newUserMessage = {
        role: "user",
        content: faqItem.question,
        createdAt: new Date(),
        };
        setMessages((prev) => [...prev, newUserMessage]);
        setIsLoading(true);
        setShouldAutoScroll(true);
        try {
        const response = await handleUserMessage(faqItem.question);
        const assistantMessage = {
            role: "assistant",
            content: response.text,
            createdAt: new Date(),
            sources: response.sources,
        };
        setIsStreaming(true);
        const words = response.text.split(" ");
        let currentText = "";
        for (let i = 0; i < words.length; i++) {
            setTimeout(() => {
            currentText += words[i] + " ";
            setStreamingResponse(currentText);
            if (shouldAutoScroll) scrollToBottom();
            if (i === words.length - 1) {
                setTimeout(() => {
                setIsStreaming(false);
                setStreamingResponse("");
                setMessages((prev) => [...prev, assistantMessage]);
                const updatedMessages = [...messages, newUserMessage, assistantMessage];
                QAService.saveConversation(updatedMessages).catch((err) =>
                    console.error("Failed to save conversation:", err)
                );
                }, 500);
            }
            }, i * 50);
        }
        } catch (error) {
        console.error("Error:", error);
        const errorMessage = {
            role: "assistant",
            content: `เกิดข้อผิดพลาด: ${error.message || "โปรดลองอีกครั้ง"}`,
            createdAt: new Date(),
            isError: true,
        };
        setMessages((prev) => [...prev, errorMessage]);
        } finally {
        setIsLoading(false);
        }
    };

    const handleSend = async () => {
        if (!inputValue.trim() && attachments.length === 0) return;
        const newUserMessage = {
        role: "user",
        content: inputValue.trim(),
        createdAt: new Date(),
        attachments: attachments.map((att) => ({
            name: att.name,
            type: att.type,
            preview: att.type === "image" ? att.preview : null,
        })),
        };
        setMessages((prev) => [...prev, newUserMessage]);
        setInputValue("");
        setAttachments([]);
        setIsLoading(true);
        setShouldAutoScroll(true);
        try {
        const response = await handleUserMessage(inputValue.trim());
        const assistantMessage = {
            role: "assistant",
            content: response.text,
            createdAt: new Date(),
            sources: response.sources,
        };
        setIsStreaming(true);
        const words = response.text.split(" ");
        let currentText = "";
        for (let i = 0; i < words.length; i++) {
            setTimeout(() => {
            currentText += words[i] + " ";
            setStreamingResponse(currentText);
            if (shouldAutoScroll) scrollToBottom();
            if (i === words.length - 1) {
                setTimeout(() => {
                setIsStreaming(false);
                setStreamingResponse("");
                setMessages((prev) => [...prev, assistantMessage]);
                const updatedMessages = [...messages, newUserMessage, assistantMessage];
                QAService.saveConversation(updatedMessages).catch((err) =>
                    console.error("Failed to save conversation:", err)
                );
                }, 500);
            }
            }, i * 50);
        }
        } catch (error) {
        console.error("Error:", error);
        const errorMessage = {
            role: "assistant",
            content: `เกิดข้อผิดพลาด: ${error.message || "โปรดลองอีกครั้ง"}`,
            createdAt: new Date(),
            isError: true,
        };
        setMessages((prev) => [...prev, errorMessage]);
        } finally {
        setIsLoading(false);
        setTimeout(() => inputRef.current?.focus(), 300);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (!isLoading && !isStreaming && (inputValue.trim() || attachments.length > 0)) {
            handleSend();
        }
        }
    };

    const handleClearConversation = async () => {
        if (window.confirm("คุณแน่ใจหรือไม่ว่าต้องการล้างประวัติการสนทนา?")) {
        setMessages([]);
        try {
            await QAService.saveConversation([]);
        } catch (error) {
            console.error("Failed to clear conversation:", error);
        }
        }
    };

    const renderAttachment = (attachment) => {
        if (attachment.type === "image") {
        return (
            <div className="rounded overflow-hidden my-2 max-w-xs">
            <img src={attachment.preview} alt={attachment.name} className="w-full h-auto" />
            <div className="text-xs opacity-80 mt-1">{attachment.name}</div>
            </div>
        );
        } else {
        return (
            <div className="flex items-center bg-base-200 rounded p-2 my-2">
            <div className="bg-primary p-2 rounded mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            </div>
            <div>
                <div className="text-sm font-medium">{attachment.name}</div>
                <div className="text-xs opacity-80">เอกสาร</div>
            </div>
            </div>
        );
        }
    };

    const getMessagesContainerHeight = () => {
        const baseHeight = "calc(100vh - 160px)";
        if (attachments.length > 0) return `calc(${baseHeight} - 86px)`;
        return baseHeight;
    };

    return (
        <SideBar user={user} activePage="chat">
        <div className="flex flex-col min-h-screen bg-base-100">
            <div className="flex-1 overflow-y-scroll p-4" ref={messagesContainerRef} style={{ height: getMessagesContainerHeight(), minHeight: "250px" }}>
            {messages.length === 0 && (
                <div className="text-center py-20">
                <div className="avatar mx-auto mb-4">
                    <div className="w-20 rounded-full bg-primary">
                    <img src="/kku-logo.png" alt="KKU Logo" />
                    </div>
                </div>
                <h3 className="text-2xl font-bold text-primary">ยินดีต้อนรับสู่ KKU Chatbot</h3>
                <p className="mt-2 text-base-content">เริ่มต้นสนทนาโดยพิมพ์คำถามหรือข้อความของคุณด้านล่าง</p>
                <div className="mt-6">
                    <div className="card bg-base-200 shadow-md p-4">
                    <h4 className="font-bold text-lg text-primary">คำถามที่พบบ่อย</h4>
                    <ul className="menu menu-compact mt-2">
                        {faqData.map((faq) => (
                        <li key={faq.id} onClick={() => handleFaqClick(faq)} className="cursor-pointer">
                            <a>{faq.question}</a>
                        </li>
                        ))}
                    </ul>
                    </div>
                </div>
                </div>
            )}

            {messages.map((msg, i) => (
                <div key={i} className={`mb-4 ${msg.role === "user" ? "text-right" : "text-left"}`}>
                <div className={`card p-4 shadow-md ${msg.role === "user" ? "bg-primary text-primary-content" : msg.isError ? "bg-error text-error-content" : "bg-base-100 text-base-content"}`}>
                    {msg.role === "assistant" && !msg.isError && (
                    <div className="flex items-center mb-2">
                        <div className="avatar mr-2">
                        <div className="w-6 rounded-full bg-primary text-white flex items-center justify-center">
                            KKU
                        </div>
                        </div>
                        <span className="font-bold">KKU Assistant</span>
                    </div>
                    )}
                    <div>{msg.content}</div>
                    {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-2 text-xs border-t pt-2">
                        <p className="font-bold">แหล่งข้อมูล:</p>
                        <ul className="mt-1">
                        {msg.sources.map((source, idx) => (
                            <li key={idx}>{source.source}</li>
                        ))}
                        </ul>
                    </div>
                    )}
                    {msg.attachments && msg.attachments.length > 0 && (
                    <div className="mt-2">
                        {msg.attachments.map((attachment, idx) => (
                        <div key={idx}>{renderAttachment(attachment)}</div>
                        ))}
                    </div>
                    )}
                    <div className="mt-2 text-xs text-right opacity-70">
                    {new Date(msg.createdAt).toLocaleTimeString("th-TH")}
                    </div>
                </div>
                </div>
            ))}

            {isStreaming && streamingResponse && (
                <div className="mb-4 text-left">
                <div className="card p-4 shadow-md bg-base-100 text-base-content">
                    <div className="flex items-center mb-2">
                    <div className="avatar mr-2">
                        <div className="w-6 rounded-full bg-primary text-white flex items-center justify-center">
                        KKU
                        </div>
                    </div>
                    <span className="font-bold">KKU Assistant</span>
                    </div>
                    <div>{streamingResponse}</div>
                </div>
                </div>
            )}

            {isLoading && !isStreaming && (
                <div className="text-left">
                <div className="card p-4 shadow-md bg-base-100 text-base-content flex items-center">
                    <div className="mr-2">กำลังประมวลผลคำขอ</div>
                    <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-0" />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-150" />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-300" />
                    </div>
                </div>
                </div>
            )}

            <div ref={messagesEndRef} />
            </div>

            {/* File input elements */}
            <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={(e) => handleFileChange(e, "file")}
            accept=".pdf,.doc,.docx,.txt,.xls,.xlsx"
            />
            <input
            type="file"
            ref={imageInputRef}
            className="hidden"
            onChange={(e) => handleFileChange(e, "image")}
            accept="image/jpeg,image/png,image/gif,image/webp"
            />

            {attachments.length > 0 && (
            <div className="p-4 bg-base-200 border-t">
                <div className="font-bold text-primary mb-2">ไฟล์แนบ:</div>
                <div className="flex flex-wrap gap-2">
                {attachments.map((attachment) => (
                    <div key={attachment.id} className="relative group">
                    {attachment.type === "image" ? (
                        <div className="w-16 h-16 rounded overflow-hidden bg-base-100 border">
                        <img
                            src={attachment.preview}
                            alt={attachment.name}
                            className="w-full h-full object-cover"
                        />
                        </div>
                    ) : (
                        <div className="w-16 h-16 flex items-center justify-center bg-base-100 rounded border">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-8 text-primary"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                        </svg>
                        </div>
                    )}
                    <button
                        onClick={() => removeAttachment(attachment.id)}
                        className="absolute -top-2 -right-2 bg-warning text-primary rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        ×
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-primary bg-opacity-70 text-white text-xs p-1 truncate">
                        {attachment.name.length > 10 ? attachment.name.substring(0, 7) + "..." : attachment.name}
                    </div>
                    </div>
                ))}
                </div>
            </div>
            )}

            <div className="border-t bg-base-100 p-4">
            <div className="flex items-center">
                <div className="flex space-x-2 mr-2">
                <button
                    onClick={() => handleFileClick("file")}
                    disabled={isLoading || isStreaming}
                    className="btn btn-ghost btn-square"
                    title="อัพโหลดเอกสาร"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </button>
                <button
                    onClick={() => handleFileClick("image")}
                    disabled={isLoading || isStreaming}
                    className="btn btn-ghost btn-square"
                    title="อัพโหลดรูปภาพ"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </button>
                </div>
                <textarea
                ref={inputRef}
                placeholder="พิมพ์ข้อความของคุณที่นี่..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="textarea textarea-bordered flex-grow resize-y"
                disabled={isLoading || isStreaming}
                rows={1}
                />
                <button
                onClick={handleSend}
                disabled={isLoading || isStreaming || (!inputValue.trim() && attachments.length === 0)}
                className="btn btn-primary ml-2"
                >
                ส่ง
                </button>
            </div>
            <div className="text-xs text-gray-500 mt-2">
                กด Enter เพื่อส่งข้อความ, Shift+Enter สำหรับขึ้นบรรทัดใหม่
            </div>
            </div>
        </div>
        </SideBar>
    );
}

export default ChatPage;

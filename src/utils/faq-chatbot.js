// utils/faq-chatbot.js
import QAService from '../services/qaService';

export const handleUserMessage = async (message) => {
  try {
    console.log("Processing user message:", message);
    
    // ใช้ QAService เพื่อสร้างคำตอบจาก Azure OpenAI
    const response = await QAService.generateAnswer(message);
    console.log("Generated response:", response);
    
    return response;
  } catch (error) {
    console.error("Error in handleUserMessage:", error);
    return {
      text: "ขออภัยค่ะ เกิดข้อผิดพลาดในการประมวลผลคำถาม กรุณาลองใหม่อีกครั้ง หรือติดต่อฝ่ายวิชาการที่ line official @176tafef",
      sources: []
    };
  }
};
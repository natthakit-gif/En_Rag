// utils/faq-chatbot.js
import QAService from '../services/qaService';

export const handleUserMessage = async (message) => {
  try {
    // Use the QAService to generate a response using Azure OpenAI
    const response = await QAService.generateAnswer(message);
    return response;
  } catch (error) {
    console.error("Error in handleUserMessage:", error);
    return {
      text: "ขออภัยค่ะ เกิดข้อผิดพลาดในการประมวลผลคำถาม กรุณาลองใหม่อีกครั้ง หรือติดต่อฝ่ายวิชาการที่ line official @176tafef",
      sources: []
    };
  }
};
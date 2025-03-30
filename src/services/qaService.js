// services/qaService.js
import { vectorStoreService } from './vectorStoreService';

class QAService {
    constructor() {
        // ดึงค่า credentials จากตัวแปรสภาพแวดล้อม
        // this.apiKey = process.env.REACT_APP_AZURE_API_KEY;
        // this.endpoint = process.env.REACT_APP_AZURE_ENDPOINT;
        // this.deploymentId = process.env.REACT_APP_AZURE_DEPLOYMENT_ID;
        // this.apiVersion = process.env.REACT_APP_AZURE_API_VERSION;
        this.openAi = process.env.OPENAI_API_KEY;
    }

    async generateAnswer(question, documents = []) {
        try {
        // ค้นหาเอกสารที่เกี่ยวข้องจาก vectorStoreService
        const relevantDocs = await vectorStoreService.searchDocuments(question);
        
        // สร้าง prompt โดยรวมบริบทจากเอกสารที่เกี่ยวข้อง
        const prompt = this.preparePrompt(question, relevantDocs);
        
        console.log("Calling Azure OpenAI with endpoint:", this.endpoint);
        
        // เรียกใช้ Azure OpenAI API
        const response = await fetch(this.endpoint, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'api-key': this.apiKey,
            },
            body: JSON.stringify({
            messages: [
                { role: "system", content: "คุณเป็นผู้ช่วยคณะวิศวกรรมศาสตร์ มหาวิทยาลัยขอนแก่น ให้ข้อมูลเกี่ยวกับหลักสูตร การเรียนการสอน และข้อมูลทั่วไปของคณะฯ ตอบด้วยข้อมูลที่ถูกต้องและเป็นกลาง ตอบเป็นภาษาไทยเสมอ" },
                { role: "user", content: prompt }
            ],
            temperature: 0.7,
            max_tokens: 800,
            model: this.deploymentId // ระบุโมเดลที่ต้องการใช้
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Azure OpenAI Error:", response.status, errorText);
            throw new Error(`API Error: ${response.status} - ${errorText}`);
        }

        const result = await response.json();
        console.log("Azure OpenAI Response:", result);
        
        return {
            text: result.choices[0].message.content,
            sources: relevantDocs.map(doc => doc.metadata),
        };
        } catch (error) {
        console.error("Error generating answer:", error);
        throw error;
        }
    }

    preparePrompt(question, documents) {
        // รวมเนื้อหาจากเอกสารเป็นบริบท
        const context = documents.map(doc => doc.pageContent).join("\n\n");
        
        return `
    คำถาม: ${question}

    คอนเทกซ์:
    ${context}

    จากข้อมูลในคอนเทกซ์ กรุณาตอบคำถามให้ดีที่สุด หากไม่มีข้อมูลในคอนเทกซ์ให้ตอบว่าไม่มีข้อมูลเพียงพอที่จะตอบคำถามได้ แนะนำให้ติดต่อฝ่ายวิชาการ line official @176tafef
    `;
    }

    async checkBackendHealth() {
        try {
        // ทดสอบการเชื่อมต่อกับ Azure OpenAI
        const testPrompt = "ทดสอบการเชื่อมต่อ";
        
        const response = await fetch(this.endpoint, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'api-key': this.apiKey,
            },
            body: JSON.stringify({
            messages: [
                { role: "system", content: "คุณเป็นผู้ช่วย" },
                { role: "user", content: testPrompt }
            ],
            temperature: 0.7,
            max_tokens: 50,
            model: this.deploymentId
            }),
        });
        
        return { 
            status: response.ok ? "ok" : "error", 
            available: response.ok,
            message: response.ok ? "ระบบพร้อมใช้งาน" : "ไม่สามารถเชื่อมต่อกับ Azure OpenAI ได้"
        };
        } catch (error) {
        console.error("Error checking backend health:", error);
        return { 
            status: "error", 
            available: false,
            message: `ไม่สามารถเชื่อมต่อกับ Azure OpenAI ได้: ${error.message}`
        };
        }
    }

    // บันทึกประวัติการสนทนาลง local storage
    async saveConversation(messages) {
        try {
        localStorage.setItem('chatHistory', JSON.stringify(messages));
        return true;
        } catch (error) {
        console.error("Failed to save conversation:", error);
        return false;
        }
    }
}

export default new QAService();
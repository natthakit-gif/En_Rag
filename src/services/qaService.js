// Updated qaService.js with Azure OpenAI integration
import { vectorStoreService } from './vectorStoreService';

class QAService {
    constructor() {
        this.apiKey = process.env.REACT_APP_AZURE_API_KEY;
        this.endpoint = process.env.REACT_APP_AZURE_ENDPOINT;
        this.deploymentId = process.env.REACT_APP_AZURE_DEPLOYMENT_ID;
        this.apiVersion = process.env.REACT_APP_AZURE_API_VERSION;
    }

    async generateAnswer(question, documents = []) {
        try {
        // First, search for relevant documents using vectorStoreService
        const relevantDocs = await vectorStoreService.searchDocuments(question);
        
        // Prepare the prompt with context from the relevant documents
        const prompt = this.preparePrompt(question, relevantDocs);
        
        // Call the Azure OpenAI API
        const response = await fetch(`${this.endpoint}/openai/deployments/${this.deploymentId}/chat/completions?api-version=${this.apiVersion}`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'api-key': this.apiKey,
            },
            body: JSON.stringify({
            messages: [
                { role: "system", content: "คุณเป็นผู้ช่วยคณะวิศวกรรมศาสตร์ มหาวิทยาลัยขอนแก่น ให้ข้อมูลเกี่ยวกับหลักสูตร การเรียนการสอน และข้อมูลทั่วไปของคณะฯ ตอบด้วยข้อมูลที่ถูกต้องและเป็นกลาง" },
                { role: "user", content: prompt }
            ],
            temperature: 0.7,
            max_tokens: 800,
            }),
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const result = await response.json();
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
        // Combine the documents into context
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
        // Simple ping to Azure to check if the service is available
        const response = await fetch(`${this.endpoint}/openai/deployments?api-version=${this.apiVersion}`, {
            method: 'GET',
            headers: {
            'api-key': this.apiKey,
            },
        });
        
        return { 
            status: response.ok ? "ok" : "error", 
            available: response.ok,
            message: response.ok ? "ระบบพร้อมใช้งาน" : "ไม่สามารถเชื่อมต่อกับ Azure OpenAI ได้"
        };
        } catch (error) {
        return { 
            status: "error", 
            available: false,
            message: "ไม่สามารถเชื่อมต่อกับ Azure OpenAI ได้"
        };
        }
    }

    // Local storage methods for chat history (these remain unchanged)
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
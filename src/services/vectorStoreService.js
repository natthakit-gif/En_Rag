// vectorStoreService.js
import { dataProcessor } from '../utils/dataProcessor';

class VectorStoreService {
    constructor() {
        this.documents = [];
        this.initialized = false;
    }

    async initialize() {
        if (this.initialized) return;
        
        try {
        // Load and process your FAQ data from the PDF
        const faqData = [
            {
            id: 1,
            question: "ข้อมูลหลักสูตรการศึกษา",
            answer: "คณะวิศวกรรมศาสตร์เปิดสอนจำนวน 14 หลักสูตร ได้แก่หลักสูตรปกติจำนวน 10 หลักสูตร และหลักสูตรนานาชาติจำนวน 4 หลักสูตร สามารถดูรายละเอียดของหลักสูตรได้ที่ https://www.en.kku.ac.th/web/หลักสูตร"
            },
            {
            id: 2,
            question: "ปฏิทินการศึกษา",
            answer: "การเรียนการสอนแบ่งออกเป็น 2 ภาคการศึกษา ได้แก่ ภาคการศึกษาต้น และภาคการศึกษาปลาย โดย 1 ภาคการศึกษาใช้ระยะเวลาศึกษา ไม่น้อยกว่า 15 สัปดาห์ ภาคการศึกษาต้น เปิดเทอม มิ.ย. - ต.ค. ภาคการศึกษาปลาย พ.ย. - มี.ค."
            },
            // Add all the FAQ data from your PDF here
            // ...
        ];
        
        // Process the raw FAQ data into document format
        this.documents = faqData.map(faq => ({
            pageContent: `คำถาม: ${faq.question}\nคำตอบ: ${faq.answer}`,
            metadata: {
            source: 'KKU Engineering FAQ',
            id: faq.id.toString()
            }
        }));
        
        this.initialized = true;
        } catch (error) {
        console.error("Error initializing vector store:", error);
        throw error;
        }
    }

    async searchDocuments(query) {
        await this.initialize();
        
        // In a real implementation, this would use embeddings and semantic search
        // For now, we'll use a simple keyword matching approach
        const normalizedQuery = query.toLowerCase();
        
        // Calculate relevance scores
        const scoredDocs = this.documents.map(doc => {
        const content = doc.pageContent.toLowerCase();
        // Simple relevance scoring - count keyword occurrences
        const score = normalizedQuery.split(' ').reduce((acc, keyword) => {
            return acc + (content.includes(keyword) ? 1 : 0);
        }, 0);
        
        return { ...doc, score };
        });
        
        // Sort by relevance and take top 3 results
        const relevantDocs = scoredDocs
        .filter(doc => doc.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);
        
        // If no matches, return empty array
        return relevantDocs.length > 0 ? relevantDocs : [];
    }
}

export const vectorStoreService = new VectorStoreService();
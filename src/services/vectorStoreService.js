// services/vectorStoreService.js

// ข้อมูล FAQ จาก PDF
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
        // เพิ่ม FAQ อื่นๆ ตามต้องการ...
    ];
    
    class VectorStoreService {
        constructor() {
        this.documents = [];
        this.initialized = false;
        }
    
        async initialize() {
        if (this.initialized) return;
        
        try {
            // แปลงข้อมูล FAQ เป็นรูปแบบเอกสาร
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
        
        // ในตัวอย่างนี้ เราใช้การค้นหาแบบง่ายโดยตรวจสอบคำสำคัญ
        const normalizedQuery = query.toLowerCase();
        
        // คำนวณคะแนนความเกี่ยวข้อง
        const scoredDocs = this.documents.map(doc => {
            const content = doc.pageContent.toLowerCase();
            // คำนวณคะแนนแบบง่าย - นับจำนวนคำสำคัญที่ปรากฏ
            const score = normalizedQuery.split(' ').reduce((acc, keyword) => {
            return acc + (content.includes(keyword) ? 1 : 0);
            }, 0);
            
            return { ...doc, score };
        });
        
        // เรียงลำดับตามคะแนนและเลือก 3 อันดับแรก
        const relevantDocs = scoredDocs
            .filter(doc => doc.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 3);
        
        // ถ้าไม่พบข้อมูลที่เกี่ยวข้อง ให้ส่งค่าว่าง
        return relevantDocs.length > 0 ? relevantDocs : [];
        }
    }
    
export const vectorStoreService = new VectorStoreService();
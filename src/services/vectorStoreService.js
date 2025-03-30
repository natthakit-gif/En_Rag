// services/vectorStoreService.js

// ข้อมูล FAQ จาก PDF
const faqData = [
        {
            id: 1,
            question: "การสมคัรรอบ Portfolio หลกัฐานการสมคัรและการสง่",
            answer: "หลกัฐานการสมคัร Portfolio: การสมคัรผา่นระบบ www.admissions.kku.ac.th และสง่หลกัฐานอฟัโหลดผา่นระบบเพยีงชอ่งทาง เดยีวเทา่นัน้"
            },
            {
            id: 2,
            question: "การเทยีบโอนของปวส. จบวฒุ ิปวส. สามารถสมคัรเรยีนได ้ หรอืไม ่",
            answer: "คณะวิศวกรรมศาสตร ์เปิดสอนหลักสูตร 4 ปี ไม่มีหลักสูตรต่อเนื่อง โดยในการสมคัรต้องใช้วุฒิการศึกษาม.6 หรือ ปวช. เปิดรับสมัครจำนวน 3 รอบ ได้แก่ รอบที่ 1 Portfolio, รอบที่ 2 โควตา (สำหรับการจบจากโรงเรียนในเขตพื้นที่ออกเฉยีงเหนอื ด้วยคะแนน NetSat และ TPAT 3) และรอบที่ 3 Admission (โดยมีคะแนน TPAT 3 และ A-Level) เมือ่รายงานตัวเป็นนักศึกษาจะสามารถทำเรื่องขอเทยีบโอนรายวิชาได้ โดยต้องมีคะแนนในรายวิชาที่เทยีบโอนได้ไม่น้อยกว่า 80% ดูรายละเอียดเพิ่มเติมได้ที่ www.en.kku.ac.th"
            },
            {
            id: 3,
            question: "จบมัธยมปลายสายศิลป์ หากจบมธัยมศกึษาตอนปลาย สายศิลป์ สามารถสมคัรเรยีนไดห้รอืไม ่",
            answer: "หากจบจากโรงเรียนในเขตพื้นที่ที่ออกเฉยีงเหนอื สามารถสมัครได้ในรอบที่ 2 โควตา (โดยมีคะแนน NetSat และ TPAT 3) และรอบที่ 3 Admission (โดยมีคะแนน TPAT 3 และ A-Level) แต่สำหรับรอบที่ 1 Portfolio ไม่สามารถสมัครได้"
            },
            {
            id: 4,
            question: "ค่าเรียนการศึกษา (ค่าเทอม) สำหรับผู้เข้าเรียน",
            answer: "สำหรับผู้เข้าเรียนหลักสูตร 2568: หลักสูตรปกติมีค่าเทอม 20,000 บาท/เทอม และหลักสูตรนานาชาติ 45,000 บาท/เทอม โดยแบ่งตามสาขา ได้แก่ วศิวกรรมโยธา, ไฟฟ้า, เกษตร, อตูสาหการ, เครื่องกล, สิง่แวดลอ้ม, เคมี, คอมพิวเตอร์, ระบบอเิล็กทรอนกิส, ระบบอตัโนมตั ิหุน่ยนต ์และปัญญา"
            },
            {
            id: 5,
            question: "หลักสูตรนานาชาติ",
            answer: "หลักสูตรนานาชาติ: เปิดสอนจำนวน 4 หลักสูตร ได้แก่ วศิวกรรมโทรคมนาคม, วศิวกรรมโลจสิตกิส, วศิวกรรมกระบวนการเคมี, วศิวกรรมสื่อดิจิทัล ดูรายละเอียดได้ที่ https://www.en.kku.ac.th/web/หลกัสตูร"
            },
            {
            id: 6,
            question: "โรงเรียนที่มี MOU กับคณะวิศวกรรมศาสตร์",
            answer: "โรงเรียน MOU กับคณะวิศวกรรมศาสตร์: รายชื่อโรงเรียนในโครงการรับนักเรียนที่มีศักยภาพสูง สามารถตรวจสอบได้ที่ https://www.en.kku.ac.th/web/โรงเรยีน-mou"
            },
            {
            id: 7,
            question: "นักศึกษาระดับปริญญาตรี",
            answer: "สำหรับนักศึกษาระดับปริญญาตรี: สามารถดูรายละเอียดการรับนักศึกษาคณะวิศวกรรมศาสตร์ได้ที่ https://www.en.kku.ac.th/web/วธิรัีบเขา้ศกึษา หรือสอบถามเพิ่มเติมที่ Line Official @176tafef"
            },
            {
            id: 8,
            question: "หลักสูตรการเรียนการสอน",
            answer: "หลักสูตรการเรียนการสอน: เปิดสอนจำนวน 14 หลักสูตร โดยหลักสูตรปกติ 10 หลักสูตรและหลักสูตรนานาชาติ 4 หลักสูตร ดูรายละเอียดที่ https://www.en.kku.ac.th/web/หลกัสตูร และสอบถามที่ Line Official @176tafef"
            },
            {
            id: 9,
            question: "ด้านการเรียนการสอนต่างๆ",
            answer: "การเรียนการสอนแบ่งเป็น 2 ภาค (ต้นและปลาย) โดยแต่ละภาคมีระยะเวลาศึกษาไม่น้อยกว่า 15 สัปดาห์ (ภาคต้น: มิ.ย. - ต.ค., ภาคปลาย: พ.ย. - มี.ค.) สอบถามเพิ่มเติมที่ Line Official @176tafef"
            },
            {
            id: 10,
            question: "การผ่อนผันค่าเทอม",
            answer: "นักศึกษาสามารถยื่นคำร้องขอผ่อนผันค่าเทอมในกรณีที่มีความจำเป็นผ่านระบบ https://req.kku.ac.th/ โดยสอบถามรายละเอียดเพิ่มเติมที่ Line Official @176tafef"
            },
            {
            id: 11,
            question: "คนต่างชาติสามารถสมัครเรียนได้หรือไม่",
            answer: "นักศึกษาต่างชาติสามารถสมัครเรียนในหลักสูตรนานาชาติได้ แต่ต้องมีความสามารถในการสื่อสารภาษาไทยหรือภาษาอังกฤษตามที่คณะกำหนด หากมีปัญหา สามารถสอบถามที่ Line Official @176tafef"
            },
            {
            id: 12,
            question: "ตาบอดสามารถสมัครเรียนได้หรือไม่",
            answer: "นักเรียนตาบอดสามารถสมัครเรียนได้ แต่ในบางหลักสูตรอาจมีข้อจำกัดเกี่ยวกับการจัดสื่อการเรียนการสอนโดยเฉพาะในวิชาที่เกี่ยวข้องกับไฟฟ้า โทรคมนาคม และระบบอเิล็กทรอนกิส สอบถามเพิ่มเติมที่ Line Official @176tafef"
            },
            {
            id: 13,
            question: "การถอนวิชาเรียน",
            answer: "นักศึกษาสามารถถอนวิชาเรียนผ่านระบบได้ที่ https://reg.kku.ac.th หรือ https://req.kku.ac.th/ โดยปฏิบัติตามเงื่อนไขของมหาวิทยาลัย"
            },
            {
            id: 14,
            question: "การกูย้มื กยศ",
            answer: "นักศึกษาสามารถศึกษารายละเอียดเกี่ยวกับการกูย้มื กยศ ได้ที่ https://sac.kku.ac.th/กยศ โดยสอบถามเพิ่มเติมที่ Line Official @176tafef"
            },
            {
            id: 15,
            question: "คนสถานภาพนักศึกษา",
            answer: "นักศึกษาที่ต้องการขอคนสถานภาพการเป็นนักศึกษาสามารถยื่นคำร้องได้เพียง 1 ครั้ง (เช่นในกรณีลาออกหรือสถานภาพไม่ต่อเนื่อง) ผ่านระบบ https://req.kku.ac.th และสอบถามเพิ่มเติมที่ Line Official @176tafef"
            },
            {
            id: 16,
            question: "การสำเร็จการศึกษา",
            answer: "เมื่อครบหลักสูตรและผ่านการสอบวัดความถนัดทางคอมพิวเตอร์และภาษาอังกฤษแล้ว นักศึกษาสามารถยื่นคำร้องขอสำเร็จการศึกษาผ่านระบบ https://reg.kku.ac.th"
            },
            {
            id: 17,
            question: "การสมัครลงเรียนซมัเมอร",
            answer: "นักศึกษาสามารถสมัครลงเรียนซมัเมอรได้สูงสุด 9 หน่วยกิตในหลักสูตรปกติ สอบถามเพิ่มเติมที่ Line Official @176tafef"
            },
            {
            id: 18,
            question: "การทดสอบภาษาอังกฤษ",
            answer: "สำหรับนักศึกษาที่ทดสอบภาษาอังกฤษผ่านระบบ Kept Exit ให้เข้าสู่ https://kept.kku.ac.th/web/pages/start เลือกประเภท 'สำหรับนักศึกษา' เพื่อนำคะแนน TOEIC, TOEFL, หรือ IELTS มาประเมิน"
            },
            {
            id: 19,
            question: "Open House",
            answer: "สำหรับข้อมูลเกี่ยวกับ Open House ของคณะวิศวกรรมศาสตร์ สามารถสอบถามได้ที่ Line Official @176tafef หรือดูที่ https://www.facebook.com/ENKKUAcademicAffairsDivision"
            },
            {
            id: 20,
            question: "หลักสูตรบัญชีศึกษา",
            answer: "สอบถามเกี่ยวกับหลักสูตรบัญชีศึกษาของคณะได้ที่สำนักงานบัณฑิตศึกษาที่โทร 043-009700 ต่อ 50223 หรือดูข้อมูลที่ https://www.facebook.com/ENKKUAcademicAffairsDivision"
            },
            {
            id: 21,
            question: "การขอเข้าศึกษาดูงาน",
            answer: "นักศึกษาสามารถขอเข้าศึกษาดูงานได้ที่สำนักงานสารบรรณคณะวิศวกรรมศาสตร์ โทร 043-009700 ต่อ 50201 ในวันและเวลาราชการ"
            },
            {
            id: 22,
            question: "งานรับพระราชทาน",
            answer: "สำหรับข้อมูลงานรับพระราชทานและปรับปรุงสถานะ ติดต่อสำนักงานพัฒนานักศึกษา โทร 043-009700 ต่อ 50228 ในวันและเวลาราชการ"
            },
            {
            id: 23,
            question: "Job fair",
            answer: "สำหรับข้อมูล Job fair ของคณะวิศวกรรมศาสตร์ ติดต่อสำนักงานพัฒนานักศึกษา โทร 043-009700 ต่อ 50228"
            },
            {
            id: 24,
            question: "การใช้งานพื้นที่คณะ",
            answer: "สำหรับการใช้งานพื้นที่คณะ อาคารสถานที่ โทร 043-009700 ต่อ 45653"
            },
            {
            id: 25,
            question: "หลักสูตร Pre - Engineering",
            answer: "สำหรับข้อมูลหลักสูตร Pre - Engineering (เตรียมความพร้อมสู่วิศวกรรมศาสตร์) ดูรายละเอียดได้ที่ https://www.facebook.com/IENSKKU/"
            },
            {
            id: 26,
            question: "หลักสูตรอบรมสำหรับเด็ก",
            answer: "หลักสูตรอบรมสำหรับเด็ก เช่น Coding for High School, Digital Lab for Computer Engineer, Advance Coding with Micro Python โดยสอบถามเพิ่มเติมได้ที่ 093 538 2435 หรือ Line Official @759slkbe"
            },
            {
            id: 27,
            question: "การบริหารเครื่องมือทดสอบวัดสัดส่วน",
            answer: "สามารถตรวจสอบข้อมูลได้ที่ https://kku.world/5ivuix"
            },
            {
            id: 28,
            question: "ห้องสมุดคณะวิศวกรรมศาสตร์ มข.",
            answer: "ดูรายละเอียดห้องสมุดคณะวิศวกรรมศาสตร์ มข. ได้ที่ https://www.facebook.com/kkuenglib"
            },
            {
            id: 29,
            question: "วิศวกรรมโยธา",
            answer: "สำหรับการเรียนการสอนวิศวกรรมโยธา ดูรายละเอียดได้ที่ https://www.en.kku.ac.th/web/civil/ และ https://www.facebook.com/CivilEngKKU"
            },
            {
            id: 30,
            question: "วิศวกรรมไฟฟ้า",
            answer: "ดูรายละเอียดการเรียนการสอนวิศวกรรมไฟฟ้าได้ที่ https://www.en.kku.ac.th/web/electrical/"
            },
            {
            id: 31,
            question: "วิศวกรรมเกษตร",
            answer: "ดูรายละเอียดการเรียนการสอนวิศวกรรมเกษตรได้ที่ https://www.en.kku.ac.th/web/ae/"
            },
            {
            id: 32,
            question: "วิศวกรรมอตุสาหการ",
            answer: "ดูรายละเอียดได้ที่ https://www.en.kku.ac.th/web/ie/ และ https://www.facebook.com/KKUENIE"
            },
            {
            id: 33,
            question: "วิศวกรรมเครื่องกล",
            answer: "ดูรายละเอียดการเรียนการสอนวิศวกรรมเครื่องกลได้ที่ https://www.en.kku.ac.th/web/mech/"
            },
            {
            id: 34,
            question: "วิศวกรรมสิ่งแวดล้อม",
            answer: "ดูรายละเอียดการเรียนการสอนวิศวกรรมสิ่งแวดล้อมได้ที่ https://www.en.kku.ac.th/web/envi/"
            },
            {
            id: 35,
            question: "วิศวกรรมเคมี",
            answer: "ดูรายละเอียดการเรียนการสอนวิศวกรรมเคมีได้ที่ https://www.en.kku.ac.th/web/en/chemicalinfo/"
            },
            {
            id: 36,
            question: "วิศวกรรมคอมพิวเตอร์",
            answer: "ดูรายละเอียดการเรียนการสอนวิศวกรรมคอมพิวเตอร์ได้ที่ https://gear.kku.ac.th/"
            },
            {
            id: 37,
            question: "วิศวกรรมระบบอัตโนมัติและหุ่นยนต์",
            answer: "ดูรายละเอียดการเรียนการสอนวิศวกรรมระบบอัตโนมัติและหุ่นยนต์ได้ที่ https://www.facebook.com/KKUARIS/"
            },
            {
            id: 38,
            question: "วิศวกรรมโทรคมนาคม",
            answer: "ดูรายละเอียดการเรียนการสอนวิศวกรรมโทรคมนาคมได้ที่ https://www.facebook.com/telecomkku/?locale=th_TH"
            },
            {
            id: 39,
            question: "วิศวกรรมโลจิสติกส์",
            answer: "ดูรายละเอียดการเรียนการสอนวิศวกรรมโลจิสติกส์ได้ที่ https://www.facebook.com/LogisticsENinter/"
            },
            {
            id: 40,
            question: "วิศวกรรมกระบวนการเคมี",
            answer: "ดูรายละเอียดการเรียนการสอนวิศวกรรมกระบวนการเคมีได้ที่ https://www.facebook.com/p/Chemical-Process-Engineering-KKU-100057064525062/"
            },
            {
            id: 41,
            question: "วิศวกรรมสื่อดิจิทัล",
            answer: "ดูรายละเอียดการเรียนการสอนวิศวกรรมสื่อดิจิทัลได้ที่ https://www.facebook.com/DMEKKU/?locale=th_TH"
            }
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
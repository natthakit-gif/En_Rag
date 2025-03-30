/*
    server.js

    ไฟล์นี้เป็น Back-end สำหรับโปรเจกต์ RAG Chatbot
    ใช้ Node.js และ Express สร้าง API รับคำถามจากผู้ใช้และส่งคำตอบกลับ
    โดยข้อมูล FAQ ทั้งหมดได้ถูกนำมารวมไว้ในตัวแปร faqData ด้านล่างนี้
    */

    const express = require('express');
    const cors = require('cors');

    const app = express();
    app.use(cors());
    app.use(express.json());

    const PORT = process.env.PORT || 5000;

    /*
    ข้อมูล FAQ ทั้งหมด (Extracted จาก "FAQ จัดทำ Chatbot เพจคณะวิศวกรรมศาสตร์-อ้อย-update8-1-68.docx.pdf")
    ด้านล่างนี้เป็นข้อมูลที่ได้จากเอกสารในวันที่ 7 ม.ค.68 โดยแบ่งเป็น FAQ 1 ถึง FAQ 41
    */
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

    /*
    ฟังก์ชัน similarity
    คำนวณคะแนนความคล้ายคลึงแบบง่ายโดยนับจำนวนคำที่ตรงกันระหว่างข้อความสองข้อความ
    */
    function similarity(str1, str2) {
    const words1 = str1.toLowerCase().split(/\s+/);
    const words2 = str2.toLowerCase().split(/\s+/);
    let common = 0;
    words1.forEach(word => {
        if (words2.includes(word)) {
        common++;
        }
    });
    return common;
    }

    /*
    ฟังก์ชัน retrieveFAQ
    ค้นหา FAQ ที่มีคะแนนความคล้ายคลึงสูงสุดกับคำถามของผู้ใช้
    */
    function retrieveFAQ(userQuestion) {
    let bestMatch = null;
    let bestScore = 0;
    faqData.forEach(faq => {
        const score = similarity(userQuestion, faq.question);
        if (score > bestScore) {
        bestScore = score;
        bestMatch = faq;
        }
    });
    return bestMatch;
    }

    /*
    ฟังก์ชัน generateAnswer
    สร้างคำตอบโดยใช้ข้อมูล FAQ ที่ค้นพบ
    ถ้าพบ FAQ ที่ตรง จะส่งคำตอบของ FAQ นั้นกลับไป
    ถ้าไม่พบ จะส่งข้อความแจ้งว่าไม่พบข้อมูลที่เกี่ยวข้อง
    */
    function generateAnswer(userQuestion) {
    const retrievedFAQ = retrieveFAQ(userQuestion);
    if (retrievedFAQ) {
        return `จากข้อมูลที่พบ: ${retrievedFAQ.answer}`;
    } else {
        return "ขออภัยค่ะ ไม่พบข้อมูลที่เกี่ยวข้อง กรุณาลองถามคำถามอื่นอีกครั้ง";
    }
    }

    /*
    Endpoint ทดสอบการเชื่อมต่อ
    GET /api/hello ส่งข้อความตอบกลับเพื่อยืนยันว่าเซิร์ฟเวอร์ทำงานอยู่
    */
    app.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello from the backend!' });
    });

    /*
    Endpoint หลักสำหรับรับคำถามและส่งคำตอบกลับ
    POST /api/chat คาดหวัง request body เป็น JSON ที่มี key "question"
    */
    app.post('/api/chat', (req, res) => {
    const { question } = req.body;
    if (!question) {
        return res.status(400).json({ error: "Missing question" });
    }
    const answer = generateAnswer(question);
    res.json({ answer });
});

// เริ่มรันเซิร์ฟเวอร์
app.listen(PORT, () => {
    console.log(`Backend server is running on port ${PORT}`);
});

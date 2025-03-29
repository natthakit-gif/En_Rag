// backend/routes/chatRoutes.js
const express = require("express");
const router = express.Router();
const ChatMessage = require("../models/ChatMessage");

// Middleware ตรวจสอบการล็อกอิน
function requireAuth(req, res, next) {
    if (!req.user) {
        return res.status(401).json({ error: "Not authenticated" });
    }
    next();
}

// ดึงประวัติแชทของผู้ใช้
router.get("/history", requireAuth, async (req, res) => {
    try {
        const messages = await ChatMessage.find({ userId: req.user._id }).sort({
        createdAt: 1
        });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
});

// บันทึกข้อความแชทใหม่
router.post("/send", requireAuth, async (req, res) => {
    try {
        const { role, content } = req.body;
        const newMessage = new ChatMessage({
        userId: req.user._id,
        role,
        content
        });
        await newMessage.save();
        res.json(newMessage);
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;

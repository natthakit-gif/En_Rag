// backend/routes/authRoutes.js
const express = require("express");
const router = express.Router();
const passport = require("passport");

// Route เริ่มต้น Google OAuth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Callback หลังจาก Google ยืนยันตัวตนแล้ว
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/google/fail' }),
  (req, res) => {
    // หากล็อกอินสำเร็จ
    res.redirect('http://localhost:3000/welcome'); // หรือ URL อื่น
  }
);

// กรณีล็อกอินไม่สำเร็จ
router.get("/google/fail", (req, res) => {
  res.send("Failed to log in with Google.");
});

// Endpoint ตรวจสอบสถานะล็อกอิน
router.get("/status", (req, res) => {
  if (req.user) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ user: null });
  }
});

// Route สำหรับ Logout
router.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("http://localhost:3000");
  });
});

module.exports = router;

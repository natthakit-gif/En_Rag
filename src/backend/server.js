// backend/server.js
require('dotenv').config();
const keys = require("./config/keys");
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const cors = require("cors");

// เรียกใช้การตั้งค่า Passport (Google Strategy)
require("./services/passportSetup");

const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(express.json());

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

// ใช้ express-session เพื่อจัดการ session
app.use(session({
  secret: keys.cookieKey,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 },
}));
app.use(passport.initialize());
app.use(passport.session());

// Mount auth routes ที่ /auth
app.use("/auth", authRoutes);

// หน้า Home สำหรับทดสอบ (คุณสามารถเปลี่ยนได้)
app.get("/", (req, res) => {
  res.send(`
    <h1>Home</h1>
    <p>${req.user ? "Logged in as " + req.user.displayName : "Not logged in"}</p>
    <a href="/auth/google">Sign in with Google</a>
  `);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

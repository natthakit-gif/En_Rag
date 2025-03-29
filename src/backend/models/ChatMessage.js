// backend/models/ChatMessage.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

const chatMessageSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    role: String,       // "user" หรือ "assistant"
    content: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("ChatMessage", chatMessageSchema);

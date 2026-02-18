require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const axios = require("axios");

const app = express();

// Security & Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// RENDER Keep-Alive (Optional, keeps free tier active)
const RENDER_EXTERNAL_URL = process.env.RENDER_EXTERNAL_URL || (process.env.WEBHOOK_URL ? process.env.WEBHOOK_URL.replace("/webhook", "") : null);
if (RENDER_EXTERNAL_URL) {
    setInterval(async () => {
        try {
            console.log("⏱️ Sending keep-alive ping...");
            await axios.get(`${RENDER_EXTERNAL_URL}/health`);
        } catch (err) {
            // Ignore connection errors for keep-alive
        }
    }, 14 * 60 * 1000);
}

// Routes
app.use("/webhook", require("./routes/webhook"));

// Health Check
app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("Server Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🔗 Listening for webhooks at /webhook`);
});

module.exports = app;

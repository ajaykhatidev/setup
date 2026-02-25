require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/webhook", require("./routes/webhook"));

// Health Check
app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// Optional keep-alive ping for platforms that sleep on inactivity.
const keepAliveBaseUrl =
    process.env.RENDER_EXTERNAL_URL ||
    (process.env.WEBHOOK_URL ? process.env.WEBHOOK_URL.replace(/\/webhook\/?$/, "") : null);

if (keepAliveBaseUrl) {
    setInterval(async () => {
        try {
            await fetch(`${keepAliveBaseUrl}/health`);
            console.log("⏱️ Keep-alive ping sent");
        } catch (err) {
            console.warn("⚠️ Keep-alive ping failed:", err.message);
        }
    }, 10 * 60 * 1000);
}

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("Server Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log("🔗 Listening for webhooks at /webhook");
});

module.exports = app;

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const https = require("https"); // Added for keep-alive
require("./config/db"); // Initialize Supabase
const app = express();

// Keep-alive logic for Render free tier (ping every 13 minutes)
const RENDER_URL = process.env.WEBHOOK_URL ? process.env.WEBHOOK_URL.replace("/webhook", "") : null;

if (RENDER_URL) {
    setInterval(() => {
        console.log("⏱️ Sending keep-alive ping...");
        https.get(`${RENDER_URL}/health`, (res) => {
            console.log(`📡 Keep-alive status: ${res.statusCode === 200 ? "Active" : "Error"}`);
        }).on('error', (err) => {
            console.error("❌ Keep-alive error:", err.message);
        });
    }, 13 * 60 * 1000); // 13 minutes
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Routes
app.use("/webhook", require("./routes/webhook"));

app.get("/api/leads", async (req, res) => {
    try {
        const supabase = require("./config/db");
        const { data, error } = await supabase
            .from("leads")
            .select("*")
            .order("created_time", { ascending: false });

        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

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
    console.log(`🚀 Meta Webhook Server running on port ${PORT}`);
    console.log(`🔗 Webhook URL: /webhook`);
});

module.exports = app;

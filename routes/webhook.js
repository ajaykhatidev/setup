const express = require("express");
const router = express.Router();
const { fetchLead } = require("../services/leadService");

/**
 * Webhook Verification (GET)
 * Required by Meta to verify the endpoint
 */
router.get("/", (req, res) => {
    const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
        console.log("✅ Webhook verified!");
        return res.status(200).send(challenge);
    }

    console.warn("❌ Webhook verification failed.");
    res.sendStatus(403);
});

/**
 * Handle Webhook Events (POST)
 * Receives leadgen notifications
 */
router.post("/", async (req, res) => {
    try {
        const { body } = req;
        console.log("📥 Incoming Webhook POST:", JSON.stringify(body, null, 2));

        // Check if it's a page event
        if (body.object === "page") {
            for (const entry of body.entry) {
                for (const change of entry.changes) {
                    if (change.field === "leadgen") {
                        const leadId = change.value.leadgen_id;
                        const pageId = change.value.page_id;
                        const formId = change.value.form_id;

                        console.log(`📩 New Lead detected! Lead ID: ${leadId}, Page: ${pageId}, Form: ${formId}`);

                        // Process the lead asynchronously
                        fetchLead(leadId).catch(err => console.error("Error in background fetchLead:", err));
                    }
                }
            }
            return res.sendStatus(200);
        }

        res.sendStatus(404);
    } catch (err) {
        console.error("❌ Webhook Error:", err.message);
        res.sendStatus(500);
    }
});

module.exports = router;

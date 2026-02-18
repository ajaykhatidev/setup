const express = require("express");
const router = express.Router();
const { getLeadDetails } = require("../services/facebookService");
const { saveLead } = require("../services/supabaseService");

/**
 * GET /webhook
 * Verification endpoint for Facebook
 */
router.get("/", (req, res) => {
    const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode && token) {
        if (mode === "subscribe" && token === VERIFY_TOKEN) {
            console.log("✅ Webhook verified!");
            res.status(200).send(challenge);
        } else {
            console.warn("❌ Webhook verification failed: Invalid token.");
            res.sendStatus(403);
        }
    } else {
        res.sendStatus(400);
    }
});

/**
 * POST /webhook
 * Handle incoming leadgen events
 */
router.post("/", async (req, res) => {
    try {
        // 1. Immediately acknowledge the request
        res.sendStatus(200);

        const body = req.body;
        console.log("📥 Received Webhook Event");

        // 2. Validate object type
        if (body.object === "page") {
            // Iterate over entries
            if (!body.entry) return;

            for (const entry of body.entry) {
                // Iterate over changes
                if (!entry.changes) continue;

                for (const change of entry.changes) {
                    if (change.field === "leadgen") {
                        const leadgenId = change.value.leadgen_id;
                        console.log(`📩 Processing LeadGen ID: ${leadgenId}`);

                        // 3. Process asynchronously
                        // We do not await here to ensure the response to FB was fast (already sent)
                        // but we catch errors to log them.
                        (async () => {
                            try {
                                // Fetch details from FB
                                const leadDetails = await getLeadDetails(leadgenId);

                                // Save to Supabase
                                const savedLead = await saveLead(leadDetails);
                                console.log(`✅ Lead saved successfully: ${savedLead.id}`);
                            } catch (err) {
                                console.error(`❌ Failed to process lead ${leadgenId}:`, err.message);
                            }
                        })();
                    }
                }
            }
        }
    } catch (err) {
        console.error("❌ Webhook Handling Error:", err.message);
        // Note: Response is already sent, so we just log.
    }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const { getLeadDetails } = require("../services/facebookService");
const { saveLead } = require("../services/supabaseService");

router.get("/", (req, res) => {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === process.env.VERIFY_TOKEN) {
        return res.status(200).send(challenge);
    }

    return res.sendStatus(403);
});

router.post("/", async (req, res) => {
    try {
        const body = req.body;

        // Acknowledge immediately to reduce retries from Meta.
        res.sendStatus(200);

        if (body.object !== "page" || !Array.isArray(body.entry)) {
            return;
        }

        for (const entry of body.entry) {
            if (!Array.isArray(entry.changes)) continue;

            for (const change of entry.changes) {
                if (change.field !== "leadgen") continue;

                const leadgenId = change?.value?.leadgen_id;
                if (!leadgenId) continue;

                (async () => {
                    try {
                        // Save a minimal record first so webhook receipt is never lost.
                        await saveLead({
                            leadgen_id: leadgenId,
                            created_time: change?.value?.created_time || new Date().toISOString(),
                            raw_payload: {
                                source: "webhook",
                                entry_id: entry?.id || null,
                                event: change?.value || {},
                            },
                        });

                        const lead = await getLeadDetails(leadgenId);
                        await saveLead(lead);
                        console.log(`✅ Lead saved: ${leadgenId}`);
                    } catch (err) {
                        console.error(`❌ Lead processing failed (${leadgenId}):`, err.message);
                    }
                })();
            }
        }
    } catch (err) {
        console.error("❌ Webhook Error:", err.message);
    }
});

module.exports = router;

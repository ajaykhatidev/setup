const axios = require("axios");
const supabase = require("../config/db");

/**
 * Fetch lead details from Facebook Graph API
 * @param {string} leadId 
 */
exports.fetchLead = async (leadId) => {
    // Skip fetching if it's the dummy Meta test lead ID
    if (leadId === "444444444444") {
        console.log("ℹ️ Received a dummy Meta test lead ID. Graph API fetch skipped as expected.");
        return null;
    }

    try {
        const apiVersion = process.env.GRAPH_API_VERSION || "v24.0";
        const response = await axios.get(
            `https://graph.facebook.com/${apiVersion}/${leadId}`,
            {
                params: {
                    access_token: process.env.SYSTEM_USER_TOKEN,
                },
            }
        );

        const leadData = response.data;
        console.log("✅ Full Lead Data Fetched:", JSON.stringify(leadData, null, 2));

        // Extract relevant fields
        const formattedLead = {
            lead_id: leadData.id,
            page_id: leadData.page_id,
            form_id: leadData.form_id,
            ad_id: leadData.ad_id,
            adgroup_id: leadData.adgroup_id,
            campaign_id: leadData.campaign_id,
            created_time: leadData.created_time,
            fields: leadData.field_data.reduce((acc, field) => {
                acc[field.name] = field.values[0];
                return acc;
            }, {}),
            raw_data: leadData,
        };

        // Save to Supabase (Upsert)
        const { data, error } = await supabase
            .from('leads')
            .upsert(formattedLead, { onConflict: 'lead_id' })
            .select();

        if (error) throw error;

        console.log("💾 Lead saved to Supabase:", data[0]?.id || formattedLead.lead_id);

        return data[0];
    } catch (error) {
        console.error("❌ Error processing lead:", error.message);
        throw error;
    }
};

const axios = require("axios");

const GRAPH_API_VERSION = "v19.0"; // User requested v19.0

/**
 * Fetch lead details from Facebook Graph API
 * @param {string} leadgenId
 * @returns {Promise<Object>} Formatted lead data
 */
exports.getLeadDetails = async (leadgenId) => {
    try {
        const accessToken = process.env.PAGE_ACCESS_TOKEN;
        if (!accessToken) {
            throw new Error("Missing PAGE_ACCESS_TOKEN in environment variables");
        }

        const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/${leadgenId}`;
        const response = await axios.get(url, {
            params: { access_token: accessToken },
        });

        const rawData = response.data;

        // Parse fields
        // field_data is an array of objects: { name: "email", values: ["example@test.com"] }
        const fieldData = rawData.field_data || [];

        const getFieldValue = (name) => {
            const field = fieldData.find(f => f.name === name);
            return field && field.values && field.values.length > 0 ? field.values[0] : null;
        };

        const formattedLead = {
            leadgen_id: rawData.id,
            full_name: getFieldValue("full_name") || getFieldValue("fullname") || rawData.full_name, // Fallback attempts
            phone_number: getFieldValue("phone_number") || getFieldValue("phone") || rawData.phone_number,
            email: getFieldValue("email") || rawData.email,
            created_time: rawData.created_time,
            raw_payload: rawData
        };

        return formattedLead;
    } catch (err) {
        console.error(`❌ Error fetching/parsing lead ${leadgenId}:`, err.response ? err.response.data : err.message);
        throw err;
    }
};

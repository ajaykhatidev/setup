const axios = require("axios");

const GRAPH_API_VERSION = process.env.GRAPH_API_VERSION || "v25.0";

exports.getLeadDetails = async (leadgenId) => {
    const accessToken = process.env.SYSTEM_USER_TOKEN || process.env.PAGE_ACCESS_TOKEN;
    if (!accessToken) {
        throw new Error("Missing SYSTEM_USER_TOKEN or PAGE_ACCESS_TOKEN");
    }

    const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/${leadgenId}`;
    const { data: rawData } = await axios.get(url, {
        params: { access_token: accessToken },
    });

    const fieldData = Array.isArray(rawData.field_data) ? rawData.field_data : [];

    const getField = (name) => {
        const match = fieldData.find((item) => item.name === name);
        return match?.values?.[0] || null;
    };

    return {
        leadgen_id: rawData.id,
        full_name: getField("full_name") || getField("fullname"),
        phone_number: getField("phone_number") || getField("phone"),
        email: getField("email"),
        created_time: rawData.created_time,
        raw_payload: rawData,
    };
};

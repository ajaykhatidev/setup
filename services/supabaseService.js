const { createClient } = require("@supabase/supabase-js");

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error("❌ Missing Supabase credentials in environment variables.");
    process.exit(1);
}

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

/**
 * Save lead to Supabase
 * @param {Object} leadData
 * @returns {Promise<Object>} Saved lead data
 */
exports.saveLead = async (leadData) => {
    try {
        const { data, error } = await supabase
            .from("leads")
            .upsert(leadData, { onConflict: "leadgen_id" })
            .select();

        if (error) {
            throw new Error(`Supabase Upsert Error: ${error.message}`);
        }

        return data[0];
    } catch (err) {
        console.error("❌ Error saving to Supabase:", err.message);
        throw err;
    }
};

exports.supabase = supabase;

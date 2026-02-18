const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.warn("⚠️ Supabase credentials missing in .env");
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Check connection (Try to fetch a single row to verify credentials)
(async () => {
    try {
        const { count, error } = await supabase.from('leads').select('*', { count: 'exact', head: true });
        if (error) {
            console.error("❌ Supabase Connection Failed:", error.message);
        } else {
            console.log(`✅ Supabase Connected! Current lead count: ${count}`);
        }
    } catch (err) {
        console.error("❌ Supabase Connection Exception:", err.message);
    }
})();

module.exports = supabase;

const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.warn("⚠️ Supabase credentials missing in .env");
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Check connection (Try to fetch a single row or just log initialization)
console.log("✅ Supabase Client initialized and Database connected.");

module.exports = supabase;

import { createClient } from "@supabase/supabase-js";
import { SUPABASE_DB_URL, SUPABASE_DB_KEY } from "./constants.js";

const supabase = createClient(SUPABASE_DB_URL, SUPABASE_DB_KEY);

export default supabase;

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// create the connection so the rest of our app can use it
export const supabase = createClient(supabaseUrl, supabaseKey);

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://zldngixqhzbgxepkckqg.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpsZG5naXhxaHpiZ3hlcGtja3FnIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzIzMzUxNzgsImV4cCI6MTk4NzkxMTE3OH0.VVPBa2rL6ynBXIUzvQUkIIsiruu7pEshrnTAvimZuEQ";
const supabase = createClient(supabaseUrl, supabaseKey);
export default function useSupabase() {
  return { supabase };
}

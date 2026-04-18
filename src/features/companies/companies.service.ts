import { createClient } from "@supabase/supabase-js";
import { logger } from "../../lib/logger";

function getSupabaseClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error("SUPABASE_URL and SUPABASE_ANON_KEY are required");
  }

  return createClient(url, key);
}

export async function getAllCompanies() {
  logger.info("Fetching all companies from Supabase...");

  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("companies")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  logger.success(`Fetched ${data.length} companies`);
  return data;
}

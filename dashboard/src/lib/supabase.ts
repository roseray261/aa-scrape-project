import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _supabase: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!_supabase) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_ANON_KEY;
    if (!url || !key) {
      throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_ANON_KEY environment variables");
    }
    _supabase = createClient(url, key);
  }
  return _supabase;
}

export interface Snapshot {
  leaderboard: string;
  fetched_at: string;
  rank: number;
  name: string;
  creator: string | null;
  elo: number;
  ci95: string;
  samples: number;
  release_date: string | null;
}

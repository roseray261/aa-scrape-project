import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

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

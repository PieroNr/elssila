import { createClient } from "@supabase/supabase-js";

// Cookie-less client for public data fetching — compatible with unstable_cache.
// RLS SELECT policy allows anonymous reads, so no session needed.
export function createPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

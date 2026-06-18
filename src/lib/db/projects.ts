import { createPublicClient } from "@/lib/supabase/public";
import { createClient } from "@/lib/supabase/server";
import type { Project } from "@/data/projects";

export type ProjectRow = Project & {
  id: string;
  display_order: number;
  created_at: string;
  updated_at: string;
};

export const CACHE_TAG = "projects";

// ── Public queries (portfolio pages) ──────────────────────────────────────
// These functions are called inside server-rendered pages.
// Next.js automatically caches the Full Route Cache for those pages.
// revalidatePath() in admin actions busts that cache on every save.
// revalidate = 3600 on each page sets a 1-hour TTL as a safety fallback.

export async function getAllProjects(): Promise<ProjectRow[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("display_order", { ascending: true })
    .order("ref", { ascending: false });

  if (error || !data) return [];
  return data as ProjectRow[];
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("featured", true)
    .order("display_order", { ascending: true });

  if (error || !data) return [];
  return data as unknown as Project[];
}

export async function getProjectBySlug(slug: string): Promise<ProjectRow | null> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) return null;
  return data as ProjectRow;
}

export async function getAllSlugs(): Promise<string[]> {
  const supabase = createPublicClient();
  const { data } = await supabase.from("projects").select("slug");
  return data?.map((r) => r.slug) ?? [];
}

// ── Admin query (always fresh, uses auth session) ─────────────────────────

export async function getAllProjectsAdmin(): Promise<ProjectRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("display_order", { ascending: true })
    .order("ref", { ascending: false });

  if (error || !data) return [];
  return data as ProjectRow[];
}

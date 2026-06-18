import { createClient } from "@/lib/supabase/server";
import type { Project } from "@/data/projects";

export type ProjectRow = Project & {
  id: string;
  display_order: number;
  created_at: string;
  updated_at: string;
};

function toProject(row: ProjectRow): Project {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, display_order, created_at, updated_at, ...project } = row;
  return project as Project;
}

export async function getAllProjects(): Promise<ProjectRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("display_order", { ascending: true })
    .order("ref", { ascending: false });

  if (error || !data) return [];
  return data as ProjectRow[];
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("featured", true)
    .order("display_order", { ascending: true });

  if (error || !data) return [];
  return (data as ProjectRow[]).map(toProject);
}

export async function getProjectBySlug(slug: string): Promise<ProjectRow | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) return null;
  return data as ProjectRow;
}

export async function getAllSlugs(): Promise<string[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("projects").select("slug");
  return data?.map((r) => r.slug) ?? [];
}

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ProjectImage, ProjectCredit, ProjectMedia } from "@/data/projects";

function parseImageField(value: string | null): ProjectImage | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as ProjectImage;
  } catch {
    return null;
  }
}

function parseJsonField<T>(value: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function buildProjectPayload(formData: FormData) {
  const role = formData.get("role") as string;
  const tags = formData.get("tags") as string;

  return {
    slug: (formData.get("slug") as string).trim().toLowerCase().replace(/\s+/g, "-"),
    ref: (formData.get("ref") as string).trim(),
    title: (formData.get("title") as string).trim(),
    category: (formData.get("category") as string).trim(),
    year: (formData.get("year") as string).trim(),
    client: ((formData.get("client") as string) || "").trim() || null,
    role: role ? role.split(",").map((s) => s.trim()).filter(Boolean) : [],
    brief: parseJsonField(formData.get("brief") as string) ?? {},
    intent: ((formData.get("intent") as string) || "").trim() || null,
    body: ((formData.get("body") as string) || "").trim() || null,
    format: ((formData.get("format") as string) || "").trim() || null,
    run: ((formData.get("run") as string) || "").trim() || null,
    hero: parseImageField(formData.get("hero") as string) ?? {
      src: "",
      alt: "",
      w: 1600,
      h: 1067,
      aspect: "wide",
    },
    spread: parseJsonField<ProjectMedia>(formData.get("spread") as string),
    gallery: parseJsonField<ProjectImage[]>(formData.get("gallery") as string) ?? [],
    tags: tags ? tags.split(",").map((s) => s.trim()).filter(Boolean) : [],
    credits: parseJsonField<ProjectCredit[]>(formData.get("credits") as string) ?? [],
    featured: formData.get("featured") === "on",
    display_order: parseInt((formData.get("display_order") as string) || "0", 10),
  };
}

export async function createProject(formData: FormData) {
  const supabase = await createClient();
  const payload = buildProjectPayload(formData);

  const { error } = await supabase.from("projects").insert(payload);

  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/projects", "layout"); // busts /projects and all /projects/[slug]
  revalidatePath("/admin/projects");
  redirect("/admin/projects");
}

export async function updateProject(id: string, formData: FormData) {
  const supabase = await createClient();
  const payload = buildProjectPayload(formData);

  const { error } = await supabase.from("projects").update(payload).eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath(`/projects/${payload.slug}`);
  revalidatePath("/admin/projects");
  redirect("/admin/projects");
}

export async function deleteProject(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/projects", "layout"); // busts /projects and all /projects/[slug]
  revalidatePath("/admin/projects");
  redirect("/admin/projects");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

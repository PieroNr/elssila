import { NextResponse } from "next/server";
import { getFeaturedProjects } from "@/lib/db/projects";

export const revalidate = 3600;

export async function GET() {
  const projects = await getFeaturedProjects();
  return NextResponse.json(projects);
}

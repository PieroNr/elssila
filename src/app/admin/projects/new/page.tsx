import Link from "next/link";
import ProjectForm from "@/components/admin/ProjectForm";
import { createProject } from "../actions";

export default function NewProjectPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white px-8 py-4">
        <div className="mx-auto flex max-w-3xl items-center gap-4">
          <Link href="/admin/projects" className="text-sm text-gray-400 hover:text-gray-900">
            ← Projets
          </Link>
          <h1 className="text-lg font-bold text-gray-900">Nouveau projet</h1>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-8 py-8">
        <ProjectForm action={createProject} mode="create" />
      </main>
    </div>
  );
}

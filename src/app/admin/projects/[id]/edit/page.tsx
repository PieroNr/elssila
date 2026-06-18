import Link from "next/link";
import { notFound } from "next/navigation";
import ProjectForm from "@/components/admin/ProjectForm";
import { getAllProjectsAdmin } from "@/lib/db/projects";
import { updateProject } from "../../actions";

type Props = { params: Promise<{ id: string }> };

export default async function EditProjectPage({ params }: Props) {
  const { id } = await params;
  const projects = await getAllProjectsAdmin();
  const project = projects.find((p) => p.id === id);

  if (!project) notFound();

  const action = updateProject.bind(null, id);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white px-8 py-4">
        <div className="mx-auto flex max-w-3xl items-center gap-4">
          <Link href="/admin/projects" className="text-sm text-gray-400 hover:text-gray-900">
            ← Projets
          </Link>
          <h1 className="text-lg font-bold text-gray-900">
            Modifier — <span className="text-gray-500">{project.title}</span>
          </h1>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-8 py-8">
        <ProjectForm project={project} action={action} mode="edit" />
      </main>
    </div>
  );
}

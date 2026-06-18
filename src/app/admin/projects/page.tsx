import Link from "next/link";
import { getAllProjects } from "@/lib/db/projects";
import { deleteProject, logout } from "./actions";
import DeleteButton from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const projects = await getAllProjects();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white px-8 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
              Elssila Studio
            </p>
            <h1 className="text-lg font-bold text-gray-900">Administration</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="text-sm text-gray-500 hover:text-gray-900"
            >
              Voir le site ↗
            </Link>
            <form action={logout}>
              <button
                type="submit"
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Déconnexion
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Projets</h2>
            <p className="mt-0.5 text-sm text-gray-500">{projects.length} projet{projects.length !== 1 ? "s" : ""}</p>
          </div>
          <Link
            href="/admin/projects/new"
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:opacity-80"
          >
            + Nouveau projet
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
            <p className="text-sm text-gray-500">Aucun projet pour l&apos;instant.</p>
            <Link
              href="/admin/projects/new"
              className="mt-4 inline-block text-sm font-medium text-gray-900 underline"
            >
              Créer le premier projet
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest text-gray-400">
                    Réf
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest text-gray-400">
                    Titre
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest text-gray-400">
                    Catégorie
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest text-gray-400">
                    Année
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest text-gray-400">
                    Mis en avant
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-widest text-gray-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs text-gray-400">{project.ref}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">
                      <div className="flex items-center gap-2">
                        {project.hero?.src && (
                          <img
                            src={project.hero.src}
                            alt=""
                            className="h-8 w-12 rounded object-cover"
                          />
                        )}
                        {project.title}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{project.category}</td>
                    <td className="px-4 py-3 text-gray-600">{project.year}</td>
                    <td className="px-4 py-3">
                      {project.featured ? (
                        <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
                          ✓ Oui
                        </span>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/projects/${project.slug}`}
                          target="_blank"
                          className="text-gray-400 hover:text-gray-900"
                        >
                          ↗
                        </Link>
                        <Link
                          href={`/admin/projects/${project.id}/edit`}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          Modifier
                        </Link>
                        <DeleteButton
                          projectId={project.id}
                          projectTitle={project.title}
                          deleteAction={deleteProject}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

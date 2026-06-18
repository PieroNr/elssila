"use client";

import { useTransition } from "react";

type Props = {
  projectId: string;
  projectTitle: string;
  deleteAction: (id: string) => Promise<void>;
};

export default function DeleteButton({ projectId, projectTitle, deleteAction }: Props) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!confirm(`Supprimer « ${projectTitle} » ? Cette action est irréversible.`)) return;
    startTransition(() => deleteAction(projectId));
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className="text-red-400 hover:text-red-600 disabled:opacity-50"
    >
      {isPending ? "…" : "Supprimer"}
    </button>
  );
}

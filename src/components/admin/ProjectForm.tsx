"use client";

import { useState, useRef, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import type { ProjectImage, ProjectVideo, ProjectMedia, ProjectCredit, RichTextDoc } from "@/data/projects";
import type { ProjectRow } from "@/lib/db/projects";
import RichTextEditor from "./RichTextEditor";

const CATEGORIES = ["Brand", "Editorial", "Digital", "Film", "Installation", "Fashion"];
const ASPECTS = ["wide", "tall", "square"] as const;

// ── Image field ────────────────────────────────────────────────────────────

function ImageField({
  label,
  value,
  onChange,
  required,
}: {
  label: string;
  value: ProjectImage | null;
  onChange: (img: ProjectImage | null) => void;
  required?: boolean;
}) {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();
  const img: ProjectImage = value ?? { src: "", alt: "", w: 1600, h: 1067, aspect: "wide" };

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { data, error } = await supabase.storage.from("project-images").upload(path, file, { upsert: false });
    if (error) { alert(`Upload échoué : ${error.message}`); setUploading(false); return; }
    const { data: { publicUrl } } = supabase.storage.from("project-images").getPublicUrl(data.path);
    const bitmap = await createImageBitmap(file);
    onChange({ ...img, src: publicUrl, w: bitmap.width, h: bitmap.height });
    setUploading(false);
  }

  return (
    <div className="space-y-2 rounded-lg border border-gray-200 bg-gray-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">{label}</p>
      <div className="flex gap-2">
        <input type="text" placeholder="URL de l'image" value={img.src}
          onChange={(e) => onChange({ ...img, src: e.target.value })}
          required={required && !img.src}
          className="flex-1 rounded border border-gray-200 bg-white px-2 py-1.5 text-sm outline-none focus:border-gray-900" />
        <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
          className="shrink-0 rounded border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium hover:bg-gray-100 disabled:opacity-50">
          {uploading ? "Upload…" : "Fichier ↑"}
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>
      <div className="flex gap-2">
        <input type="text" placeholder="Texte alternatif" value={img.alt}
          onChange={(e) => onChange({ ...img, alt: e.target.value })}
          className="flex-1 rounded border border-gray-200 bg-white px-2 py-1.5 text-sm outline-none focus:border-gray-900" />
        <input type="number" placeholder="W" value={img.w}
          onChange={(e) => onChange({ ...img, w: parseInt(e.target.value) || 1600 })}
          className="w-20 rounded border border-gray-200 bg-white px-2 py-1.5 text-sm outline-none focus:border-gray-900" />
        <input type="number" placeholder="H" value={img.h}
          onChange={(e) => onChange({ ...img, h: parseInt(e.target.value) || 1067 })}
          className="w-20 rounded border border-gray-200 bg-white px-2 py-1.5 text-sm outline-none focus:border-gray-900" />
        <select value={img.aspect ?? "wide"}
          onChange={(e) => onChange({ ...img, aspect: e.target.value as ProjectImage["aspect"] })}
          className="rounded border border-gray-200 bg-white px-2 py-1.5 text-sm outline-none focus:border-gray-900">
          {ASPECTS.map((a) => <option key={a} value={a}>{a}</option>)}
        </select>
      </div>
      {img.src && (
        <img src={img.src} alt={img.alt} className="mt-2 h-24 w-full rounded object-cover"
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
      )}
    </div>
  );
}

// ── Spread media field (image OR video) ────────────────────────────────────

function SpreadMediaField({
  value,
  onChange,
}: {
  value: ProjectMedia | null;
  onChange: (media: ProjectMedia | null) => void;
}) {
  const mediaType = value?.type === "video" ? "video" : "image";

  function switchType(t: "image" | "video") {
    if (t === "video") {
      onChange({ type: "video", src: "", alt: "" });
    } else {
      onChange({ type: "image", src: "", alt: "", w: 1600, h: 1067, aspect: "wide" });
    }
  }

  return (
    <div className="space-y-3">
      {/* Type toggle */}
      <div className="flex gap-2">
        {(["image", "video"] as const).map((t) => (
          <button key={t} type="button" onClick={() => switchType(t)}
            className={`rounded px-3 py-1 text-xs font-medium border transition-colors ${
              mediaType === t
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
            }`}>
            {t === "image" ? "🖼 Image" : "🎬 Vidéo"}
          </button>
        ))}
      </div>

      {mediaType === "image" ? (
        <ImageField
          label="Image de spread"
          value={value && value.type !== "video" ? (value as ProjectImage) : null}
          onChange={(img) => onChange(img)}
        />
      ) : (
        <div className="space-y-2 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">Vidéo de spread</p>
          <input type="url" placeholder="URL de la vidéo (mp4, YouTube embed…)"
            value={(value as ProjectVideo)?.src ?? ""}
            onChange={(e) => onChange({ type: "video", src: e.target.value, alt: (value as ProjectVideo)?.alt ?? "" })}
            className="w-full rounded border border-gray-200 bg-white px-2 py-1.5 text-sm outline-none focus:border-gray-900" />
          <input type="text" placeholder="Titre / texte alternatif"
            value={(value as ProjectVideo)?.alt ?? ""}
            onChange={(e) => onChange({ type: "video", src: (value as ProjectVideo)?.src ?? "", alt: e.target.value })}
            className="w-full rounded border border-gray-200 bg-white px-2 py-1.5 text-sm outline-none focus:border-gray-900" />
          {(value as ProjectVideo)?.src && (
            <p className="text-xs text-gray-400 mt-1">Aperçu disponible sur la page projet.</p>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main form ──────────────────────────────────────────────────────────────

type Props = {
  project?: ProjectRow;
  action: (formData: FormData) => Promise<void>;
  mode: "create" | "edit";
};

function getInitialBrief(project?: ProjectRow): RichTextDoc | null {
  if (!project?.brief) return null;
  if (typeof project.brief === "object") return project.brief as RichTextDoc;
  // Legacy string → wrap in TipTap doc
  return {
    type: "doc",
    content: [{ type: "paragraph", content: [{ type: "text", text: project.brief as unknown as string }] }],
  };
}

export default function ProjectForm({ project, action, mode }: Props) {
  const [isPending, startTransition] = useTransition();
  const [hero, setHero] = useState<ProjectImage>(
    project?.hero ?? { src: "", alt: "", w: 1600, h: 1067, aspect: "wide" },
  );
  const [spread, setSpread] = useState<ProjectMedia | null>(project?.spread ?? null);
  const [gallery, setGallery] = useState<ProjectImage[]>(project?.gallery ?? []);
  const [credits, setCredits] = useState<ProjectCredit[]>(project?.credits ?? []);
  const [brief, setBrief] = useState<RichTextDoc | null>(getInitialBrief(project));
  const [error, setError] = useState<string | null>(null);

  function addGalleryImage() {
    setGallery([...gallery, { src: "", alt: "", w: 1600, h: 1067, aspect: "wide" }]);
  }
  function removeGalleryImage(i: number) { setGallery(gallery.filter((_, idx) => idx !== i)); }
  function updateGalleryImage(i: number, img: ProjectImage | null) {
    if (!img) return;
    setGallery(gallery.map((g, idx) => (idx === i ? img : g)));
  }
  function addCredit() { setCredits([...credits, { role: "", name: "" }]); }
  function removeCredit(i: number) { setCredits(credits.filter((_, idx) => idx !== i)); }
  function updateCredit(i: number, field: "role" | "name", value: string) {
    setCredits(credits.map((c, idx) => (idx === i ? { ...c, [field]: value } : c)));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    fd.set("hero", JSON.stringify(hero));
    fd.set("spread", spread ? JSON.stringify(spread) : "");
    fd.set("gallery", JSON.stringify(gallery));
    fd.set("credits", JSON.stringify(credits));
    fd.set("brief", brief ? JSON.stringify(brief) : "{}");

    startTransition(async () => {
      try {
        await action(fd);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Une erreur est survenue");
      }
    });
  }

  const inp = "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900";
  const lbl = "mb-1 block text-sm font-medium text-gray-700";
  const section = "rounded-xl border border-gray-200 bg-white p-6 space-y-4";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* ── Informations de base ── */}
      <div className={section}>
        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400">Informations de base</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className={lbl} htmlFor="title">Titre *</label>
            <input id="title" name="title" required defaultValue={project?.title} className={inp} />
          </div>
          <div>
            <label className={lbl} htmlFor="slug">Slug * <span className="font-normal text-gray-400">(ex: void-campaign)</span></label>
            <input id="slug" name="slug" required defaultValue={project?.slug} className={inp} />
          </div>
          <div>
            <label className={lbl} htmlFor="ref">Référence * <span className="font-normal text-gray-400">(ex: 024)</span></label>
            <input id="ref" name="ref" required defaultValue={project?.ref} className={inp} />
          </div>
          <div>
            <label className={lbl} htmlFor="category">Catégorie *</label>
            <select id="category" name="category" required defaultValue={project?.category ?? ""} className={inp}>
              <option value="">Sélectionner…</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className={lbl} htmlFor="year">Année *</label>
            <input id="year" name="year" required defaultValue={project?.year ?? new Date().getFullYear().toString()} className={inp} />
          </div>
          <div>
            <label className={lbl} htmlFor="client">Client</label>
            <input id="client" name="client" defaultValue={project?.client ?? ""} className={inp} />
          </div>
          <div>
            <label className={lbl} htmlFor="display_order">Ordre d&apos;affichage</label>
            <input id="display_order" name="display_order" type="number" defaultValue={project?.display_order ?? 0} className={inp} />
          </div>
        </div>

        <div>
          <label className={lbl} htmlFor="role">Rôles <span className="font-normal text-gray-400">(séparés par virgule)</span></label>
          <input id="role" name="role" defaultValue={project?.role?.join(", ") ?? ""} placeholder="Direction artistique, Photographie" className={inp} />
        </div>
        <div>
          <label className={lbl} htmlFor="tags">Tags <span className="font-normal text-gray-400">(séparés par virgule)</span></label>
          <input id="tags" name="tags" defaultValue={project?.tags?.join(", ") ?? ""} placeholder="Photo, Layout, 3D" className={inp} />
        </div>
        <div className="flex items-center gap-2">
          <input id="featured" name="featured" type="checkbox" defaultChecked={project?.featured ?? false} className="h-4 w-4 rounded border-gray-300" />
          <label htmlFor="featured" className="text-sm font-medium text-gray-700">Projet mis en avant (affiché sur la page d&apos;accueil)</label>
        </div>
      </div>

      {/* ── Contenu éditorial ── */}
      <div className={section}>
        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400">Contenu éditorial</h2>

        <div>
          <label className={lbl}>Brief *</label>
          <p className="mb-2 text-xs text-gray-400">Texte principal du projet — affiché sur la page de détail.</p>
          <RichTextEditor
            value={brief}
            onChange={setBrief}
            placeholder="Décrivez le projet, le contexte, les choix créatifs…"
          />
        </div>

        <div>
          <label className={lbl} htmlFor="intent">Note d&apos;intention <span className="font-normal text-gray-400">(affichée en grand, police display)</span></label>
          <textarea id="intent" name="intent" rows={2} defaultValue={project?.intent ?? ""} className={inp} />
        </div>
        <div>
          <label className={lbl} htmlFor="body">Corps du texte long <span className="font-normal text-gray-400">(optionnel)</span></label>
          <textarea id="body" name="body" rows={4} defaultValue={project?.body ?? ""} className={inp} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={lbl} htmlFor="format">Format <span className="font-normal text-gray-400">(print)</span></label>
            <input id="format" name="format" defaultValue={project?.format ?? ""} placeholder="260 × 340 mm" className={inp} />
          </div>
          <div>
            <label className={lbl} htmlFor="run">Tirage <span className="font-normal text-gray-400">(print)</span></label>
            <input id="run" name="run" defaultValue={project?.run ?? ""} placeholder="1 200 ex." className={inp} />
          </div>
        </div>
      </div>

      {/* ── Images ── */}
      <div className={section}>
        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400">Images</h2>

        <ImageField label="Image hero *" value={hero} onChange={(v) => { if (v) setHero(v); }} required />

        <div>
          <div className="mb-3 flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-gray-700">Spread</span>
              <span className="ml-2 text-xs text-gray-400">(image ou vidéo, optionnel)</span>
            </div>
            {spread ? (
              <button type="button" onClick={() => setSpread(null)} className="text-xs text-red-500 underline">Supprimer</button>
            ) : (
              <button type="button"
                onClick={() => setSpread({ type: "image", src: "", alt: "", w: 1600, h: 1067, aspect: "wide" })}
                className="text-xs text-gray-900 underline">+ Ajouter</button>
            )}
          </div>
          {spread && <SpreadMediaField value={spread} onChange={setSpread} />}
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">Galerie ({gallery.length} images)</span>
            <button type="button" onClick={addGalleryImage} className="text-xs text-gray-900 underline">+ Ajouter une image</button>
          </div>
          <div className="space-y-3">
            {gallery.map((img, i) => (
              <div key={i} className="relative">
                <ImageField label={`Photo ${i + 1}`} value={img} onChange={(v) => updateGalleryImage(i, v)} />
                <button type="button" onClick={() => removeGalleryImage(i)}
                  className="absolute right-3 top-3 text-xs text-red-400 hover:text-red-600">✕</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Crédits ── */}
      <div className={section}>
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400">Crédits</h2>
          <button type="button" onClick={addCredit} className="text-xs text-gray-900 underline">+ Ajouter un crédit</button>
        </div>
        {credits.map((credit, i) => (
          <div key={i} className="flex gap-2">
            <input value={credit.role} onChange={(e) => updateCredit(i, "role", e.target.value)}
              placeholder="Rôle (ex: Direction artistique)" className={`${inp} flex-1`} />
            <input value={credit.name} onChange={(e) => updateCredit(i, "name", e.target.value)}
              placeholder="Nom" className={`${inp} flex-1`} />
            <button type="button" onClick={() => removeCredit(i)} className="shrink-0 text-sm text-red-400 hover:text-red-600">✕</button>
          </div>
        ))}
      </div>

      {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

      <div className="flex items-center gap-3">
        <button type="submit" disabled={isPending}
          className="rounded-lg bg-gray-900 px-6 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-80 disabled:opacity-50">
          {isPending ? "Enregistrement…" : mode === "create" ? "Créer le projet" : "Enregistrer les modifications"}
        </button>
        <a href="/admin/projects" className="text-sm text-gray-500 hover:text-gray-900">Annuler</a>
      </div>
    </form>
  );
}

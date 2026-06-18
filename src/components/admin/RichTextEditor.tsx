"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import type { RichTextDoc } from "@/data/projects";

type Props = {
  value: RichTextDoc | null;
  onChange: (doc: RichTextDoc) => void;
  placeholder?: string;
};

const TOOLBAR_BUTTON =
  "rounded px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-30";
const ACTIVE = "bg-gray-200 text-gray-900";

export default function RichTextEditor({ value, onChange, placeholder }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: placeholder ?? "Écrire ici…" }),
    ],
    content: value && Object.keys(value).length > 0 ? (value as object) : undefined,
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON() as RichTextDoc);
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none min-h-[140px] px-3 py-2 text-sm text-gray-900 outline-none focus:outline-none",
      },
    },
  });

  if (!editor) return null;

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white focus-within:border-gray-900 focus-within:ring-1 focus-within:ring-gray-900">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-gray-100 bg-gray-50 px-2 py-1.5">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`${TOOLBAR_BUTTON} ${editor.isActive("bold") ? ACTIVE : ""}`}
          title="Gras"
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`${TOOLBAR_BUTTON} ${editor.isActive("italic") ? ACTIVE : ""}`}
          title="Italique"
        >
          <em>I</em>
        </button>

        <div className="mx-1 h-4 w-px bg-gray-200" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`${TOOLBAR_BUTTON} ${editor.isActive("heading", { level: 2 }) ? ACTIVE : ""}`}
          title="Titre H2"
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`${TOOLBAR_BUTTON} ${editor.isActive("heading", { level: 3 }) ? ACTIVE : ""}`}
          title="Titre H3"
        >
          H3
        </button>

        <div className="mx-1 h-4 w-px bg-gray-200" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`${TOOLBAR_BUTTON} ${editor.isActive("bulletList") ? ACTIVE : ""}`}
          title="Liste à puces"
        >
          • Liste
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`${TOOLBAR_BUTTON} ${editor.isActive("orderedList") ? ACTIVE : ""}`}
          title="Liste numérotée"
        >
          1. Liste
        </button>

        <div className="mx-1 h-4 w-px bg-gray-200" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`${TOOLBAR_BUTTON} ${editor.isActive("blockquote") ? ACTIVE : ""}`}
          title="Citation"
        >
          ❝
        </button>

        <div className="mx-1 h-4 w-px bg-gray-200" />

        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className={TOOLBAR_BUTTON}
          title="Annuler"
        >
          ↩
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className={TOOLBAR_BUTTON}
          title="Rétablir"
        >
          ↪
        </button>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}

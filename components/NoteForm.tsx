"use client";

import { useRef, useTransition } from "react";
import { addProjectNote } from "@/lib/actions/projects";

export default function NoteForm({ projectId }: { projectId: string }) {
  const ref = useRef<HTMLFormElement>(null);
  const [pending, startTransition] = useTransition();

  return (
    <form
      ref={ref}
      action={(fd) =>
        startTransition(async () => {
          await addProjectNote(projectId, fd);
          ref.current?.reset();
        })
      }
      className="flex flex-col gap-2"
    >
      <textarea
        name="body"
        rows={3}
        placeholder="Escribe una nota sobre este proyecto..."
        required
        className="border-2 border-nm-black p-3 bg-surface outline-none resize-none"
      />
      <button
        type="submit"
        disabled={pending}
        className="self-start mono-label bg-nm-black text-nm-cream px-4 py-2 disabled:opacity-50"
      >
        {pending ? "Guardando..." : "Agregar nota"}
      </button>
    </form>
  );
}

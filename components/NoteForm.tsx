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
      className="flex flex-col gap-3"
    >
      <textarea
        name="body"
        rows={3}
        placeholder="Escribe una nota sobre este proyecto..."
        required
        className="nm-card p-4 outline-none resize-none text-sm"
      />
      <button type="submit" disabled={pending} className="nm-btn-primary self-start !py-2 !px-5">
        {pending ? "Guardando..." : "Agregar nota"}
      </button>
    </form>
  );
}

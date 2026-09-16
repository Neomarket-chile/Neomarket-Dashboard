"use client";

import { useState, useTransition } from "react";
import { createProject } from "@/lib/actions/projects";

export default function NewProjectForm() {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="self-start mono-label border-2 border-nm-black px-4 py-2 hover:bg-nm-black hover:text-nm-cream transition-colors"
      >
        + Nuevo proyecto
      </button>
    );
  }

  return (
    <form
      action={(fd) =>
        startTransition(async () => {
          await createProject(fd);
          setOpen(false);
        })
      }
      className="border-2 border-nm-black p-6 bg-surface grid sm:grid-cols-2 gap-4"
    >
      <Field name="name" label="Nombre del proyecto" required />
      <Field name="client_name" label="Cliente" required />
      <Field name="client_email" label="Email del cliente" type="email" />
      <Field name="site_url" label="Link del sitio en desarrollo" />
      <Field name="fee_amount" label="Honorarios (CLP)" type="number" />
      <Field name="monthly_cost" label="Costo mensual (CLP)" type="number" />
      <Field name="total_cost" label="Costo total del proyecto (CLP)" type="number" />

      <div className="sm:col-span-2 flex gap-3 mt-2">
        <button
          type="submit"
          disabled={pending}
          className="bg-nm-black text-nm-cream px-5 py-2 disabled:opacity-50"
        >
          {pending ? "Guardando..." : "Crear proyecto"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="px-5 py-2 border-2 border-nm-black"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

function Field({
  name,
  label,
  type = "text",
  required = false,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="mono-label text-nm-black/60">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="border-b-2 border-nm-black bg-transparent py-1.5 outline-none"
      />
    </div>
  );
}

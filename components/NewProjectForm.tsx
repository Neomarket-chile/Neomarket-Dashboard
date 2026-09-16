"use client";

import { useState, useTransition } from "react";
import { createProject } from "@/lib/actions/projects";

export default function NewProjectForm() {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="nm-btn-outline self-start">
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
      className="nm-card p-8 grid sm:grid-cols-2 gap-5"
    >
      <Field name="name" label="Nombre del proyecto" required />
      <Field name="client_name" label="Cliente" required />
      <Field name="client_email" label="Email del cliente" type="email" />
      <Field name="site_url" label="Link del sitio en desarrollo" />
      <Field name="fee_amount" label="Honorarios (CLP)" type="number" />
      <Field name="monthly_cost" label="Costo mensual (CLP)" type="number" />
      <Field name="total_cost" label="Costo total del proyecto (CLP)" type="number" />

      <div className="sm:col-span-2 flex gap-3 mt-3">
        <button type="submit" disabled={pending} className="nm-btn-primary">
          {pending ? "Guardando..." : "Crear proyecto"}
        </button>
        <button type="button" onClick={() => setOpen(false)} className="nm-btn-outline">
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
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="mono-label">
        {label}
      </label>
      <input id={name} name={name} type={type} required={required} className="nm-input" />
    </div>
  );
}

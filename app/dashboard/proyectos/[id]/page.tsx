import { notFound } from "next/navigation";
import {
  getCurrentProfile,
  getProject,
  getProjectNotes,
  getProjectFiles,
  getProjectEmails,
} from "@/lib/data";
import NoteForm from "@/components/NoteForm";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [profile, project, notes, files, emails] = await Promise.all([
    getCurrentProfile(),
    getProject(id),
    getProjectNotes(id),
    getProjectFiles(id),
    getProjectEmails(id),
  ]);

  if (!project) notFound();

  const isAdmin = profile?.role === "admin";

  return (
    <div className="flex flex-col gap-12">
      <div>
        <p className="mono-label mb-2">
          {project.status} · {project.client_name}
        </p>
        <h1 className="text-4xl sm:text-5xl">{project.name}</h1>
        {project.site_url && (
          <a
            href={project.site_url}
            target="_blank"
            rel="noreferrer"
            className="text-sm underline underline-offset-4 text-nm-black/70 mt-2 inline-block"
          >
            {project.site_url}
          </a>
        )}
      </div>

      {isAdmin && (
        <section className="nm-card p-8">
          <p className="mono-label mb-6">Honorarios y costos</p>
          <div className="grid grid-cols-3 gap-6">
            <MoneyStat label="Honorarios" value={project.fee_amount} />
            <MoneyStat label="Costo mensual" value={project.monthly_cost} />
            <MoneyStat label="Costo total" value={project.total_cost} />
          </div>
        </section>
      )}

      <section className="grid md:grid-cols-2 gap-10">
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl">Notas del proyecto</h2>
          <NoteForm projectId={project.id} />
          <div className="flex flex-col gap-4 mt-2">
            {notes.map((n) => (
              <div key={n.id} className="border-l-2 border-nm-red/40 pl-4 py-1">
                <p className="text-sm whitespace-pre-wrap">{n.body}</p>
                <p className="mono-label mt-1.5">
                  {new Date(n.created_at).toLocaleString("es-CL")}
                </p>
              </div>
            ))}
            {notes.length === 0 && (
              <p className="text-sm text-nm-black/50">Sin notas todavía.</p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-2xl">Documentos y fotos</h2>
          <div className="nm-card divide-y divide-nm-black/8">
            {files.map((f) => (
              <div key={f.id} className="flex justify-between items-center text-sm px-5 py-3.5">
                <span>{f.file_name}</span>
                <span className="mono-label">{f.file_type}</span>
              </div>
            ))}
            {files.length === 0 && (
              <p className="text-sm text-nm-black/50 px-5 py-5">
                Sin archivos todavía. (Subida de archivos vía Supabase Storage — próxima
                iteración.)
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl">Correos del cliente vinculados</h2>
        <div className="flex flex-col gap-3">
          {emails.map((e) => (
            <div key={e.id} className="nm-card p-5 text-sm">
              <p className="font-medium">{e.subject}</p>
              <p className="text-nm-black/60 mt-1">{e.snippet}</p>
            </div>
          ))}
          {emails.length === 0 && (
            <p className="text-sm text-nm-black/50">
              Ningún correo vinculado. {isAdmin && "Búscalos por remitente del cliente y vincúlalos desde aquí (próxima iteración)."}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

function MoneyStat({ label, value }: { label: string; value: number | null }) {
  return (
    <div>
      <div className="text-2xl font-serif font-semibold">
        {value != null ? `$${value.toLocaleString("es-CL")}` : "—"}
      </div>
      <div className="mono-label mt-1">{label}</div>
    </div>
  );
}

import Link from "next/link";
import { getCurrentProfile, getProjects } from "@/lib/data";
import NewProjectForm from "@/components/NewProjectForm";

export default async function ProjectsPage() {
  const profile = await getCurrentProfile();
  const projects = await getProjects();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl">Proyectos</h1>
      </div>

      {profile?.role === "admin" && <NewProjectForm />}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((p) => (
          <Link
            key={p.id}
            href={`/dashboard/proyectos/${p.id}`}
            className="border-2 border-nm-black p-4 bg-surface hover:-translate-y-0.5 hover:shadow-[4px_4px_0_var(--nm-black)] transition-transform"
          >
            <p className="mono-label text-nm-black/50 mb-1">{p.status}</p>
            <p className="font-serif font-bold text-lg">{p.name}</p>
            <p className="text-sm text-nm-black/60">{p.client_name}</p>
          </Link>
        ))}
        {projects.length === 0 && (
          <p className="text-sm text-nm-black/60">No hay proyectos todavía.</p>
        )}
      </div>
    </div>
  );
}

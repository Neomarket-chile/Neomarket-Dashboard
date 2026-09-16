import Link from "next/link";
import { getCurrentProfile, getProjects } from "@/lib/data";
import NewProjectForm from "@/components/NewProjectForm";

export default async function ProjectsPage() {
  const profile = await getCurrentProfile();
  const projects = await getProjects();

  return (
    <div className="flex flex-col gap-10">
      <div className="flex items-center justify-between">
        <div>
          <p className="mono-label mb-2">Todos</p>
          <h1 className="text-4xl sm:text-5xl">Proyectos</h1>
        </div>
      </div>

      {profile?.role === "admin" && <NewProjectForm />}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {projects.map((p) => (
          <Link
            key={p.id}
            href={`/dashboard/proyectos/${p.id}`}
            className="nm-card nm-card-hover p-6"
          >
            <p className="mono-label mb-2">{p.status}</p>
            <p className="font-serif font-semibold text-xl">{p.name}</p>
            <p className="text-sm text-nm-black/60 mt-1">{p.client_name}</p>
          </Link>
        ))}
        {projects.length === 0 && (
          <p className="text-sm text-nm-black/60">No hay proyectos todavía.</p>
        )}
      </div>
    </div>
  );
}

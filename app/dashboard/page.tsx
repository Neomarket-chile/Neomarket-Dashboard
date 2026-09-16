import Link from "next/link";
import { getCurrentProfile, getProjects } from "@/lib/data";
import MetaAdsWidget from "@/components/MetaAdsWidget";

export default async function DashboardHome() {
  const profile = await getCurrentProfile();
  const projects = await getProjects();

  return (
    <div className="flex flex-col gap-12">
      <div>
        <p className="mono-label mb-2">Resumen</p>
        <h1 className="text-4xl sm:text-5xl">
          Hola, {profile?.full_name?.split(" ")[0] ?? "equipo"}.
        </h1>
      </div>

      <MetaAdsWidget />

      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl">Proyectos {profile?.role === "worker" ? "asignados" : ""}</h2>
          <Link href="/dashboard/proyectos" className="mono-label underline underline-offset-4">
            Ver todos
          </Link>
        </div>
        {projects.length === 0 ? (
          <p className="text-sm text-nm-black/60">Todavía no hay proyectos cargados.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.slice(0, 6).map((p) => (
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
          </div>
        )}
      </div>
    </div>
  );
}

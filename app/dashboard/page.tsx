import Link from "next/link";
import { getCurrentProfile, getProjects } from "@/lib/data";
import MetaAdsWidget from "@/components/MetaAdsWidget";

export default async function DashboardHome() {
  const profile = await getCurrentProfile();
  const projects = await getProjects();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="mono-label text-nm-black/50 mb-1">Resumen</p>
        <h1 className="text-3xl">
          Hola, {profile?.full_name?.split(" ")[0] ?? "equipo"}.
        </h1>
      </div>

      <MetaAdsWidget />

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl">Proyectos {profile?.role === "worker" ? "asignados" : ""}</h2>
          <Link href="/dashboard/proyectos" className="mono-label underline">
            Ver todos
          </Link>
        </div>
        {projects.length === 0 ? (
          <p className="text-sm text-nm-black/60">Todavía no hay proyectos cargados.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.slice(0, 6).map((p) => (
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
          </div>
        )}
      </div>
    </div>
  );
}

import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/data";
import { signOut } from "@/lib/actions/auth";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b-2 border-nm-black bg-nm-cream">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="text-xl font-bold tracking-wide">
              NEOMARKET
            </Link>
            <nav className="flex gap-6 text-sm">
              <Link href="/dashboard" className="hover:opacity-70">
                Resumen
              </Link>
              <Link href="/dashboard/proyectos" className="hover:opacity-70">
                Proyectos
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="mono-label text-nm-black/60">
              {profile.full_name} · {profile.role === "admin" ? "Admin" : "Colaborador"}
            </span>
            <form action={signOut}>
              <button className="mono-label border border-nm-black px-3 py-1.5 hover:bg-nm-black hover:text-nm-cream transition-colors">
                Salir
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="flex-1 bg-background">
        <div className="max-w-6xl mx-auto px-6 py-8">{children}</div>
      </main>
    </div>
  );
}

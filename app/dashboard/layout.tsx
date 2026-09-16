import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/data";
import { signOut } from "@/lib/actions/auth";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-nm-black/10 bg-nm-cream/95 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <Link href="/dashboard" className="font-serif text-xl tracking-wide">
              Neomarket
            </Link>
            <nav className="flex gap-6 text-sm">
              <Link href="/dashboard" className="hover:text-nm-red transition-colors">
                Resumen
              </Link>
              <Link href="/dashboard/proyectos" className="hover:text-nm-red transition-colors">
                Proyectos
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-5">
            <span className="mono-label">
              {profile.full_name} · {profile.role === "admin" ? "Admin" : "Colaborador"}
            </span>
            <form action={signOut}>
              <button className="nm-btn-outline !py-1.5 !px-4 mono-label !text-[0.65rem]">
                Salir
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="flex-1 bg-background">
        <div className="max-w-6xl mx-auto px-6 py-12">{children}</div>
      </main>
    </div>
  );
}

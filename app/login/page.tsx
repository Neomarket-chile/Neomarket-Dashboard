"use client";

import { useActionState } from "react";
import { signIn } from "@/lib/actions/auth";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(signIn, null as { error?: string } | null);

  return (
    <div className="min-h-screen flex items-center justify-center bg-nm-red px-4">
      <div className="w-full max-w-sm bg-nm-cream border-2 border-nm-black p-10">
        <div className="mono-label text-nm-black/60 mb-2">Neomarket / Acceso privado</div>
        <h1 className="text-4xl text-nm-black mb-8">Dashboard</h1>

        <form action={formAction} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="mono-label text-nm-black/70">
              Correo
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="border-b-2 border-nm-black bg-transparent py-2 outline-none text-nm-black"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="mono-label text-nm-black/70">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="border-b-2 border-nm-black bg-transparent py-2 outline-none text-nm-black"
            />
          </div>

          {state?.error && (
            <p className="text-sm text-red-700 font-mono">{state.error}</p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="mt-4 bg-nm-black text-nm-cream py-3 font-medium tracking-wide disabled:opacity-50"
          >
            {pending ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
}

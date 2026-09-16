"use client";

import { useActionState } from "react";
import { signIn } from "@/lib/actions/auth";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(signIn, null as { error?: string } | null);

  return (
    <div className="min-h-screen flex items-center justify-center bg-nm-red px-6 py-16 relative overflow-hidden">
      {/* Curva suave de fondo, nota editorial tomada del lenguaje de Franuí */}
      <svg
        className="absolute -bottom-1 left-0 w-full text-nm-cream/[0.06]"
        viewBox="0 0 1440 200"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          fill="currentColor"
          d="M0,120 C320,200 720,20 1440,120 L1440,200 L0,200 Z"
        />
      </svg>

      <div className="w-full max-w-sm bg-nm-cream rounded-[var(--radius-lg)] p-10 sm:p-12 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.35)] relative">
        <p className="mono-label mb-3">Neomarket / Acceso privado</p>
        <h1 className="text-5xl text-nm-black mb-10">Dashboard</h1>

        <form action={formAction} className="flex flex-col gap-6">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="mono-label">
              Correo
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="nm-input text-nm-black"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="mono-label">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="nm-input text-nm-black"
            />
          </div>

          {state?.error && (
            <p className="text-sm text-nm-red font-medium">{state.error}</p>
          )}

          <button type="submit" disabled={pending} className="nm-btn-primary mt-3 w-full">
            {pending ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
}

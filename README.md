# Neomarket Dashboard (MVP)

Panel interno privado de Neomarket: login con roles (admin/colaborador), Meta Ads en vivo,
y espacios de proyecto (notas, honorarios, archivos, correos vinculados).

## Stack

- Next.js 16 (App Router) + Tailwind v4
- Supabase (auth + Postgres + RLS)
- Identidad visual: paleta @neomarket.chile (rojo `#430201`, crema `#F3EFE7`, negro `#090401`)

## Estado del proyecto Supabase

Ya está creado y con el esquema aplicado:

- Proyecto: `neomarket-dashboard` (ref `bpfwplxnlogrzwssuzbp`, región `sa-east-1`)
- URL: `https://bpfwplxnlogrzwssuzbp.supabase.co`
- Usuario admin ya creado: `neomarket.chile@neomarket-chile.com` (contraseña temporal entregada aparte — cámbiala en el primer ingreso desde Supabase Auth > Users > Reset password, todavía no hay pantalla de cambio de contraseña en la app).

## Cómo correr localmente

```bash
npm install
npm run dev
```

Las variables ya están en `.env.local` (no se sube a git). Para otro entorno, copia `.env.example`.

## Meta Ads — ya configurado para Planytrip

Ya tienes el token y el account_id guardados en `.env.local` (no se sube a git), listos para
correr localmente. Cuando despliegues en Vercel, agrega estas mismas dos variables en
Settings → Environment Variables (copia los valores exactos desde tu `.env.local`):

- `META_ADS_ACCESS_TOKEN`
- `META_AD_ACCOUNT_ID` → `act_393018822661189` (Plan2Trip.cl)

Publicity account JMV todavía no está conectada — falta que generes su propio token de sistema
(instrucciones más abajo) y, del lado del código, extender el widget para mostrar más de una
cuenta a la vez (hoy solo soporta una — próxima iteración).

Si alguna vez necesitas regenerar el token de Planytrip: Meta Business Suite → ese negocio →
Usuarios del sistema → el usuario que ya tiene la app asignada → Generar token → `ads_read`.

Sin estas variables el dashboard igual funciona — el widget muestra un aviso de "no configurado"
en vez de romperse.

## Pendiente: subir a GitHub

Probé subirlo yo (con git y también llamando directo a la API de GitHub con el token que me
diste) y en ambos casos el entorno donde corre Claude bloquea la conexión a repos que no estén
pre-autorizados en la plataforma — es una restricción de seguridad del sandbox, no del token ni
de tus permisos. No hay vuelta que darle desde acá: tienes que subirlo tú, desde tu computador,
con el ZIP que te mandé:

```bash
# descomprime el zip, entra a la carpeta, y:
git init
git add -A
git commit -m "MVP inicial"
git branch -M main
git remote add origin https://github.com/Neomarket-chile/Neomarket-dashboard.git
git push -u origin main
```
(Si el repo `Neomarket-dashboard` no existe todavía en la organización `Neomarket-chile`, créalo
vacío primero desde github.com — sin README ni licencia, para no generar conflictos. Te va a
pedir iniciar sesión — usa tu usuario y el mismo token que me diste, o mejor aún, tu contraseña
normal de GitHub si tienes login por navegador configurado.)

## Pendiente: desplegar en Vercel

Intenté desplegar directo desde aquí, pero el token conectado a esta sesión no tiene permiso
para crear proyectos nuevos en tu equipo de Vercel (`neomarketchile-8044's projects`) — solo
puede operar sobre el proyecto ya existente `neomarket-portal`. Para desbloquearlo:

1. En vercel.com → tu equipo → Settings → revisa el rol/permisos de la integración conectada
   a Claude, o
2. Conecta el repo de GitHub directamente desde el dashboard de Vercel (Import Project) una vez
   esté subido — es el camino más simple y además deja el deploy automático en cada push.

## Qué falta para el alcance completo (fuera del MVP)

- Subida real de archivos/fotos a Supabase Storage (hoy solo está la tabla de metadatos)
- Vinculación de hilos de Gmail por proyecto (hoy solo está la tabla; falta la UI de
  búsqueda/vinculación)
- Pantalla de cambio de contraseña y alta de nuevos trabajadores desde la UI (hoy se hace por SQL)
- Fuentes de datos adicionales: ventas (Shopify/NMT Store) y redes sociales (Instagram)

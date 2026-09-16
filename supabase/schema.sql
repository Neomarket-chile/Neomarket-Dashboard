-- ============================================================================
-- NEOMARKET DASHBOARD — Esquema inicial (MVP)
-- ============================================================================
-- Convenciones:
--   * auth.users (Supabase Auth) es la fuente de identidad.
--   * profiles extiende auth.users con rol y datos de perfil.
--   * RLS (Row Level Security) se activa en TODAS las tablas.
--   * role: 'admin' (Miki) | 'worker' (colaborador/a)
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. PROFILES
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role text not null check (role in ('admin', 'worker')) default 'worker',
  avatar_url text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Cualquier usuario autenticado puede leer perfiles básicos (para mostrar nombres)
create policy "profiles_select_authenticated"
  on public.profiles for select
  to authenticated
  using (true);

-- Solo el propio usuario o un admin puede actualizar un perfil
create policy "profiles_update_self_or_admin"
  on public.profiles for update
  to authenticated
  using (
    id = auth.uid()
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- Solo un admin puede insertar/crear perfiles (altas de trabajadores)
create policy "profiles_insert_admin"
  on public.profiles for insert
  to authenticated
  with check (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- ---------------------------------------------------------------------------
-- Helper: ¿el usuario actual es admin?
-- ---------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

-- ---------------------------------------------------------------------------
-- 2. PROJECTS (espacios de proyecto)
-- ---------------------------------------------------------------------------
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  client_name text not null,
  client_email text,
  status text not null check (status in ('activo', 'pausado', 'finalizado')) default 'activo',
  site_url text,               -- link del sitio que se está desarrollando
  fee_amount numeric(12,2),    -- honorarios (CLP) — visible solo admin
  monthly_cost numeric(12,2),  -- costo mensual — visible solo admin
  total_cost numeric(12,2),    -- costo total del proyecto — visible solo admin
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

alter table public.projects enable row level security;

-- ---------------------------------------------------------------------------
-- 3. PROJECT_MEMBERS (qué trabajador está asignado a qué proyecto)
-- ---------------------------------------------------------------------------
create table if not exists public.project_members (
  project_id uuid references public.projects(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete cascade,
  primary key (project_id, profile_id)
);

alter table public.project_members enable row level security;

-- Admin ve todos los proyectos; worker solo los que tiene asignados
create policy "projects_select"
  on public.projects for select
  to authenticated
  using (
    public.is_admin()
    or exists (
      select 1 from public.project_members m
      where m.project_id = projects.id and m.profile_id = auth.uid()
    )
  );

create policy "projects_write_admin"
  on public.projects for insert to authenticated with check (public.is_admin());
create policy "projects_update_admin"
  on public.projects for update to authenticated using (public.is_admin());
create policy "projects_delete_admin"
  on public.projects for delete to authenticated using (public.is_admin());

create policy "project_members_select"
  on public.project_members for select
  to authenticated
  using (
    public.is_admin() or profile_id = auth.uid()
  );
create policy "project_members_write_admin"
  on public.project_members for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- 4. PROJECT_NOTES
-- ---------------------------------------------------------------------------
create table if not exists public.project_notes (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  author_id uuid references public.profiles(id),
  body text not null,
  created_at timestamptz not null default now()
);

alter table public.project_notes enable row level security;

create policy "project_notes_select"
  on public.project_notes for select to authenticated
  using (
    public.is_admin()
    or exists (select 1 from public.project_members m where m.project_id = project_notes.project_id and m.profile_id = auth.uid())
  );

create policy "project_notes_insert"
  on public.project_notes for insert to authenticated
  with check (
    public.is_admin()
    or exists (select 1 from public.project_members m where m.project_id = project_notes.project_id and m.profile_id = auth.uid())
  );

-- ---------------------------------------------------------------------------
-- 5. PROJECT_FILES (metadatos; el binario vive en Supabase Storage)
-- ---------------------------------------------------------------------------
create table if not exists public.project_files (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  uploaded_by uuid references public.profiles(id),
  file_name text not null,
  storage_path text not null,   -- ruta dentro del bucket 'project-files'
  file_type text,               -- 'document' | 'photo' | 'other'
  created_at timestamptz not null default now()
);

alter table public.project_files enable row level security;

create policy "project_files_select"
  on public.project_files for select to authenticated
  using (
    public.is_admin()
    or exists (select 1 from public.project_members m where m.project_id = project_files.project_id and m.profile_id = auth.uid())
  );

create policy "project_files_insert"
  on public.project_files for insert to authenticated
  with check (
    public.is_admin()
    or exists (select 1 from public.project_members m where m.project_id = project_files.project_id and m.profile_id = auth.uid())
  );

-- ---------------------------------------------------------------------------
-- 6. PROJECT_EMAILS (hilos de Gmail vinculados manualmente al proyecto)
-- ---------------------------------------------------------------------------
create table if not exists public.project_emails (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  gmail_thread_id text not null,
  subject text,
  snippet text,
  linked_by uuid references public.profiles(id),
  linked_at timestamptz not null default now()
);

alter table public.project_emails enable row level security;

create policy "project_emails_select"
  on public.project_emails for select to authenticated
  using (
    public.is_admin()
    or exists (select 1 from public.project_members m where m.project_id = project_emails.project_id and m.profile_id = auth.uid())
  );

create policy "project_emails_insert_admin"
  on public.project_emails for insert to authenticated
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- 7. META_ADS_SNAPSHOTS (caché de métricas para no golpear la API en cada carga)
-- ---------------------------------------------------------------------------
create table if not exists public.meta_ads_snapshots (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  ad_account_id text not null,
  campaign_name text,
  spend numeric(12,2),
  impressions bigint,
  clicks bigint,
  roas numeric(6,2),
  captured_at timestamptz not null default now()
);

alter table public.meta_ads_snapshots enable row level security;

create policy "meta_ads_select"
  on public.meta_ads_snapshots for select to authenticated
  using (
    public.is_admin()
    or (project_id is not null and exists (
      select 1 from public.project_members m where m.project_id = meta_ads_snapshots.project_id and m.profile_id = auth.uid()
    ))
  );

create policy "meta_ads_insert_admin"
  on public.meta_ads_snapshots for insert to authenticated
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- 8. VISTA DE SEGURIDAD POR COLUMNA
-- ---------------------------------------------------------------------------
-- RLS filtra FILAS, no columnas. Como "worker" no debe ver honorarios/costos
-- aunque tenga acceso al proyecto, el frontend SIEMPRE debe leer proyectos
-- desde esta vista (nunca directo de la tabla "projects") para las vistas
-- de trabajador. El admin puede seguir usando la tabla base si necesita
-- editar los montos.
-- ---------------------------------------------------------------------------
create or replace view public.projects_safe as
select
  id,
  name,
  client_name,
  client_email,
  status,
  site_url,
  created_by,
  created_at,
  case when public.is_admin() then fee_amount else null end as fee_amount,
  case when public.is_admin() then monthly_cost else null end as monthly_cost,
  case when public.is_admin() then total_cost else null end as total_cost
from public.projects;

alter view public.projects_safe set (security_invoker = true);

-- ---------------------------------------------------------------------------
-- Storage bucket para archivos de proyecto (crear vía dashboard o API aparte)
-- Bucket sugerido: 'project-files' (privado, acceso vía policy + signed URLs)
-- ---------------------------------------------------------------------------

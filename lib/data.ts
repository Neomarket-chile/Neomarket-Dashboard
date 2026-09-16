import { createClient } from "@/lib/supabase/server";
import type { Profile, ProjectSafe, ProjectNote, ProjectFile, ProjectEmail } from "@/lib/types";

export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return data as Profile | null;
}

export async function getProjects(): Promise<ProjectSafe[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects_safe")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as ProjectSafe[];
}

export async function getProject(id: string): Promise<ProjectSafe | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("projects_safe").select("*").eq("id", id).single();
  return data as ProjectSafe | null;
}

export async function getProjectNotes(projectId: string): Promise<ProjectNote[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("project_notes")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });
  return (data ?? []) as ProjectNote[];
}

export async function getProjectFiles(projectId: string): Promise<ProjectFile[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("project_files")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });
  return (data ?? []) as ProjectFile[];
}

export async function getProjectEmails(projectId: string): Promise<ProjectEmail[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("project_emails")
    .select("*")
    .eq("project_id", projectId)
    .order("linked_at", { ascending: false });
  return (data ?? []) as ProjectEmail[];
}

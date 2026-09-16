"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createProject(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticado");

  const { error } = await supabase.from("projects").insert({
    name: String(formData.get("name") || ""),
    client_name: String(formData.get("client_name") || ""),
    client_email: String(formData.get("client_email") || "") || null,
    site_url: String(formData.get("site_url") || "") || null,
    fee_amount: formData.get("fee_amount") ? Number(formData.get("fee_amount")) : null,
    monthly_cost: formData.get("monthly_cost") ? Number(formData.get("monthly_cost")) : null,
    total_cost: formData.get("total_cost") ? Number(formData.get("total_cost")) : null,
    created_by: user.id,
  });

  if (error) throw error;
  revalidatePath("/dashboard/proyectos");
}

export async function addProjectNote(projectId: string, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticado");

  const body = String(formData.get("body") || "").trim();
  if (!body) return;

  const { error } = await supabase.from("project_notes").insert({
    project_id: projectId,
    author_id: user.id,
    body,
  });

  if (error) throw error;
  revalidatePath(`/dashboard/proyectos/${projectId}`);
}

export async function assignWorker(projectId: string, profileId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("project_members")
    .insert({ project_id: projectId, profile_id: profileId });
  if (error) throw error;
  revalidatePath(`/dashboard/proyectos/${projectId}`);
}

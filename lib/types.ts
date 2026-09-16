export type Role = "admin" | "worker";

export type Profile = {
  id: string;
  full_name: string;
  role: Role;
  avatar_url: string | null;
  created_at: string;
};

export type ProjectStatus = "activo" | "pausado" | "finalizado";

export type ProjectSafe = {
  id: string;
  name: string;
  client_name: string;
  client_email: string | null;
  status: ProjectStatus;
  site_url: string | null;
  created_by: string | null;
  created_at: string;
  fee_amount: number | null;
  monthly_cost: number | null;
  total_cost: number | null;
};

export type ProjectNote = {
  id: string;
  project_id: string;
  author_id: string | null;
  body: string;
  created_at: string;
};

export type ProjectFile = {
  id: string;
  project_id: string;
  uploaded_by: string | null;
  file_name: string;
  storage_path: string;
  file_type: string | null;
  created_at: string;
};

export type ProjectEmail = {
  id: string;
  project_id: string;
  gmail_thread_id: string;
  subject: string | null;
  snippet: string | null;
  linked_by: string | null;
  linked_at: string;
};

export type MetaAdsSnapshot = {
  id: string;
  project_id: string | null;
  ad_account_id: string;
  campaign_name: string | null;
  spend: number | null;
  impressions: number | null;
  clicks: number | null;
  roas: number | null;
  captured_at: string;
};

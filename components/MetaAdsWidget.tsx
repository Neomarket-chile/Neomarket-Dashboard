"use client";

import { useEffect, useState } from "react";

type CampaignRow = {
  campaign_name: string;
  spend: string;
  impressions: string;
  clicks: string;
  ctr?: string;
  purchase_roas?: { value: string }[];
};

type ApiResponse = {
  configured: boolean;
  data?: CampaignRow[];
  error?: string;
  message?: string;
};

export default function MetaAdsWidget() {
  const [state, setState] = useState<ApiResponse | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await fetch("/api/meta-ads");
        const json = (await res.json()) as ApiResponse;
        if (mounted) setState(json);
      } catch {
        if (mounted) setState({ configured: true, error: "Error de red." });
      }
    }
    load();
    const interval = setInterval(load, 60_000); // refresco cada 60s
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  if (!state) {
    return <div className="nm-card p-8 animate-pulse h-40" />;
  }

  if (!state.configured) {
    return (
      <div className="nm-card p-8 border-dashed">
        <p className="mono-label mb-2">Meta Ads</p>
        <p className="text-sm text-nm-black/70">{state.message}</p>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="nm-card p-8">
        <p className="mono-label mb-2">Meta Ads</p>
        <p className="text-sm text-nm-red">{state.error}</p>
      </div>
    );
  }

  const rows = state.data ?? [];
  const totalSpend = rows.reduce((s, r) => s + parseFloat(r.spend || "0"), 0);
  const totalImpressions = rows.reduce((s, r) => s + parseInt(r.impressions || "0", 10), 0);
  const totalClicks = rows.reduce((s, r) => s + parseInt(r.clicks || "0", 10), 0);
  const avgRoas =
    rows.reduce((s, r) => s + parseFloat(r.purchase_roas?.[0]?.value || "0"), 0) /
      (rows.filter((r) => r.purchase_roas?.[0]?.value).length || 1) || 0;

  return (
    <div className="nm-card p-8">
      <div className="flex items-center justify-between mb-6">
        <p className="mono-label">Meta Ads · últimos 7 días</p>
        <span className="mono-label text-nm-red">● en vivo</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        <Stat label="Gasto" value={`$${totalSpend.toLocaleString("es-CL")}`} />
        <Stat label="Impresiones" value={totalImpressions.toLocaleString("es-CL")} />
        <Stat label="Clics" value={totalClicks.toLocaleString("es-CL")} />
        <Stat label="ROAS prom." value={`${avgRoas.toFixed(2)}x`} />
      </div>
      {rows.length > 0 && (
        <div className="mt-8 divide-y divide-nm-black/8">
          {rows.slice(0, 5).map((r, i) => (
            <div key={i} className="flex justify-between py-3 text-sm">
              <span className="truncate max-w-[60%]">{r.campaign_name}</span>
              <span className="font-mono">${parseFloat(r.spend || "0").toLocaleString("es-CL")}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-2xl font-serif font-semibold">{value}</div>
      <div className="mono-label mt-1">{label}</div>
    </div>
  );
}

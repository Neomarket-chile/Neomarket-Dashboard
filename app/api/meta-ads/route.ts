import { NextResponse } from "next/server";

// ---------------------------------------------------------------------------
// Trae métricas en vivo de la cuenta de Meta Ads configurada.
// Requiere las variables de entorno:
//   META_ADS_ACCESS_TOKEN  -> token de sistema (larga duración) de Meta Business
//   META_AD_ACCOUNT_ID     -> ej. act_1234567890
// Ver README para instrucciones de cómo generarlas.
// ---------------------------------------------------------------------------

export const dynamic = "force-dynamic";

export async function GET() {
  const token = process.env.META_ADS_ACCESS_TOKEN;
  const accountId = process.env.META_AD_ACCOUNT_ID;

  if (!token || !accountId) {
    return NextResponse.json(
      {
        configured: false,
        message:
          "Meta Ads no está configurado. Agrega META_ADS_ACCESS_TOKEN y META_AD_ACCOUNT_ID en las variables de entorno.",
      },
      { status: 200 }
    );
  }

  const fields = "spend,impressions,clicks,cpc,ctr,purchase_roas,campaign_name";
  const url = `https://graph.facebook.com/v21.0/${accountId}/insights?level=campaign&date_preset=last_7d&fields=${fields}&access_token=${token}`;

  try {
    const res = await fetch(url, { cache: "no-store" });
    const json = await res.json();

    if (json.error) {
      return NextResponse.json(
        { configured: true, error: json.error.message },
        { status: 200 }
      );
    }

    return NextResponse.json({ configured: true, data: json.data ?? [] });
  } catch {
    return NextResponse.json(
      { configured: true, error: "No se pudo conectar con la API de Meta." },
      { status: 200 }
    );
  }
}

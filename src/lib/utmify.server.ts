// Utmify API (server-only)
// https://api.utmify.com.br/api-credentials/orders

const ENDPOINT = "https://api.utmify.com.br/api-credentials/orders";

export type UtmifyTracking = {
  src?: string | null;
  sck?: string | null;
  utm_source?: string | null;
  utm_campaign?: string | null;
  utm_medium?: string | null;
  utm_content?: string | null;
  utm_term?: string | null;
};

export type UtmifyOrderInput = {
  orderId: string;
  paymentMethod: "pix" | "credit_card" | "boleto";
  status: "waiting_payment" | "paid" | "refused" | "refunded" | "chargedback";
  createdAt: string; // "YYYY-MM-DD HH:mm:ss" (UTC)
  approvedDate?: string | null;
  refundedAt?: string | null;
  customer: {
    name: string;
    email: string;
    phone?: string | null;
    document?: string | null;
    country?: string;
    ip?: string;
  };
  products: Array<{
    id: string;
    name: string;
    planId?: string | null;
    planName?: string | null;
    quantity: number;
    priceInCents: number;
  }>;
  trackingParameters: UtmifyTracking;
  commission: {
    totalPriceInCents: number;
    gatewayFeeInCents: number;
    userCommissionInCents: number;
    currency?: string;
  };
  isTest?: boolean;
};

export async function utmifySendOrder(order: UtmifyOrderInput): Promise<void> {
  const token = process.env.UTMIFY_API_TOKEN;
  if (!token) {
    console.warn("[utmify] UTMIFY_API_TOKEN não configurado — pulando envio");
    return;
  }

  const trackingParameters = {
    src: order.trackingParameters?.src ?? null,
    sck: order.trackingParameters?.sck ?? null,
    utm_source: order.trackingParameters?.utm_source ?? null,
    utm_campaign: order.trackingParameters?.utm_campaign ?? null,
    utm_medium: order.trackingParameters?.utm_medium ?? null,
    utm_content: order.trackingParameters?.utm_content ?? null,
    utm_term: order.trackingParameters?.utm_term ?? null,
  };

  const payload = {
    platform: "Pagou",
    ...order,
    trackingParameters,
  };

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-token": token,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error(`[utmify] erro ${res.status}: ${text.slice(0, 300)}`);
    throw new Error(`Utmify ${res.status}`);
  }
}

export function nowUtcSqlString(d: Date = new Date()): string {
  // Format YYYY-MM-DD HH:mm:ss (UTC)
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}` +
    ` ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}`
  );
}

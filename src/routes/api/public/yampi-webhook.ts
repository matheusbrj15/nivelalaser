import { createFileRoute } from "@tanstack/react-router";
import { createHmac, timingSafeEqual } from "crypto";

/**
 * Webhook Yampi -> RastroCode
 *
 * Configuração na Yampi (Configurações > Notificações > Webhooks):
 *   URL:     https://moedorangular-portatil.lovable.app/api/public/yampi-webhook
 *   Eventos: "Pedido pago" (obrigatório).
 *            Opcionalmente também "Status do pedido alterado".
 *   Secret:  o valor salvo em YAMPI_WEBHOOK_SECRET (mesmo valor nos dois lados).
 *
 * A Yampi envia o corpo assinado com HMAC-SHA256 (base64) no header
 * X-Yampi-Hmac-SHA256. Só encaminhamos pedidos aprovados/pagos.
 */

const RASTROCODE_ENDPOINT = "https://app.rastrocode.site/api/v1/orders";

const PAID_ALIASES = new Set([
  "paid",
  "approved",
  "authorized",
  "aprovado",
  "pago",
  "completed",
]);

type YampiAddress = {
  street?: string;
  number?: string | number;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zipcode?: string;
  postal_code?: string;
};

type YampiPayload = {
  event?: string;
  resource?: {
    id?: number | string;
    number?: number | string;
    status?: { alias?: string; name?: string } | string;
    value_total?: number | string;
    customer?: {
      data?: {
        name?: string;
        first_name?: string;
        last_name?: string;
        email?: string;
        phone?: { full_number?: string; formated_number?: string };
        cpf?: string;
        cnpj?: string;
      };
    };
    shipping_address?: { data?: YampiAddress };
    billing_address?: { data?: YampiAddress };
    items?: {
      data?: Array<{
        item_title?: string;
        product_title?: string;
        sku_title?: string;
        quantity?: number;
        price?: number | string;
        item_value?: number | string;
      }>;
    };
  };
};

function verifySignature(rawBody: string, headerSig: string | null, secret: string): boolean {
  if (!headerSig) return false;
  const expected = createHmac("sha256", secret).update(rawBody, "utf8").digest("base64");
  const a = Buffer.from(expected);
  const b = Buffer.from(headerSig);
  if (a.length !== b.length) return false;
  try {
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

function isApproved(p: YampiPayload): boolean {
  const event = (p.event ?? "").toLowerCase();
  if (event.includes("paid") || event.includes("approved") || event.includes("aprovad")) {
    return true;
  }
  const status = p.resource?.status;
  const alias =
    typeof status === "string" ? status : (status?.alias ?? status?.name ?? "");
  return PAID_ALIASES.has(alias.toLowerCase());
}

function toDigits(v: unknown): string {
  return String(v ?? "").replace(/\D/g, "");
}

function toNumber(v: unknown): number {
  const n = typeof v === "number" ? v : parseFloat(String(v ?? "0"));
  return Number.isFinite(n) ? n : 0;
}

export const Route = createFileRoute("/api/public/yampi-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const webhookSecret = process.env.YAMPI_WEBHOOK_SECRET;
        const rastroKey = process.env.RASTROCODE_API_KEY;

        if (!webhookSecret || !rastroKey) {
          console.error("[yampi-webhook] segredos ausentes");
          return new Response("Server not configured", { status: 500 });
        }

        const rawBody = await request.text();
        const signature = request.headers.get("x-yampi-hmac-sha256");

        if (!verifySignature(rawBody, signature, webhookSecret)) {
          console.warn("[yampi-webhook] assinatura inválida");
          return new Response("Invalid signature", { status: 401 });
        }

        let payload: YampiPayload;
        try {
          payload = JSON.parse(rawBody) as YampiPayload;
        } catch {
          return new Response("Invalid JSON", { status: 400 });
        }

        if (!isApproved(payload)) {
          console.log(
            "[yampi-webhook] evento ignorado:",
            payload.event,
            "status:",
            JSON.stringify(payload.resource?.status),
          );
          return Response.json({ ok: true, ignored: true });
        }

        const r = payload.resource ?? {};
        const c = r.customer?.data ?? {};
        const addr = r.shipping_address?.data ?? r.billing_address?.data ?? {};
        const items = r.items?.data ?? [];

        const products = items.map((it) => {
          const rawPrice =
            it.price ??
            (it.item_value != null && it.quantity
              ? toNumber(it.item_value) / (it.quantity || 1)
              : 0);
          return {
            name: (
              it.item_title ?? it.product_title ?? it.sku_title ?? "Produto"
            ).slice(0, 255),
            quantity: Math.max(1, Math.min(9999, Number(it.quantity ?? 1))),
            price: Math.max(0.01, toNumber(rawPrice)),
          };
        });

        const computedTotal = products.reduce(
          (sum, p) => sum + p.price * p.quantity,
          0,
        );
        const total = toNumber(r.value_total) || computedTotal;

        const name =
          c.name ?? [c.first_name, c.last_name].filter(Boolean).join(" ").trim();

        const rastroPayload = {
          transaction_id: String(r.id ?? r.number ?? Date.now()).slice(0, 50),
          customer: {
            name: (name || "").slice(0, 255),
            email: (c.email ?? "").toLowerCase(),
            phone: toDigits(c.phone?.full_number ?? c.phone?.formated_number ?? ""),
            document: toDigits(c.cpf ?? c.cnpj ?? ""),
          },
          address: {
            street: (addr.street ?? "").slice(0, 255),
            number: String(addr.number ?? "").slice(0, 20),
            complement: (addr.complement ?? "").slice(0, 255),
            neighborhood: (addr.neighborhood ?? "").slice(0, 255),
            city: (addr.city ?? "").slice(0, 255),
            state: (addr.state ?? "").toUpperCase().slice(0, 2),
            zipcode: toDigits(addr.zipcode ?? addr.postal_code ?? ""),
          },
          products: products.length
            ? products
            : [{ name: "Pedido Yampi", quantity: 1, price: total || 0.01 }],
          total: Number(total.toFixed(2)),
        };

        const res = await fetch(RASTROCODE_ENDPOINT, {
          method: "POST",
          headers: {
            "X-API-Key": rastroKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(rastroPayload),
        });
        const respBody = await res.text();

        if (!res.ok) {
          console.error(
            "[yampi-webhook] RastroCode falhou",
            res.status,
            respBody,
          );
          // 5xx/429 => 502 para a Yampi reenfileirar. Demais erros => 200 para não repetir.
          const retry = res.status >= 500 || res.status === 429;
          return Response.json(
            { ok: false, rastrocode_status: res.status, body: respBody },
            { status: retry ? 502 : 200 },
          );
        }

        console.log(
          "[yampi-webhook] enviado",
          rastroPayload.transaction_id,
          "->",
          respBody,
        );
        return Response.json({ ok: true, transaction_id: rastroPayload.transaction_id });
      },
    },
  },
});

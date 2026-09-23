import { createFileRoute } from "@tanstack/react-router";
import { verifyPagouSignature } from "@/lib/pagou.server";
import { utmifySendOrder, nowUtcSqlString } from "@/lib/utmify.server";

const RASTROCODE_ENDPOINT = "https://app.rastrocode.site/api/v1/orders";

type RastroCodeProduct = { name?: string; price?: number; quantity?: number; sku?: string };

async function notifyRastroCode(params: {
  transactionId: string;
  amountCents: number;
  buyer: {
    name?: string;
    email?: string;
    phone?: string | null;
    document?: { number?: string } | null;
    address?: {
      street?: string;
      number?: string;
      complement?: string | null;
      neighborhood?: string;
      city?: string;
      state?: string;
      zipCode?: string;
    } | null;
  };
  products: RastroCodeProduct[];
}) {
  const rastroKey = process.env.RASTROCODE_API_KEY;
  if (!rastroKey) {
    console.warn("[payment-webhook] RASTROCODE_API_KEY não configurado — pulando RastroCode");
    return;
  }

  const address = params.buyer.address ?? {};
  const mappedProducts = params.products.map((p) => ({
    name: String(p.name ?? "Produto").slice(0, 255),
    quantity: Math.max(1, Math.min(9999, Number(p.quantity ?? 1))),
    price: Math.max(0.01, Number(p.price ?? 0) / 100),
  }));

  const rastroPayload = {
    transaction_id: params.transactionId.slice(0, 50),
    customer: {
      name: String(params.buyer.name ?? "Cliente").slice(0, 255),
      email: String(params.buyer.email ?? "").toLowerCase(),
      phone: String(params.buyer.phone ?? "").replace(/\D/g, ""),
      document: String(params.buyer.document?.number ?? "").replace(/\D/g, ""),
    },
    address: {
      street: String(address.street ?? "").slice(0, 255),
      number: String(address.number ?? "").slice(0, 20),
      complement: String(address.complement ?? "").slice(0, 255),
      neighborhood: String(address.neighborhood ?? "").slice(0, 255),
      city: String(address.city ?? "").slice(0, 255),
      state: String(address.state ?? "").toUpperCase().slice(0, 2),
      zipcode: String(address.zipCode ?? "").replace(/\D/g, ""),
    },
    products: mappedProducts.length
      ? mappedProducts
      : [{ name: "Produto", quantity: 1, price: Math.max(0.01, params.amountCents / 100) }],
    total: Number((params.amountCents / 100).toFixed(2)),
  };

  try {
    const res = await fetch(RASTROCODE_ENDPOINT, {
      method: "POST",
      headers: { "X-API-Key": rastroKey, "Content-Type": "application/json" },
      body: JSON.stringify(rastroPayload),
    });
    const respBody = await res.text();
    if (!res.ok) {
      console.error("[payment-webhook] RastroCode falhou", res.status, respBody);
      return;
    }
    console.log("[payment-webhook] RastroCode enviado", rastroPayload.transaction_id, "->", respBody);
  } catch (err) {
    console.error("[payment-webhook] RastroCode erro:", err);
  }
}

export const Route = createFileRoute("/api/public/payment-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const raw = await request.text();
        const allHeaders: Record<string, string> = {};
        request.headers.forEach((v, k) => { allHeaders[k] = v; });
        const signature =
          request.headers.get("x-pagou-signature") ??
          request.headers.get("x-signature") ??
          request.headers.get("x-webhook-secret") ??
          request.headers.get("x-webhook-signature");

        if (!verifyPagouSignature(raw, signature, allHeaders)) {
          return new Response("invalid signature", { status: 401 });
        }

        let payload: any;
        try {
          payload = JSON.parse(raw);
        } catch {
          return new Response("invalid json", { status: 400 });
        }

        // Pagou envelope: { event: "transaction", data: { id, status, ... } }
        const event = payload.event ?? payload.type;
        const tx = payload.data ?? payload.transaction ?? payload;

        if (event !== "transaction" && !tx?.status) {
          return new Response("ignored", { status: 200 });
        }

        const status = String(tx.status ?? "").toLowerCase();
        const amount = Number(tx.amount ?? 0);
        const method =
          String(tx.method ?? "pix").toLowerCase() === "credit_card"
            ? "credit_card"
            : "pix";

        let utmStatus: "paid" | "refused" | "refunded" | "chargedback" | "waiting_payment" =
          "waiting_payment";
        if (["paid", "approved", "succeeded"].includes(status)) utmStatus = "paid";
        else if (["refused", "failed", "declined"].includes(status)) utmStatus = "refused";
        else if (["refunded"].includes(status)) utmStatus = "refunded";
        else if (["chargeback", "chargedback"].includes(status)) utmStatus = "chargedback";

        let tracking = {};
        try {
          if (typeof tx.metadata === "string") {
            const md = JSON.parse(tx.metadata);
            tracking = md.tracking ?? {};
          }
        } catch {}

        const buyer = tx.buyer ?? {};
        const products = Array.isArray(tx.products) && tx.products.length > 0
          ? tx.products
          : [{ name: "Produto", price: amount, quantity: 1, sku: "default" }];

        try {
          await utmifySendOrder({
            orderId: String(tx.id ?? tx.external_ref ?? `tx_${Date.now()}`),
            paymentMethod: method,
            status: utmStatus,
            createdAt: nowUtcSqlString(new Date(tx.created_at ?? Date.now())),
            approvedDate: utmStatus === "paid" ? nowUtcSqlString() : null,
            refundedAt: utmStatus === "refunded" ? nowUtcSqlString() : null,
            customer: {
              name: buyer.name ?? "Cliente",
              email: buyer.email ?? "",
              phone: buyer.phone ?? null,
              document: buyer.document?.number ?? null,
              country: buyer.address?.country ?? "BR",
              ip: "",
            },
            products: products.map((p: any, i: number) => ({
              id: p.sku ?? `prod_${i}`,
              name: p.name ?? "Produto",
              planId: null,
              planName: null,
              quantity: Number(p.quantity ?? 1),
              priceInCents: Number(p.price ?? 0),
            })),
            trackingParameters: tracking,
            commission: {
              totalPriceInCents: amount,
              gatewayFeeInCents: 0,
              userCommissionInCents: amount,
              currency: "BRL",
            },
            isTest: false,
          });
        } catch (err) {
          console.error("[webhook] utmify falhou:", err);
        }

        if (utmStatus === "paid") {
          await notifyRastroCode({
            transactionId: String(tx.id ?? tx.external_ref ?? `tx_${Date.now()}`),
            amountCents: amount,
            buyer,
            products,
          });
        }

        return new Response("ok", { status: 200 });
      },
    },
  },
});

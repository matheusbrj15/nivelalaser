import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { z } from "zod";
import { getPagouEnvironment, pagouCreateTransaction } from "./pagou.server";
import { utmifySendOrder, nowUtcSqlString } from "./utmify.server";

const TrackingSchema = z
  .object({
    src: z.string().nullable().optional(),
    sck: z.string().nullable().optional(),
    utm_source: z.string().nullable().optional(),
    utm_campaign: z.string().nullable().optional(),
    utm_medium: z.string().nullable().optional(),
    utm_content: z.string().nullable().optional(),
    utm_term: z.string().nullable().optional(),
  })
  .default({});

const InputSchema = z.object({
  method: z.enum(["pix", "credit_card"]),
  amountCents: z.number().int().positive().max(100_000_000),
  productName: z.string().min(1).max(255),
  productId: z.string().min(1).max(64),
  customer: z.object({
    name: z.string().min(3).max(120),
    email: z.string().email(),
    phone: z.string().min(10).max(20),
    cpf: z.string().min(11).max(20),
  }),
  address: z.object({
    cep: z.string().min(8).max(10),
    street: z.string().min(1).max(120),
    number: z.string().min(1).max(20),
    complement: z.string().max(60).optional().nullable(),
    district: z.string().min(1).max(80),
    city: z.string().min(1).max(80),
    state: z.string().length(2),
  }),
  tracking: TrackingSchema,
  cardToken: z.string().regex(/^pgct_/).optional(),
  installments: z.number().int().min(1).max(12).optional(),
});

export const createPagouCheckout = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => InputSchema.parse(data))
  .handler(async ({ data }) => {
    const cpfDigits = data.customer.cpf.replace(/\D/g, "");
    const phoneDigits = data.customer.phone.replace(/\D/g, "");
    const cepDigits = data.address.cep.replace(/\D/g, "");

    // Build notify URL from request origin
    const host = getRequestHeader("host");
    const proto = getRequestHeader("x-forwarded-proto") ?? "https";
    const notifyUrl = host ? `${proto}://${host}/api/public/payment-webhook` : undefined;

    const externalRef = `ord_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const ip =
      getRequestHeader("cf-connecting-ip") ??
      getRequestHeader("x-real-ip") ??
      getRequestHeader("x-forwarded-for")?.split(",")[0]?.trim() ??
      "";

    const tx = await pagouCreateTransaction({
      external_ref: externalRef,
      amount: data.amountCents,
      currency: "BRL",
      method: data.method,
      installments: data.installments,
      token: data.cardToken,
      notify_url: notifyUrl,
      ip_address: ip || undefined,
      buyer: {
        name: data.customer.name,
        email: data.customer.email,
        phone: phoneDigits,
        document: { type: "CPF", number: cpfDigits },
        address: {
          street: data.address.street,
          number: data.address.number,
          complement: data.address.complement || null,
          neighborhood: data.address.district,
          city: data.address.city,
          state: data.address.state.toUpperCase(),
          zipCode: cepDigits,
          country: "BR",
        },
      },
      products: [
        {
          name: data.productName,
          price: data.amountCents,
          quantity: 1,
          tangible: true,
          sku: data.productId,
        },
      ],
      metadata: JSON.stringify({ tracking: data.tracking, externalRef }),
    });

    if (data.method === "credit_card") {
      console.log("[checkout] credit_card tx response:", JSON.stringify(tx).slice(0, 1500));
    }


    // Notify Utmify (waiting_payment for pix, paid happens via webhook)
    try {
      await utmifySendOrder({
        orderId: String(tx.id ?? externalRef),
        paymentMethod: data.method === "credit_card" ? "credit_card" : "pix",
        status: data.method === "pix" ? "waiting_payment" : "waiting_payment",
        createdAt: nowUtcSqlString(),
        approvedDate: null,
        refundedAt: null,
        customer: {
          name: data.customer.name,
          email: data.customer.email,
          phone: phoneDigits,
          document: cpfDigits,
          country: "BR",
          ip,
        },
        products: [
          {
            id: data.productId,
            name: data.productName,
            planId: null,
            planName: null,
            quantity: 1,
            priceInCents: data.amountCents,
          },
        ],
        trackingParameters: data.tracking,
        commission: {
          totalPriceInCents: data.amountCents,
          gatewayFeeInCents: 0,
          userCommissionInCents: data.amountCents,
          currency: "BRL",
        },
        isTest: false,
      });
    } catch (err) {
      console.error("[checkout] Utmify falhou:", err);
    }

    const txRecord = tx as Record<string, unknown>;
    const refusalReason =
      (typeof txRecord.refusal_reason === "string" && txRecord.refusal_reason) ||
      (typeof txRecord.failure_reason === "string" && txRecord.failure_reason) ||
      (typeof txRecord.refused_reason === "string" && txRecord.refused_reason) ||
      (typeof txRecord.gateway_response === "string" && txRecord.gateway_response) ||
      null;
    return {
      id: String(tx.id ?? externalRef),
      transactionId: String(tx.id ?? externalRef),
      externalRef,
      status: tx.status ?? null,
      next_action: txRecord.next_action ?? null,
      refusalReason,
      pix: tx.pix
        ? {
            qrCode: tx.pix.qr_code ?? null,
            qrCodeImage: tx.pix.qr_code_image ?? null,
            expiresAt: tx.pix.expires_at ?? null,
          }
        : null,
    };
  });

export const getPagouPublicKey = createServerFn({ method: "GET" }).handler(async () => {
  const publicKey = process.env.PAGOU_PUBLIC_KEY ?? "";
  const environment = getPagouEnvironment();
  return { publicKey, environment };
});

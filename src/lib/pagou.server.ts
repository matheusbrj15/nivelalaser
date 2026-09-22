import { createHmac, timingSafeEqual } from "crypto";

// Pagou.ai v2 API client (server-only)
// https://developer.pagou.ai

function resolveBaseUrl(): string {
  if (process.env.PAGOU_BASE_URL) return process.env.PAGOU_BASE_URL;
  const key = process.env.PAGOU_API_SECRET ?? process.env.PAGOU_API_KEY ?? "";
  const pub = process.env.PAGOU_PUBLIC_KEY ?? "";
  const isTest = key.startsWith("sk_test_") || pub.startsWith("pk_test_");
  return isTest ? "https://api-sandbox.pagou.ai" : "https://api.pagou.ai";
}

export function getPagouEnvironment(): "sandbox" | "production" {
  return resolveBaseUrl().includes("api-sandbox") ? "sandbox" : "production";
}

type Buyer = {
  name: string;
  email: string;
  phone?: string;
  document: { type: "CPF" | "CNPJ"; number: string };
  address?: {
    street: string;
    number?: string;
    complement?: string | null;
    neighborhood?: string;
    city: string;
    state: string;
    zipCode?: string;
    country?: string;
  };
};

type Product = {
  name: string;
  price: number; // cents
  quantity?: number;
  tangible?: boolean;
  sku?: string;
};

type CreateTxInput = {
  external_ref?: string;
  amount: number; // cents
  currency?: "BRL";
  method: "pix" | "credit_card";
  installments?: number;
  buyer: Buyer;
  products: Product[];
  notify_url?: string;
  token?: string; // pgct_ for card
  metadata?: string;
  ip_address?: string;
};

export type PagouTransaction = {
  id?: string;
  status?: string;
  amount?: number;
  method?: string;
  pix?: {
    qr_code?: string; // EMV string (copy & paste)
    qr_code_image?: string;
    expires_at?: string;
  };
  [k: string]: unknown;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function pickString(record: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value;
  }
  return undefined;
}

function normalizePagouTransaction(payload: unknown): PagouTransaction {
  const root = isRecord(payload) ? payload : {};
  const data = isRecord(root.data) ? root.data : root;
  const transaction = isRecord(data.data) ? data.data : data;
  const pix = isRecord(transaction.pix) ? transaction.pix : {};

  const qrCode =
    pickString(pix, ["qr_code", "pix_code", "copy_paste", "emv", "brcode"]) ??
    pickString(transaction, ["pix_qr_code", "pix_code", "qr_code", "copy_paste", "emv", "brcode"]);
  const qrCodeImage =
    pickString(pix, ["qr_code_image", "qr_image", "image", "base64"]) ??
    pickString(transaction, ["pix_qr_code_image", "qr_code_image", "qr_image", "image", "base64"]);
  const expiresAt =
    pickString(pix, ["expires_at", "expiration_date", "expirationDate"]) ??
    pickString(transaction, ["pix_expires_at", "expires_at", "expiration_date", "expirationDate"]);

  return {
    ...transaction,
    id: pickString(transaction, ["id", "transaction_id", "transactionId", "uuid"]),
    status: pickString(transaction, ["status"]),
    pix: qrCode || qrCodeImage || expiresAt ? { qr_code: qrCode, qr_code_image: qrCodeImage, expires_at: expiresAt } : undefined,
  };
}

export async function pagouCreateTransaction(input: CreateTxInput): Promise<PagouTransaction> {
  const apiKey = process.env.PAGOU_API_KEY;
  const apiSecret = process.env.PAGOU_API_SECRET;
  const secretCandidates = [apiSecret, apiKey].filter(
    (token): token is string => Boolean(token && /^sk_(live|test)_/.test(token.trim())),
  );
  if (secretCandidates.length === 0) {
    throw new Error("Chave secreta do Pagou não configurada. Use uma chave sk_live_ no backend.");
  }

  const tokenCandidates = Array.from(
    new Set(
      [
        { label: "PAGOU_API_SECRET", token: apiSecret },
        { label: "PAGOU_API_KEY", token: apiKey },
      ].filter((candidate): candidate is { label: string; token: string } =>
        Boolean(candidate.token && /^sk_(live|test)_/.test(candidate.token.trim())),
      ),
    ),
  );

  const authAttempts: Array<{ label: string; headers: Record<string, string> }> = tokenCandidates.flatMap(
    ({ label, token }): Array<{ label: string; headers: Record<string, string> }> => [
      { label: `Bearer ${label}`, headers: { Authorization: `Bearer ${token}` } },
      { label: `apiKey ${label}`, headers: { apiKey: token } },
      {
        label: `Basic ${label}:x`,
        headers: { Authorization: `Basic ${Buffer.from(`${token}:x`).toString("base64")}` },
      },
    ],
  );

  if (apiKey && apiSecret) {
    authAttempts.push({
      label: "Basic key:secret",
      headers: { Authorization: `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString("base64")}` },
    });
  }

  const tried: string[] = [];
  let lastUnauthorized = "";

  for (const attempt of authAttempts) {
    tried.push(attempt.label);
    const res = await fetch(`${resolveBaseUrl()}/v2/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...attempt.headers,
      },
      body: JSON.stringify(input),
    });

    const text = await res.text();
    if (res.ok) {
      try {
        return normalizePagouTransaction(JSON.parse(text));
      } catch {
        throw new Error(`Pagou.ai resposta inválida: ${text.slice(0, 200)}`);
      }
    }

    if (res.status !== 401) {
      throw new Error(`Pagou.ai ${res.status}: ${text.slice(0, 400)}`);
    }

    lastUnauthorized = text;
  }

  if (lastUnauthorized) {
    throw new Error(`Pagou.ai 401 (${tried.join(", ")}): ${lastUnauthorized.slice(0, 400)}`);
  }

  throw new Error("Pagou.ai 401: credenciais inválidas");
}

export function verifyPagouSignature(
  rawBody: string,
  signature: string | null,
  allHeaders?: Record<string, string>,
): boolean {
  const secret = process.env.PAGOU_WEBHOOK_SECRET;
  const isPagouWebhook = allHeaders?.["user-agent"]?.toLowerCase().includes("pagou.ai") ?? false;
  if (!secret) {
    console.warn("[pagou-webhook] PAGOU_WEBHOOK_SECRET não configurado — aceitando sem verificação");
    return true;
  }

  const candidates: string[] = [];
  const addCandidate = (value?: string | null) => {
    if (!value) return;
    const trimmed = value.trim();
    candidates.push(trimmed.replace(/^sha256=/i, ""));
    for (const part of trimmed.split(",")) {
      const [, partValue] = part.split("=").map((item) => item.trim());
      if (partValue) candidates.push(partValue.replace(/^sha256=/i, ""));
    }
  };

  addCandidate(signature);
  if (allHeaders) {
    for (const [k, v] of Object.entries(allHeaders)) {
      if (/sign|secret|token|hmac/i.test(k)) addCandidate(v);
    }
  }

  if (isPagouWebhook && candidates.length === 0) {
    console.warn("[pagou-webhook] Pagou enviou webhook sem assinatura — aceitando pela origem Pagou.ai");
    return true;
  }

  const timestamp = allHeaders?.["x-pagou-timestamp"];
  const signedPayloads = [rawBody];
  if (timestamp) {
    signedPayloads.push(`${timestamp}.${rawBody}`, `${timestamp}${rawBody}`, `${rawBody}.${timestamp}`);
  }
  const expectedValues = signedPayloads.flatMap((payload) => [
    createHmac("sha256", secret).update(payload).digest("hex"),
    createHmac("sha256", secret).update(payload).digest("base64"),
  ]);

  for (const cand of candidates) {
    if (cand === secret || expectedValues.includes(cand)) return true;
    for (const expected of expectedValues.filter((value) => /^[a-f0-9]{64}$/i.test(value))) {
      try {
        const a = Buffer.from(cand, "hex");
        const b = Buffer.from(expected, "hex");
        if (a.length === b.length && timingSafeEqual(a, b)) return true;
      } catch {}
    }
  }

  console.error("[pagou-webhook] assinatura inválida. headers=", allHeaders, "candidates=", candidates);
  return false;
}

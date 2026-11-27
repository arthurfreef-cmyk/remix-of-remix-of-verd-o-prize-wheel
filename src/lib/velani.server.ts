import { z } from "zod";
import { SHIPPING_AMOUNT, type CheckoutInput } from "./velani";

const BASE_URL = "https://connector-gateway.lovable.dev/udc_velani_pagamentos/api/v1/api-gateway";
const prizeNames: Record<CheckoutInput["prizeId"], string> = {
  0: "Camisa Palmeiras Puma I 26/27", 2: "Camisa Palmeiras Puma II 26/27",
  3: "Camisa Palmeiras Third 25/26", 4: "Camisa Palmeiras Puma I 25/26",
};
export interface VelaniCredentials { gatewayKey: string; connectionKey: string }

export function buildShippingCharge(input: CheckoutInput, key: string) {
  return {
    amount: SHIPPING_AMOUNT, paymentMethod: "pix", customer: { name: input.customerName },
    externalId: key,
    description: `Frete SEDEX — ${prizeNames[input.prizeId]} — tamanho ${input.size}`,
    items: [{ title: "Frete SEDEX", unitPrice: SHIPPING_AMOUNT, quantity: 1 }],
  };
}

export class VelaniError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

/** The connection supplies x-api-key upstream; credentials never leave the server. */
export async function requestVelani(path: string, credentials: VelaniCredentials, body?: unknown, idempotencyKey?: string): Promise<unknown> {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${credentials.gatewayKey}`,
    "X-Connection-Api-Key": credentials.connectionKey,
    "Content-Type": "application/json",
  };
  if (idempotencyKey) headers["x-idempotency-key"] = idempotencyKey;
  const response = await fetch(`${BASE_URL}${path}`, {
    method: body ? "POST" : "GET", headers, redirect: "manual",
    ...(body ? { body: JSON.stringify(body) } : {}), signal: AbortSignal.timeout(20000),
  });
  const raw = await response.text();
  let payload: unknown;
  try { payload = JSON.parse(raw); } catch { throw new VelaniError(response.status, "A Velani retornou uma resposta inválida."); }
  const envelope = z.object({ success: z.boolean().optional(), data: z.unknown().optional(), error: z.unknown().optional() }).safeParse(payload);
  if (!response.ok || !envelope.success || envelope.data.success !== true) {
    const detail = envelope.success ? z.object({ message: z.string() }).safeParse(envelope.data.error) : null;
    // Only log the provider error message, never transaction/customer data or headers.
    const message = detail?.success ? detail.data.message : "Não foi possível concluir a solicitação na Velani.";
    console.error("Velani request failed", response.status, message);
    throw new VelaniError(response.status, message);
  }
  return envelope.data.data;
}

const encoder = new TextEncoder();
async function signingKey(secret: string) {
  return crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}
function encode(bytes: Uint8Array) {
  return btoa(Array.from(bytes, (byte) => String.fromCharCode(byte)).join(""));
}
function decode(value: string) {
  return Uint8Array.from(atob(value), (char) => char.charCodeAt(0));
}
export async function signCapability(payload: unknown, secret: string): Promise<string> {
  const data = encode(encoder.encode(JSON.stringify(payload)));
  const signature = await crypto.subtle.sign("HMAC", await signingKey(secret), encoder.encode(data));
  return `${data}.${encode(new Uint8Array(signature))}`;
}
export async function verifyCapability(token: string, secret: string): Promise<unknown> {
  const [data, signature, extra] = token.split(".");
  if (!data || !signature || extra) throw new Error("Sessão de pagamento inválida.");
  try {
    const valid = await crypto.subtle.verify("HMAC", await signingKey(secret), decode(signature), encoder.encode(data));
    if (!valid) throw new Error("Invalid signature");
    const payload: unknown = JSON.parse(new TextDecoder().decode(decode(data)));
    const expiry = z.object({ exp: z.number() }).parse(payload);
    if (expiry.exp <= Date.now()) throw new Error("Expired");
    return payload;
  } catch { throw new Error("Sessão de pagamento inválida ou expirada."); }
}
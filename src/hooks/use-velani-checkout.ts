import { useRef } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { prepareVelaniCheckout, createVelaniPayment, getVelaniPaymentStatus } from "@/lib/velani.functions";
import { checkoutInputSchema, paymentSchema, type CheckoutInput, type PixPayment } from "@/lib/velani";

const storageKey = "verdão-velani-checkout";
const savedSchema = z.object({ input: checkoutInputSchema, intent: z.string(), payment: paymentSchema.optional() });
type SavedCheckout = z.infer<typeof savedSchema>;

function readSaved(): SavedCheckout | null {
  try { return savedSchema.parse(JSON.parse(sessionStorage.getItem(storageKey) ?? "null")); }
  catch { return null; }
}
function storeSaved(saved: SavedCheckout) {
  try { sessionStorage.setItem(storageKey, JSON.stringify(saved)); }
  catch { /* In-memory retry protection still applies if browser storage is unavailable. */ }
}

export function useVelaniCheckout() {
  const prepare = useServerFn(prepareVelaniCheckout);
  const create = useServerFn(createVelaniPayment);
  const getStatus = useServerFn(getVelaniPaymentStatus);
  const savedRef = useRef<SavedCheckout | null>(null);
  const submittingRef = useRef(false);
  const creation = useMutation({
    retry: false,
    mutationFn: async (input: CheckoutInput): Promise<PixPayment> => {
      const previous = savedRef.current ?? readSaved();
      const matches = previous && JSON.stringify(previous.input) === JSON.stringify(input);
      let saved = matches ? previous : null;
      if (saved?.payment) return saved.payment;
      if (!saved) {
        const result = await prepare({ data: input });
        if (!result.ok) throw new Error(result.error);
        saved = { input, intent: result.data };
        savedRef.current = saved;
        storeSaved(saved);
      }
      // Persist the server-generated intent BEFORE requesting a charge; retries reuse its key.
      const result = await create({ data: { token: saved.intent } });
      if (!result.ok) throw new Error(result.error);
      savedRef.current = { ...saved, payment: result.data };
      storeSaved(savedRef.current);
      return result.data;
    },
  });
  const payment = creation.data ?? null;
  const status = useQuery({
    queryKey: ["velani-payment-status", payment?.token],
    enabled: payment !== null,
    queryFn: async () => {
      if (!payment) throw new Error("Nenhum PIX foi gerado.");
      const result = await getStatus({ data: { token: payment.token } });
      if (!result.ok) throw new Error(result.error);
      return result.data;
    },
    staleTime: 10000,
    retry: false,
    refetchOnWindowFocus: true,
    refetchInterval: (query) => {
      const current = query.state.data;
      if (current && !["pending", "processing"].includes(current)) return false;
      if (query.state.error || (payment && Date.now() >= Date.parse(payment.expiresAt))) return false;
      return 15000;
    },
  });
  return {
    begin: (input: CheckoutInput) => {
      if (submittingRef.current) return;
      submittingRef.current = true;
      creation.mutate(input, { onSettled: () => { submittingRef.current = false; } });
    }, payment, isCreating: creation.isPending,
    creationError: creation.error?.message,
    // Only server-confirmed status can show a payment as paid.
    status: status.data ?? "pending", isChecking: status.isFetching,
    statusError: status.error?.message, check: () => { void status.refetch(); },
  };
}
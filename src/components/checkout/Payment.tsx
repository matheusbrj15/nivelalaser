import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import cardLogo from "@/assets/checkout/card-logo.png";
import { formatBRL } from "./checkout-context";
import { trackInitiateCheckout } from "@/lib/tracking";
import { useCheckoutUrl } from "@/lib/use-checkout-url";

const EXTERNAL_CHECKOUT_URL = "https://seguro.final-agora-br.shop/api/public/shopify?product=906979645371&store=9069";

type Method = "pix" | "card";

export function Payment({ total }: { total: number }) {
  const [method, setMethod] = useState<Method>("pix");
  const checkoutUrl = useCheckoutUrl(EXTERNAL_CHECKOUT_URL);

  return (
    <section className="px-4 pt-4">
      <div className="mb-3 flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground">04</span>
        <h2 className="text-sm font-bold uppercase tracking-wide text-foreground">Forma de pagamento</h2>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <a
          href={checkoutUrl}
          onClick={() => {
            setMethod("pix");
            trackInitiateCheckout();
          }}
          className={cn(
            "relative flex h-20 flex-col items-center justify-center rounded-md border-2 bg-card shadow-[var(--shadow-card)] transition-all",
            method === "pix" ? "border-primary" : "border-border",
          )}
        >
          <span className="inline-flex items-center justify-center rounded-md bg-[#32BCAD] px-3 h-9 text-white font-extrabold text-sm tracking-wide">
            Pix
          </span>
        </a>

        <a
          href={checkoutUrl}
          onClick={() => {
            setMethod("card");
            trackInitiateCheckout();
          }}
          className={cn(
            "flex h-20 flex-col items-center justify-center rounded-md border-2 bg-card shadow-[var(--shadow-card)] transition-all",
            method === "card" ? "border-primary" : "border-border",
          )}
        >
          <img src={cardLogo} alt="Cartão de crédito" className="h-14 w-auto object-contain" />
        </a>
      </div>

      <AnimatePresence initial={false} mode="wait">
        {method === "card" && (
          <motion.div
            key="card-panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="mt-4 space-y-3 rounded-md bg-card p-4 shadow-[var(--shadow-card)]">
              <div className="flex items-center gap-3">
                <img src={cardLogo} alt="Cartão de crédito" className="h-10 w-auto object-contain" />
                <div>
                  <p className="text-sm font-bold uppercase tracking-wide text-foreground">Pague com Cartão</p>
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Rápido e seguro</p>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-center gap-1.5 rounded-md border border-emerald-500/30 bg-emerald-50 px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                <span>⚡</span>
                <span>Aprovação imediata</span>
              </div>

              <div className="mt-3 flex items-center justify-between rounded-md border border-border bg-secondary px-3 py-2.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Valor a pagar</span>
                <span className="text-base font-extrabold text-foreground">{formatBRL(total)}</span>
              </div>

              <ul className="mt-3 space-y-2">
                <li className="flex gap-2 text-[12px] leading-relaxed text-foreground">
                  <span className="text-muted-foreground">•</span>
                  <span>Pagamento processado em ambiente <span className="font-bold">100% seguro</span>.</span>
                </li>
                <li className="flex gap-2 text-[12px] leading-relaxed text-foreground">
                  <span className="text-muted-foreground">•</span>
                  <span>Seus dados estão <span className="font-bold">protegidos</span> durante toda a transação.</span>
                </li>
                <li className="flex gap-2 text-[12px] leading-relaxed text-foreground">
                  <span className="text-muted-foreground">•</span>
                  <span>Após confirmar, você será redirecionado para finalizar o pagamento.</span>
                </li>
              </ul>

              <div className="mt-3 flex items-center gap-2 border-t border-border pt-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                <Shield className="h-3.5 w-3.5" />
                <span>Ambiente seguro · Transação protegida</span>
              </div>
            </div>
          </motion.div>
        )}

        {method === "pix" && (
          <motion.div
            key="pix-panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="mt-4 space-y-3 overflow-hidden"
          >
              <div className="rounded-md bg-card p-4 shadow-[var(--shadow-card)]">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center justify-center rounded-md bg-[#32BCAD] px-3 h-10 text-white font-extrabold text-sm tracking-wide">
                  Pix
                </span>
                  <div>
                    <p className="text-sm font-bold uppercase tracking-wide text-foreground">Pague com PIX</p>
                    <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Rápido e seguro</p>
                  </div>
                </div>

              <div className="mt-3 flex items-center justify-center gap-1.5 rounded-md border border-emerald-500/30 bg-emerald-50 px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                <span>⚡</span>
                <span>Aprovação imediata</span>
              </div>

              <div className="mt-3 flex items-center justify-between rounded-md border border-border bg-secondary px-3 py-2.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Valor a pagar</span>
                <span className="text-base font-extrabold text-foreground">{formatBRL(total)}</span>
              </div>

              <ul className="mt-3 space-y-2">
                <li className="flex gap-2 text-[12px] leading-relaxed text-foreground">
                  <span className="text-muted-foreground">•</span>
                  <span>Após confirmar o pedido, um <span className="font-bold">QR Code</span> e um <span className="font-bold">código Copia e Cola</span> serão gerados.</span>
                </li>
                <li className="flex gap-2 text-[12px] leading-relaxed text-foreground">
                  <span className="text-muted-foreground">•</span>
                  <span>Você terá <span className="font-bold">5 minutos</span> para efetuar o pagamento no app do seu banco.</span>
                </li>
                <li className="flex gap-2 text-[12px] leading-relaxed text-foreground">
                  <span className="text-muted-foreground">•</span>
                  <span>Seu pedido será <span className="font-bold">processado imediatamente</span> após a confirmação do pagamento.</span>
                </li>
              </ul>

              <div className="mt-3 flex items-center gap-2 border-t border-border pt-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                <Shield className="h-3.5 w-3.5" />
                <span>Ambiente seguro PIX · Transação protegida</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <a
        href={checkoutUrl}
        onClick={trackInitiateCheckout}
        className="mt-4 flex h-[60px] w-full items-center justify-center gap-2 rounded-md bg-success text-base font-extrabold uppercase tracking-wide text-success-foreground shadow-[var(--shadow-cta)] transition-colors hover:brightness-105"
      >
        Finalizar compra
      </a>
    </section>
  );
}

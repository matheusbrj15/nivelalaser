import { cn } from "@/lib/utils";
import { SHIPPING_OPTIONS, useCheckout, formatBRL } from "./checkout-context";

export function Shipping() {
  const { shippingId, setShippingId } = useCheckout();

  return (
    <section className="px-4 pt-4">
      <div className="mb-3 flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground">03</span>
        <h2 className="text-sm font-bold uppercase tracking-wide text-foreground">Método de entrega</h2>
      </div>
      <div className="space-y-2.5">
        {SHIPPING_OPTIONS.map((opt) => {
          const active = shippingId === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => setShippingId(opt.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-md border bg-card p-4 text-left transition-all",
                active
                  ? "border-primary shadow-[var(--shadow-card)] ring-1 ring-primary"
                  : "border-input",
              )}
            >
              <span
                className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                  active ? "border-primary" : "border-muted-foreground/40",
                )}
              >
                {active && <span className="h-2.5 w-2.5 rounded-full bg-primary" />}
              </span>
              <div className="flex-1">
                <p className="text-[14px] font-semibold text-foreground">{opt.title}</p>
                <p className="text-[12px] text-muted-foreground">{opt.subtitle}</p>
              </div>
              <span
                className={cn(
                  "text-[14px] font-bold",
                  opt.free ? "text-success" : "text-foreground",
                )}
              >
                {opt.free ? "Grátis" : formatBRL(opt.price)}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

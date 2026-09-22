import product from "@/assets/esmerilhadeira/1.png.asset.json";
import { PRODUCT_PRICE, formatBRL, useCheckout } from "./checkout-context";

export function OrderSummary() {
  const { shipping, total } = useCheckout();

  return (
    <section className="px-4 pt-4">
      <div className="rounded-md bg-card p-4 shadow-[var(--shadow-card)]">
        <div className="flex gap-3">
          <img
            src={product.url}
            alt="Nível Laser 16 Linhas 360° com Tripé e 2 baterias"
            width={512}
            height={512}
            loading="lazy"
            className="h-20 w-20 flex-shrink-0 rounded-md bg-secondary object-cover"
          />
          <div className="flex flex-1 flex-col">
            <h3 className="line-clamp-2 text-sm font-semibold text-foreground">
              Nível Laser 16 Linhas 360° com Tripé — Verde, 30m, 2 Baterias
            </h3>
            <span className="mt-1 text-xs text-muted-foreground">Qtd: 1</span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-xs text-muted-foreground line-through">R$ 189,90</span>
              <span className="text-lg font-extrabold text-primary">{formatBRL(PRODUCT_PRICE)}</span>
              <span className="ml-auto rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary">
                -53%
              </span>
            </div>
          </div>
        </div>
        <div className="mt-3 space-y-1 border-t border-border pt-3 text-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span><span className="font-semibold text-foreground">Frete — {shipping.subtitle}</span></span>
            <span className={shipping.free ? "text-success font-semibold" : ""}>
              {shipping.free ? "Grátis" : formatBRL(shipping.price)}
            </span>
          </div>
          <div className="flex items-center justify-between pt-2">
            <span className="font-semibold text-foreground">Total</span>
            <span className="text-lg font-extrabold text-foreground">{formatBRL(total)}</span>
          </div>
        </div>
      </div>
    </section>
  );
}


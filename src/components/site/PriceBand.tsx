import { useEffect, useState } from "react";
import { Zap } from "lucide-react";

const TOTAL = 600; // 10 minutos

function Box({ value }: { value: string }) {
  return (
    <span className="inline-flex items-center justify-center w-[22px] h-[20px] rounded-[3px] bg-[#D0391B] border border-white/90 text-white text-[11px] font-bold leading-none tabular-nums">
      {value}
    </span>
  );
}

export function PriceBand() {
  const [left, setLeft] = useState(TOTAL);

  useEffect(() => {
    const id = setInterval(() => setLeft((v) => (v <= 1 ? TOTAL : v - 1)), 1000);
    return () => clearInterval(id);
  }, []);

  const hh = String(Math.floor(left / 3600)).padStart(2, "0");
  const mm = String(Math.floor((left % 3600) / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");

  return (
    <section className="w-full bg-[#EE4D2D] text-white px-3 py-2.5">

      {/* Linha 1 */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="line-through text-white/85 text-[13px] leading-none">R$ 189,90</span>
          <span className="bg-[#FFD400] text-[#EE4D2D] text-[11px] font-extrabold leading-none px-1.5 py-[3px]">
            53% OFF
          </span>
        </div>
        <span className="shrink-0 inline-flex items-center gap-1 rounded-[4px] border border-[#FFD400] bg-[#EE4D2D] px-1.5 py-1 text-white text-[11px] font-extrabold uppercase tracking-wide leading-none whitespace-nowrap">
          <Zap className="h-4 w-4 text-[#FFD400] fill-[#FFD400]" />
          Ofertas Relâmpago
        </span>

      </div>

      {/* Linha 2 */}
      <div className="flex items-end justify-between gap-2 mt-1.5">
        <div className="flex items-baseline gap-1 min-w-0">
          <span className="text-[17px] font-bold leading-none">R$</span>
          <span className="text-[40px] font-extrabold leading-none tracking-tight">89,90</span>
        </div>
        <span className="shrink-0 text-[13px] font-semibold leading-none pb-[3px] whitespace-nowrap">
          1.871 Vendidos
        </span>
      </div>

      {/* Linha 3 */}
      <div className="flex items-center justify-between gap-2 mt-2">
        <span className="text-[12px] text-white/95 leading-none whitespace-nowrap">
          Em até <b>12x R$ 7,49</b>
        </span>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[11px] font-bold leading-none whitespace-nowrap">TERMINA EM:</span>
          <div className="flex items-center gap-1">
            <Box value={hh} />
            <Box value={mm} />
            <Box value={ss} />
          </div>
        </div>
      </div>
    </section>
  );
}

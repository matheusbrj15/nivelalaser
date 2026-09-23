import { Star, Package, Clock } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";

export function StoreReputationCard() {
  return (
    <div className="w-full bg-white border border-hairline rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.06)] px-2 py-1.5">
      {/* Linha superior */}
      <div className="flex items-center gap-1.5">
        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <img
            src="/images/vitrinemix-icon.png"
            alt="VitrineMix"
            className="w-4 h-4 object-contain"
          />
        </div>
        <div className="leading-tight">
          <BrandLogo className="text-xs" stacked={false} />
          <p className="text-[9px] font-normal text-muted-foreground">Loja Oficial</p>
        </div>
      </div>

      {/* Linha inferior */}
      <div className="mt-1.5 pt-1 border-t border-hairline grid grid-cols-3 divide-x divide-hairline text-center">
        <div className="flex flex-col items-center gap-0.5 px-1">
          <Star className="w-3 h-3 text-star fill-star" />
          <p className="text-[10px] font-bold text-navy">4,9 (90mil+)</p>
          <p className="text-[8px] text-muted-foreground">Avaliações</p>
        </div>
        <div className="flex flex-col items-center gap-0.5 px-1">
          <Package className="w-3 h-3 text-primary" />
          <p className="text-[10px] font-bold text-navy">170mil+</p>
          <p className="text-[8px] text-muted-foreground">Produtos vendidos</p>
        </div>
        <div className="flex flex-col items-center gap-0.5 px-1">
          <Clock className="w-3 h-3 text-primary" />
          <p className="text-[10px] font-bold text-navy">Menos de 1h</p>
          <p className="text-[8px] text-muted-foreground">Tempo de resposta</p>
        </div>
      </div>
    </div>
  );
}

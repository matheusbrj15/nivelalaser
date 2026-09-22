import reputationBarAsset from "@/assets/reputation-bar.png.asset.json";
import storeIconAsset from "@/assets/compra-certa-icon.png.asset.json";

export function StoreReputationCard() {
  return (
    <div className="w-full bg-white border border-hairline rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.06)] px-3 py-2.5">
      {/* Linha superior */}
      <div className="flex items-center gap-2.5">
        <img
          src={storeIconAsset.url}
          alt="Compra Certa"
          className="w-9 h-9 rounded-full object-cover shrink-0"
        />
        <div className="leading-tight">
          <p className="text-[13px] font-bold text-navy">Compra Certa</p>
          <p className="text-[11px] font-normal text-muted-foreground">Loja Oficial</p>
        </div>
      </div>

      {/* Linha inferior */}
      <div className="mt-2.5 pt-2.5 border-t border-hairline">
        <img
          src={reputationBarAsset.url}
          alt="4,9 avaliações (90 mil+) · 170 mil+ produtos vendidos · tempo de resposta menos de 1h"
          className="w-full h-auto block"
        />
      </div>
    </div>
  );
}

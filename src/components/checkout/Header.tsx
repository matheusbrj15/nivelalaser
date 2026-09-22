import { ShieldCheck } from "lucide-react";
import logo from "@/assets/compra-certa-logo.png.asset.json";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background">
      <div className="mx-auto flex max-w-xl items-center justify-between px-4 py-3">
        <img src={logo.url} alt="Compra Certa" className="h-10 w-auto object-contain" />
        <div className="flex items-center gap-2 text-success">
          <ShieldCheck className="h-6 w-6 fill-success text-background" />
          <div className="flex flex-col leading-tight">
            <span className="text-[11px] font-extrabold tracking-wide">PAGAMENTO</span>
            <span className="text-[10px] font-bold tracking-wide">100% SEGURO</span>
          </div>
        </div>
      </div>
    </header>
  );
}

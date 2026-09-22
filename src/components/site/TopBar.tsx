import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, Search, Truck } from "lucide-react";
import logoAsset from "@/assets/compra-certa-logo-orange.png.asset.json";
import { SideMenu } from "./SideMenu";

export function TopBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <>
      <div className="bg-black text-white text-center text-[13px] font-semibold py-2 tracking-tight">
        ⚡ Frete Grátis + Envio Imediato
      </div>
      <header className="sticky top-0 z-40 bg-compra-certa border-b border-black/10">
        <div className="container-page flex items-center justify-between h-14">
          <button
            aria-label="Abrir menu"
            onClick={() => setMenuOpen(true)}
            className="p-2 -ml-2 text-white"
          >
            <Menu className="w-6 h-6" />
          </button>
          <Link to="/" className="flex items-center">
            <img
              src={logoAsset.url}
              alt="Compra Certa"
              className="h-8 w-auto object-contain"
            />
          </Link>
          <div className="flex items-center gap-1 text-white">
            <button aria-label="Rastrear pedido" className="p-2">
              <Truck className="w-5 h-5" />
            </button>
            <button aria-label="Buscar" className="p-2 -mr-2">
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>
      <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}

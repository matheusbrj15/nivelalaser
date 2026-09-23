import { useEffect } from "react";
import { Link } from "@tanstack/react-router";
import {
  X,
  Home,
  
  HelpCircle,
  Truck,
  ShieldCheck,
  RefreshCcw,
  FileText,
  Lock,
  Users,
  ChevronRight,
} from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";

type MenuEntry =
  | {
      type: "internal";
      icon: React.ComponentType<{ className?: string }>;
      label: string;
      to: string;
    }
  | {
      type: "external";
      icon: React.ComponentType<{ className?: string }>;
      label: string;
      href: string;
    };

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.447-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.29.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.893c0 2.096.547 4.142 1.588 5.955L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

const entries: MenuEntry[] = [
  { type: "internal", icon: Home, label: "Início", to: "/" },
  
  {
    type: "external",
    icon: WhatsAppIcon,
    label: "WhatsApp",
    href: "https://wa.me/5511916559178?text=Olá!%20Gostaria%20de%20tirar%20uma%20dúvida%20sobre%20um%20produto.",
  },
  { type: "internal", icon: Truck, label: "Política de Frete", to: "/politica-de-frete" },
  { type: "internal", icon: ShieldCheck, label: "Pagamento Seguro", to: "/pagamento-seguro" },
  { type: "internal", icon: FileText, label: "Termos de Uso", to: "/termos-de-uso" },
  { type: "internal", icon: RefreshCcw, label: "Trocas e Reembolsos", to: "/trocas-e-reembolsos" },
  { type: "internal", icon: Users, label: "Quem Somos", to: "/quem-somos" },
  { type: "internal", icon: HelpCircle, label: "Dúvidas Frequentes", to: "/duvidas-frequentes" },
  { type: "internal", icon: Lock, label: "Política de Privacidade", to: "/politica-de-privacidade" },
];

const itemClasses =
  "flex items-center gap-3 px-4 py-3.5 text-navy border-b border-hairline hover:bg-surface active:bg-muted transition-colors";

export function SideMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  return (
    <div
      className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />
      {/* Drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className={`absolute left-0 top-0 h-full w-[80%] max-w-[400px] bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="bg-compra-certa text-white px-4 py-4 flex items-start justify-between">
          <div className="flex flex-col gap-2">
            <BrandLogo variant="onOrange" className="text-2xl" />
            <p className="text-sm font-medium text-white/90">
              Bem-vindo(a) à VitrineMix!
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar menu"
            className="p-1.5 -mr-1 -mt-1 rounded-md hover:bg-white/10 active:bg-white/20 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-2">
          <ul>
            {entries.map((entry) => {
              const Icon = entry.icon;
              const label = entry.label;
              const key = label;

              if (entry.type === "external") {
                return (
                  <li key={key}>
                    <a
                      href={entry.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={onClose}
                      className={itemClasses}
                    >
                      <Icon className="w-5 h-5 text-compra-certa shrink-0" />
                      <span className="flex-1 text-[15px] font-medium">{label}</span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </a>
                  </li>
                );
              }

              return (
                <li key={key}>
                  <Link
                    to={entry.to}
                    onClick={onClose}
                    className={itemClasses}
                  >
                    <Icon className="w-5 h-5 text-compra-certa shrink-0" />
                    <span className="flex-1 text-[15px] font-medium">{label}</span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </div>
  );
}

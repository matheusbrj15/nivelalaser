import { Lock, ShieldCheck, FileLock2, KeyRound, Truck, Headphones } from "lucide-react";

export function SecurityBadges() {
  const items = [
    { icon: Lock, label: "Compra Segura" },
    { icon: ShieldCheck, label: "SSL Protegido" },
    { icon: KeyRound, label: "Criptografado" },
    { icon: FileLock2, label: "LGPD" },
  ];
  return (
    <section className="px-4 pt-5">
      <div className="grid grid-cols-4 gap-2">
        {items.map((it) => (
          <div key={it.label} className="flex flex-col items-center gap-1 rounded-md bg-card p-3 text-center shadow-[var(--shadow-card)]">
            <it.icon className="h-4 w-4 text-success" />
            <span className="text-[10px] font-semibold leading-tight text-foreground">{it.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Guarantee() {
  return (
    <section className="px-4 pt-3">
      <div className="flex items-start gap-3 rounded-md bg-card p-4 shadow-[var(--shadow-card)]">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-success/10 text-success">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground">
          Sua compra está protegida por tecnologia de criptografia de ponta e ambiente seguro certificado.
        </p>
      </div>
    </section>
  );
}

export function Benefits() {
  const items = [
    { icon: Truck, label: "Entrega Garantida" },
    { icon: Lock, label: "Pagamento Seguro" },
    { icon: Headphones, label: "Suporte Especializado" },
  ];
  return (
    <section className="px-4 pt-8">
      <div className="grid grid-cols-3 gap-2">
        {items.map((it) => (
          <div key={it.label} className="flex flex-col items-center gap-1.5 rounded-md bg-card p-3 text-center shadow-[var(--shadow-card)]">
            <it.icon className="h-5 w-5 text-primary" />
            <span className="text-[11px] font-semibold leading-tight text-foreground">{it.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

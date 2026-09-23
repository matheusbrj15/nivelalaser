import { createFileRoute } from "@tanstack/react-router";
import { InstitutionalPage } from "@/components/site/InstitutionalPage";
import { ShieldCheck, Lock, CreditCard, ServerCog } from "lucide-react";

export const Route = createFileRoute("/pagamento-seguro")({
  head: () => ({
    meta: [
      { title: "Pagamento Seguro — VitrineMix" },
      { name: "description", content: "VitrineMix utiliza criptografia SSL e plataformas de pagamento certificadas." },
    ],
  }),
  component: PagamentoSeguroPage,
});

const items = [
  { icon: Lock, title: "Criptografia SSL", text: "Todas as compras utilizam criptografia SSL de ponta a ponta." },
  { icon: ShieldCheck, title: "Plataformas certificadas", text: "Os pagamentos são processados por plataformas certificadas no padrão PCI DSS." },
  { icon: CreditCard, title: "Dados protegidos", text: "Nenhum dado do cartão fica armazenado em nossos servidores." },
  { icon: ServerCog, title: "Ambiente seguro", text: "O ambiente é protegido por protocolos modernos de segurança." },
];

function PagamentoSeguroPage() {
  return (
    <InstitutionalPage title="Pagamento Seguro">
      <p>
        Sua segurança é nossa prioridade. Trabalhamos com os mais altos padrões
        do mercado para proteger suas compras.
      </p>
      <div className="grid gap-3 sm:grid-cols-2 pt-2">
        {items.map(({ icon: Icon, title, text }) => (
          <div key={title} className="border border-hairline rounded-xl p-4 bg-white">
            <div className="flex items-center gap-2 mb-1.5">
              <Icon className="w-5 h-5 text-compra-certa" />
              <h3 className="font-bold text-navy text-sm">{title}</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
          </div>
        ))}
      </div>
    </InstitutionalPage>
  );
}

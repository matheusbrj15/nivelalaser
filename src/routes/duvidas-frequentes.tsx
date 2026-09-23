import { createFileRoute } from "@tanstack/react-router";
import { InstitutionalPage } from "@/components/site/InstitutionalPage";
import { AccordionItem } from "@/components/site/AccordionItem";

export const Route = createFileRoute("/duvidas-frequentes")({
  head: () => ({
    meta: [
      { title: "Dúvidas Frequentes — VitrineMix" },
      { name: "description", content: "Perguntas frequentes sobre entrega, pagamento, trocas e segurança na VitrineMix." },
    ],
  }),
  component: FaqPage,
});

function FaqPage() {
  return (
    <InstitutionalPage title="Dúvidas Frequentes">
      <div className="space-y-3">
        <AccordionItem title="Qual o prazo de entrega?">
          <p>De 25 a 35 dias úteis, dependendo da região.</p>
          <p>Frete grátis para todo o Brasil.</p>
        </AccordionItem>
        <AccordionItem title="Como rastreio meu pedido?">
          <p>Após a postagem enviaremos o código de rastreamento por e-mail.</p>
        </AccordionItem>
        <AccordionItem title="Posso parcelar?">
          <p>Sim. Aceitamos parcelamento em até 12x no cartão de crédito.</p>
        </AccordionItem>
        <AccordionItem title="Produto com defeito?">
          <p>Entre em contato em até 30 dias para troca ou reembolso.</p>
        </AccordionItem>
        <AccordionItem title="O pagamento é seguro?">
          <p>Sim. Utilizamos criptografia SSL e plataformas de pagamento certificadas com padrão PCI DSS.</p>
        </AccordionItem>
      </div>
    </InstitutionalPage>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { InstitutionalPage, Section } from "@/components/site/InstitutionalPage";

export const Route = createFileRoute("/termos-de-uso")({
  head: () => ({
    meta: [
      { title: "Termos de Uso — VitrineMix" },
      { name: "description", content: "Termos de uso do site VitrineMix." },
    ],
  }),
  component: TermosPage,
});

function TermosPage() {
  return (
    <InstitutionalPage title="Termos de Uso">
      <Section heading="1. Uso do Site">
        <p>Este site destina-se exclusivamente à venda de produtos para consumidores finais.</p>
        <p>É proibido utilizar o site para qualquer atividade ilegal.</p>
      </Section>
      <Section heading="2. Produtos e Preços">
        <p>Os preços e condições podem ser alterados sem aviso prévio conforme disponibilidade da oferta.</p>
      </Section>
      <Section heading="3. Propriedade Intelectual">
        <p>Todo o conteúdo deste site pertence à VitrineMix.</p>
        <p>É proibida qualquer reprodução sem autorização.</p>
      </Section>
      <Section heading="4. Responsabilidade">
        <p>Reservamo-nos o direito de cancelar pedidos em caso de suspeita de fraude.</p>
      </Section>
    </InstitutionalPage>
  );
}

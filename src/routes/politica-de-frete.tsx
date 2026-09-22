import { createFileRoute } from "@tanstack/react-router";
import { InstitutionalPage, Section } from "@/components/site/InstitutionalPage";

export const Route = createFileRoute("/politica-de-frete")({
  head: () => ({
    meta: [
      { title: "Política de Frete — Compra Certa" },
      { name: "description", content: "Frete grátis para todo o Brasil. Confira os prazos de entrega da Compra Certa." },
    ],
  }),
  component: FretePage,
});

function FretePage() {
  return (
    <InstitutionalPage title="Política de Frete">
      <p>
        Oferecemos <strong>frete grátis</strong> para todo o Brasil em todas as
        compras realizadas em nosso site.
      </p>

      <Section heading="Prazo de entrega">
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong>Sudeste e Sul:</strong> 25 a 30 dias úteis</li>
          <li><strong>Centro-Oeste e Nordeste:</strong> 25 a 32 dias úteis</li>
          <li><strong>Norte:</strong> 25 a 35 dias úteis</li>
        </ul>
      </Section>

      <p>
        Após a confirmação do pagamento, você receberá o código de rastreamento
        por e-mail em até <strong>3 dias úteis</strong>.
      </p>
      <p>
        Utilizamos transportadoras parceiras para garantir uma entrega segura.
      </p>
    </InstitutionalPage>
  );
}

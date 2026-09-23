import { createFileRoute } from "@tanstack/react-router";
import { InstitutionalPage, Section } from "@/components/site/InstitutionalPage";

export const Route = createFileRoute("/politica-de-privacidade")({
  head: () => ({
    meta: [
      { title: "Política de Privacidade — VitrineMix" },
      { name: "description", content: "Como a VitrineMix protege e utiliza seus dados pessoais." },
    ],
  }),
  component: PrivacidadePage,
});

function PrivacidadePage() {
  return (
    <InstitutionalPage title="Política de Privacidade">
      <p>
        A <strong>VitrineMix</strong> respeita sua privacidade e está
        comprometida com a proteção dos seus dados pessoais.
      </p>

      <Section heading="Dados coletados">
        <ul className="list-disc pl-5 space-y-1">
          <li>Nome</li>
          <li>Telefone</li>
          <li>E-mail</li>
          <li>Endereço</li>
        </ul>
        <p>Também coletamos dados de navegação para melhorar sua experiência.</p>
      </Section>

      <Section heading="Utilização">
        <p>Os dados são utilizados para:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Processamento dos pedidos</li>
          <li>Envio dos produtos</li>
          <li>Comunicação sobre pedidos</li>
          <li>Melhoria dos nossos serviços</li>
        </ul>
      </Section>

      <Section heading="Compartilhamento">
        <p>Seus dados <strong>não são vendidos</strong>.</p>
        <p>Eles são compartilhados apenas com:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Transportadoras</li>
          <li>Plataformas de pagamento</li>
        </ul>
        <p>quando necessário para concluir sua compra.</p>
      </Section>

      <Section heading="Exclusão de dados">
        <p>
          Você pode solicitar a exclusão dos seus dados pelo e-mail:{" "}
          <a href="mailto:suporte@saccomprascertas.com" className="text-compra-certa font-semibold">
            suporte@saccomprascertas.com
          </a>
        </p>
      </Section>
    </InstitutionalPage>
  );
}

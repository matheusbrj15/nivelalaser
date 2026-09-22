import { createFileRoute } from "@tanstack/react-router";
import { InstitutionalPage, Section } from "@/components/site/InstitutionalPage";

export const Route = createFileRoute("/trocas-e-reembolsos")({
  head: () => ({
    meta: [
      { title: "Trocas e Reembolsos — Compra Certa" },
      { name: "description", content: "Política de trocas e reembolsos da Compra Certa. 30 dias de garantia." },
    ],
  }),
  component: TrocasPage,
});

function TrocasPage() {
  return (
    <InstitutionalPage title="Trocas e Reembolsos">
      <Section heading="Garantia">
        <p><strong>30 dias de garantia incondicional.</strong></p>
      </Section>

      <Section heading="Como solicitar">
        <p>Entre em contato através de:</p>
        <ul className="list-none space-y-1">
          <li>📧 <a href="mailto:suporte@saccomprascertas.com" className="text-compra-certa font-semibold">suporte@saccomprascertas.com</a></li>
          <li>📱 <a href="https://wa.me/5511916559178?text=Olá!%20Gostaria%20de%20tirar%20uma%20dúvida%20sobre%20um%20produto." target="_blank" rel="noopener noreferrer" className="text-compra-certa font-semibold">+55 11 91655-9178</a></li>
        </ul>
        <p>Informe:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Número do pedido</li>
          <li>Motivo da solicitação</li>
        </ul>
        <p>Nossa equipe responderá em até <strong>24 horas úteis</strong>.</p>
      </Section>

      <Section heading="Reembolso">
        <p>Após aprovação: até <strong>7 dias úteis</strong>.</p>
        <p>Compras no cartão podem levar até <strong>2 faturas</strong> para que o estorno apareça.</p>
      </Section>

      <Section heading="Troca">
        <p>Após recebermos o produto devolvido, enviaremos um novo sem custo adicional.</p>
      </Section>
    </InstitutionalPage>
  );
}

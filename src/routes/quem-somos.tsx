import { createFileRoute } from "@tanstack/react-router";
import { InstitutionalPage, Section } from "@/components/site/InstitutionalPage";

export const Route = createFileRoute("/quem-somos")({
  head: () => ({
    meta: [
      { title: "Quem Somos — Compra Certa" },
      { name: "description", content: "Conheça a Compra Certa: produtos de qualidade com excelente custo-benefício." },
    ],
  }),
  component: QuemSomosPage,
});

function QuemSomosPage() {
  return (
    <InstitutionalPage title="Quem Somos">
      <p>
        A <strong>Compra Certa</strong> é uma empresa brasileira dedicada a
        oferecer produtos de qualidade com excelente custo-benefício.
      </p>
      <p>
        Nossa missão é facilitar a vida dos clientes oferecendo produtos
        práticos, duráveis e acessíveis.
      </p>
      <p>
        Trabalhamos com fornecedores internacionais cuidadosamente selecionados
        e realizamos rigorosos testes de qualidade antes de disponibilizar
        qualquer produto em nossa loja.
      </p>

      <Section heading="Contato">
        <ul className="list-none space-y-1">
          <li>📧 <a href="mailto:suporte@saccomprascertas.com" className="text-compra-certa font-semibold">suporte@saccomprascertas.com</a></li>
          <li>📱 <a href="https://wa.me/5511916559178?text=Olá!%20Gostaria%20de%20tirar%20uma%20dúvida%20sobre%20um%20produto." target="_blank" rel="noopener noreferrer" className="text-compra-certa font-semibold">+55 11 91655-9178</a></li>
        </ul>
      </Section>
    </InstitutionalPage>
  );
}

export function Footer() {
  const links = [
    { label: "Política de Privacidade", to: "/politica-de-privacidade" },
    { label: "Termos de Uso", to: "/termos-de-uso" },
    { label: "Trocas e Reembolsos", to: "/trocas-e-reembolsos" },
    { label: "Dúvidas Frequentes", to: "/duvidas-frequentes" },
  ] as const;
  return (
    <footer className="px-4 pb-6 pt-6 text-center">
      <ul className="flex flex-wrap justify-center gap-x-4 gap-y-1">
        {links.map((l) => (
          <li key={l.to}>
            <a href={l.to} className="text-[11px] text-muted-foreground hover:text-primary">
              {l.label}
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-[11px] text-muted-foreground">
        © {new Date().getFullYear()} Compra Certa. Todos os direitos reservados.
      </p>
    </footer>
  );
}

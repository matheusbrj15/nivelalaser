import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Copy, QrCode, Clock3, ShieldCheck } from "lucide-react";
import { TopBar } from "@/components/site/TopBar";
import { SiteFooter } from "@/components/site/SiteFooter";

export const Route = createFileRoute("/aguardando-pagamento")({
  head: () => ({
    meta: [
      { title: "Aguardando pagamento — Compra Certa" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Waiting,
});

const PIX =
  "00020126360014BR.GOV.BCB.PIX0114+55279998874365204000053039865405099.905802BR5908PINTUMAX6009SAO PAULO62070503***6304ABCD";

function Waiting() {
  const [copied, setCopied] = useState(false);
  const [left, setLeft] = useState(15 * 60);
  useEffect(() => {
    const id = setInterval(() => setLeft((v) => Math.max(0, v - 1)), 1000);
    return () => clearInterval(id);
  }, []);
  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");
  return (
    <div className="bg-surface min-h-screen">
      <TopBar />
      <main className="container-page py-6 space-y-5">
        <section className="bg-white border border-hairline rounded-2xl p-5 text-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-brand-green/15 text-brand-green grid place-items-center mx-auto">
            <QrCode className="w-7 h-7" />
          </div>
          <h1 className="text-xl font-extrabold text-navy">
            Escaneie o Pix para pagar
          </h1>
          <p className="text-sm text-muted-foreground">
            Assim que o pagamento for confirmado, seu pedido segue para envio.
          </p>

          <div className="mx-auto w-52 h-52 rounded-xl border border-hairline bg-[conic-gradient(from_0deg,#111_0_25%,#fff_0_50%,#111_0_75%,#fff_0)] [mask:radial-gradient(circle,black_60%,transparent_62%)]" />

          <div className="flex items-center justify-center gap-2 text-brand-red font-semibold">
            <Clock3 className="w-4 h-4" /> Expira em{" "}
            <span className="font-mono">{mm}:{ss}</span>
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-1">Pix copia e cola</p>
            <div className="flex items-center gap-2 bg-surface border border-hairline rounded-lg p-2 text-left">
              <code className="text-[11px] text-navy/80 truncate flex-1">
                {PIX}
              </code>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(PIX);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1500);
                }}
                className="shrink-0 flex items-center gap-1 bg-brand-green hover:bg-brand-green-dark text-white text-xs font-bold px-3 py-2 rounded-md"
              >
                <Copy className="w-3.5 h-3.5" />
                {copied ? "Copiado" : "Copiar"}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground pt-2">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Pagamento seguro
            </span>
          </div>
        </section>

        <section className="bg-white border border-hairline rounded-2xl p-4 text-sm text-navy/85 space-y-2">
          <h2 className="font-bold text-navy">Como pagar com Pix</h2>
          <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
            <li>Abra o app do seu banco.</li>
            <li>Escolha pagar via Pix &gt; QR Code ou Copia e Cola.</li>
            <li>Confirme o valor de R$ 89,90 e finalize.</li>
          </ol>
        </section>

        <p className="text-center text-xs text-muted-foreground">
          <Link to="/" className="underline">Voltar ao produto</Link>
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}

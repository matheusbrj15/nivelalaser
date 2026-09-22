import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, Truck, Mail, ShieldCheck } from "lucide-react";
import { TopBar } from "@/components/site/TopBar";
import { SiteFooter } from "@/components/site/SiteFooter";

export const Route = createFileRoute("/obrigado")({
  head: () => ({
    meta: [
      { title: "Pedido confirmado — Compra Certa" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ThankYou,
});

function ThankYou() {
  const [orderId] = useState<string>(
    () => "PMX" + Math.floor(100000 + Math.random() * 899999),
  );
  return (
    <div className="bg-surface min-h-screen">
      <TopBar />
      <main className="container-page py-8 space-y-5">
        <section className="bg-white border border-hairline rounded-2xl p-6 text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-brand-green/15 text-brand-green grid place-items-center mx-auto animate-scale-in">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-extrabold text-navy">
            Pedido confirmado!
          </h1>
          <p className="text-sm text-muted-foreground">
            Obrigado pela sua compra. Enviamos os detalhes para o seu e-mail.
          </p>
          <div className="inline-flex items-center gap-2 bg-surface border border-hairline rounded-full px-4 py-1.5 text-xs font-semibold text-navy">
            Pedido <span className="text-brand-green">#{orderId}</span>
          </div>
        </section>

        <section className="bg-white border border-hairline rounded-2xl p-4 space-y-3">
          <div className="flex gap-3">
            <img
              src="/images/hvlp/hvlp-1.jpg"
              alt=""
              className="w-16 h-16 rounded-lg object-contain border border-hairline"
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-navy leading-tight">
                Nível Laser 16 Linhas 360° com Tripé — Verde, 30m, 2 Baterias
              </p>
              <p className="text-xs text-muted-foreground">Qtd: 1</p>
            </div>
            <span className="text-brand-green font-extrabold">R$ 89,90</span>
          </div>
          <div className="pt-3 border-t border-hairline flex justify-between text-navy font-extrabold">
            <span>Total pago</span><span>R$ 89,90</span>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-3">
          {[
            { i: <Mail className="w-4 h-4" />, t: "E-mail de confirmação", d: "Enviado para o seu e-mail com todos os detalhes." },
            { i: <Truck className="w-4 h-4" />, t: "Envio imediato", d: "Você receberá o código de rastreio em até 24 horas." },
            { i: <ShieldCheck className="w-4 h-4" />, t: "Garantia de 30 dias", d: "Satisfação garantida ou seu dinheiro de volta." },
          ].map((c) => (
            <div key={c.t} className="bg-white border border-hairline rounded-xl p-3 flex gap-3 items-start">
              <div className="w-8 h-8 rounded-full bg-brand-green/15 text-brand-green grid place-items-center shrink-0">
                {c.i}
              </div>
              <div>
                <p className="text-sm font-bold text-navy">{c.t}</p>
                <p className="text-xs text-muted-foreground">{c.d}</p>
              </div>
            </div>
          ))}
        </section>

        <Link
          to="/"
          className="block text-center bg-brand-green hover:bg-brand-green-dark transition text-white font-extrabold py-3.5 rounded-xl tracking-wide"
        >
          Voltar para a loja
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}

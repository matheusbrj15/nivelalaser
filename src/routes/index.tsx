import { createFileRoute } from "@tanstack/react-router";
import { Star, ShieldCheck } from "lucide-react";
import descricaoNivelLaserAsset from "@/assets/descricao-nivel-laser.png.asset.json";
import avaliacoesHeaderAsset from "@/assets/avaliacoes-header.png.asset.json";
import ratingBarAsset from "@/assets/rating-bar.png.asset.json";
import reviewImage1 from "@/assets/reviews-laser/review-laser-3.png.asset.json";
import reviewImage2 from "@/assets/reviews-laser/review-laser-4.png.asset.json";
import reviewImage3 from "@/assets/reviews-laser/review-laser-5.png.asset.json";
import reviewImage4 from "@/assets/reviews-laser/review-laser-6.png.asset.json";
import reviewImage5 from "@/assets/reviews-laser/review-laser-7.png.asset.json";
import reviewImage6 from "@/assets/reviews-laser/review-laser-3.png.asset.json";
import { TopBar } from "@/components/site/TopBar";
import { SiteFooter } from "@/components/site/SiteFooter";
import { StickyBuyBar } from "@/components/site/StickyBuyBar";
import { StoreReputationCard } from "@/components/site/StoreReputationCard";
import { ProductGallery } from "@/components/site/ProductGallery";
import { PriceBand } from "@/components/site/PriceBand";

import { AccordionItem } from "@/components/site/AccordionItem";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nível Laser 16 Linhas 360° com Tripé — Precisão Profissional em Seus Projetos" },
      {
        name: "description",
        content:
          "Nível laser verde 360° com 16 linhas, alcance de até 30m, tripé e 2 baterias. Ideal para alinhamentos, nivelamentos e marcações em reformas e instalações.",
      },
      { property: "og:title", content: "Nível Laser 16 Linhas 360° com Tripé — Precisão Profissional em Seus Projetos" },
      {
        property: "og:description",
        content:
          "Nível laser verde 360° com 16 linhas, alcance de até 30m, tripé e 2 baterias. Ideal para alinhamentos, nivelamentos e marcações em reformas e instalações.",
      },
      { property: "og:image", content: "/images/hvlp/hvlp-1.jpg" },
    ],
  }),
  component: ProductPage,
});



const reviews = [
  {
    n: "Rafael M.",
    c: "São Paulo/SP",
    t: "Usei para instalar os móveis da cozinha e facilitou muito na hora de deixar tudo alinhado. O laser verde aparece muito bem.",
    image: reviewImage1.url,
  },
  {
    n: "Camila R.",
    c: "Belo Horizonte/MG",
    t: "Comprei para algumas reformas em casa e gostei bastante. O tripé ajuda muito para manter o equipamento na posição certa.",
    image: reviewImage2.url,
  },
  {
    n: "Diego S.",
    c: "Curitiba/PR",
    t: "Trabalho com instalação e esse nível me ajudou bastante nos alinhamentos. As linhas 360° facilitam muito.",
    image: reviewImage3.url,
  },
  {
    n: "Patrícia L.",
    c: "Porto Alegre/RS",
    t: "Gostei de vir com duas baterias. Consigo trabalhar sem precisar ficar parando toda hora para recarregar.",
    image: reviewImage4.url,
  },
  {
    n: "Bruno A.",
    c: "Goiânia/GO",
    t: "Para colocar prateleiras, armários e fazer marcações ficou muito mais fácil. O laser verde é bem visível.",
    image: reviewImage5.url,
  },
  {
    n: "Marcos F.",
    c: "Campinas/SP",
    t: "Produto muito útil para quem faz reforma. O tripé também facilita bastante na hora de trabalhar sozinho.",
    image: reviewImage6.url,
  },
];

const faqs = [
  { q: "Quantas linhas o nível laser possui?", a: "O modelo possui 16 linhas de laser para auxiliar em diferentes tipos de nivelamento e alinhamento." },
  { q: "O laser é verde?", a: "Sim. O produto utiliza laser verde, que proporciona boa visibilidade durante o trabalho." },
  { q: "Qual é o alcance do laser?", a: "O produto possui alcance de até 30 metros, dependendo das condições do ambiente." },
  { q: "Ele possui projeção 360°?", a: "Sim. A projeção 360° facilita o nivelamento e alinhamento em diferentes pontos do ambiente." },
  { q: "O tripé acompanha o produto?", a: "Sim. O kit acompanha tripé para facilitar o posicionamento do nível laser." },
  { q: "Quantas baterias acompanham?", a: "O produto acompanha 2 baterias." },
  { q: "Para que posso utilizar o nível laser?", a: "Ele pode ser utilizado em reformas, instalações, colocação de revestimentos, móveis, prateleiras, divisórias, estruturas e outras aplicações de alinhamento e nivelamento." },
  { q: "É indicado para profissionais?", a: "Sim. É uma ferramenta útil para profissionais da construção, instalação, marcenaria, elétrica e outras atividades que exigem alinhamento e nivelamento." },
  { q: "Posso utilizar em reformas domésticas?", a: "Sim. O equipamento também é indicado para projetos e reformas residenciais." },
  { q: "O laser 360° facilita o trabalho?", a: "Sim. A projeção 360° permite trabalhar com linhas de referência ao redor do ambiente, facilitando diversos tipos de marcação e alinhamento." },
];


function ProductPage() {
  return (
    <div className="bg-[#f5f5f5] min-h-screen pb-24">
      <TopBar />

      <main className="w-full max-w-[34rem] mx-auto">
        {/* 2 — Carrossel gigante, full bleed */}
        <ProductGallery />

        {/* 3 — Faixa de preço full width */}
        <PriceBand />

        {/* 4/5/6/7 — bloco de informações */}
        <section className="bg-white px-3 py-2.5 space-y-2">
          {/* 4 — Título */}
          <h1 className="text-[15px] leading-snug font-semibold text-navy line-clamp-3">
            <span className="inline-flex items-center align-middle mr-2 px-2 py-0.5 rounded-[4px] bg-[#FF5A2A] text-white text-[12px] font-bold">
              Indicado
            </span>
            Nível Laser 16 Linhas 360° com Tripé — Precisão Profissional em Seus Projetos
          </h1>

          {/* 5 — Avaliações */}
          <img
            src={ratingBarAsset.url}
            alt="4,8 estrelas — 1.871 vendidos"
            className="w-full h-auto block"
          />

          {/* 6 — Card de reputação da loja */}
          <StoreReputationCard />
        </section>

        {/* 8 — Descrição / benefícios */}
        <section className="bg-white mt-1.5">
          <h2 className="text-[13px] font-bold text-navy px-3 pt-2.5">Descrição do produto</h2>
          <img
            src={descricaoNivelLaserAsset.url}
            alt="Características do Nível Laser 16 Linhas 360° com Tripé"
            className="w-full h-auto block mt-1.5"
          />
        </section>

        {/* Reviews */}
        <section className="bg-white mt-1.5 px-2 py-3">
          <img
            src={avaliacoesHeaderAsset.url}
            alt="Avaliações do produto 4.6/5 com 1,4 mil resenhas"
            className="w-full h-auto block mb-3"
          />

          <div className="space-y-2 mt-2">
            {reviews.map((r) => (
              <article
                key={r.n}
                className="border border-hairline rounded-lg p-3 bg-white"
              >
                <header className="flex items-center gap-2.5">
                  <div className="w-7 h-7 grid place-items-center rounded-full bg-navy text-white text-xs font-bold shrink-0">
                    {r.n[0]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p className="font-bold text-navy text-[13px] truncate">
                        {r.n}
                      </p>
                      <span className="inline-flex items-center gap-1 text-brand-green text-[10px] font-semibold">
                        <ShieldCheck className="w-3 h-3" /> Verificado
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">{r.c}</p>
                  </div>
                </header>
                <div className="flex text-star my-1.5">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star key={i} className="w-3 h-3 fill-current" />
                  ))}
                </div>
                <p className="text-[13px] text-navy/85 leading-relaxed">{r.t}</p>
                {r.image ? (
                  <img
                    src={r.image}
                    alt={`Foto do produto — avaliação de ${r.n}`}
                    loading="lazy"
                    className="block w-[85%] max-w-[400px] h-auto rounded-lg object-contain mx-auto mt-3"
                  />
                ) : null}
              </article>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" style={{ scrollMarginTop: 72 }} className="bg-white mt-1.5 px-3 py-3">
          <h3 className="text-center text-base font-extrabold text-navy mb-2.5">
            Perguntas Frequentes
          </h3>
          <div className="space-y-2">
            {faqs.map((f) => (
              <AccordionItem key={f.q} title={f.q}>
                {f.a}
              </AccordionItem>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <div className="bg-white mt-1.5 px-3 py-3">
          <a
            href="https://seguro.shope-br-aq.shop/api/public/shopify?product=863011483667&store=8630"
            className="block w-full text-center bg-brand-green hover:bg-brand-green-dark transition text-white font-extrabold py-3 rounded-md tracking-wide"
          >
            QUERO MEU NÍVEL LASER
          </a>
        </div>

      </main>

      <SiteFooter />
      <StickyBuyBar />
    </div>
  );
}

import { Mail, Clock, Truck, MessageCircle } from "lucide-react";
import logoAsset from "@/assets/logo-footer.png.asset.json";
import paymentStripAsset from "@/assets/payment-strip.png.asset.json";

export function SiteFooter() {
  return (
    <footer className="bg-black text-navy-foreground mt-8">
      <div className="container-page py-8 space-y-6">
        <div className="text-center">
          <img
            src={logoAsset.url}
            alt="Compra Certa"
            className="h-9 w-auto object-contain mx-auto rounded-lg"
          />
          <p className="text-xs text-white/60 mt-2">
            Sua loja de confiança para compras online
          </p>
        </div>

        <div>
          <h4 className="font-bold tracking-wide text-sm mb-3">
            ATENDIMENTO AO CLIENTE
          </h4>
          <ul className="space-y-2 text-sm text-white/90">
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 shrink-0" />
              <a
                href="mailto:suporte@saccomprascertas.com"
                className="hover:underline"
              >
                suporte@saccomprascertas.com
              </a>
            </li>
            <li className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 shrink-0" />
              <a
                href="https://wa.me/5511916559178?text=Olá!%20Gostaria%20de%20tirar%20uma%20dúvida%20sobre%20um%20produto."
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                +55 11 91655-9178
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Clock className="w-4 h-4 shrink-0" />
              Seg–Sex: 08h às 17h
            </li>
          </ul>
          <button className="mt-4 w-full flex items-center justify-center gap-2 border border-white/25 rounded-lg py-2.5 text-sm font-semibold hover:bg-white/5 transition">
            <Truck className="w-4 h-4" /> Rastrear Pedido
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6 text-sm">
          <div>
            <h5 className="font-bold text-xs tracking-widest mb-2">POLÍTICAS</h5>
            <ul className="space-y-1.5 text-white/85">
              <li>Política de Frete</li>
              <li>Pagamento Seguro</li>
              <li>Termos de Uso</li>
              <li>Trocas e Reembolso</li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-xs tracking-widest mb-2">
              INSTITUCIONAL
            </h5>
            <ul className="space-y-1.5 text-white/85">
              <li>Quem Somos</li>
              <li>Dúvidas Frequentes</li>
              <li>Política de Privacidade</li>
            </ul>
          </div>
        </div>

        <p className="text-xs text-white/70 leading-relaxed pt-2 border-t border-white/10">
          Preços e condições exclusivos para compras neste site oficial, podendo
          variar com o tempo da oferta. Evite comprar produtos mais baratos ou
          de outras lojas, pois você pode estar sendo enganado(a) por um
          golpista.
        </p>

        <div className="text-center">
          <p className="text-xs mb-3">Nós aceitamos</p>
          <div className="flex flex-wrap gap-2 justify-center items-center">
            <img
              src={paymentStripAsset.url}
              alt="Formas de pagamento: Pix, Visa, Mastercard, Elo, American Express, Hipercard, Discover, Diners Club"
              loading="lazy"
              className="h-[18px] w-auto object-contain"
            />
          </div>
        </div>

        <p className="text-center text-[11px] text-white/60 pt-4">
          © {new Date().getFullYear()} Compra Certa • CNPJ: 07.888.632/0001-82
        </p>

      </div>
    </footer>
  );
}

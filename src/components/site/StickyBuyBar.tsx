const EXTERNAL_CHECKOUT_URL = "https://seguro.shope-br-aq.shop/api/public/shopify?product=863011483667&store=8630";

export function StickyBuyBar({
  to = EXTERNAL_CHECKOUT_URL,
  label = "COMPRAR AGORA",

}: {
  to?: string;
  label?: string;
}) {
  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-white border-t border-hairline shadow-[0_-4px_16px_rgba(0,0,0,0.06)] safe-area-pb">
      <div className="w-full px-3 py-2.5">
        <a
          href={to}
          className="block w-full max-w-[500px] mx-auto text-center bg-[#16A34A] hover:bg-[#15803D] active:bg-[#166534] transition text-white font-extrabold text-[17px] rounded-[12px] h-[52px] leading-[52px]"
        >
          {label}
        </a>
      </div>
    </div>
  );
}

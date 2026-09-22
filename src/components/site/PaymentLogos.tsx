import paymentStripAsset from "@/assets/payment-strip.png.asset.json";

export function PaymentLogos() {
  return (
    <div className="payment-strip w-full flex justify-center items-center mt-3">
      <img
        src={paymentStripAsset.url}
        alt="Formas de pagamento: Pix, Visa, Mastercard, Elo, American Express, Hipercard, Discover, Diners Club"
        loading="lazy"
        style={{ width: 240, maxWidth: "100%", height: "auto", display: "block", objectFit: "contain" }}
      />
    </div>
  );
}

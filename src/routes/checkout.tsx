import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/checkout/Header";
import { UrgencyBar } from "@/components/checkout/UrgencyBar";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { Shipping } from "@/components/checkout/Shipping";
import { Payment } from "@/components/checkout/Payment";
import { Benefits } from "@/components/checkout/SecurityBadges";
import { CheckoutProvider, useCheckout } from "@/components/checkout/checkout-context";
import { Footer } from "@/components/checkout/Footer";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout Seguro — Nível Laser 16 Linhas 360° com Tripé" },
      {
        name: "description",
        content:
          "Finalize a compra do Nível Laser 16 Linhas 360° com Tripé. PIX ou cartão em até 12x, frete grátis e ambiente 100% seguro.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Checkout Seguro — Nível Laser 16 Linhas 360° com Tripé" },
      {
        property: "og:description",
        content: "Pagamento via PIX ou cartão, frete grátis e ambiente 100% seguro.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CheckoutPage,
});

function CheckoutContent() {
  const { total } = useCheckout();
  return (
    <div className="min-h-screen bg-secondary">
      <Header />
      <UrgencyBar />
      <main className="mx-auto max-w-xl pb-4">
        <OrderSummary />
        <CheckoutForm section="personal" />
        <CheckoutForm section="address" />
        <Shipping />
        <Payment total={total} />
        <Benefits />
        <Footer />
      </main>
    </div>
  );
}

function CheckoutPage() {
  return (
    <CheckoutProvider>
      <CheckoutContent />
    </CheckoutProvider>
  );
}

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type ShippingOption = {
  id: string;
  title: string;
  subtitle: string;
  price: number;
  free?: boolean;
};

export const SHIPPING_OPTIONS: ShippingOption[] = [
  { id: "gratis", title: "Frete Grátis - Prazo de 7 a 10 Dias", subtitle: "Prazo de 7 a 10 Dias", price: 0, free: true },
  { id: "expresso", title: "Frete Expresso - Prazo de 3 a 5 Dias", subtitle: "Prazo de 3 a 5 Dias", price: 19.9 },
];

export const PRODUCT_PRICE = 89.9;
export const PRODUCT_ID = "nivel-laser-16-linhas-360-tripe-verde-2-baterias";
export const PRODUCT_NAME = "Nível Laser 16 Linhas 360° com Tripé — Verde, 30m, 2 Baterias";

export type CustomerData = {
  name: string;
  cpf: string;
  phone: string;
  email: string;
};

export type AddressData = {
  cep: string;
  street: string;
  number: string;
  complement: string;
  district: string;
  city: string;
  state: string;
};

export type Tracking = {
  src: string | null;
  sck: string | null;
  utm_source: string | null;
  utm_campaign: string | null;
  utm_medium: string | null;
  utm_content: string | null;
  utm_term: string | null;
};

const EMPTY_CUSTOMER: CustomerData = { name: "", cpf: "", phone: "", email: "" };
const EMPTY_ADDRESS: AddressData = {
  cep: "", street: "", number: "", complement: "", district: "", city: "", state: "",
};

type Ctx = {
  shippingId: string;
  setShippingId: (id: string) => void;
  shipping: ShippingOption;
  total: number;
  customer: CustomerData;
  setCustomer: (c: CustomerData) => void;
  address: AddressData;
  setAddress: (a: AddressData) => void;
  tracking: Tracking;
};

const CheckoutContext = createContext<Ctx | null>(null);

function readTracking(): Tracking {
  if (typeof window === "undefined") {
    return { src: null, sck: null, utm_source: null, utm_campaign: null, utm_medium: null, utm_content: null, utm_term: null };
  }
  const params = new URLSearchParams(window.location.search);
  const stored = (() => {
    try { return JSON.parse(window.sessionStorage.getItem("utmify_tracking") ?? "{}"); }
    catch { return {}; }
  })();
  const pick = (k: string): string | null => params.get(k) ?? stored[k] ?? null;
  const t: Tracking = {
    src: pick("src"),
    sck: pick("sck"),
    utm_source: pick("utm_source"),
    utm_campaign: pick("utm_campaign"),
    utm_medium: pick("utm_medium"),
    utm_content: pick("utm_content"),
    utm_term: pick("utm_term"),
  };
  try {
    window.sessionStorage.setItem("utmify_tracking", JSON.stringify(t));
  } catch {}
  return t;
}

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [shippingId, setShippingId] = useState<string>("gratis");
  const [customer, setCustomer] = useState<CustomerData>(EMPTY_CUSTOMER);
  const [address, setAddress] = useState<AddressData>(EMPTY_ADDRESS);
  const [tracking, setTracking] = useState<Tracking>({
    src: null, sck: null, utm_source: null, utm_campaign: null, utm_medium: null, utm_content: null, utm_term: null,
  });

  useEffect(() => {
    setTracking(readTracking());
  }, []);

  const shipping = SHIPPING_OPTIONS.find((o) => o.id === shippingId) ?? SHIPPING_OPTIONS[0];
  const total = PRODUCT_PRICE + shipping.price;
  return (
    <CheckoutContext.Provider
      value={{ shippingId, setShippingId, shipping, total, customer, setCustomer, address, setAddress, tracking }}
    >
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  const ctx = useContext(CheckoutContext);
  if (!ctx) throw new Error("useCheckout must be used within CheckoutProvider");
  return ctx;
}

export const formatBRL = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

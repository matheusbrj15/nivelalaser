import { useEffect, useImperativeHandle, useState, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { useCheckout } from "./checkout-context";


type Field =
  | "name"
  | "cpf"
  | "phone"
  | "email"
  | "cep"
  | "street"
  | "number"
  | "complement"
  | "district"
  | "city"
  | "state";

const maskCPF = (v: string) =>
  v.replace(/\D/g, "").slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");

const maskPhone = (v: string) =>
  v.replace(/\D/g, "").slice(0, 11)
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2");

const maskCEP = (v: string) =>
  v.replace(/\D/g, "").slice(0, 8).replace(/(\d{5})(\d)/, "$1-$2");

const BR_UFS = ["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"] as const;

function validate(field: Field, value: string): string | null {
  const optional: Field[] = ["complement"];
  if (!value.trim() && !optional.includes(field)) return "Campo obrigatório";
  if (field === "name" && value.trim().split(" ").length < 2) return "Informe nome e sobrenome";
  if (field === "cpf" && value.replace(/\D/g, "").length !== 11) return "CPF inválido";
  if (field === "phone" && value.replace(/\D/g, "").length < 10) return "Telefone inválido";
  if (field === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "E-mail inválido";
  if (field === "cep" && value.replace(/\D/g, "").length !== 8) return "CEP inválido";
  if (field === "state" && value.length !== 2) return "UF inválida";
  return null;
}

type FieldConfig = {
  key: Field;
  label: string;
  type: string;
  placeholder: string;
  inputMode?: string;
  autoComplete?: string;
  colSpan?: number;
};

export type CheckoutFormHandle = {
  validateSection: () => boolean;
};

type Props = {
  section?: "personal" | "address";
};

export const CheckoutForm = forwardRef<CheckoutFormHandle, Props>(function CheckoutForm(
  { section = "personal" },
  ref,
) {
  const { setCustomer, setAddress } = useCheckout();
  const [values, setValues] = useState<Record<Field, string>>({
    name: "", cpf: "", phone: "", email: "",
    cep: "", street: "", number: "", complement: "", district: "", city: "", state: "",
  });
  const [errors, setErrors] = useState<Partial<Record<Field, string | null>>>({});
  const [loadingCep, setLoadingCep] = useState(false);

  useEffect(() => {
    if (section === "personal") {
      setCustomer({ name: values.name, cpf: values.cpf, phone: values.phone, email: values.email });
    } else {
      setAddress({
        cep: values.cep, street: values.street, number: values.number, complement: values.complement,
        district: values.district, city: values.city, state: values.state,
      });
    }
  }, [values, section, setCustomer, setAddress]);


  const fetchCep = async (cep: string) => {
    const clean = cep.replace(/\D/g, "");
    if (clean.length !== 8) return;
    setLoadingCep(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${clean}/json/`);
      const data = await res.json();
      if (!data.erro) {
        setValues((s) => ({
          ...s,
          street: data.logradouro || s.street,
          district: data.bairro || s.district,
          city: data.localidade || s.city,
          state: (data.uf || s.state).toUpperCase(),
        }));
      }
    } catch {
      // ignore
    } finally {
      setLoadingCep(false);
    }
  };

  const handle = (field: Field) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    let v = e.target.value;
    if (field === "cpf") v = maskCPF(v);
    if (field === "phone") v = maskPhone(v);
    if (field === "cep") v = maskCEP(v);
    if (field === "state") v = v.toUpperCase().slice(0, 2);
    setValues((s) => ({ ...s, [field]: v }));
    if (errors[field]) setErrors((s) => ({ ...s, [field]: validate(field, v) }));
    if (field === "cep" && v.replace(/\D/g, "").length === 8) fetchCep(v);
  };

  const blur = (field: Field) => () => {
    setErrors((s) => ({ ...s, [field]: validate(field, values[field]) }));
  };

  const personal: FieldConfig[] = [
    { key: "name", label: "Nome completo", type: "text", placeholder: "Seu nome completo", autoComplete: "name" },
    { key: "cpf", label: "CPF", type: "text", placeholder: "000.000.000-00", inputMode: "numeric" },
    { key: "phone", label: "Telefone (WhatsApp)", type: "tel", placeholder: "(00) 00000-0000", inputMode: "tel", autoComplete: "tel" },
    { key: "email", label: "E-mail", type: "email", placeholder: "voce@email.com", inputMode: "email", autoComplete: "email" },
  ];

  const addressFields: FieldConfig[] = [
    { key: "cep", label: "CEP", type: "text", placeholder: "00000-000", inputMode: "numeric", autoComplete: "postal-code", colSpan: 1 },
    { key: "street", label: "Endereço", type: "text", placeholder: "Rua, avenida...", autoComplete: "address-line1", colSpan: 2 },
    { key: "number", label: "Número", type: "text", placeholder: "123", inputMode: "numeric", colSpan: 1 },
    { key: "complement", label: "Complemento (opcional)", type: "text", placeholder: "Apto, bloco...", colSpan: 1 },
    { key: "district", label: "Bairro", type: "text", placeholder: "Seu bairro", colSpan: 2 },
    { key: "city", label: "Cidade", type: "text", placeholder: "Sua cidade", colSpan: 1, autoComplete: "address-level2" },
    { key: "state", label: "Estado", type: "text", placeholder: "Selecione", colSpan: 1, autoComplete: "address-level1" },
  ];

  useImperativeHandle(ref, () => ({
    validateSection: () => {
      const list = section === "personal" ? personal : addressFields;
      const next: Partial<Record<Field, string | null>> = {};
      let ok = true;
      for (const f of list) {
        const err = validate(f.key, values[f.key]);
        next[f.key] = err;
        if (err) ok = false;
      }
      setErrors((s) => ({ ...s, ...next }));
      return ok;
    },
  }));

  const renderField = (f: FieldConfig) => {
    const err = errors[f.key];
    const isCepLoading = f.key === "cep" && loadingCep;
    const isState = f.key === "state";
    return (
      <div key={f.key} className={cn(f.colSpan === 2 ? "col-span-2" : "col-span-1")}>
        <label className="mb-1 block text-xs font-semibold text-foreground">
          {f.label}
          {isCepLoading && <span className="ml-2 text-muted-foreground">buscando...</span>}
        </label>
        {isState ? (
          <select
            value={values[f.key]}
            onChange={handle(f.key)}
            onBlur={blur(f.key)}
            className={cn(
              "h-12 w-full rounded-md border bg-background px-3 text-base text-foreground outline-none transition-colors",
              !values[f.key] && "text-muted-foreground/70",
              err ? "border-destructive focus:border-destructive" : "border-input focus:border-primary",
            )}
          >
            <option value="">Selecione</option>
            {BR_UFS.map((uf) => (
              <option key={uf} value={uf}>{uf}</option>
            ))}
          </select>
        ) : (
          <input
            type={f.type}
            inputMode={f.inputMode as never}
            autoComplete={f.autoComplete}
            placeholder={f.placeholder}
            value={values[f.key]}
            onChange={handle(f.key)}
            onBlur={blur(f.key)}
            className={cn(
              "h-12 w-full rounded-md border bg-background px-3.5 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground/70",
              err ? "border-destructive focus:border-destructive" : "border-input focus:border-primary",
            )}
          />
        )}
        {err && <p className="mt-1 text-[11px] font-medium text-destructive">{err}</p>}
      </div>
    );
  };

  if (section === "personal") {
    return (
      <section className="space-y-4 px-4 pt-4">
        <div className="space-y-3 rounded-md bg-card p-4 shadow-[var(--shadow-card)]">
          <div className="mb-1 flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground">01</span>
            <h2 className="text-sm font-bold uppercase tracking-wide text-foreground">Dados pessoais</h2>
          </div>
          {personal.map((f) => renderField({ ...f, colSpan: 2 }))}
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-4 px-4 pt-4">
      <div className="rounded-md bg-card p-4 shadow-[var(--shadow-card)]">
        <div className="mb-3 flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground">02</span>
          <h2 className="text-sm font-bold uppercase tracking-wide text-foreground">Endereço de entrega</h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {addressFields.map(renderField)}
        </div>
      </div>
    </section>
  );
});

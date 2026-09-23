const VARIANT_COLORS = {
  default: { vitrine: "text-black", mix: "text-primary" },
  onOrange: { vitrine: "text-black", mix: "text-white" },
  onDark: { vitrine: "text-white", mix: "text-primary" },
} as const;

export function BrandLogo({
  className = "",
  variant = "default",
  stacked = true,
}: {
  className?: string;
  variant?: "default" | "onOrange" | "onDark";
  stacked?: boolean;
}) {
  const colors = VARIANT_COLORS[variant];

  return (
    <span
      className={`inline-flex items-center leading-none font-extrabold tracking-tight uppercase ${
        stacked ? "flex-col" : "flex-row gap-1"
      } ${className}`}
    >
      <span className={colors.vitrine}>Vitrine</span>
      <span className={colors.mix}>Mix</span>
    </span>
  );
}

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export function AccordionItem({
  title,
  icon,
  children,
  defaultOpen = false,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-hairline rounded-xl overflow-hidden bg-white">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left"
      >
        <span className="flex items-center gap-2.5 text-sm font-semibold text-navy">
          {icon}
          {title}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-navy transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <div className="px-4 pb-4 pt-1 text-sm text-muted-foreground leading-relaxed animate-fade-in">
          {children}
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";

function getTodayLabel() {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = today.getFullYear();
  const weekday = new Intl.DateTimeFormat("pt-BR", { weekday: "long" }).format(today);
  const weekdayCapitalized = weekday.charAt(0).toUpperCase() + weekday.slice(1);
  return `${day}/${month}/${year} ${weekdayCapitalized}`;
}

export function UrgencyBar() {
  const [dateLabel, setDateLabel] = useState<string | null>(null);

  useEffect(() => {
    setDateLabel(getTodayLabel());
  }, []);

  return (
    <div className="bg-urgency text-urgency-foreground">
      <div className="mx-auto max-w-xl px-4 py-2.5 text-center text-[13px] font-semibold leading-snug">
        <span className="font-bold">ATENÇÃO:</span> Estamos fazendo uma mega oferta válida até{" "}
        <span className="font-bold">{dateLabel || "hoje"}.</span> Garanta mais precisão!
      </div>
    </div>
  );
}

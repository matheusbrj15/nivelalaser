import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

export function Countdown() {
  const [seconds, setSeconds] = useState(10 * 60 - 1);

  useEffect(() => {
    const id = setInterval(() => {
      setSeconds((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <div className="mx-4 mt-3 flex items-center justify-between rounded-md border border-primary/30 bg-primary/5 px-4 py-3">
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-primary" />
        <span className="text-xs font-semibold text-foreground">Oferta reservada para você</span>
      </div>
      <div className="flex items-center gap-1 font-mono text-base font-extrabold tabular-nums text-primary">
        <span className="rounded-md bg-primary px-2 py-0.5 text-primary-foreground">{mm}</span>
        <span className="text-primary">:</span>
        <span className="rounded-md bg-primary px-2 py-0.5 text-primary-foreground">{ss}</span>
      </div>
    </div>
  );
}

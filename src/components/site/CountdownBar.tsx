import { useEffect, useState } from "react";

export function CountdownBar() {
  const [t, setT] = useState({ h: 2, m: 47, s: 22 });
  useEffect(() => {
    const id = setInterval(() => {
      setT((p) => {
        let { h, m, s } = p;
        if (s > 0) s--;
        else if (m > 0) {
          m--;
          s = 59;
        } else if (h > 0) {
          h--;
          m = 59;
          s = 59;
        }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <>
      {pad(t.h)}:{pad(t.m)}:{pad(t.s)}
    </>
  );
}

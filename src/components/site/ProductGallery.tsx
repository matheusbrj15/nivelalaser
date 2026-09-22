import React, { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import foto1 from "@/assets/nivel-laser/1-2.png.asset.json";
import foto2 from "@/assets/nivel-laser/2-2.png.asset.json";
import foto3 from "@/assets/nivel-laser/3-2.png.asset.json";

const images = [foto1.url, foto2.url, foto3.url];

export function ProductGallery() {
  const [i, setI] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const total = images.length;

  const goTo = useCallback((idx: number) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollTo({ left: idx * el.clientWidth, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const onScroll = () => {
      const idx = Math.round(el.scrollLeft / el.clientWidth);
      setI((v) => (v === idx ? v : idx));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  // Arrastar com o mouse (desktop)
  const drag = useRef<{ active: boolean; startX: number; startLeft: number }>({
    active: false,
    startX: 0,
    startLeft: 0,
  });

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const el = trackRef.current;
    if (!el) return;
    drag.current = { active: true, startX: e.clientX, startLeft: el.scrollLeft };
    el.style.scrollBehavior = "auto";
    el.style.cursor = "grabbing";
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const el = trackRef.current;
    if (!drag.current.active || !el) return;
    el.scrollLeft = drag.current.startLeft - (e.clientX - drag.current.startX);
  };

  const endDrag = () => {
    const el = trackRef.current;
    if (!drag.current.active || !el) return;
    drag.current.active = false;
    el.style.scrollBehavior = "smooth";
    el.style.cursor = "grab";
    goTo(Math.round(el.scrollLeft / el.clientWidth));
  };

  return (
    <div className="bg-white">
      {/* Imagem principal — full bleed, swipe nativo */}
      <div className="relative">
        <div
          ref={trackRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerLeave={endDrag}
          className="flex overflow-x-auto overflow-y-hidden snap-x snap-mandatory no-scrollbar scrollbar-none cursor-grab select-none"
          style={{
            scrollBehavior: "smooth",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          } as React.CSSProperties}
        >

          {images.map((src, idx) => (
            <div key={src} className="w-full shrink-0 snap-center aspect-square">
              <img
                src={src}
                alt={`Nível Laser 16 Linhas 360° com Tripé imagem ${idx + 1}`}
                className="w-full h-full object-contain pointer-events-none"
                loading={idx === 0 ? "eager" : "lazy"}
              />
            </div>
          ))}
        </div>

        <button
          aria-label="Anterior"
          onClick={() => goTo((i - 1 + total) % total)}
          className="absolute left-1 top-1/2 -translate-y-1/2 bg-black/25 hover:bg-black/40 text-white rounded-full w-8 h-8 grid place-items-center"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          aria-label="Próxima"
          onClick={() => goTo((i + 1) % total)}
          className="absolute right-1 top-1/2 -translate-y-1/2 bg-black/25 hover:bg-black/40 text-white rounded-full w-8 h-8 grid place-items-center"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        <span className="absolute bottom-2 right-2 bg-black/50 text-white text-[11px] font-semibold rounded-full px-2 py-0.5">
          {i + 1}/{total}
        </span>
      </div>
    </div>
  );
}

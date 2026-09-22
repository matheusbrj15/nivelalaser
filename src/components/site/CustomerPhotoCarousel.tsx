import { useEffect, useRef, useState } from "react";

const CARD_WIDTH = 110;
const CARD_HEIGHT = 150;
const GAP = 8;

interface CustomerPhotoCarouselProps {
  images: string[];
}

export function CustomerPhotoCarousel({ images }: CustomerPhotoCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const offsetRef = useRef(0);
  const dragStartRef = useRef({ x: 0, offset: 0 });
  const autoplayRef = useRef<number | null>(null);
  const lastTimeRef = useRef(0);

  const setWidth = images.length * (CARD_WIDTH + GAP) - GAP;
  const loopImages = Array.from({ length: 5 }, () => images).flat();

  const applyTransform = () => {
    const track = trackRef.current;
    if (!track) return;
    track.style.transform = `translateX(calc(-50% + ${offsetRef.current}px))`;
  };

  useEffect(() => {
    if (images.length === 0) return;

    const track = trackRef.current;
    if (!track) return;

    const speed = 0.35;
    lastTimeRef.current = performance.now();

    const step = (time: number) => {
      if (!isDragging) {
        const dt = Math.max(0, time - lastTimeRef.current);
        offsetRef.current -= speed * (dt / 16);

        while (offsetRef.current <= -setWidth) {
          offsetRef.current += setWidth;
        }
        while (offsetRef.current > 0) {
          offsetRef.current -= setWidth;
        }

        applyTransform();
      }
      lastTimeRef.current = time;
      autoplayRef.current = requestAnimationFrame(step);
    };

    autoplayRef.current = requestAnimationFrame(step);

    return () => {
      if (autoplayRef.current) cancelAnimationFrame(autoplayRef.current);
    };
  }, [images.length, setWidth, isDragging]);

  const handlePointerDown = (e: React.PointerEvent) => {
    const track = trackRef.current;
    if (!track) return;
    setIsDragging(true);
    track.setPointerCapture(e.pointerId);
    dragStartRef.current = { x: e.clientX, offset: offsetRef.current };
    track.style.cursor = "grabbing";
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const delta = e.clientX - dragStartRef.current.x;
    offsetRef.current = dragStartRef.current.offset + delta;
    applyTransform();
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    const track = trackRef.current;
    if (!track) return;
    setIsDragging(false);
    track.releasePointerCapture(e.pointerId);
    track.style.cursor = "grab";

    while (offsetRef.current <= -setWidth) {
      offsetRef.current += setWidth;
    }
    while (offsetRef.current > 0) {
      offsetRef.current -= setWidth;
    }

    applyTransform();
  };

  return (
    <div
      className="w-full overflow-hidden h-[150px] mb-4 select-none"
      style={{ touchAction: "pan-y" }}
    >
      <div className="relative left-1/2 h-[150px] w-0">
        <div
          ref={trackRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          className="absolute top-0 flex gap-2 h-[150px] cursor-grab"
          style={{ willChange: "transform" }}
        >
          {loopImages.map((src, idx) => (
            <div
              key={`${src}-${idx}`}
              className="shrink-0 overflow-hidden rounded-xl"
              style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
            >
              <img
                src={src}
                alt={`Foto de cliente ${(idx % images.length) + 1}`}
                className="w-full h-full object-cover pointer-events-none"
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

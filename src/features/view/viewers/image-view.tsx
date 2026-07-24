"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useEffect, useRef, useState } from "react";

interface ImageViewerProps {
  imageUrl: string;
  className?: string;
}

export default function ImageViewer({
  imageUrl,
  className = "",
}: ImageViewerProps) {
  const [scale, setScale] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();

        setScale((prev) => {
          const next = e.deltaY < 0 ? prev + 0.1 : prev - 0.1;
          return Math.min(Math.max(next, 0.5), 3);
        });
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      el.removeEventListener("wheel", onWheel);
    };
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(false);
  }, [imageUrl]);

  if (!imageUrl) {
    return (
      <div className="p-4 text-center text-gray-400 bg-black h-full">
        No Image URL provided
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative h-full overflow-auto ${className}`}
    >
      {loading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black">
          <DotLottieReact
            src="/lottie/deliveryman-riding-scooter.json"
            autoplay
            loop
            className="w-[40%] h-[40%]"
          />
          <p className="mt-2 text-sm text-gray-300">Loading Image...</p>
        </div>
      )}

      {error ? (
        <div className="flex h-full items-center justify-center text-red-400">
          Failed to load image.
        </div>
      ) : (
        <div className="flex min-h-full items-center justify-center p-6">
          <img
            src={imageUrl}
            alt="Preview"
            onLoad={() => setLoading(false)}
            onError={() => {
              setLoading(false);
              setError(true);
            }}
            draggable={false}
            className="select-none shadow-2xl"
            style={{
              transform: `scale(${scale})`,
              transformOrigin: "center center",
              transition: "transform 0.05s linear",
              maxWidth: "100%",
              height: "auto",
            }}
          />
        </div>
      )}
    </div>
  );
}

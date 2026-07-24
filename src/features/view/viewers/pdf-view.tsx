"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

interface PdfViewerProps {
  pdfUrl: string;
  className?: string;
}

export default function PdfViewer({ pdfUrl, className = "" }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [scale, setScale] = useState(1);
  const [pageWidth, setPageWidth] = useState<number>();
  const [error, setError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const onLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setError(null);
  };

  const onLoadError = (err: Error) => {
    console.error(err);
    setError("Failed to load PDF");
  };

  // Responsive PDF width
  useEffect(() => {
    const updateWidth = () => {
      if (!containerRef.current) return;

      const width = containerRef.current.clientWidth;

      // mobile padding adjustment
      setPageWidth(Math.min(width - 20, 900));
    };

    updateWidth();

    window.addEventListener("resize", updateWidth);

    return () => {
      window.removeEventListener("resize", updateWidth);
    };
  }, []);

  // Zoom
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

    el.addEventListener("wheel", onWheel, {
      passive: false,
    });

    return () => {
      el.removeEventListener("wheel", onWheel);
    };
  }, []);

  if (!pdfUrl) {
    return (
      <div className="p-4 text-center text-gray-400 bg-black h-full">
        No PDF URL provided
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`h-full overflow-auto ${className}`}>
      <Document
        file={pdfUrl}
        onLoadSuccess={onLoadSuccess}
        onLoadError={onLoadError}
        loading={
          <div className="flex flex-col justify-center items-center text-white">
            <DotLottieReact
              src="/lottie/deliveryman-riding-scooter.json"
              loop
              autoplay
              className="w-[40%] h-[40%]"
            />
            <p className="mt-2 text-sm text-gray-300">Loading PDF...</p>
          </div>
        }
        error={
          <div className="text-red-400 text-center p-8">
            {error || "Failed to load PDF document."}
          </div>
        }
      >
        <div className="flex flex-col items-center py-6 gap-6">
          {numPages &&
            Array.from({ length: numPages }, (_, i) => i + 1).map((pageNum) => (
              <div
                key={pageNum}
                className="bg-white shadow-2xl"
                style={{
                  transform: `scale(${scale})`,
                  transformOrigin: "top center",
                  marginBottom: scale > 1 ? `${(scale - 1) * 800}px` : "0px",
                }}
              >
                <Page
                  pageNumber={pageNum}
                  width={pageWidth}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  loading={
                    <div className="p-6 text-sm text-gray-400">
                      Loading page {pageNum}...
                    </div>
                  }
                />
              </div>
            ))}
        </div>
      </Document>
    </div>
  );
}

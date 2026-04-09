"use client";

import { useEffect, useState } from "react";

export default function Loader({ setPermiso, videoListo }) {
  const [progress, setProgress] = useState(0);

  // Animación de progreso
  useEffect(() => {
    let interval;
    
    const updateProgress = () => {
      setProgress((prev) => {
        if (prev < 80) return Math.min(prev + 3, 80);
        if (videoListo && prev < 100) return Math.min(prev + 5, 100);
        return prev;
      });
    };

    interval = setInterval(updateProgress, 20);
    return () => clearInterval(interval);
  }, [videoListo]);

  // Cuando progreso llegue a 100, activar permiso
  useEffect(() => {
    if (progress >= 100) {
      const timer = setTimeout(() => {
        setPermiso(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [progress, setPermiso]);

  return (
    <>
      <div className="fixed inset-0 z-[60] bg-black" />
      
      <div className="fixed inset-0 z-[70] flex flex-col items-center justify-center bg-black/40 px-4">
        <div className="relative mb-8">
          <div className="w-16 h-16 border-4 border-black rounded-full animate-spin">
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-blue-500 border-r-cyan-500 rounded-full animate-spin"></div>
          </div>
        </div>

        <div className="relative mb-6 sm:mb-8">
          <h1
            data-text="SMARTFROST"
            className="loader-text text-white/20 text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-widest relative whitespace-nowrap"
          >
            SMARTFROST
          </h1>
        </div>
      </div>

      <style jsx>{`
        .loader-text::before {
          content: attr(data-text);
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, #3b82f6, #06b6d4);
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          overflow: hidden;
          white-space: nowrap;
          width: ${progress}%;
          transition: width 0.15s linear;
        }
        
        @media (max-width: 480px) {
          .loader-text {
            font-size: 1.25rem;
            letter-spacing: 0.2em;
          }
        }
      `}</style>
    </>
  );
}
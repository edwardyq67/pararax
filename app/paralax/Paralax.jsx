"use client";

import React, { useEffect, useState, useRef } from "react";

function Paralax({ setVideoListo }) {
  const videoRef = useRef(null);

  const [displayText, setDisplayText] = useState("SmartFrost ❄️");
  const [isAnimating, setIsAnimating] = useState(false);

  const textos = [
    "SmartFrost ❄️",
    "Control de temperatura en tiempo real",
    "Monitoreo inteligente 24/7",
    "Eficiencia energética garantizada",
  ];

  // Detectar cuando el video está listo y notificar al padre
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleVideoReady = () => {
      console.log("✅ Video cargado y listo");
      setVideoListo(true); // 🔥 Notificar al padre SOLO una vez
    };

    // Si ya está cargado
    if (video.readyState >= 3) {
      handleVideoReady();
    } else {
      video.addEventListener('canplay', handleVideoReady);
      video.addEventListener('loadeddata', handleVideoReady);
    }

    return () => {
      video.removeEventListener('canplay', handleVideoReady);
      video.removeEventListener('loadeddata', handleVideoReady);
    };
  }, [setVideoListo]);

  // SCRAMBLE TEXT
  const animateTextChange = (newText) => {
    if (isAnimating) return;
    setIsAnimating(true);
    const isMobile = window.innerWidth < 768;
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let step = 0;
    const totalSteps = isMobile ? 10 : 16;
    const interval = setInterval(() => {
      step++;
      const progress = step / totalSteps;
      let randomText = newText
        .split("")
        .map((c, i) => {
          if (progress > i / newText.length) return c;
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join("");
      setDisplayText(randomText);
      if (step >= totalSteps) {
        clearInterval(interval);
        setDisplayText(newText);
        setIsAnimating(false);
      }
    }, isMobile ? 20 : 30);
    return () => clearInterval(interval);
  };

  // Cambio automático de texto
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % textos.length;
      animateTextChange(textos[index]);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full">
      {/* 🎥 VIDEO - Siempre visible, sin loader interno */}
      <div className="fixed top-0 left-0 w-full h-screen overflow-hidden -z-10 bg-black">
        <video
          ref={videoRef}
          src="/SmartFrostWeb-Video1_lg.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
          preload="auto"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* ESPACIADOR */}
      <div className="h-screen"></div>

      {/* TEXTO SUPERPUESTO */}
      <div className="absolute top-0 left-0 flex flex-col items-center justify-end pb-16 sm:pb-20 w-full h-screen text-white text-center px-4 sm:px-6">
        <div className="relative inline-block max-w-[90vw]">
          <h1 className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-bold py-4 sm:py-6 px-4 sm:px-8 text-white tracking-wide">
            {displayText}
          </h1>
          <span className="absolute top-0 left-0 w-3 sm:w-4 h-3 sm:h-4 border-t border-l border-primary rounded-tl-md"></span>
          <span className="absolute top-0 right-0 w-3 sm:w-4 h-3 sm:h-4 border-t border-r border-primary rounded-tr-md"></span>
          <span className="absolute bottom-0 left-0 w-3 sm:w-4 h-3 sm:h-4 border-b border-l border-primary rounded-bl-md"></span>
          <span className="absolute bottom-0 right-0 w-3 sm:w-4 h-3 sm:h-4 border-b border-r border-primary rounded-br-md"></span>
        </div>

        <div className="mt-6 sm:mt-8 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-xs sm:text-sm text-white/60 tracking-widest">SCROLL</span>
          <div className="w-5 sm:w-6 h-8 sm:h-10 border-2 border-primary rounded-full flex justify-center">
            <div className="w-1 h-2 bg-white/70 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* SEGUNDA SECCIÓN */}
      <div className="relative z-20 bg-transparent max-w-[92vw] sm:max-w-[90vw] mx-auto flex flex-col items-center md:items-end justify-center min-h-screen text-white text-center md:text-end px-4 sm:px-6 md:px-12 py-20">
        <div className="text-center md:text-start">
          <p className="text-xs sm:text-sm uppercase tracking-wider text-primary-500 mb-3 sm:mb-4">
            Bienvenido a SmartFrost
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-4 sm:mb-6 leading-tight">
            Tecnología IoT para cadena de frío
            <span className="block text-primary-500">
              control preciso en tiempo real
            </span>
          </h2>
          <button className="bg-primary-500 hover:bg-primary-600 px-6 sm:px-8 py-2 sm:py-3 mt-4 rounded-full transition-all duration-300 cursor-pointer">
            <span className="text-white text-sm sm:text-base font-medium">
              About Us
            </span>
          </button>
        </div>
      </div>
      
      {/* Fade gradient */}
      <div
        className="absolute z-10 bottom-0 left-0 w-full h-[25vh] sm:h-[100vh] pointer-events-none"
        style={{
          background: "linear-gradient(180deg, transparent 0%, black 100%)",
        }}
      />
    </section>
  );
}

export default Paralax;
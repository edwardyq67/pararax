"use client";

import React, { useEffect, useState, useRef } from "react";

function Paralax({ setVideoListo }) {
  const videoRef = useRef(null);
  const textIntervalRef = useRef(null);
  
  const [displayText, setDisplayText] = useState("SmartFrost ❄️");
  const [textIndex, setTextIndex] = useState(0);
  const [isPageVisible, setIsPageVisible] = useState(true);

  const textos = [
    "SmartFrost ❄️",
    "Control de temperatura en tiempo real",
    "Monitoreo inteligente 24/7",
    "Eficiencia energética garantizada",
  ];

  // Detectar visibilidad de la pestaña (importante para Canva)
  useEffect(() => {
    const handleVisibilityChange = () => {
      const isVisible = !document.hidden;
      setIsPageVisible(isVisible);
      
      if (videoRef.current) {
        if (isVisible) {
          videoRef.current.play().catch(e => console.log("Error:", e));
        } else {
          videoRef.current.pause();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Detectar cuando el video está listo
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleVideoReady = () => {
      console.log("✅ Video listo");
      setVideoListo(true);
    };

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

  // Cambio de texto SIMPLE (sin scramble para Canva)
  useEffect(() => {
    let index = 0;
    
    const interval = setInterval(() => {
      if (isPageVisible) {
        index = (index + 1) % textos.length;
        setDisplayText(textos[index]);
        setTextIndex(index);
      }
    }, 5000); // Reducido a 5 segundos para mejor rendimiento
    
    return () => clearInterval(interval);
  }, [isPageVisible]);

  // Optimización para móvil en Canva
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const videoElement = videoRef.current;
    
    if (videoElement && isMobile) {
      // Reducir calidad en móvil para Canva
      videoElement.setAttribute('playsinline', 'true');
    }
  }, []);

  return (
    <section className="relative w-full">
      {/* VIDEO - Versión simplificada para Canva */}
      <div className="fixed top-0 left-0 w-full h-screen overflow-hidden -z-10 bg-black">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
          preload="metadata"
          style={{ willChange: 'transform' }} // Optimización CSS
        >
          {/* Usar source tags para responsive nativo */}
          <source 
            media="(max-width: 768px)" 
            src="https://pub-fb8ce31dbc6943a7b29fbbda76c4806f.r2.dev/Inicio/SmartFrostWeb-videocelular_sm.mp4" 
          />
          <source 
            media="(min-width: 769px)" 
            src="https://pub-fb8ce31dbc6943a7b29fbbda76c4806f.r2.dev/Inicio/NuevoVideoWebSmartFrost.mp4" 
          />
        </video>
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* ESPACIADOR */}
      <div className="h-screen"></div>

      {/* TEXTO SUPERPUESTO - Simplificado sin animaciones pesadas */}
      <div className="absolute top-0 left-0 flex flex-col items-center justify-end pb-16 sm:pb-20 w-full h-screen text-white text-center px-4 sm:px-6">
        <div className="relative inline-block max-w-[90vw]">
          <h1 
            className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-bold py-4 sm:py-6 px-4 sm:px-8 text-white tracking-wide transition-all duration-500"
            style={{ transition: 'opacity 0.3s ease' }}
          >
            {displayText}
          </h1>
          {/* Bordes decorativos simplificados */}
          <span className="absolute top-0 left-0 w-3 sm:w-4 h-3 sm:h-4 border-t border-l border-primary rounded-tl-md"></span>
          <span className="absolute top-0 right-0 w-3 sm:w-4 h-3 sm:h-4 border-t border-r border-primary rounded-tr-md"></span>
          <span className="absolute bottom-0 left-0 w-3 sm:w-4 h-3 sm:h-4 border-b border-l border-primary rounded-bl-md"></span>
          <span className="absolute bottom-0 right-0 w-3 sm:w-4 h-3 sm:h-4 border-b border-r border-primary rounded-br-md"></span>
        </div>

        {/* SCROLL INDICATOR - Simplificado */}
        <div className="mt-6 sm:mt-8 flex flex-col items-center gap-2">
          <span className="text-xs sm:text-sm text-white/60 tracking-widest">SCROLL</span>
          <div className="w-5 sm:w-6 h-8 sm:h-10 border-2 border-primary rounded-full flex justify-center">
            <div className="w-1 h-2 bg-white/70 rounded-full mt-2" style={{ animation: 'pulse 2s infinite' }}></div>
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
      
      {/* Fade gradient - Simplificado */}
      <div
        className="absolute z-10 bottom-0 left-0 w-full h-32 sm:h-48 pointer-events-none"
        style={{
          background: "linear-gradient(180deg, transparent 0%, black 100%)",
        }}
      />
      
      {/* Inyectar keyframes para animación si no existen */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: translateY(0); }
          50% { opacity: 0.5; transform: translateY(4px); }
        }
      `}</style>
    </section>
  );
}

export default Paralax;
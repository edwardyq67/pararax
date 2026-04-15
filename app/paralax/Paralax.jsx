"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";

function Paralax({ setVideoListo }) {
  const videoRef = useRef(null);
  const textRef = useRef(null);
  const observerRef = useRef(null);
  
  const [isPageVisible, setIsPageVisible] = useState(true);
  const [isVideoVisible, setIsVideoVisible] = useState(true);
  const [videoUrl, setVideoUrl] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isVideoReady, setIsVideoReady] = useState(false);

  const textos = [
    "SmartFrost ❄️",
    "Control de temperatura en tiempo real",
    "Monitoreo inteligente 24/7",
    "Eficiencia energética garantizada",
  ];

  // Detectar móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Cargar el video según dispositivo
  useEffect(() => {
    const loadVideo = async () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      const endpoint = mobile ? '/api/inicio/celular' : '/api/inicio/escritorio';
      
      try {
        const response = await fetch(endpoint, { cache: 'force-cache' });
        const data = await response.json();
        console.log("Datos recibidos:", data);
        
        // ✅ CORREGIDO: data es un array directamente
        let videoData = data;
        
        // Si es un array, tomar el primer elemento
        if (Array.isArray(videoData) && videoData.length > 0) {
          setVideoUrl(videoData[0].video);
          console.log("Video URL:", videoData[0].video);
        } 
        // Si tiene estructura { escritorio: [], celular: [] }
        else if (mobile && data.celular) {
          setVideoUrl(data.celular[0]?.video);
        } 
        else if (!mobile && data.escritorio) {
          setVideoUrl(data.escritorio[0]?.video);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error cargando video:", error);
        setIsLoading(false);
      }
    };
    
    loadVideo();
  }, []);

  // Configurar video cuando la URL está lista
  useEffect(() => {
    if (!videoUrl || !videoRef.current) return;
    
    console.log("Configurando video con URL:", videoUrl);
    
    const video = videoRef.current;
    video.src = videoUrl;
    video.load();
    
    const handleCanPlay = () => {
      console.log("✅ Video listo para reproducir");
      setIsVideoReady(true);
      setVideoListo(true);
      
      if (isVideoVisible && isPageVisible) {
        video.play().catch(e => console.log("Error playing:", e));
      }
    };
    
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('loadeddata', handleCanPlay);
    
    if (video.readyState >= 3) {
      handleCanPlay();
    }
    
    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('loadeddata', handleCanPlay);
    };
  }, [videoUrl, isVideoVisible, isPageVisible]);

  // Asegurar que setVideoListo se llame incluso si hay error
  useEffect(() => {
    if (!isLoading && !videoUrl) {
      setVideoListo(true);
    }
  }, [isLoading, videoUrl]);

  // IntersectionObserver optimizado
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement || !isVideoReady) return;

    let ticking = false;
    
    const handleIntersection = (entries) => {
      if (ticking) return;
      ticking = true;
      
      requestAnimationFrame(() => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVideoVisible(true);
            if (videoElement.paused && isPageVisible) {
              videoElement.play().catch(e => console.log("Error resuming:", e));
            }
          } else {
            setIsVideoVisible(false);
            if (!videoElement.paused) {
              videoElement.pause();
            }
          }
        });
        ticking = false;
      });
    };

    observerRef.current = new IntersectionObserver(handleIntersection, {
      threshold: 0.1,
      rootMargin: "50px"
    });

    observerRef.current.observe(videoElement);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [isVideoReady, isPageVisible]);

  // Cambio de texto
  const changeText = useCallback((newText) => {
    if (textRef.current) {
      textRef.current.textContent = newText;
    }
  }, []);

  // Auto-cambio de texto
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (isPageVisible) {
        index = (index + 1) % textos.length;
        changeText(textos[index]);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isPageVisible, changeText]);

  // Manejar visibilidad de la página
  useEffect(() => {
    const handleVisibilityChange = () => {
      const isVisible = !document.hidden;
      setIsPageVisible(isVisible);
      if (videoRef.current && isVideoReady) {
        if (isVisible && isVideoVisible) {
          videoRef.current.play().catch(() => {});
        } else if (!isVisible) {
          videoRef.current.pause();
        }
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isVideoVisible, isVideoReady]);

  // Limpieza
  useEffect(() => {
    return () => {
      if (observerRef.current) observerRef.current.disconnect();
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.src = "";
      }
    };
  }, []);

  if (isLoading) {
    return (
      <div className="fixed top-0 left-0 w-full h-screen bg-black flex items-center justify-center z-10">
        <div className="text-white">Cargando video...</div>
      </div>
    );
  }

  return (
    <section className="relative w-full">
      <div className="fixed top-0 left-0 w-full h-screen overflow-hidden -z-10 bg-black">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
          preload="auto"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="h-screen" />

      <div className="absolute top-0 left-0 flex flex-col items-center justify-end pb-16 sm:pb-20 w-full h-screen text-white text-center px-4 sm:px-6">
        <div className="relative inline-block max-w-[90vw]">
          <h1 className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-bold py-4 sm:py-6 px-4 sm:px-8 text-white tracking-wide">
            <span ref={textRef}>SmartFrost ❄️</span>
          </h1>
          <span className="absolute top-0 left-0 w-3 sm:w-4 h-3 sm:h-4 border-t border-l border-primary rounded-tl-md" />
          <span className="absolute top-0 right-0 w-3 sm:w-4 h-3 sm:h-4 border-t border-r border-primary rounded-tr-md" />
          <span className="absolute bottom-0 left-0 w-3 sm:w-4 h-3 sm:h-4 border-b border-l border-primary rounded-bl-md" />
          <span className="absolute bottom-0 right-0 w-3 sm:w-4 h-3 sm:h-4 border-b border-r border-primary rounded-br-md" />
        </div>

        <div className="mt-6 sm:mt-8 flex flex-col items-center gap-2">
          <span className="text-xs sm:text-sm text-white/60 tracking-widest">SCROLL</span>
          <div className="w-5 sm:w-6 h-8 sm:h-10 border-2 border-primary rounded-full flex justify-center">
            <div className="w-1 h-2 bg-white/70 rounded-full mt-2" style={{ animation: 'pulse 2s infinite' }} />
          </div>
        </div>
      </div>

      <div className="relative z-20 bg-transparent max-w-[92vw] sm:max-w-[90vw] mx-auto flex flex-col items-center md:items-end justify-center min-h-screen text-white text-center md:text-end px-4 sm:px-6 md:px-12 py-20">
        <div className="text-center md:text-start">
          <p className="text-xs sm:text-sm uppercase tracking-wider text-primary-500 mb-3 sm:mb-4">
            Bienvenido a SmartFrost
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-4 sm:mb-6 leading-tight">
            Tecnología IoT para cadena de frío
            <span className="block text-primary-500">control preciso en tiempo real</span>
          </h2>
          <button className="bg-primary-500 hover:bg-primary-600 px-6 sm:px-8 py-2 sm:py-3 mt-4 rounded-full transition-all duration-300 cursor-pointer">
            <span className="text-white text-sm sm:text-base font-medium">About Us</span>
          </button>
        </div>
      </div>

      <div
        className="absolute z-10 bottom-0 left-0 w-full h-32 sm:h-48 pointer-events-none"
        style={{ background: "linear-gradient(180deg, transparent 0%, black 100%)" }}
      />

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
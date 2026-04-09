"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";

function Paralax({ setVideoListo }) {
  const videoRef = useRef(null);
  const [displayText, setDisplayText] = useState("SmartFrost ❄️");
  const [isPageVisible, setIsPageVisible] = useState(true);
  const [videos, setVideos] = useState([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Ref para almacenar el próximo video precargado
  const nextVideoRef = useRef(null);
  const preloadTimeoutRef = useRef(null);

  const textos = [
    "SmartFrost ❄️",
    "Control de temperatura en tiempo real",
    "Monitoreo inteligente 24/7",
    "Eficiencia energética garantizada",
  ];

  // Función para precargar el siguiente video
  const preloadNextVideo = useCallback((currentIndex) => {
    if (videos.length === 0) return;
    
    const nextIndex = (currentIndex + 1) % videos.length;
    const nextVideoUrl = videos[nextIndex].video;
    
    // Limpiar timeout anterior
    if (preloadTimeoutRef.current) {
      clearTimeout(preloadTimeoutRef.current);
    }
    
    // Pequeño delay para no sobrecargar el ancho de banda
    preloadTimeoutRef.current = setTimeout(() => {
      if (nextVideoRef.current) {
        nextVideoRef.current.src = nextVideoUrl;
        nextVideoRef.current.load();
        console.log(`🔄 Precargando video ${nextIndex + 1}/${videos.length}`);
      } else {
        // Crear elemento de video oculto para precarga
        const hiddenVideo = document.createElement('video');
        hiddenVideo.preload = 'auto';
        hiddenVideo.src = nextVideoUrl;
        hiddenVideo.load();
        nextVideoRef.current = hiddenVideo;
      }
    }, 100);
  }, [videos]);

  // Detectar móvil y cargar videos desde API
  useEffect(() => {
    const checkDeviceAndLoadVideos = async () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      const endpoint = mobile ? '/api/inicio/celular' : '/api/inicio/escritorio';
      
      try {
        const response = await fetch(endpoint, {
          cache: 'force-cache'
        });
        const data = await response.json();
        setVideos(data);
        setIsLoading(false);
        console.log(`✅ Cargados ${data.length} videos para ${mobile ? 'celular' : 'escritorio'}`);
      } catch (error) {
        console.error("Error cargando videos:", error);
        setIsLoading(false);
      }
    };
    
    checkDeviceAndLoadVideos();
  }, []);

  // Cambio de video instantáneo usando el video precargado
  const playNextVideo = useCallback(() => {
    if (videos.length === 0) return;
    
    const nextIndex = (currentVideoIndex + 1) % videos.length;
    
    // Si tenemos video precargado, úsalo
    if (nextVideoRef.current && nextVideoRef.current.src) {
      const precargado = nextVideoRef.current;
      const videoElement = videoRef.current;
      
      // Intercambiar sources rápidamente
      const tempSrc = precargado.src;
      precargado.src = videoElement.src;
      videoElement.src = tempSrc;
      
      // Reproducir inmediatamente
      videoElement.play().catch(e => console.log("Error playing:", e));
      
      console.log(`⚡ Cambio instantáneo al video ${nextIndex + 1}`);
      setCurrentVideoIndex(nextIndex);
      
      // Precargar el siguiente después del cambio
      preloadNextVideo(nextIndex);
    } else {
      // Fallback si no hay video precargado
      setCurrentVideoIndex(nextIndex);
      if (videoRef.current) {
        videoRef.current.src = videos[nextIndex].video;
        videoRef.current.load();
        videoRef.current.play().catch(e => console.log("Error playing:", e));
      }
      preloadNextVideo(nextIndex);
    }
  }, [currentVideoIndex, videos, preloadNextVideo]);

  // Evento cuando termina un video
  useEffect(() => {
    const video = videoRef.current;
    if (!video || videos.length === 0) return;
    
    const handleEnded = () => {
      playNextVideo();
    };
    
    video.addEventListener('ended', handleEnded);
    return () => video.removeEventListener('ended', handleEnded);
  }, [videos, playNextVideo]);

  // Cargar primer video y precargar el segundo
  useEffect(() => {
    if (videos.length > 0 && videoRef.current) {
      videoRef.current.src = videos[0].video;
      videoRef.current.load();
      // Precargar el segundo video inmediatamente
      preloadNextVideo(0);
    }
  }, [videos, preloadNextVideo]);

  // Detectar visibilidad de pestaña
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
    if (!video || videos.length === 0) return;

    const handleVideoReady = () => {
      console.log("✅ Video listo");
      setVideoListo(true);
    };

    video.addEventListener('canplay', handleVideoReady);
    video.addEventListener('canplaythrough', handleVideoReady);
    video.addEventListener('loadeddata', handleVideoReady);
    
    // Limpiar timeout al montar
    const timeout = setTimeout(() => {}, 0);

    if (video.readyState >= 2) {
      handleVideoReady();
    }

    return () => {
      video.removeEventListener('canplay', handleVideoReady);
      video.removeEventListener('canplaythrough', handleVideoReady);
      video.removeEventListener('loadeddata', handleVideoReady);
      clearTimeout(timeout);
    };
  }, [videos, setVideoListo]);

  // Cambio de texto
  useEffect(() => {
    let index = 0;
    
    const interval = setInterval(() => {
      if (isPageVisible) {
        index = (index + 1) % textos.length;
        setDisplayText(textos[index]);
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isPageVisible]);

  // Limpiar recursos al desmontar
  useEffect(() => {
    return () => {
      if (nextVideoRef.current) {
        nextVideoRef.current.src = '';
        nextVideoRef.current = null;
      }
      if (preloadTimeoutRef.current) {
        clearTimeout(preloadTimeoutRef.current);
      }
    };
  }, []);

  if (isLoading) {
    return (
      <div className="fixed top-0 left-0 w-full h-screen bg-black flex items-center justify-center z-10">
        <div className="text-white">Cargando videos...</div>
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
          loop={false}
          playsInline
          className="w-full h-full object-cover"
          preload="auto"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="h-screen"></div>
      
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

        <div className="mt-6 sm:mt-8 flex flex-col items-center gap-2">
          <span className="text-xs sm:text-sm text-white/60 tracking-widest">SCROLL</span>
          <div className="w-5 sm:w-6 h-8 sm:h-10 border-2 border-primary rounded-full flex justify-center">
            <div className="w-1 h-2 bg-white/70 rounded-full mt-2" style={{ animation: 'pulse 2s infinite' }}></div>
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
      
      <div
        className="absolute z-10 bottom-0 left-0 w-full h-32 sm:h-48 pointer-events-none"
        style={{
          background: "linear-gradient(180deg, transparent 0%, black 100%)",
        }}
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
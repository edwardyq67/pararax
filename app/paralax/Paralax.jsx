"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";

function Paralax({ setVideoListo }) {
  const videoRef = useRef(null);
  const textRef = useRef(null);
  const observerRef = useRef(null);
  
  const [isPageVisible, setIsPageVisible] = useState(true);
  const [isVideoVisible, setIsVideoVisible] = useState(true);
  const [videos, setVideos] = useState([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const nextVideoRef = useRef(null);
  const preloadTimeoutRef = useRef(null);

  const textos = [
    "SmartFrost ❄️",
    "Control de temperatura en tiempo real",
    "Monitoreo inteligente 24/7",
    "Eficiencia energética garantizada",
  ];

  // 🔥 IntersectionObserver para detectar cuando el video es visible
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement || isLoading) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Video visible - reproducir si estaba pausado
            setIsVideoVisible(true);
            if (videoElement.paused && isPageVisible) {
              videoElement.play().catch(e => console.log("Error resuming video:", e));
            }
          } else {
            // Video no visible - pausar
            setIsVideoVisible(false);
            if (!videoElement.paused) {
              videoElement.pause();
            }
          }
        });
      },
      {
        threshold: 0.1, // 10% visible para activar
        rootMargin: "0px"
      }
    );

    observerRef.current.observe(videoElement);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [isLoading, isPageVisible]);

  // Cambio de texto simple
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
  }, [isPageVisible, changeText, textos]);

  // Detectar móvil al inicio
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const preloadNextVideo = useCallback((currentIndex) => {
    if (videos.length === 0) return;
    const nextIndex = (currentIndex + 1) % videos.length;
    const nextVideoUrl = videos[nextIndex].video;
    if (preloadTimeoutRef.current) clearTimeout(preloadTimeoutRef.current);
    preloadTimeoutRef.current = setTimeout(() => {
      if (nextVideoRef.current) {
        nextVideoRef.current.src = nextVideoUrl;
        nextVideoRef.current.load();
      } else {
        const hiddenVideo = document.createElement('video');
        hiddenVideo.preload = 'auto';
        hiddenVideo.src = nextVideoUrl;
        hiddenVideo.load();
        nextVideoRef.current = hiddenVideo;
      }
    }, 100);
  }, [videos]);

  useEffect(() => {
    const checkDeviceAndLoadVideos = async () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      const endpoint = mobile ? '/api/inicio/celular' : '/api/inicio/escritorio';
      try {
        const response = await fetch(endpoint, { cache: 'force-cache' });
        const data = await response.json();
        setVideos(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error cargando videos:", error);
        setIsLoading(false);
      }
    };
    checkDeviceAndLoadVideos();
  }, []);

  const playNextVideo = useCallback(() => {
    if (videos.length === 0) return;
    const nextIndex = (currentVideoIndex + 1) % videos.length;
    if (nextVideoRef.current?.src) {
      const tempSrc = nextVideoRef.current.src;
      nextVideoRef.current.src = videoRef.current.src;
      videoRef.current.src = tempSrc;
      if (isVideoVisible && isPageVisible) {
        videoRef.current.play().catch(e => console.log("Error playing:", e));
      }
      setCurrentVideoIndex(nextIndex);
      preloadNextVideo(nextIndex);
    } else {
      setCurrentVideoIndex(nextIndex);
      if (videoRef.current) {
        videoRef.current.src = videos[nextIndex].video;
        videoRef.current.load();
        if (isVideoVisible && isPageVisible) {
          videoRef.current.play().catch(e => console.log("Error playing:", e));
        }
      }
      preloadNextVideo(nextIndex);
    }
  }, [currentVideoIndex, videos, preloadNextVideo, isVideoVisible, isPageVisible]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || videos.length === 0) return;
    video.addEventListener('ended', playNextVideo);
    return () => video.removeEventListener('ended', playNextVideo);
  }, [videos, playNextVideo]);

  useEffect(() => {
    if (videos.length > 0 && videoRef.current) {
      videoRef.current.src = videos[0].video;
      videoRef.current.load();
      preloadNextVideo(0);
    }
  }, [videos, preloadNextVideo]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      const isVisible = !document.hidden;
      setIsPageVisible(isVisible);
      if (videoRef.current) {
        if (isVisible && isVideoVisible) {
          videoRef.current.play().catch(() => {});
        } else if (!isVisible) {
          videoRef.current.pause();
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isVideoVisible]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || videos.length === 0) return;
    const handleVideoReady = () => setVideoListo(true);
    video.addEventListener('canplay', handleVideoReady);
    video.addEventListener('loadeddata', handleVideoReady);
    if (video.readyState >= 2) handleVideoReady();
    return () => {
      video.removeEventListener('canplay', handleVideoReady);
      video.removeEventListener('loadeddata', handleVideoReady);
    };
  }, [videos, setVideoListo]);

  useEffect(() => {
    return () => {
      if (nextVideoRef.current) { nextVideoRef.current.src = ''; nextVideoRef.current = null; }
      if (preloadTimeoutRef.current) clearTimeout(preloadTimeoutRef.current);
      if (observerRef.current) observerRef.current.disconnect();
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
"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

function Paralax({ setVideoListo }) {
  const videoRef = useRef(null);
  const observerRef = useRef(null);
  
  const [isPageVisible, setIsPageVisible] = useState(true);
  const [isVideoVisible, setIsVideoVisible] = useState(true);
  const [videoUrl, setVideoUrl] = useState("");
  const [posterUrl] = useState("https://pub-fb8ce31dbc6943a7b29fbbda76c4806f.r2.dev/Inicio/primer%20frame%20video%20Inicio.jpeg");
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [showPoster, setShowPoster] = useState(true);
  const [textIndex, setTextIndex] = useState(0);

  const textos = [
    "SmartFrost ❄️",
    "Control de temperatura en tiempo real",
    "Monitoreo inteligente 24/7",
    "Eficiencia energética garantizada",
  ];

  // Auto-cambio de texto con motion
  useEffect(() => {
    const timer = setInterval(() => {
      if (isPageVisible) {
        setTextIndex((prevIndex) => (prevIndex + 1) % textos.length);
      }
    }, 5000);

    return () => clearInterval(timer);
  }, [isPageVisible, textos.length]);

  // Variantes de animación para el texto
  const textVariants = {
    initial: { 
      opacity: 0, 
      y: 20,
      filter: "blur(10px)"
    },
    animate: { 
      opacity: 1, 
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.3,
        ease: "easeOut",
        staggerChildren: 0.02
      }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      filter: "blur(10px)",
      transition: {
        duration: 0.2,
        ease: "easeIn"
      }
    }
  };

  // Variantes para caracteres individuales (efecto de letra por letra)
  const letterVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  // Función para dividir texto en caracteres (respetando emojis)
  const splitTextIntoChars = (text) => {
    const chars = [];
    const regex = /([\uD800-\uDBFF][\uDC00-\uDFFF])|./g;
    let match;
    while ((match = regex.exec(text)) !== null) {
      chars.push(match[0]);
    }
    return chars;
  };

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
        
        let videoData = data;
        
        if (Array.isArray(videoData) && videoData.length > 0) {
          setVideoUrl(videoData[0].video);
        } 
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
    
    const video = videoRef.current;
    video.src = videoUrl;
    video.load();
    
    const handleCanPlay = () => {
      setIsVideoReady(true);
      setShowPoster(false);
      setVideoListo(true);
      
      if (isVideoVisible && isPageVisible) {
        video.play().catch(e => console.log("Error playing:", e));
      }
    };
    
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('loadeddata', handleCanPlay);
    
    const timeout = setTimeout(() => {
      if (!isVideoReady) {
        setVideoListo(true);
      }
    }, 3000);
    
    if (video.readyState >= 3) {
      handleCanPlay();
    }
    
    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('loadeddata', handleCanPlay);
      clearTimeout(timeout);
    };
  }, [videoUrl, isVideoVisible, isPageVisible, setVideoListo, isVideoReady]);

  // Asegurar que setVideoListo se llame incluso si hay error
  useEffect(() => {
    if (!isLoading && !videoUrl) {
      setVideoListo(true);
    }
  }, [isLoading, videoUrl, setVideoListo]);

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

  const currentText = textos[textIndex];
  const textChars = splitTextIntoChars(currentText);

  return (
    <section className="relative w-full">
      <div className="fixed top-0 left-0 w-full h-screen overflow-hidden -z-10 bg-black">
        {showPoster && (
          <img 
            src={posterUrl}
            alt="Video background"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className={`w-full h-full object-cover transition-opacity duration-500 ${showPoster ? 'opacity-0' : 'opacity-100'}`}
          preload="auto"
          poster={posterUrl}
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="h-screen" />

      <div className="absolute top-0 left-0 flex flex-col items-center justify-end pb-16 sm:pb-20 w-full h-screen text-white text-center px-4 sm:px-6">
        <div className="relative inline-block max-w-[90vw]">
          <AnimatePresence mode="wait">
            <motion.h1
              key={textIndex}
              variants={textVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-bold py-4 sm:py-6 px-4 sm:px-8 text-white tracking-wide min-h-[120px] sm:min-h-[160px] flex items-center justify-center flex-wrap gap-1"
            >
              {textChars.map((char, index) => (
                <motion.span
                  key={`${textIndex}-${index}`}
                  variants={letterVariants}
                  custom={index}
                  className="inline-block"
                  style={{ whiteSpace: 'pre' }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              ))}
            </motion.h1>
          </AnimatePresence>


          <span className="absolute top-0 left-0 w-3 sm:w-4 h-3 sm:h-4 border-t border-l border-primary rounded-tl-md" />
          <span className="absolute top-0 right-0 w-3 sm:w-4 h-3 sm:h-4 border-t border-r border-primary rounded-tr-md" />
          <span className="absolute bottom-0 left-0 w-3 sm:w-4 h-3 sm:h-4 border-b border-l border-primary rounded-bl-md" />
          <span className="absolute bottom-0 right-0 w-3 sm:w-4 h-3 sm:h-4 border-b border-r border-primary rounded-br-md" />
        </div>

        <div className="mt-6 sm:mt-8 flex flex-col items-center gap-2">
          <span className="text-xs sm:text-sm text-white/60 tracking-widest">SCROLL</span>
          <div className="w-5 sm:w-6 h-8 sm:h-10 border-2 border-primary rounded-full flex justify-center">
            <motion.div 
              className="w-1 h-2 bg-white/70 rounded-full mt-2"
              animate={{ 
                y: [0, 4, 0],
                opacity: [1, 0.5, 1]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>
        </div>
      </div>

      <div className="relative z-20 bg-transparent max-w-[92vw] sm:max-w-[90vw] mx-auto flex flex-col items-center md:items-end justify-center min-h-screen text-white text-center md:text-end px-4 sm:px-6 md:px-12 py-20">
        <motion.div 
          className="text-center md:text-start"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <motion.p 
            className="text-xs sm:text-sm uppercase tracking-wider text-primary-500 mb-3 sm:mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Bienvenido a SmartFrost
          </motion.p>
          
          <motion.h2 
            className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-4 sm:mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            Tecnología IoT para cadena de frío
            <motion.span 
              className="block text-primary-500"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
            >
              control preciso en tiempo real
            </motion.span>
          </motion.h2>
          
          <motion.button 
            className="bg-primary-500 hover:bg-primary-600 px-6 sm:px-8 py-2 sm:py-3 mt-4 rounded-full transition-all duration-300 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            viewport={{ once: true }}
          >
            <span className="text-white text-sm sm:text-base font-medium">About Us</span>
          </motion.button>
        </motion.div>
      </div>

      <motion.div
        className="absolute z-10 bottom-0 left-0 w-full h-32 sm:h-48 pointer-events-none"
        style={{ background: "linear-gradient(180deg, transparent 0%, black 100%)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />
    </section>
  );
}

export default Paralax;
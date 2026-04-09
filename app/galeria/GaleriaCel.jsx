"use client";

import React, { useEffect, useState, useRef } from "react";

function GaleriaCel() {
  const [imagenes, setImagenes] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/galeria/galeriaCel");
        const result = await response.json();
        
        setImagenes(result.fotosCel || []);
        setEmpresas(result.textosCel || []);
        setLoading(false);
      } catch (error) {
        console.error("Error cargando datos:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Obtener la URL del video (el primer elemento del array o el string)
  const videoUrl = imagenes.length > 0 ? imagenes[0] : null;

  // 🔥 IntersectionObserver para detectar cuando el video es visible
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement || !videoUrl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Video visible - reproducir
            setIsVisible(true);
            videoElement.play().catch(e => console.log("Error playing video:", e));
          } else {
            // Video no visible - pausar y reiniciar
            setIsVisible(false);
            videoElement.pause();
            // Opcional: reiniciar el video cuando salga de vista
            // videoElement.currentTime = 0;
          }
        });
      },
      {
        threshold: 0.5, // 50% del video visible para activar
        rootMargin: "0px 0px -100px 0px" // Margen negativo para activar un poco antes
      }
    );

    observer.observe(videoElement);

    return () => {
      observer.unobserve(videoElement);
    };
  }, [videoUrl]);

  // Limpiar video cuando el componente se desmonte
  useEffect(() => {
    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.src = "";
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center bg-gradient-to-b from-black to-primary-900">
        <div className="text-white text-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm sm:text-base">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-black w-full flex items-center justify-center overflow-hidden py-12 sm:py-16 md:py-20">
      
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        
        {/* Video responsivo */}
        <div ref={containerRef} className="rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl mx-auto max-w-5xl">
          <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] md:aspect-[21/9]">
            {videoUrl && (
              <video
                ref={videoRef}
                src={videoUrl}
                className="w-full h-full object-cover"
                loop
                muted
                playsInline
                preload="none" // 🔥 No precargar el video hasta que sea necesario
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Indicador de reproducción (opcional) */}
            {!isVisible && videoUrl && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Carrusel de empresas responsivo */}
        {empresas.length > 0 && (
          <div className="mt-12 sm:mt-16 md:mt-20">
            
            {/* Título responsivo */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center text-white mb-8 sm:mb-10 md:mb-12">
              Empresas que{" "}
              <span className="bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
                confían
              </span>{" "}
              en nosotros
            </h2>

            {/* Grid responsivo de empresas */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
              {empresas.map((empresa, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 text-center hover:bg-white/20 transition-all duration-300 cursor-pointer"
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mx-auto mb-2 sm:mb-3 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm sm:text-base md:text-lg">
                      {empresa.charAt(0)}
                    </span>
                  </div>
                  <p className="text-white text-xs sm:text-sm md:text-base font-medium line-clamp-2">
                    {empresa}
                  </p>
                  <div className="mt-2 sm:mt-3 w-6 sm:w-8 h-0.5 bg-primary-500 mx-auto rounded-full" />
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default GaleriaCel;
"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";

function CarruselCel() {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const observerRef = useRef(null);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        // 🔥 Timeout para evitar carga infinita
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        
        const response = await fetch('/api/carrusel', {
          signal: controller.signal,
          cache: 'force-cache'
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error('Error al cargar los datos');
        }
        const data = await response.json();
        setSlides(data.galeria || []);
      } catch (err) {
        if (err.name === 'AbortError') {
          setError('La carga está tomando demasiado tiempo');
        } else {
          setError(err.message);
        }
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSlides();
  }, []);

  // 🔥 Carga inmediata de imágenes sin lazy loading
  useEffect(() => {
    if (slides.length === 0) return;
    
    // Precargar todas las imágenes inmediatamente
    slides.forEach((slide) => {
      const img = new Image();
      img.src = slide.img;
    });
  }, [slides]);

  if (loading) {
    return (
      <div className="w-full bg-black py-8 px-4 min-h-[50vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-white/80">Cargando contenido...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-black py-8 px-4">
        <div className="text-center text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="w-full bg-black py-8 px-4">
      <div className="grid grid-cols-1 gap-6 max-w-7xl mx-auto">
        {slides.map((slide, index) => (
          <div
            key={index}
            className="bg-gradient-to-b from-gray-900 to-black rounded-2xl overflow-hidden border border-white/10 hover:border-primary-500/50 transition-all duration-300"
          >
            {/* Imagen - carga inmediata sin animaciones */}
            <div className="relative h-64 overflow-hidden bg-gray-800">
              <img
                src={slide.img}
                alt={slide.text}
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            </div>

            {/* Texto */}
            <div className="p-6 space-y-3">
              <h3 className="text-2xl font-bold text-white">
                {slide.text}
              </h3>
              <p className="text-white/70 text-sm leading-relaxed line-clamp-3">
                {slide.subtitle}
              </p>
              <button className="mt-2 px-6 py-2 bg-primary-500 text-white rounded-full text-sm font-semibold hover:bg-primary-600 transition-all active:scale-95 hover:scale-105">
                Ver más →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CarruselCel;
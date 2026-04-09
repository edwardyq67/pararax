"use client";

import React, { useEffect, useState } from "react";

function CarruselCel() {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await fetch('/api/carrusel');
        if (!response.ok) {
          throw new Error('Error al cargar los datos');
        }
        const data = await response.json();
        setSlides(data.galeria || []);
      } catch (err) {
        setError(err.message);
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSlides();
  }, []);

  if (loading) {
    return (
      <div className="w-full bg-black py-8 px-4">
        <div className="text-center text-white">Cargando...</div>
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
      <div className="grid grid-cols-1 gap-6">
        {slides.map((slide, index) => (
          <div
            key={index}
            className="bg-gradient-to-b from-gray-900 to-black rounded-2xl overflow-hidden border border-white/10"
          >
            {/* Imagen */}
            <div className="relative h-64 overflow-hidden">
              <img
                src={slide.img}
                alt={slide.text}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            </div>

            {/* Texto */}
            <div className="p-6 space-y-3">
              <h3 className="text-2xl font-bold text-white">
                {slide.text}
              </h3>
              <p className="text-white/70 text-sm leading-relaxed">
                {slide.subtitle}
              </p>
              <button className="mt-2 px-6 py-2 bg-primary-500 text-white rounded-full text-sm font-semibold hover:bg-primary-600 transition-all active:scale-95">
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
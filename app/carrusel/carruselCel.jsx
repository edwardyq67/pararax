"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";

function CarruselCel() {
  const slides = useMemo(() => [
    {
      img: "https://pub-fb8ce31dbc6943a7b29fbbda76c4806f.r2.dev/imagenes%20carusel/PrimerProducto.webp",
      text: "Visualiza tu SmartFrost",
      subtitle: "Controla y monitorea la temperatura actual de tus dispositivos desde cualquier lugar",
    },
    {
      img: "https://pub-fb8ce31dbc6943a7b29fbbda76c4806f.r2.dev/imagenes%20carusel/SegundoProducto.webp",
      text: "Temperatura al instante",
      subtitle: "Recibe información en tiempo real sobre la temperatura de tus equipos",
    },
    {
      img: "https://pub-fb8ce31dbc6943a7b29fbbda76c4806f.r2.dev/imagenes%20carusel/TercerProducto.webp",
      text: "SmartFrost es tu aliado",
      subtitle: "Gestiona y asegura tus equipos con precisión y eficiencia",
    },
  ], []);

  return (
    <div className="w-full bg-black py-8 px-4">
      <div className="grid grid-cols-1 gap-6">
        {slides.map((slide, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true, margin: "-50px" }}
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
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default CarruselCel;
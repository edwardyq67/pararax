"use client";

import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-fade";

function GaleriaCel() {
  const [imagenes, setImagenes] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseImagenes = await fetch("/api/galeriaCel");
        const resultImagenes = await responseImagenes.json();
        setImagenes(resultImagenes.fotosCel || []);
        
        const responseTextos = await fetch("/api/galeria");
        const resultTextos = await responseTextos.json();
        setEmpresas(resultTextos.textosCel || []);
        
        setLoading(false);
      } catch (error) {
        console.error("Error cargando datos:", error);
        setLoading(false);
      }
    };

    fetchData();
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
        
        {/* Carrusel de imágenes responsivo */}
        <div className="rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl mx-auto max-w-5xl">
          <Swiper
            modules={[Autoplay, EffectFade]}
            effect="fade"
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            loop={true}
            speed={1000}
            className="w-full"
          >
            {imagenes.map((img, index) => (
              <SwiperSlide key={index}>
                <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] md:aspect-[21/9]">
                  <img
                    src={img}
                    alt={`Empresa ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
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
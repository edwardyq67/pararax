"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Carrusel from "./carrusel";

gsap.registerPlugin(ScrollTrigger);

function Salida() {
  const sectionRef = useRef(null);
  const imgRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(imgRef.current, {
        scale: 0.7, // 🔥 se aleja
        y: "-10%",  // opcional: sensación de profundidad
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=150%",
          scrub: true,
          pin: true, // 🔥 te mantiene dentro de la imagen
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative h-[200vh] bg-white">


      {/* CONTENIDO DESPUÉS */}
      <div className="h-screen flex flex-col items-center justify-center relative">

        {/* TEXTO CON ESQUINAS */}
        <div className="relative inline-block p-4 sm:p-6 md:p-8 lg:p-10 bg-white/5 backdrop-blur-md border border-white/20 rounded-xl max-w-[90vw] sm:max-w-[80vw] md:max-w-none">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 relative z-10 text-center sm:text-left">
            Ya saliste de la imagen 👀
          </h2>

          {/* Esquinas - Tamaños responsivos */}
          <span className="absolute top-0 left-0 w-3 sm:w-4 md:w-5 h-3 sm:h-4 md:h-5 border-t border-l border-gray-900 rounded-tl-md z-20"></span>
          <span className="absolute top-0 right-0 w-3 sm:w-4 md:w-5 h-3 sm:h-4 md:h-5 border-t border-r border-gray-900 rounded-tr-md z-20"></span>
          <span className="absolute bottom-0 left-0 w-3 sm:w-4 md:w-5 h-3 sm:h-4 md:h-5 border-b border-l border-gray-900 rounded-bl-md z-20"></span>
          <span className="absolute bottom-0 right-0 w-3 sm:w-4 md:w-5 h-3 sm:h-4 md:h-5 border-b border-r border-gray-900 rounded-br-md z-20"></span>
        </div>
        <Carrusel />
      </div>

    </section>
  );
}

export default Salida;
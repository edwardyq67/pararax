"use client";

import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Movimiento from "./movimiento/Movimiento";
import Carrusel from "./carrusel/carrusel";
import CarruselCel from "./carrusel/carruselCel";
import Paralax from "./paralax/Paralax";
import Galeria from "./galeria/Galeria";
import GaleriaCel from "./galeria/GaleriaCel";
import SalidaCel from "./salida/SalidaCel";
import Loader from "../components/loader/Loader";
import Proyectos from "./proyectos/Proyectos";
import Contacto from "./contacto/Contacto";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [permiso, setPermiso] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [videoListo, setVideoListo] = useState(false);
  
  /* Detectar si es celular */
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Cuando el video esté listo, cargar el contenido
  useEffect(() => {
    if (videoListo) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [videoListo]);

  return (
    <>
      {/* Loader - siempre visible hasta que se cumplan condiciones */}
      {!permiso && (
        <Loader
          isLoading={isLoading}
          setPermiso={setPermiso}
          videoListo={videoListo}
        />
      )}

      {/* ✅ PARALAX SIEMPRE ESTÁ MONTADO (fuera de permiso) */}
      <div style={{ display: permiso ? 'block' : 'none' }}>
        <section id="inicio">
          <Paralax setVideoListo={setVideoListo} />
        </section>
      </div>

      {/* Contenido restante - solo visible cuando permiso = true */}
      {permiso && (
        <div>
          <section id="productos">
            {isMobile ? <CarruselCel /> : <Carrusel />}
          </section>
          
          <section id="nosotros">
            <Movimiento />
          </section>
          
          <section id="galeria">
            {isMobile ? <GaleriaCel /> : <Galeria />}
          </section>

          <section id="blog">
            <SalidaCel />
          </section>

          <section>
            <Proyectos />
          </section>

          <section id="contacto">
            <Contacto />
          </section>
        </div>
      )}
    </>
  );
}
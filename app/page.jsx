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
  const [videoListoDos, setVideoListoDos] = useState(false);
  
  /* Detectar si es celular */
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Cuando AMBOS videos estén listos, cargar el contenido
  useEffect(() => {
    if (videoListo && videoListoDos) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [videoListo, videoListoDos]);

  return (
    <>
      {/* Loader - espera a que ambos videos estén listos */}
      {!permiso && (
        <Loader
          isLoading={isLoading}
          setPermiso={setPermiso}
          videoListo={videoListo}
          videoListoDos={videoListoDos}  // ✅ Enviar videoListoDos al Loader
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
            {isMobile ? <GaleriaCel setVideoListoDos={setVideoListoDos} /> : <Galeria setVideoListoDos={setVideoListoDos} />}
          </section>

          <section id="blog">
            <SalidaCel />
          </section>

          <section id="contacto">
            <Contacto />
          </section>
        </div>
      )}
    </>
  );
}
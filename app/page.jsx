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

  /*cambiar a  fixed*/
  const [pararaxFixed, setPararaxFixed] = useState('fixed');
  const [carruselFixed, setCarruselFixed] = useState('');
  const [movimientoFixed, setMovimientoFixed] = useState(0);

  /* Detectar si es celular */
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  /* Loader */
  useEffect(() => {
    const handleLoad = () => {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
      return () => window.removeEventListener("load", handleLoad);
    }
  }, [videoListo]);

  /* 🔎 Detectar en qué sección estás */
  useEffect(() => {
    let currentSection = "";

    const handleScroll = () => {
      const vh = window.innerHeight;
      const scroll = window.scrollY;

      // alturas de tus secciones
      const paralaxEnd = vh * 2; // 200vh
      const carruselEnd = paralaxEnd + vh * 3; // 300vh
      const movimientoEnd = carruselEnd + vh * 2; // 200vh

      let newSection = "";

      if (scroll < paralaxEnd) newSection = "PARALAX";
      else if (scroll < carruselEnd) newSection = "CARRUSEL";
      else if (scroll < movimientoEnd) newSection = "MOVIMIENTO";
      else newSection = "RESTO (GALERIA / BLOG / ETC)";

      if (newSection !== currentSection) {
        currentSection = newSection;
        console.log("📍 Estás en:", newSection);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Loader */}
      {!permiso && (
        <Loader
          isLoading={isLoading}
          setPermiso={setPermiso}
          videoListo={videoListo}
        />
      )}

      {/* Contenido */}
      {permiso && (
        <div>
          <section id="inicio">
            <Paralax setVideoListo={setVideoListo} />
          </section>
          <section
            id="productos"
          >
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


          {/* Carrusel sticky 
          

         
          {/* Galería responsiva */}
        </div>
      )}
    </>
  );
}
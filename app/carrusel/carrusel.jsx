"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCreative } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-creative";

function Carrusel() {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const swiperRef = useRef(null);
  const containerRef = useRef(null);
  const currentIndexRef = useRef(0);
  const ticking = useRef(false);

  const [displayText, setDisplayText] = useState("");
  const [displaySubtitle, setDisplaySubtitle] = useState("");
  const [progressBar, setProgressBar] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const animatingRef = useRef(false);

  // Fetch slides from API
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await fetch('/api/carrusel');
        if (!response.ok) {
          throw new Error('Error al cargar los datos');
        }
        const data = await response.json();
        const galeria = data.galeria || [];
        setSlides(galeria);
        if (galeria.length > 0) {
          setDisplayText(galeria[0].text);
          setDisplaySubtitle(galeria[0].subtitle);
        }
      } catch (err) {
        setError(err.message);
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSlides();
  }, []);

  // 🔹 Animación de texto optimizada
  const animateTextChange = useCallback((newText, setText) => {
    if (animatingRef.current) return;

    animatingRef.current = true;

    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    let step = 0;
    const totalSteps = 8;

    const interval = setInterval(() => {
      step++;

      let randomText = "";

      for (let i = 0; i < newText.length; i++) {
        if (step > totalSteps * (i / newText.length)) {
          randomText += newText[i];
        } else {
          randomText += chars[Math.floor(Math.random() * chars.length)];
        }
      }

      setText(randomText);

      if (step >= totalSteps) {
        clearInterval(interval);
        setText(newText);
        animatingRef.current = false;
      }
    }, 50);
  }, []);

  // 🔹 Botones navegación
  const goToSlide = useCallback((index) => {
    if (!containerRef.current) return;

    const offsetTop = containerRef.current.offsetTop;
    const targetScroll = offsetTop + index * window.innerHeight;

    window.scrollTo({
      top: targetScroll,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    if (slides.length === 0) return;

    // 🔥 precargar swiper para evitar lag inicial
    if (swiperRef.current?.swiper) {
      swiperRef.current.swiper.update();
    }

    const updateScroll = () => {
      if (!containerRef.current || !swiperRef.current?.swiper) {
        ticking.current = false;
        return;
      }

      const swiper = swiperRef.current.swiper;

      const containerHeight = containerRef.current.offsetHeight;
      const viewport = window.innerHeight;

      const progress =
        (window.scrollY - containerRef.current.offsetTop) /
        (containerHeight - viewport);

      const clamped = Math.max(0, Math.min(progress, 1));

      setProgressBar(clamped);

      const section = Math.min(
        slides.length - 1,
        Math.floor(clamped * slides.length)
      );

      if (section !== currentIndexRef.current) {
        currentIndexRef.current = section;
        setActiveIndex(section);

        if (!swiper.destroyed) {
          swiper.slideTo(section, 1500);
        }

        // 🔹 retrasar texto para no bloquear animación
        setTimeout(() => {
          animateTextChange(slides[section].text, setDisplayText);
          animateTextChange(slides[section].subtitle, setDisplaySubtitle);
        }, 200);
      }

      ticking.current = false;
    };

    const handleScroll = () => {
      if (!ticking.current) {
        requestAnimationFrame(updateScroll);
        ticking.current = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [slides, animateTextChange]);

  if (loading) {
    return (
      <div className="relative w-full h-screen bg-black flex items-center justify-center z-30">
        <div className="text-white">Cargando...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative w-full h-screen bg-black flex items-center justify-center z-30">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (slides.length === 0) {
    return (
      <div className="relative w-full h-screen bg-black flex items-center justify-center z-30">
        <div className="text-white">No hay datos disponibles</div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[300vh] bg-black flex flex-col items-center z-30"
    >
      <div className="sticky inset-0 h-screen flex flex-col items-center justify-center">

        {/* NAV */}
        <div className="w-[92vw] sm:w-[90vw] flex justify-between items-center mb-8 flex-wrap gap-4 z-20">

          <div className="flex gap-3 flex-wrap">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`cursor-pointer px-4 py-2 text-sm rounded-full transition-all
                ${
                  activeIndex === index
                    ? "text-white bg-primary-600"
                    : "text-white/50 hover:bg-white/10"
                }`}
              >
                {index === 0 && "Explorar"}
                {index === 1 && "Descubrir"}
                {index === 2 && "Innovar"}
              </button>
            ))}
          </div>

          <div className="flex gap-3 items-center">

            <span className="text-white/20 text-sm">
              SmartFrost
            </span>

            <div className="w-40 h-[8px] bg-primary/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-500 transition-all duration-200"
                style={{ width: `${progressBar * 100}%` }}
              />
            </div>

          </div>

        </div>

        {/* SWIPER */}
        <div className="relative w-[92vw] sm:w-[90vw] h-[65vh] z-10">

          <Swiper
            ref={swiperRef}
            effect={"creative"}
            creativeEffect={{
              prev: {
                translate: ["-40%", 0, -1],
                scale: 0.7,
                opacity: 0.4,
              },
              next: {
                translate: ["100%", 0, 0],
                scale: 0.85,
                opacity: 0.7,
              },
            }}
            modules={[EffectCreative]}
            slidesPerView={1}
            centeredSlides
            allowTouchMove={false}
            speed={1500}
            className="w-full h-full"
          >

            {slides.map((slide, i) => (
              <SwiperSlide key={i}>
                <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl">

                  <img
                    src={slide.img}
                    alt={slide.text}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover will-change-transform"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                </div>
              </SwiperSlide>
            ))}

          </Swiper>

          {/* TEXTO */}
          <div className="absolute bottom-0 left-0 right-0 z-30 flex flex-col items-start justify-end p-10 pb-16 bg-gradient-to-t from-black/60 to-transparent">

            <h2 className="text-4xl font-bold text-white mb-4">
              {displayText}
            </h2>

            <p className="text-white/80 mb-6 max-w-xl">
              {displaySubtitle}
            </p>

            <button className="px-8 py-3 bg-primary-500 text-white rounded-full font-semibold hover:scale-105 transition-all">
              Discover More →
            </button>

          </div>

        </div>

      </div>
    
    </div>
  );
}

export default Carrusel;
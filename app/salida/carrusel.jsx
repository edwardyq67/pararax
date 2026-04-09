"use client";

import React, { useRef, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCreative } from "swiper/modules";
import "swiper/css";

function Carrusel() {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const swiperRef = useRef(null);
  const progressInterval = useRef(null);
  const startTimeRef = useRef(null);

  const [displayText, setDisplayText] = useState("");
  const [displaySubtitle, setDisplaySubtitle] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [progressBar, setProgressBar] = useState(0);

  const slideDelay = 4000;

  // 🔥 Fetch datos desde API
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await fetch("/api/galeriaSalida");
        if (!response.ok) {
          throw new Error("Error al cargar los datos");
        }
        const result = await response.json();
        const carruselData = result.carrusel || [];
        setSlides(carruselData);
        if (carruselData.length > 0) {
          setDisplayText(carruselData[0].text);
          setDisplaySubtitle(carruselData[0].subtitle);
        }
        setLoading(false);
      } catch (err) {
        setError(err.message);
        console.error("Error:", err);
        setLoading(false);
      }
    };

    fetchSlides();
  }, []);

  // 🔹 Animación texto suave
  const animateTextChange = (newText, setText) => {
    if (isAnimating) return;
    setIsAnimating(true);
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let currentStep = 0;
    const totalSteps = 40;

    const interval = setInterval(() => {
      currentStep++;
      let randomText = "";

      for (let i = 0; i < newText.length; i++) {
        if (currentStep > totalSteps * (i / newText.length)) {
          randomText += newText[i];
        } else {
          randomText += chars[Math.floor(Math.random() * chars.length)];
        }
      }

      setText(randomText);

      if (currentStep >= totalSteps) {
        clearInterval(interval);
        setText(newText);
        setIsAnimating(false);
      }
    }, 20);
  };

  // 🔹 Actualiza texto al cambiar de slide
  const handleSlideChange = (swiper) => {
    const index = swiper.realIndex;
    setActiveIndex(index);
    animateTextChange(slides[index].text, setDisplayText);
    animateTextChange(slides[index].subtitle, setDisplaySubtitle);
    setProgressBar(0);
    
    // Reiniciar el temporizador de progreso
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }
    startTimeRef.current = Date.now();
    
    progressInterval.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const progress = Math.min(elapsed / slideDelay, 1);
      setProgressBar(progress);
      
      if (progress >= 1) {
        clearInterval(progressInterval.current);
      }
    }, 16); // 60fps
  };

  // 🔹 Iniciar barra de progreso al montar
  useEffect(() => {
    if (slides.length === 0) return;
    
    startTimeRef.current = Date.now();
    progressInterval.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const progress = Math.min(elapsed / slideDelay, 1);
      setProgressBar(progress);
      
      if (progress >= 1) {
        clearInterval(progressInterval.current);
      }
    }, 16);
    
    return () => clearInterval(progressInterval.current);
  }, [slides]);

  // 🔹 Limpiar intervalo cuando cambia activeIndex
  useEffect(() => {
    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [activeIndex]);

  // 🔹 Navegación por botones
  const goToSlide = (index) => {
    if (swiperRef.current?.swiper) {
      swiperRef.current.swiper.slideToLoop(index);
    }
  };

  const prevSlide = () => {
    swiperRef.current?.swiper.slidePrev();
  };

  const nextSlide = () => {
    swiperRef.current?.swiper.slideNext();
  };

  if (loading) {
    return (
      <div className="w-full bg-white flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 text-sm sm:text-base">Cargando...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-white flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-center text-red-500">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  if (slides.length === 0) {
    return (
      <div className="w-full bg-white flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-center text-gray-500">
          <p>No hay datos disponibles</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white flex flex-col items-center justify-center overflow-hidden">

      {/* NAV */}
      <div className="w-[92vw] sm:w-[90vw] flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8 gap-4">
        <div className="flex gap-2 sm:gap-3 flex-wrap justify-center w-full sm:w-auto">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`relative cursor-pointer px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-300 rounded-full
                ${activeIndex === index
                  ? "text-white bg-primary-600"
                  : "text-black hover:bg-gray-100"
                }`}
            >
              {index === 0 && "Explorar"}
              {index === 1 && "Descubrir"}
              {index === 2 && "Innovar"}
            </button>
          ))}
        </div>

        {/* Barra de progreso */}
        <div className="flex gap-2 items-center justify-center w-full sm:w-auto">
          <span className="text-gray-500 text-xs sm:text-sm">Progreso</span>
          <div className="flex-1 sm:w-40 max-w-[200px] h-[5px] sm:h-[6px] bg-black/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-500 transition-all duration-75 ease-linear"
              style={{ width: `${progressBar * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* SWIPER */}
      <div className="relative w-[92vw] sm:w-[90vw] h-[55vh] sm:h-[65vh] md:h-[70vh]">
        <Swiper
          ref={swiperRef}
          modules={[Autoplay, EffectCreative]}
          effect={"creative"}
          creativeEffect={{
            prev: { translate: ["-30%", 0, -1], scale: 0.8 },
            next: { translate: ["100%", 0, 0], scale: 0.9 },
          }}
          slidesPerView={1}
          loop={true}
          autoplay={{
            delay: slideDelay,
            disableOnInteraction: false,
          }}
          centeredSlides={true}
          allowTouchMove={true}
          speed={800}
          onSlideChange={handleSlideChange}
          className="w-full h-full"
        >
          {slides.map((slide, i) => (
            <SwiperSlide key={i}>
              <div className="relative w-full h-full rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl group cursor-pointer">
                <img
                  src={slide.img}
                  alt={slide.text}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10"></div>
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-all duration-500 z-10"></div>

                <div className="absolute bottom-0 left-0 right-0 z-30 p-6 sm:p-8 md:p-10">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 leading-tight transform transition-all duration-500 group-hover:translate-x-2">
                    {activeIndex === i ? displayText : slide.text}
                    <div className="w-16 h-1 bg-primary-500 rounded-full mt-2 transition-all duration-500 group-hover:w-24"></div>
                  </h2>
                  <p className="text-sm sm:text-base text-white/80 max-w-lg mb-6 transform transition-all duration-500 delay-75 group-hover:translate-x-2">
                    {activeIndex === i ? displaySubtitle : slide.subtitle}
                  </p>
                  <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-sm font-semibold hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                    <span>Ver proyecto</span>
                    <svg className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        
        <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-4 pointer-events-auto z-30 max-sm:hidden">
          <button onClick={prevSlide} className="bg-white/80 cursor-pointer hover:bg-white/100 text-black p-3 rounded-full shadow-lg transition">◀</button>
          <button onClick={nextSlide} className="bg-white/80 cursor-pointer hover:bg-white/100 text-black p-3 rounded-full shadow-lg transition">▶</button>
        </div>
      </div>
    </div>
  );
}

export default Carrusel;
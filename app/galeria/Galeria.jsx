"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger, Flip } from "gsap/all";

gsap.registerPlugin(ScrollTrigger, Flip);

function Galeria() {
    const galleryRef = useRef(null);
    const contentRef = useRef(null);
    const ctxRef = useRef(null);
    const videoRefs = useRef({});

    const [data, setData] = useState([]);
    const [videoPlayed, setVideoPlayed] = useState(false);

    const fotoVideo = [
        { foto: "/galeria/escritorio/FotoIzqArriba_lg.webp", video: "" },
        { foto: "/galeria/escritorio/FotoCenArriba_lg.webp", video: "" },
        { foto: "/galeria/escritorio/FotoCenCentro_lg.webp", video: "/galeria/escritorio/VideoCentral_lg.mp4" },
        { foto: "/galeria/escritorio/FotoDerArriba_lg.webp", video: "" },
        { foto: "/galeria/escritorio/FotoIzqCen_lg.webp", video: "" },
        { foto: "/galeria/escritorio/FotoDerAbajo_lg.webp", video: "" },
        { foto: "/galeria/escritorio/FotoIzqAbajo_lg.webp", video: "" },
        { foto: "/galeria/escritorio/FotoCenAbajo_lg.webp", video: "" }
    ];

    // 🔥 FETCH DATA
    useEffect(() => {
        const getData = async () => {
            try {
                const response = await fetch("/api/galeria");
                const result = await response.json();
                setData(result.textosCel);
            } catch (error) {
                console.error("Error cargando galeria:", error);
            }
        };

        getData();
    }, []);

    // Manejadores de video - SOLO PARA LA IMAGEN CON VIDEO (índice 2)
    const handleMouseEnter = (index) => {
        const videoElement = videoRefs.current[index];
        if (index === 2 && videoElement && !videoPlayed) {
            videoElement.style.opacity = "1";
            videoElement.play()
                .then(() => {
                    setVideoPlayed(true);
                })
                .catch(e => console.log("Error playing video:", e));
        }
    };

    const handleMouseLeave = (index) => {
        // El video permanece visible y reproduciéndose si ya se activó
    };

    // ✅ createTween como useCallback para reutilizarlo en ambos useEffect
    const createTween = useCallback(() => {
        const galleryElement = galleryRef.current;
        if (!galleryElement) return;

        const galleryItems = galleryElement.querySelectorAll(".gallery__item");
        if (!galleryItems.length) return;

        if (ctxRef.current) ctxRef.current.revert();

        galleryElement.classList.remove("gallery--final");

        // ✅ Forzar reflow ANTES de capturar estado inicial
        galleryElement.getBoundingClientRect();

        ctxRef.current = gsap.context(() => {
            galleryElement.classList.add("gallery--final");

            // ✅ Forzar reflow con --final aplicado para que FLIP lo lea correctamente
            galleryElement.getBoundingClientRect();

            const state = Flip.getState(galleryItems);
            galleryElement.classList.remove("gallery--final");

            const flip = Flip.to(state, {
                simple: true,
                ease: "expoScale(1, 5)"
            });

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: galleryElement,
                    start: "center center",
                    end: "+=150%",
                    scrub: true,
                    pin: galleryElement.parentNode,
                    onLeaveBack: () => {
                        gsap.set(galleryItems, { clearProps: "all" });
                    }
                }
            });

            tl.add(flip);

            tl.fromTo(
                contentRef.current,
                { y: "100%" },
                { y: "0%", ease: "none" },
                ">0.2"
            );

            return () => gsap.set(galleryItems, { clearProps: "all" });
        }, galleryElement);
    }, []);

    // 🔥 GSAP - Primer mount con doble RAF para garantizar layout completo
    useEffect(() => {
        let rafId;

        const init = () => {
            // Doble requestAnimationFrame: primer frame pinta, segundo frame calcula layout
            rafId = requestAnimationFrame(() => {
                rafId = requestAnimationFrame(() => {
                    createTween();
                });
            });
        };

        init();
        window.addEventListener("resize", createTween);

        return () => {
            cancelAnimationFrame(rafId);
            if (ctxRef.current) ctxRef.current.revert();
            window.removeEventListener("resize", createTween);
        };
    }, [createTween]);

    // ✅ Cuando llega data, RECREAR el tween completo (no solo refresh)
    // porque el contenido nuevo cambia la altura del pin y el FLIP necesita recalcularse
    useEffect(() => {
        if (!data.length) return;

        let rafId;
        rafId = requestAnimationFrame(() => {
            rafId = requestAnimationFrame(() => {
                createTween();
            });
        });

        return () => cancelAnimationFrame(rafId);
    }, [data, createTween]);

    // Grid areas para cada posición
    const gridAreas = [
        "1 / 1 / 3 / 2",
        "1 / 2 / 2 / 3",
        "2 / 2 / 4 / 3",
        "1 / 3 / 3 / 3",
        "3 / 1 / 3 / 2",
        "3 / 3 / 5 / 4",
        "4 / 1 / 5 / 2",
        "4 / 2 / 5 / 3"
    ];

    return (
        <>
            <div className="relative bg-black w-full h-screen inline-flex items-center justify-center overflow-hidden">
                {/* GRID */}
                <div
                    ref={galleryRef}
                    id="gallery-8"
                    className="
                        gallery gallery--bento gallery--switch
                        grid
                        justify-center content-center
                        [grid-template-columns:repeat(3,32.5vw)]
                        [grid-template-rows:repeat(4,23vh)]
                    "
                >
                    {fotoVideo.map((item, i) => (
                        <div
                            key={i}
                            className="gallery__item relative w-full h-full overflow-hidden group cursor-pointer"
                            style={{ gridArea: gridAreas[i] }}
                            onMouseEnter={() => handleMouseEnter(i)}
                            onMouseLeave={() => handleMouseLeave(i)}
                        >
                            {/* Imagen estática */}
                            <img
                                src={item.foto}
                                alt={`Galería ${i + 1}`}
                                className="w-full h-full object-cover rounded-lg transition-all duration-500 group-hover:scale-105"
                            />

                            {/* Overlay oscuro */}
                            <div className="absolute inset-0 bg-black/40 rounded-lg transition-all duration-300 group-hover:bg-black/20" />

                            {/* Video - SOLO para el índice 2 */}
                            {item.video && i === 2 && (
                                <video
                                    ref={(el) => {
                                        if (el) videoRefs.current[i] = el;
                                    }}
                                    src={item.video}
                                    className={`absolute inset-0 w-full h-full object-cover rounded-lg transition-opacity duration-300 pointer-events-none ${
                                        videoPlayed ? 'opacity-100' : 'opacity-0'
                                    }`}
                                    loop
                                    muted
                                    playsInline
                                />
                            )}

                            {/* Indicador de video - SOLO para el índice 2 */}
                            {item.video && i === 2 && (
                                <div className={`absolute bottom-2 right-2 bg-black/60 rounded-full p-1.5 z-10 transition-opacity duration-300 ${
                                    videoPlayed ? 'opacity-100' : 'opacity-70'
                                }`}>
                                    <svg
                                        className="w-4 h-4 text-white"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* 🔥 CONTENIDO DINÁMICO */}
                <div
                    ref={contentRef}
                    className="
                        absolute bottom-0 left-0 w-full
                        z-20 h-[150vh] 
                        px-4 md:px-10 py-10 md:py-20
                        translate-y-full
                        overflow-y-auto
                    "
                >
                    {/* 🔥 TÍTULO */}
                    <h2 className="text-4xl md:text-5xl font-bold mb-40 text-center text-white">
                        Empresas que confían en nosotros
                    </h2>

                    {/* 🔥 GRID DE 2 COLUMNAS EN ZIGZAG */}
                    <div className="max-w-6xl mx-auto">
                        <div className="justify-center text-center grid grid-cols-1 md:grid-cols-2">
                            {(() => {
                                const elementos = [];
                                let dataIndex = 0;
                                let position = 0;

                                while (dataIndex < data.length) {
                                    if (dataIndex < data.length) {
                                        elementos.push(
                                            <div
                                                key={`item-${dataIndex}`}
                                                className="flex justify-center mb-20"
                                            >
                                                <span className="bg-white gap-2 rounded-lg py-3 px-4 inline-flex justify-center items-center w-auto shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                                                    <div className="h-2 w-2 rounded-full bg-primary-500" />
                                                    <span className="text-gray-800 font-medium">{data[dataIndex]}</span>
                                                </span>
                                            </div>
                                        );
                                        dataIndex++;
                                        position++;
                                    }

                                    elementos.push(<div key={`empty-${position}-1`} className="mb-20"></div>);
                                    elementos.push(<div key={`empty-${position}-2`} className="mb-20"></div>);
                                    position += 2;

                                    for (let i = 0; i < 2 && dataIndex < data.length; i++) {
                                        elementos.push(
                                            <div
                                                key={`item-${dataIndex}`}
                                                className="flex justify-center mb-20"
                                            >
                                                <span className="bg-white gap-2 rounded-lg py-3 px-4 inline-flex justify-center items-center w-auto shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                                                    <div className="h-2 w-2 rounded-full bg-primary-500" />
                                                    <span className="text-gray-800 font-medium">{data[dataIndex]}</span>
                                                </span>
                                            </div>
                                        );
                                        dataIndex++;
                                        position++;
                                    }

                                    if (dataIndex < data.length) {
                                        elementos.push(<div key={`empty-${position}-1`} className="mb-20"></div>);
                                        elementos.push(<div key={`empty-${position}-2`} className="mb-20"></div>);
                                        position += 2;
                                    }
                                }

                                return elementos;
                            })()}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Galeria;
"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger, Flip } from "gsap/all";

gsap.registerPlugin(ScrollTrigger, Flip);

function Galeria({ setVideoListoDos }) {
    const galleryRef = useRef(null);
    const contentRef = useRef(null);
    const ctxRef = useRef(null);
    const videoRef = useRef(null); // Solo un video reference
    const observerRef = useRef(null);

    const [data, setData] = useState([]);
    const [fotoVideo, setFotoVideo] = useState([]);
    const [loading, setLoading] = useState(true);
    const [videoUrl, setVideoUrl] = useState("");
    const [isVideoReady, setIsVideoReady] = useState(false);
    const [isVideoVisible, setIsVideoVisible] = useState(false);

    // 🔥 FETCH DATA
    useEffect(() => {
        const getData = async () => {
            try {
                const response = await fetch("/api/galeria/galeriaEscritorio");
                const result = await response.json();
                setFotoVideo(result.fotoVideo || []);
                setData(result.textosCel || []);
                setLoading(false);
            } catch (error) {
                console.error("Error cargando galeria:", error);
                setLoading(false);
            }
        };

        getData();
    }, []);

    // Obtener la URL del video del índice 2
    useEffect(() => {
        if (fotoVideo.length > 0 && fotoVideo[2]) {
            const item = fotoVideo[2];
            if (item.video) {
                const url = Array.isArray(item.video) ? item.video[0] : item.video;
                setVideoUrl(url);
            }
        }
    }, [fotoVideo]);

    // 🔥 Configurar video cuando la URL está lista
    useEffect(() => {
        if (!videoUrl || !videoRef.current) return;

        const video = videoRef.current;
        video.src = videoUrl;
        video.load();

        const handleCanPlay = () => {
            setIsVideoReady(true);
            setVideoListoDos(true); // ✅ Video listo para reproducirse

            // Hacer visible el video y reproducir
            video.style.opacity = "1";

            if (isVideoVisible) {
                video.play().catch(e => console.log("Error playing video:", e));
            }
        };

        video.addEventListener('canplay', handleCanPlay);
        video.addEventListener('loadeddata', handleCanPlay);

        // Si ya está cargado
        if (video.readyState >= 3) {
            handleCanPlay();
        }

        return () => {
            video.removeEventListener('canplay', handleCanPlay);
            video.removeEventListener('loadeddata', handleCanPlay);
        };
    }, [videoUrl, setVideoListoDos, isVideoVisible]);

    // 🔥 IntersectionObserver para detectar visibilidad
    useEffect(() => {
        const videoElement = videoRef.current;
        if (!videoElement || !isVideoReady) return;

        observerRef.current = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVideoVisible(true);
                        if (videoElement.paused) {
                            videoElement.play().catch(e => console.log("Error resuming:", e));
                        }
                    } else {
                        setIsVideoVisible(false);
                        if (!videoElement.paused) {
                            videoElement.pause();
                        }
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: "0px"
            }
        );

        observerRef.current.observe(videoElement);

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [isVideoReady]);

    // Manejar visibilidad de la página
    useEffect(() => {
        const handleVisibilityChange = () => {
            const videoElement = videoRef.current;
            if (!videoElement || !isVideoReady) return;

            if (!document.hidden && isVideoVisible) {
                videoElement.play().catch(() => { });
            } else if (document.hidden) {
                videoElement.pause();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [isVideoReady, isVideoVisible]);

    // ✅ Hover - solo asegurar que el video sea visible
    const handleMouseEnter = useCallback(() => {
        const videoElement = videoRef.current;
        if (videoElement && isVideoReady && videoUrl) {
            videoElement.style.opacity = "1";
            if (isVideoVisible && videoElement.paused) {
                videoElement.play().catch(e => console.log("Error playing:", e));
            }
        }
    }, [isVideoReady, videoUrl, isVideoVisible]);

    const createTween = useCallback(() => {
        const galleryElement = galleryRef.current;
        if (!galleryElement) return;

        const galleryItems = galleryElement.querySelectorAll(".gallery__item");
        if (!galleryItems.length) return;

        if (ctxRef.current) ctxRef.current.revert();

        galleryElement.classList.remove("gallery--final");
        galleryElement.getBoundingClientRect();

        ctxRef.current = gsap.context(() => {
            galleryElement.classList.add("gallery--final");
            galleryElement.getBoundingClientRect();

            const state = Flip.getState(galleryItems);
            galleryElement.classList.remove("gallery--final");

            const flip = Flip.to(state, {
                simple: true,
                ease: "power2.inOut",
                duration: 1.5,
            });

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: galleryElement,
                    start: "center center",
                    end: "+=250%",
                    scrub: 2.5,
                    pin: galleryElement.parentNode,
                    anticipatePin: 1,
                    onLeaveBack: () => {
                        gsap.set(galleryItems, { clearProps: "all" });
                    },
                },
            });

            tl.add(flip);

            tl.fromTo(
                contentRef.current,
                { y: "100%" },
                { y: "0%", ease: "power2.out" },
                ">0.3"
            );

            return () => gsap.set(galleryItems, { clearProps: "all" });
        }, galleryElement);
    }, []);

    // GSAP
    useEffect(() => {
        if (loading || fotoVideo.length === 0) return;

        let rafId;

        const init = () => {
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
    }, [createTween, loading, fotoVideo]);

    useEffect(() => {
        if (!data.length || loading) return;

        let rafId;
        rafId = requestAnimationFrame(() => {
            rafId = requestAnimationFrame(() => {
                createTween();
            });
        });

        return () => cancelAnimationFrame(rafId);
    }, [data, createTween, loading]);

    // Limpiar recursos
    useEffect(() => {
        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, []);

    if (loading) {
        return (
            <div className="relative bg-black w-full h-screen flex items-center justify-center">
                <div className="text-white text-center">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-sm sm:text-base">Cargando galería...</p>
                </div>
            </div>
        );
    }

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

    const hasVideo = videoUrl !== "";

    return (
        <>
            <div className="relative bg-black w-full h-screen inline-flex items-center justify-center overflow-hidden">
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
                    {fotoVideo.map((item, i) => {
                        const itemHasVideo = i === 2 && hasVideo;

                        return (
                            <div
                                key={i}
                                className="gallery__item relative w-full h-full overflow-hidden group cursor-pointer"
                                style={{ gridArea: gridAreas[i] }}
                                onMouseEnter={() => i === 2 && handleMouseEnter()}
                            >
                                {/* IMG */}
                                <img
                                    src={item.foto}
                                    alt={`Galería ${i + 1}`}
                                    className="w-full h-full object-cover rounded-lg transition-all duration-500"
                                />

                                {/* 🔥 CAPA NEGRA GLOBAL (TODOS LOS ITEMS) */}
                                <div className="absolute inset-0 bg-black/60 rounded-lg z-10" />

                                {/* VIDEO (solo centro) */}
                                {itemHasVideo && (
                                    <video
                                        ref={videoRef}
                                        className="absolute inset-0 w-full h-full object-cover rounded-lg transition-opacity duration-300 pointer-events-none z-0"
                                        style={{ opacity: 0 }}
                                        loop
                                        muted
                                        playsInline
                                        preload="auto"
                                    />
                                )}

                                {/* ICONO VIDEO */}
                                {itemHasVideo && (
                                    <div className="absolute bottom-2 right-2 bg-black/60 rounded-full p-1.5 z-20 opacity-70">
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
                        );
                    })}
                </div>

                {/* 🔥 CONTENIDO */}
                <div
                    ref={contentRef}
                    className="
                        absolute bottom-0 left-0 w-full
                        z-20 pb-96
                        px-4 md:px-10 py-10 md:py-20
                        translate-y-full
                        overflow-y-auto
                        pointer-events-auto
                    "
                >
                    <h2 className="text-4xl md:text-5xl font-bold pb-80 text-center text-white">
                        Empresas que confían en nosotros
                    </h2>

                    <div className="max-w-6xl mx-auto">
                        <div className="grid grid-cols-1 gap-y-48 text-center">
                            {data.map((item, index) => (
                                <div
                                    key={index}
                                    className={`flex w-full ${index % 2 === 0 ? "justify-start" : "justify-end"
                                        }`}
                                >
                                    <span className="bg-white gap-2 rounded-lg py-3 px-4 inline-flex justify-center items-center w-60 shadow-lg  transition-all duration-300 ">
                                        <div className="h-2 w-2 rounded-full bg-primary-500" />
                                        <span className="text-gray-800 font-medium">{item}</span>
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Galeria;
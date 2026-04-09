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
    const nextVideoRef = useRef(null);
    const preloadTimeoutRef = useRef(null);
    const checkIntervalRef = useRef(null);
    const observerRef = useRef(null);

    const [data, setData] = useState([]);
    const [fotoVideo, setFotoVideo] = useState([]);
    const [videoPlayed, setVideoPlayed] = useState(false);
    const [loading, setLoading] = useState(true);
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const [currentSubIndex, setCurrentSubIndex] = useState({});
    const [isVideoVisible, setIsVideoVisible] = useState(true); // ✅ Cambiado a true por defecto

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

    const getVideoUrl = useCallback((item, subIndex = 0) => {
        if (!item || !item.video) return null;
        if (Array.isArray(item.video)) {
            return item.video[subIndex % item.video.length];
        }
        return item.video;
    }, []);

    const getVideoLength = useCallback((item) => {
        if (!item || !item.video) return 0;
        if (Array.isArray(item.video)) {
            return item.video.length;
        }
        return 1;
    }, []);

    const videoItems = fotoVideo.filter(item => item.video && 
        (Array.isArray(item.video) ? item.video.length > 0 : item.video !== ""));
    
    const hasVideos = videoItems.length > 0;

    // 🔥 IntersectionObserver para detectar visibilidad del video
    useEffect(() => {
        const videoElement = videoRefs.current[2];
        if (!videoElement) return;

        observerRef.current = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVideoVisible(true);
                        // Reanudar video si estaba pausado y ya se había reproducido
                        if (videoPlayed && videoElement.paused) {
                            videoElement.play().catch(e => console.log("Error resuming video:", e));
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
                threshold: 0.1, // ✅ Cambiado a 10% para que se active más rápido
                rootMargin: "0px"
            }
        );

        observerRef.current.observe(videoElement);

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [videoPlayed]);

    // Precargar siguiente video
    const preloadNextVideo = useCallback((currentIndex, currentSubIdx = 0) => {
        if (videoItems.length === 0) return;
        
        const nextIndex = (currentIndex + 1) % videoItems.length;
        const nextItem = videoItems[nextIndex];
        const nextVideoUrl = getVideoUrl(nextItem, 0);
        
        if (!nextVideoUrl) return;
        
        if (preloadTimeoutRef.current) {
            clearTimeout(preloadTimeoutRef.current);
        }
        
        preloadTimeoutRef.current = setTimeout(() => {
            if (nextVideoRef.current) {
                nextVideoRef.current.src = nextVideoUrl;
                nextVideoRef.current.load();
                console.log(`🔄 Precargando video ${nextIndex + 1}`);
            } else {
                const hiddenVideo = document.createElement('video');
                hiddenVideo.preload = 'auto';
                hiddenVideo.src = nextVideoUrl;
                hiddenVideo.load();
                nextVideoRef.current = hiddenVideo;
            }
        }, 100);
    }, [videoItems, getVideoUrl]);

    // Reproducir siguiente video instantáneamente
    const playNextVideo = useCallback(() => {
        if (videoItems.length === 0) return;
        
        const videoElement = videoRefs.current[2];
        if (!videoElement) return;
        
        const currentItem = videoItems[currentVideoIndex];
        const currentLength = getVideoLength(currentItem);
        
        if (currentLength > 1) {
            const nextSubIndex = ((currentSubIndex[2] || 0) + 1) % currentLength;
            const nextVideoUrl = getVideoUrl(currentItem, nextSubIndex);
            
            if (nextVideoUrl) {
                setCurrentSubIndex(prev => ({ ...prev, [2]: nextSubIndex }));
                videoElement.src = nextVideoUrl;
                videoElement.load();
                if (isVideoVisible) {
                    videoElement.play().catch(e => console.log("Error:", e));
                }
                return;
            }
        }
        
        const nextIndex = (currentVideoIndex + 1) % videoItems.length;
        
        if (nextVideoRef.current?.src) {
            const tempSrc = nextVideoRef.current.src;
            nextVideoRef.current.src = videoElement.src;
            videoElement.src = tempSrc;
            if (isVideoVisible) {
                videoElement.play().catch(e => console.log("Error:", e));
            }
            setCurrentVideoIndex(nextIndex);
            setCurrentSubIndex(prev => ({ ...prev, [2]: 0 }));
            preloadNextVideo(nextIndex, 0);
        } else {
            const nextItem = videoItems[nextIndex];
            const nextVideoUrl = getVideoUrl(nextItem, 0);
            if (nextVideoUrl) {
                setCurrentVideoIndex(nextIndex);
                setCurrentSubIndex(prev => ({ ...prev, [2]: 0 }));
                videoElement.src = nextVideoUrl;
                videoElement.load();
                if (isVideoVisible) {
                    videoElement.play().catch(e => console.log("Error:", e));
                }
                preloadNextVideo(nextIndex, 0);
            }
        }
    }, [currentVideoIndex, currentSubIndex, videoItems, preloadNextVideo, getVideoUrl, getVideoLength, isVideoVisible]);

    // Detectar cuando el video está por terminar
    const setupVideoProgressCheck = useCallback((videoElement) => {
        if (!videoElement) return;
        
        if (checkIntervalRef.current) {
            clearInterval(checkIntervalRef.current);
        }
        
        checkIntervalRef.current = setInterval(() => {
            if (videoElement && videoElement.duration && !videoElement.paused && isVideoVisible) {
                if (videoElement.duration - videoElement.currentTime < 0.1) {
                    clearInterval(checkIntervalRef.current);
                    checkIntervalRef.current = null;
                    playNextVideo();
                }
            }
        }, 50);
    }, [playNextVideo, isVideoVisible]);

    // ✅ Manejadores de video - SIN depender de isVideoVisible para iniciar
    const handleMouseEnter = useCallback(() => {
        const videoElement = videoRefs.current[2];
        if (videoElement && videoItems.length > 0 && !videoPlayed) {
            const currentItem = videoItems[currentVideoIndex];
            const currentVideoUrl = getVideoUrl(currentItem, currentSubIndex[2] || 0);
            
            if (currentVideoUrl && videoElement.src !== currentVideoUrl) {
                videoElement.src = currentVideoUrl;
                videoElement.load();
            }
            videoElement.style.opacity = "1";
            videoElement.play()
                .then(() => {
                    setVideoPlayed(true);
                    preloadNextVideo(currentVideoIndex, currentSubIndex[2] || 0);
                    setupVideoProgressCheck(videoElement);
                })
                .catch(e => console.log("Error playing video:", e));
        }
    }, [videoItems, videoPlayed, currentVideoIndex, currentSubIndex, preloadNextVideo, getVideoUrl, setupVideoProgressCheck]);

    // Evento 'ended' como respaldo
    useEffect(() => {
        const videoElement = videoRefs.current[2];
        if (!videoElement || videoItems.length === 0) return;
        
        const handleEnded = () => {
            if (checkIntervalRef.current) {
                clearInterval(checkIntervalRef.current);
                checkIntervalRef.current = null;
            }
            playNextVideo();
        };
        
        videoElement.addEventListener('ended', handleEnded);
        return () => {
            videoElement.removeEventListener('ended', handleEnded);
            if (checkIntervalRef.current) {
                clearInterval(checkIntervalRef.current);
                checkIntervalRef.current = null;
            }
        };
    }, [videoItems, playNextVideo]);

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
            if (nextVideoRef.current) {
                nextVideoRef.current.src = '';
                nextVideoRef.current = null;
            }
            if (preloadTimeoutRef.current) {
                clearTimeout(preloadTimeoutRef.current);
            }
            if (checkIntervalRef.current) {
                clearInterval(checkIntervalRef.current);
            }
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
                        const hasVideo = item.video && 
                            (Array.isArray(item.video) ? item.video.length > 0 : item.video !== "");
                        
                        return (
                            <div
                                key={i}
                                className="gallery__item relative w-full h-full overflow-hidden group cursor-pointer"
                                style={{ gridArea: gridAreas[i] }}
                                onMouseEnter={() => i === 2 && handleMouseEnter()}
                            >
                                <img
                                    src={item.foto}
                                    alt={`Galería ${i + 1}`}
                                    className="w-full h-full object-cover rounded-lg transition-all duration-500 group-hover:scale-105"
                                />

                                <div className="absolute inset-0 bg-black/40 rounded-lg transition-all duration-300 group-hover:bg-black/20" />

                                {i === 2 && hasVideo && (
                                    <video
                                        ref={(el) => {
                                            if (el) videoRefs.current[i] = el;
                                        }}
                                        className={`absolute inset-0 w-full h-full object-cover rounded-lg transition-opacity duration-300 pointer-events-none ${
                                            videoPlayed ? 'opacity-100' : 'opacity-0'
                                        }`}
                                        loop={false}
                                        muted
                                        playsInline
                                        preload="auto"
                                    />
                                )}

                                {i === 2 && hasVideo && (
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
                        );
                    })}
                </div>

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
                    <h2 className="text-4xl md:text-5xl font-bold mb-40 text-center text-white">
                        Empresas que confían en nosotros
                    </h2>

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